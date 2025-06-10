const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/authMiddleware');
const Notification = require('../models/Notification');

router.get('/notifications', protect, async (req, res) => {
  const notes = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(notes);
});

router.put('/notifications/:id/read', protect, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
});

router.delete('/notifications/:id', protect, async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

router.delete('/notifications', protect, async (req, res) => {
  await Notification.deleteMany({ user: req.user.id });
  res.json({ success: true });
});

module.exports = router;
