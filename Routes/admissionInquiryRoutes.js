const express = require("express");
const router = express.Router();

const { createAdmissionInquiry, getAllAdmissionInquiries, deleteAdmissionInquiry } = require("../controllers/admissionInquiryController");

router.post("/", createAdmissionInquiry);
router.get("/", getAllAdmissionInquiries);
router.delete("/:id", deleteAdmissionInquiry);

module.exports = router;
