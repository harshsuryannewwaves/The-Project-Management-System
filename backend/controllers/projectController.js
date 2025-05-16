const { default: mongoose } = require('mongoose');
const Project = require('../models/Project');
const path = require('path');

// Admin: Create project
exports.createProject = async (req, res) => {
    try {
        const { name, description, endTime } = req.body;
        const file = req.file ? `/uploads/${req.file.filename}` : null;

        let assignedMembers = req.body.assignedMembers;

        // Normalize assignedMembers to an array of valid ObjectId strings
        const memberIds = Array.isArray(assignedMembers)
            ? assignedMembers
            : typeof assignedMembers === 'string'
                ? assignedMembers.split(',').map(id => id.trim().replace(/^["']|["']$/g, ''))
                : [];



        const project = await Project.create({
            name,
            description,
            assignedMembers: memberIds, // ✅ correct key
            file,
            endTime
        });

        res.status(201).json(project);
    } catch (err) {
        console.error('Project creation error:', err);
        res.status(500).json({ error: 'Failed to create project' });
    }
};


exports.getProjects = async (req, res) => {
  try {

    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find().populate('assignedMembers', 'name email');
    } else {
      const userId = new mongoose.Types.ObjectId(req.user.id); // 👈 fix here
      projects = await Project.find({ assignedMembers: userId })
        .populate('assignedMembers', 'name email');
    }

    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};
// Employee: Get a specific project they are assigned to
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('assignedMembers', 'name email');
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Convert assignedMembers' IDs to string for safe comparison
    const isAssigned = project.assignedMembers.some(member =>
      member._id.toString() === req.user.id
    );

    if (req.user.role !== 'admin' && !isAssigned) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(project);
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};
