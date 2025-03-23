const mongoose = require("mongoose");

const admissionInquirySchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gradeApplying: {
    type: String,
    required: true,
  },
  parentName: {
    type: String,
    required: true,
  },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    previousSchool: {
        type: String,
    },
    message: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("AdmissionInquiry", admissionInquirySchema);