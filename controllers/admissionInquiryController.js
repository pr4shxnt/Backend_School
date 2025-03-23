const AdmissionInquiry =  require("../Models/admissionInquiryModel")
const express = require("express");

exports.createAdmissionInquiry = async (req, res) => {
    try {
        const { studentName, dateOfBirth, gradeApplying, parentName, email, phone, address, previousSchool, message } = req.body;
        const newAdmissionInquiry = new AdmissionInquiry({ studentName, dateOfBirth, gradeApplying, parentName, email, phone, address, previousSchool, message });
        await newAdmissionInquiry.save();
        res.status(201).json({ message: "Admission Inquiry created successfully!", admissionInquiry: newAdmissionInquiry });
    } catch (error) {
        res.status(500).json({ message: "Error creating Admission Inquiry", error: error.message });
    }
}


exports.getAllAdmissionInquiries = async (req, res) => {
    try {
        const admissionInquiries = await AdmissionInquiry.find();
        res.status(200).json(admissionInquiries);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Admission Inquiries", error: error.message });
    }
}

exports.deleteAdmissionInquiry = async (req, res) => {
    try {
        const { id } = req.params;
        await AdmissionInquiry.findByIdAndDelete(id);
        res.status(200).json({ message: "Admission Inquiry deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting Admission Inquiry", error: error.message });
    }
}

