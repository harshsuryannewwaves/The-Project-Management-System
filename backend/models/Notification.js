const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: String, // 'project', 'task', 'ticket', 'timesheet'
  message: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isRead: { type: Boolean, default: false },
  link: String,  // optional navigation (e.g. `/projects/123`)
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
