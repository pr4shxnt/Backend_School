// /middlewares/uploadMiddleware.js

const multer = require('multer');
const path = require('path');

// Define storage options for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Store images in the "uploads" directory
  },
  filename: function (req, file, cb) {
    // Generate a unique filename to avoid conflicts
    cb(null, Date.now() + path.extname(file.originalname));  // For example: 1609459200000.jpg
  }
});

// File filter to ensure only image files are uploaded
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);  // Accept image files
  } else {
    cb(new Error('Only image files are allowed'), false);  // Reject non-image files
  }
};

// Define the upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },  // Max file size of 50MB
  fileFilter: fileFilter
});

module.exports = upload;
