// Comment Controller

// GET all comments
const getAllComments = (req, res) => {
  res.status(200).json(dataStore.comments);
};


// GET comment by ID
const getCommentById = (req, res) => {
  const commentId = parseInt(req.params.id);
  const comment = dataStore.comments.find(c => c.id === commentId);

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  res.status(200).json(comment);
};


// CREATE a comment
const createComment = (req, res) => {
  const { content, userId, videoId } = req.body;

  // Validate required fields
  if (!content || !userId || !videoId) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if user exists
  const userExists = dataStore.users.some(u => u.id === userId);
  if (!userExists) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if video exists
  const videoExists = dataStore.videos.some(v => v.id === videoId);
  if (!videoExists) {
    return res.status(404).json({ error: 'Video not found' });
  }

  const newComment = {
    id: dataStore.comments.length + 1,
    content,
    userId,
    videoId,
    createdAt: new Date().toISOString()
  };

  dataStore.comments.push(newComment);

  res.status(201).json(newComment);
};


// UPDATE a comment
const updateComment = (req, res) => {
  const commentId = parseInt(req.params.id);
  const commentIndex = dataStore.comments.findIndex(c => c.id === commentId);

  if (commentIndex === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  const { content } = req.body;
  const comment = dataStore.comments[commentIndex];

  // Update only if provided
  if (content) comment.content = content;

  comment.updatedAt = new Date().toISOString();

  res.status(200).json(comment);
};


// DELETE a comment
const deleteComment = (req, res) => {
  const commentId = parseInt(req.params.id);
  const commentIndex = dataStore.comments.findIndex(c => c.id === commentId);

  if (commentIndex === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  dataStore.comments.splice(commentIndex, 1);

  res.status(204).end();
};


module.exports = {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment
};