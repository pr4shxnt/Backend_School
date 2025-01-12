const mongoose = require('mongoose');

// Define the schema for the gallery (single image with title)
const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Title is required
    trim: true, // Trims any extra spaces
  },
  image: {
    type: String,
    required: true, // Image is required
  },
  category: {
    type: String,
    required: true, // Category is required
  }}
, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create the model
const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery;
