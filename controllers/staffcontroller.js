// staffController.js
const Staff = require('../Models/StaffModel');
const multer = require('multer');
const path = require('path');
const fs = require("fs");

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/staff_images/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  },
});

// Create a new staff member
const createStaff = async (req, res) => {
  try {
    const { full_name, age, standard, faculty } = req.body;
    const image = req.file ? req.file.path : null;

    if (!image) return res.status(400).json({ message: 'Image is required' });

    const newStaff = new Staff({ full_name, image, age, standard, faculty });
    await newStaff.save();

    res.status(201).json({ message: 'Staff created successfully', staff: newStaff });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all staff members
const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update staff details
const updateStaff = async (req, res) => {
    try {
      const { id } = req.params;
      const { full_name, age, standard } = req.body;

      // Find staff by ID
      const staff = await Staff.findById(id);
      if (!staff) {
        return res.status(404).json({ message: 'Staff not found' });
      }

      // Handle photo update
      if (req.file) {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        if (staff.updatedAt && staff.updatedAt > oneYearAgo) {
          return res.status(400).json({
            message: 'Photo can only be updated once a year',
          });
        }

        // Update the image path
        staff.image = req.file.path;
      }

      // Update other fields if provided
      if (full_name) staff.full_name = full_name.trim();
      if (age !== undefined) {
        if (age < 0) {
          return res.status(400).json({ message: 'Age cannot be negative' });
        }
        staff.age = age;
      }
      if (standard) staff.standard = standard.trim();

      // Save the updated staff
      await staff.save();
      res.status(200).json({
        message: 'Staff updated successfully',
        staff,
      });
    } catch (error) {
      // Handle unexpected errors
      res.status(500).json({ message: error.message });
    }
  };


// Delete a staff member
const deleteStaff = async (req, res) => {
    try {
      const { id } = req.params;
      const staff = await Staff.findByIdAndDelete(id);

      if (!staff) return res.status(404).json({ message: 'Staff not found' });

      // Delete the staff image
      if (staff.image) {
        const imagePath = path.join(__dirname, '..', staff.image);
        fs.unlink(imagePath, (err) => {
          if (err) console.log("Error deleting image:", err);
        });
      }

      res.status(200).json({ message: 'Staff deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


module.exports = {
  createStaff,
  getAllStaff,
  updateStaff,
  deleteStaff,
  upload,
};
