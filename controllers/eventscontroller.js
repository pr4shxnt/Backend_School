const Events = require("../Models/eventsModel");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/events_list/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Create a new event
const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, category } = req.body;

        if (!title || !description || !date || !location || !category) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const image = req.file ? req.file.filename : null;

        if (!image) {
            return res.status(400).json({ error: "Image is required." });
        }

        const newEvent = new Events({
            title,
            description,
            date,
            location,
            image,
            category,
        });

        await newEvent.save();
        res.status(201).json({ message: "Event created successfully!", event: newEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create event." });
    }
};

// Get all events
const getAllEvents = async (req, res) => {
    try {
        const events = await Events.find();
        const today = new Date();

        const updatedEvents = events
            .map((event) => {
                if (new Date(event.date).toDateString() === today.toDateString()) {
                    return { ...event.toObject(), status: "Streaming Now" };
                } else if (new Date(event.date) < today) {
                    return null; // Filter out past events
                }
                return { ...event.toObject(), status: "Upcoming" };
            })
            .filter(Boolean); // Remove null values

        res.status(200).json(updatedEvents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch events." });
    }
};

// Update an event by ID
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date, location, category } = req.body;
        const image = req.file ? req.file.filename : null;

        const event = await Events.findById(id);
        if (!event) {
            return res.status(404).json({ error: "Event not found." });
        }

        // Update fields only if they are provided
        if (title) event.title = title;
        if (description) event.description = description;
        if (date) event.date = date;
        if (location) event.location = location;
        if (category) event.category = category;
        if (image) {
            // Delete the old image
            const oldImagePath = path.join(__dirname, "../uploads/events_list/", event.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            event.image = image;
        }

        const updatedEvent = await event.save();
        res.status(200).json({ message: "Event updated successfully!", event: updatedEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update event." });
    }
};

// Delete an event by ID
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Events.findByIdAndDelete(id);

        if (!event) {
            return res.status(404).json({ error: "Event not found." });
        }

        // Remove associated image
        const imagePath = path.join(__dirname, "../uploads/events_list/", event.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        res.status(200).json({ message: "Event deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete event." });
    }
};

// Automatic deletion of past events using cron job
cron.schedule("0 0 * * *", async () => {
    try {
        const today = new Date();
        const expiredEvents = await Events.find({ date: { $lt: today } });

        for (const event of expiredEvents) {
            const imagePath = path.join(__dirname, "../uploads/events_list/", event.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Delete associated image
            }
        }

        await Events.deleteMany({ date: { $lt: today } });
        console.log("Expired events deleted successfully.");
    } catch (error) {
        console.error("Error while deleting expired events:", error);
    }
});

// Exporting functions
module.exports = {
    upload,
    createEvent,
    getAllEvents,
    updateEvent,
    deleteEvent,
};
