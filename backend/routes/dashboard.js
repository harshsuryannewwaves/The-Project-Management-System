const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const Ticket = require('../models/Ticket');

// Summary Stats
router.get('/stats', async (req, res) => {
  try {
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const projects = await Project.find();
    const projectsCompleted = projects.filter(p => p.endTime && new Date(p.endTime) < new Date()).length;
    const projectsInProgress = projects.length - projectsCompleted;

    const tickets = await Ticket.find();
    const ticketsRaised = tickets.length;
    const ticketsClosed = tickets.filter(t => t.status === 'resolved').length;
    const ticketsPending = tickets.filter(t => t.status !== 'resolved').length;

    res.json({
      totalEmployees,
      projectsCompleted,
      projectsInProgress,
      ticketsRaised,
      ticketsClosed,
      ticketsPending,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

// Table Endpoints
router.get('/employees', async (req, res) => {
  const data = await User.find({ role: 'employee' }).select('name email role');
  res.json(data);
});

router.get('/projects-completed', async (req, res) => {
  const data = await Project.find({ endTime: { $lt: new Date() } }).select('name description endTime');
  res.json(data);
});

router.get('/projects-in-progress', async (req, res) => {
  const data = await Project.find({ $or: [{ endTime: null }, { endTime: { $gte: new Date() } }] }).select('name description endTime');
  res.json(data);
});

router.get('/tickets', async (req, res) => {
  const data = await Ticket.find().select('title status category createdAt');
  res.json(data);
});

router.get('/tickets-closed', async (req, res) => {
  const data = await Ticket.find({ status: 'resolved' }).select('title category createdAt');
  res.json(data);
});

router.get('/tickets-pending', async (req, res) => {
  const data = await Ticket.find({ status: { $ne: 'resolved' } }).select('title status createdAt');
  res.json(data);
});

module.exports = router;
