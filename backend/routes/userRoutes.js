const express = require('express');
const router = express.Router();
const { createUser, updateUser, changePassword } = require('../controllers/userController.js');
const { protect, isAdmin } = require('../middlewares/authMiddleware');
// const { authenticateUser, requireAdmin } = require('../middlewares/authMiddleware.js');

router.post('/create', protect,isAdmin, createUser);
router.put('/change-password' ,protect,changePassword);
router.put('/:id', protect ,isAdmin ,updateUser);

module.exports = router;