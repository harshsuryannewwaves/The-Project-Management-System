const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect } = require('../middlewares/authMiddleware');

// Employee creates attendance
router.post('/create', protect, attendanceController.createAttendance);

// All users: get own or all attendance
router.get('/', protect, attendanceController.getAttendanceRecords);

// Get one attendance
router.get('/:id', protect, attendanceController.getAttendanceById);

// Admin updates attendance (e.g. approve sick leave or correct)
router.put('/:id', protect, attendanceController.updateAttendance);

// Admin deletes attendance
router.delete('/:id', protect, attendanceController.deleteAttendance);

module.exports = router;