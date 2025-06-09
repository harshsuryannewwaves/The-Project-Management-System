const Task = require('../models/Task');
const User = require('../models/User');

// Create Task
exports.createTask = async (req, res) => {
    const { title, description, assignedTo, project } = req.body;

    if (!title || !assignedTo) {
        return res.status(400).json({ message: 'Title and assignedTo are required' });
    }

    try {
        const task = await Task.create({
            title,
            description,
            assignedTo,
            assignedBy: req.user.id,
            project
        }); res.status(201).json(task);
    } catch (err) {
        console.error('Error creating task:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all tasks (admin sees all, employee sees theirs)
exports.getAllTasks = async (req, res) => {
    try {
        const filter = req.user.role === 'admin'
            ? {}
            : { $or: [{ assignedTo: req.user.id }, { assignedBy: req.user.id }] };
        const tasks = await Task.find(filter)
            .populate('assignedTo', 'name email')
            .populate('assignedBy', 'name email')
            .populate('project', 'name');

        res.status(200).json(tasks);
    } catch (err) {
        console.error('Error fetching tasks:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single task
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email')
            .populate('assignedBy', 'name email')
            .populate('project', 'name');
        if (!task) return res.status(404).json({ message: 'Task not found' });

        res.status(200).json(task);
    } catch (err) {
        console.error('Error fetching task:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update task (status or description)
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        const { title, description, status } = req.body;

        if (title) task.title = title;
        if (description) task.description = description;
        if (status) task.status = status;

        await task.save();
        res.status(200).json(task);
    } catch (err) {
        console.error('Error updating task:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete task (admin or task assigner)
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (req.user.role !== 'admin' && task.assignedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this task' });
        }

        await task.deleteOne();
        res.status(200).json({ message: 'Task deleted' });
    } catch (err) {
        console.error('Error deleting task:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
