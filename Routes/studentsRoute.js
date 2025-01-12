const express = require('express');
const studentcontroller = require('../controllers/studentcontroller'); // Import the controller

const router = express.Router();

// Route to handle creating a new student
router.post('/create', studentcontroller.createStudent);

// Route to get all students
router.get('/', studentcontroller.getAllStudents);

// Route to get a student by ID
router.get('/:id', studentcontroller.getStudentById);

// Route to update a student's information
router.put('/update/:id', studentcontroller.updateStudent);

// Route to delete a student by ID
router.delete('/:id', studentcontroller.deleteStudent);

module.exports = router;
