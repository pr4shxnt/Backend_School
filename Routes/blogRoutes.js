const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogcontroller');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/blog_images/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 50 }, // Max file size: 5MB
});

// Routes
// Create a new blog
router.post('/create', upload.array('images', 5), blogController.createBlog);

// Get all blogs
router.get('/', blogController.getAllBlogs);

// Get reviewed blogs
router.get('/reviewed', blogController.getReviewedBlogs);

// Get blogs pending review
router.get('/pending', blogController.getPendingBlogs);

// Update a blog (title, author, content, isReviewed)
router.put('/:id', blogController.updateBlog);

// Delete a blog
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
