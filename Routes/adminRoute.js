const express = require("express");
const {
  getAllAdmins,
  createAdmin,
  deleteAdmin,
  loginAdmin,
  updatePassword, // Make sure to import the updatePassword function
  validatePassword, // Import the validatePassword function
} = require("../controllers/admincontroller");

const router = express.Router();

// Route to get all admins
router.get("/", getAllAdmins);

// Route to login an admin
router.post("/login", loginAdmin);

// Route to create a new admin
router.post("/", createAdmin);

// Route to validate password before deletion or update
router.post("/validatePassword/:id", validatePassword);

// Route to delete an admin (after password validation)
router.delete("/:id", deleteAdmin);

// Route to update an admin's password
router.put("/updatePassword/:id", updatePassword); // Update password route

module.exports = router;
