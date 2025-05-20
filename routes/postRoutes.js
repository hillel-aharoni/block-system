const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getAllPosts,
  createPost,
  deletePost,
  addComment
} = require('../controllers/postController');

// כולם יכולים לראות פוסטים
router.get('/', getAllPosts);

// רק משתמש מחובר יכול לפרסם פוסט
router.post('/', auth, createPost);

// רק יוצר הפוסט או אדמין יכול למחוק
router.delete('/:id', auth, deletePost);

// רק משתמש מחובר יכול להגיב
router.post('/:id/comments', auth, addComment);

module.exports = router;
