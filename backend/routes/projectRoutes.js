const express = require('express');
const router = express.Router();
const {
createProject,
getProjects,
getProjectById,
} = require('../controllers/projectController');
const { protect,isAdmin } = require('../middlewares/authMiddleware');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage });


// Get specific project
router.get('/:id', protect, getProjectById);
// Admin: Create project
router.post('/create', protect, isAdmin, upload.single('file'), createProject);

// Authenticated users (admin or employee)
router.get('/', protect, getProjects);


module.exports = router;