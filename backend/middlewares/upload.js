const multer = require('multer');
const path = require('path');

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists and is writable
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `ticket_${Date.now()}${ext}`);
  }
});

const upload = multer({ storage }); // No fileFilter = all file types allowed
module.exports = upload;
