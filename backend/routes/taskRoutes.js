const express = require('express');
const router = express.Router();
const {
createTask,
getAllTasks,
getTaskById,
updateTask,
deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

// All users (admin + employee) can create task
router.post('/create', protect, createTask);

// Get tasks (admin sees all, employee sees theirs)
router.get('/', protect, getAllTasks);

// Get a specific task
router.get('/:id', protect, getTaskById);

// Update task
router.put('/:id', protect, updateTask);

// Delete task
router.delete('/:id', protect, deleteTask);

module.exports = router;