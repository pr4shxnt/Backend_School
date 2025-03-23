const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const adminRoutes = require("./Routes/adminRoute");
const galleryRoutes = require('./Routes/GalleryRoute');
const connectDB = require("./DB/Database");
const staffRoutes = require("./Routes/staffRoute");
const eventsRoutes = require("./Routes/eventsRoute");
const studentsRoutes = require("./Routes/studentsRoute");
const blogRoutes = require("./Routes/blogRoutes");
const admissionInquiry = require("./Routes/admissionInquiryRoutes");

const cron = require('node-cron');


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();


// Routes
app.use("/api/admins", adminRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/gallery', galleryRoutes);
app.use('/api/staffs', staffRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/admissionInquiry', admissionInquiry);
app.use('/api/blogs', blogRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
