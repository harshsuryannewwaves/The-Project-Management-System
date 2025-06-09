const multer = require('multer');
const path = require('path');

// Store uploaded images in /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `ticket_${Date.now()}${ext}`); // use backticks for template literals
  }
});

const upload = multer({ storage });
module.exports = upload;
