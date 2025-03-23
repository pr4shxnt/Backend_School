const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AdminUser = require("../models/adminModel");

// Fetch all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await AdminUser.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins", error: error.message });
  }
};

// Create a new admin
const createAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingAdmin = await AdminUser.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new AdminUser({ username, email, password: hashedPassword });
    await newAdmin.save();
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(500).json({ message: "Error creating admin", error: error.message });
  }
};

// Login an admin
const loginAdmin = async (req, res) => {
    const { username, password } = req.body; // Use username instead of email

    try {
      // Find admin by username
      const admin = await AdminUser.findOne({ username });
      if (!admin) {
        return res.status(404).json({ message: "Incorrect username or password" });
      }

      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Incorrect username or password" });
      }

      // Generate token using jwt.sign(), including user data and expiration time
      const token = jwt.sign(
        { id: admin._id, username: admin.username, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: "4h" } // Token will expire in 1 hour
      );

      // Send the token back in the response
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ message: "Error logging in, Try again later.", error: error.message });
    }
};

// Validate password
const validatePassword = async (req, res) => {
  const { password } = req.body; // Password provided by the user
  const adminId = req.params.id; // Admin ID from the URL parameter

  try {
    const admin = await AdminUser.findById(adminId); // Find admin by ID
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({ isValid: true }); // Return validation result
  } catch (error) {
    res.status(500).json({ message: "Error validating password", error: error.message });
  }
};

// Update the admin's password
const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const adminId = req.params.id;

    try {
      // Find the admin by ID
      const admin = await AdminUser.findById(adminId);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Check if the old password matches the stored password
      const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Incorrect old password" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the password in the database
      admin.password = hashedPassword;
      await admin.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating password", error: error.message });
    }
};

// Delete an admin (after password validation)
const deleteAdmin = async (req, res) => {
  const adminId = req.params.id;

  try {
    const admin = await AdminUser.findByIdAndDelete(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting admin", error: error.message });
  }
};

module.exports = { getAllAdmins, createAdmin, updatePassword, deleteAdmin, validatePassword, loginAdmin };
