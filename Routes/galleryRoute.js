// /routes/galleryRoutes.js

const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/gallerycontroller');

// Create a new gallery (with image upload)
router.post('/create', galleryController.createGallery);

// Update gallery by ID (with image upload)
router.put('/:id', galleryController.updateGallery);

// Delete gallery by ID
router.delete('/:id', galleryController.deleteGallery);

// Get all galleries
router.get('/', galleryController.getAllGalleries);

module.exports = router;
