// src/routes/videos.js

const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const commentController = require('../controllers/commentController'); // ← ADD THIS LINE

// Public routes
router.get('/following', protect, videoController.getFollowingVideos);
router.get('/', videoController.getAllVideos);
router.get('/:id', videoController.getVideoById);
router.get('/:id/comments', commentController.getVideoComments); // ← now works

// Protected routes
router.post('/', protect, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), videoController.createVideo);

router.put('/:id', protect, videoController.updateVideo);
router.delete('/:id', protect, videoController.deleteVideo);

module.exports = router;