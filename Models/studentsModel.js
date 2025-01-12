const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    roll_no: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
    },
    standard: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    app_no: {
        type: Number,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone_no: {
        type: Number,
        required: true,
        unique: true,
    },
    admit_date: {
        type: Date,
        required: true,
    },
    grad_date: {
        type: Date,
        required: true,
    },
    dob: { type: Date,
         required: true },
});

// Ensure that the model is exported correctly
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
