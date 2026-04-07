// LIKE a comment
const likeComment = (req, res) => {
  const commentId = parseInt(req.params.id);
  const comment = dataStore.comments.find(c => c.id === commentId);

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  if (!comment.likes) comment.likes = 0;
  comment.likes += 1;

  res.status(200).json(comment);
};

// UNLIKE a comment
const unlikeComment = (req, res) => {
  const commentId = parseInt(req.params.id);
  const comment = dataStore.comments.find(c => c.id === commentId);

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  if (!comment.likes || comment.likes === 0) {
    return res.status(400).json({ error: 'No likes to remove' });
  }

  comment.likes -= 1;

  res.status(200).json(comment);
};