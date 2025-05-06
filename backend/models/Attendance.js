const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
taskName: { type: String, required: true },
hoursSpent: { type: Number, required: true }
});

const attendanceSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
date: { type: Date, required: true },
status: { type: String, enum: ['present', 'absent'], required: true },
sickLeaveReason: { type: String },
timesheet: [timesheetSchema]
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);