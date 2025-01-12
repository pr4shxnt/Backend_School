const multer = require('multer');
const path = require('path');
const Gallery = require('../Models/galleryModel');
const fs = require('fs');

// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder where images will be uploaded
  },
  filename: (req, file, cb) => {
    const title = req.body.title ? req.body.title.trim().replace(/[^a-zA-Z0-9]/g, '_') : 'default_title';
    const extname = path.extname(file.originalname).toLowerCase();
    cb(null, `${title}${extname}`); // Rename the image to title.extension
  },
});

// Configure multer upload
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Max file size set to 50MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb(new Error('Only image files are allowed!'));
    }
  },
}).single('image'); // Expect image to come from the 'image' field

// Create a new gallery (with image upload)
exports.createGallery = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    const { title, category } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`; // Save the file path

    try {
      const newGallery = new Gallery({
        title,
        category,
        image: imageUrl,
      });

      await newGallery.save();
      res.status(201).json({ success: true, gallery: newGallery });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating gallery', error: error.message });
    }
  });
};

// Update gallery by ID (with image upload)
// Update gallery by ID (with image upload)
exports.updateGallery = async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      const { title, category } = req.body;
      let imageUrl = null;

      // If there's an image uploaded, update the image path
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;  // Save the new image path
      } else {
        // If no new image, retain the old image URL (if any)
        const gallery = await Gallery.findById(req.params.id);
        if (gallery) {
          imageUrl = gallery.image;  // Retain the existing image URL
        }
      }

      try {
        // Find the gallery by ID and update it with the new title, category, and image URL
        const updatedGallery = await Gallery.findByIdAndUpdate(
          req.params.id,
          { title, category, image: imageUrl },
          { new: true }
        );

        if (!updatedGallery) {
          return res.status(404).json({ success: false, message: 'Gallery not found' });
        }

        res.status(200).json({ success: true, message: 'Gallery updated successfully', updatedGallery });
      } catch (error) {
        console.error('Error updating gallery:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
    });
  };


// Delete gallery by ID
exports.deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({ success: false, message: 'Gallery not found' });
    }

    // Delete image from the server
    const imagePath = path.join(__dirname, '..', 'uploads', gallery.image.split('/').pop());
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Error deleting image file:', err);
      }
    });

    // Delete gallery from the database
    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Gallery deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting gallery', error: error.message });
  }
};

// Get all galleries
exports.getAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find();
    res.status(200).json({ success: true, galleries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching galleries', error: error.message });
  }
};
