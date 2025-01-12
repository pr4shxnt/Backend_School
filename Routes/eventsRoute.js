const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/eventscontroller");

// Multer middleware for file uploads
const { upload } = eventsController;

// Routes

// Create a new event
router.post("/create", upload.single("image"), eventsController.createEvent);

// Get all events
router.get("/", eventsController.getAllEvents);

// Update an event with image upload
router.put("/:id", upload.single("image"), eventsController.updateEvent);

// Delete an event by ID
router.delete("/:id", eventsController.deleteEvent);

module.exports = router;
