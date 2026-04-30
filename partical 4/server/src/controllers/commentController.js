const prisma = require('../lib/prisma');

// Get all comments (GET /api/comments)
exports.getAllComments = async (req, res) => {
  try {
    const { cursor, limit = 20 } = req.query;
    const limitNum = parseInt(limit) || 20;

    const queryOptions = {
      take: limitNum + 1,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    };

    if (cursor) {
      queryOptions.cursor = { id: parseInt(cursor) };
      queryOptions.skip = 1;
    }

    const comments = await prisma.comment.findMany(queryOptions);

    const hasNextPage = comments.length > limitNum;
    if (hasNextPage) comments.pop();

    if (req.user) {
      const userId = req.user.id;
      comments.forEach((comment) => {
        comment.isLiked = comment.likes.some((like) => like.userId === userId);
      });
    }

    const formattedComments = comments.map((comment) => ({
      ...comment,
      likeCount: comment._count.likes,
      _count: undefined,
      likes: undefined,
    }));

    const nextCursor = hasNextPage
      ? formattedComments[formattedComments.length - 1].id.toString()
      : null;

    res.status(200).json({
      comments: formattedComments,
      pagination: {
        nextCursor,
        hasNextPage,
      },
    });
  } catch (error) {
    console.error('Error getting all comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get comments by video ID (GET /api/videos/:id/comments)
exports.getVideoComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { cursor, limit = 20 } = req.query;
    const limitNum = parseInt(limit) || 20;

    const videoExists = await prisma.video.findUnique({
      where: { id: parseInt(id) },
    });

    if (!videoExists) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const queryOptions = {
      where: { videoId: parseInt(id) },
      take: limitNum + 1,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: { likes: true },
        },
        likes: {
          select: { userId: true },
        },
      },
    };

    if (cursor) {
      queryOptions.cursor = { id: parseInt(cursor) };
      queryOptions.skip = 1;
    }

    const comments = await prisma.comment.findMany(queryOptions);

    const hasNextPage = comments.length > limitNum;
    if (hasNextPage) comments.pop();

    if (req.user) {
      const userId = req.user.id;
      comments.forEach((comment) => {
        comment.isLiked = comment.likes.some((like) => like.userId === userId);
      });
    }

    const formattedComments = comments.map((comment) => ({
      ...comment,
      likeCount: comment._count.likes,
      _count: undefined,
      likes: undefined,
    }));

    const nextCursor = hasNextPage
      ? formattedComments[formattedComments.length - 1].id.toString()
      : null;

    res.status(200).json({
      comments: formattedComments,
      pagination: { nextCursor, hasNextPage },
    });
  } catch (error) {
    console.error(`Error getting comments for video ${req.params.id}:`, error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get comment by ID (GET /api/comments/:id)
exports.getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        video: {
          select: {
            id: true,
            caption: true,
            thumbnailUrl: true,
          },
        },
        _count: {
          select: { likes: true },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (req.user) {
      const like = await prisma.commentLike.findUnique({
        where: {
          userId_commentId: {
            userId: parseInt(req.user.id),
            commentId: parseInt(id),
          },
        },
      });
      comment.isLiked = !!like;
    }

    res.status(200).json(comment);
  } catch (error) {
    console.error(`Error fetching comment ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to fetch comment' });
  }
};

// Create comment (POST /api/comments)
exports.createComment = async (req, res) => {
  try {
    const { videoId, content } = req.body;
    const userId = req.user.id;

    const video = await prisma.video.findUnique({
      where: { id: parseInt(videoId) },
    });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: parseInt(userId),
        videoId: parseInt(videoId),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Failed to create comment' });
  }
};

// Update comment (PUT /api/comments/:id)
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId !== parseInt(userId)) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content, updatedAt: new Date() },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error(`Error updating comment ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to update comment' });
  }
};

// Delete comment (DELETE /api/comments/:id)
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
      include: { video: { select: { userId: true } } },
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (
      comment.userId !== parseInt(userId) &&
      comment.video.userId !== parseInt(userId)
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await prisma.comment.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(`Error deleting comment ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};

// Like/unlike comment (POST/DELETE /api/comments/:id/like)
exports.toggleCommentLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: parseInt(userId),
          commentId: parseInt(id),
        },
      },
    });

    let action;

    if (existingLike) {
      await prisma.commentLike.delete({
        where: {
          userId_commentId: {
            userId: parseInt(userId),
            commentId: parseInt(id),
          },
        },
      });
      action = 'unliked';
    } else {
      await prisma.commentLike.create({
        data: {
          userId: parseInt(userId),
          commentId: parseInt(id),
        },
      });
      action = 'liked';
    }

    const likeCount = await prisma.commentLike.count({
      where: { commentId: parseInt(id) },
    });

    res.status(200).json({
      message: `Comment ${action} successfully`,
      action,
      likeCount,
    });
  } catch (error) {
    console.error(`Error toggling like for comment ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to toggle like' });
  }
};

module.exports = {
  getAllComments: exports.getAllComments,
  getVideoComments: exports.getVideoComments,
  getCommentById: exports.getCommentById,
  createComment: exports.createComment,
  updateComment: exports.updateComment,
  deleteComment: exports.deleteComment,
  toggleCommentLike: exports.toggleCommentLike,
};