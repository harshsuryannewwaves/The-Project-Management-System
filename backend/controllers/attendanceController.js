const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Notification = require('../models/Notification');
// Create attendance (Employee only)
exports.createAttendance = async (req, res) => {
    try {
        const { date, status, sickLeaveReason, timesheet } = req.body;
        // Only one attendance per user per day
        const existing = await Attendance.findOne({ user: req.user.id, date });
        if (existing) {
            return res.status(400).json({ message: 'Attendance already submitted for this date' });
        }

        const attendance = await Attendance.create({
            user: req.user.id,
            date,
            status,
            sickLeaveReason: status === 'absent' ? sickLeaveReason : '',
            timesheet: status === 'present' ? timesheet : [],
            approved: false, // always false on creation
        });
        const admins = await User.find({ role: 'admin' }); // notify all admins
        await Promise.all(
            admins.map(admin =>
                Notification.create({
                    type: 'attendance',
                    message: `${req.user.name} submitted attendance for ${date}`,
                    user: admin._id,
                    link: `/attendance/${attendance._id}`
                })
            )
        );

        res.status(201).json(attendance);
    } catch (err) {
        console.error('Create Attendance Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all attendance (Admin: all, Employee: own)
exports.getAttendanceRecords = async (req, res) => {
    try {
        const filter = req.user.role === 'admin'
            ? {}
            : { user: req.user.id };
        const records = await Attendance.find(filter)
            .populate('user', 'name email')
            .sort({ date: -1 });

        res.status(200).json(records);
    } catch (err) {
        console.error('Fetch Attendance Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single attendance by ID
exports.getAttendanceById = async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.id)
            .populate('user', 'name email');
        if (!attendance) return res.status(404).json({ message: 'Attendance not found' });

        if (req.user.role !== 'admin' && attendance.user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json(attendance);
    } catch (err) {
        console.error('Get Attendance Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update attendance (Admin only - for approval or correction)
exports.updateAttendance = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access only' });
        }
        const attendance = await Attendance.findById(req.params.id);
        if (!attendance) return res.status(404).json({ message: 'Attendance not found' });

        const { status, sickLeaveReason, timesheet, approved } = req.body;

        if (status) attendance.status = status;
        if (sickLeaveReason) attendance.sickLeaveReason = sickLeaveReason;
        if (timesheet) attendance.timesheet = timesheet;
        if (typeof approved === 'boolean') attendance.approved = approved;


        await attendance.save();
        await Notification.create({
            type: 'attendance',
            message: `Your attendance for ${attendance.date} has been ${approved ? 'approved' : 'updated'} by Admin`,
            user: attendance.user,
            link: `/attendance/${attendance._id}`
        });
        res.status(200).json(attendance);
    } catch (err) {
        console.error('Update Attendance Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete attendance (Admin only)
exports.deleteAttendance = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access only' });
        }
        const attendance = await Attendance.findById(req.params.id);
        if (!attendance) return res.status(404).json({ message: 'Attendance not found' });

        await attendance.deleteOne();
        res.status(200).json({ message: 'Attendance deleted' });
    } catch (err) {
        console.error('Delete Attendance Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};