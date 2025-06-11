const express = require('express');
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket
} = require('../controllers/ticketController');

const { protect } = require('../middlewares/authMiddleware');
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage });


// Create ticket (Employee or Admin)
router.post('/create', protect, upload.single('image'), createTicket);

// Get all tickets (Admin sees all, employee sees own)
router.get('/', protect, getAllTickets);

// Get single ticket
router.get('/:id', protect, getTicketById);

// Update ticket
router.put('/:id', protect, upload.single('image'), updateTicket);

// Delete ticket
router.delete('/:id', protect, deleteTicket);

module.exports = router;
