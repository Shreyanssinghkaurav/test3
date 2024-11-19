const express = require('express');
const {
  getStories,
  createStory,
  updateStory,
  deleteStory,
  likeStory,
  getDrafts,
  saveDraft,
  addComment,
  deleteComment
} = require('../controllers/storyController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getStories);
router.get('/drafts', protect, getDrafts);
router.post('/', protect, createStory);
router.post('/draft', protect, saveDraft);
router.put('/:id', protect, updateStory);
router.delete('/:id', protect, deleteStory);
router.post('/:id/like', protect, likeStory);
router.post('/:id/comment', protect, addComment);
router.delete('/:id/comment/:commentId', protect, deleteComment);

module.exports = router;