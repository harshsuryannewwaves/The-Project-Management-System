const express = require('express');
const router = express.Router();
const { createUser, updateUser, changePassword, getProfile } = require('../controllers/userController.js');
const { protect, isAdmin } = require('../middlewares/authMiddleware');
// const { authenticateUser, requireAdmin } = require('../middlewares/authMiddleware.js');
router.get('/me', protect, getProfile);
router.post('/create', protect,isAdmin, createUser);
router.put('/change-password' ,protect,changePassword);
router.put('/:id', protect ,isAdmin ,updateUser);

module.exports = router;