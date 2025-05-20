const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const { getAllUsers, deleteUser } = require('../controllers/userController');

// רק אדמין יכול לגשת
router.get('/', auth, checkRole(['admin']), getAllUsers);
router.delete('/:id', auth, checkRole(['admin']), deleteUser);

module.exports = router;
