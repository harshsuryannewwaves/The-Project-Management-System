const Ticket = require('../models/Ticket');
const User = require('../models/User');

// Create a ticket (Employee)
exports.createTicket = async (req, res) => {
  try {
    const { title, description, category, project, assignedTo } = req.body;

    if (!title) return res.status(400).json({ message: 'Title is required' });

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const ticket = await Ticket.create({
      title,
      description,
      image: imagePath,
      category,
      project,
      assignedTo,
      createdBy: req.user.id
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error('Error creating ticket:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get all tickets
// Admin sees all, Employee sees own tickets (or assigned to them)
exports.getAllTickets = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? {}
      : {
        $or: [
          { createdBy: req.user.id },
          { assignedTo: req.user.id }
        ]
      };

    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('project', 'name');

    res.status(200).json(tickets);
  } catch (err) {
    console.error('Error fetching tickets:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('project', 'name');

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Authorization
    if (req.user.role !== 'admin' &&
      ticket.createdBy._id.toString() !== req.user.id &&
      ticket.assignedTo?._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(ticket);
  } catch (err) {
    console.error('Error fetching ticket:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update ticket (Admin or ticket creator)
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Only admin or ticket creator can update
    if (
      req.user.role !== 'admin' &&
      ticket.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to update this ticket' });
    }

    const { title, description, status, category, assignedTo, project, image } = req.body;

    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (status) ticket.status = status;
    if (category) ticket.category = category;
    if (assignedTo) ticket.assignedTo = assignedTo;
    if (project) ticket.project = project;
    if (image) ticket.image = image;

    await ticket.save();
    res.status(200).json(ticket);
  } catch (err) {
    console.error('Error updating ticket:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete ticket (Only admin or creator)
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    if (
      req.user.role !== 'admin' &&
      ticket.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this ticket' });
    }

    await ticket.deleteOne();
    res.status(200).json({ message: 'Ticket deleted' });
  } catch (err) {
    console.error('Error deleting ticket:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
