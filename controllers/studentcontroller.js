const Student = require('../Models/studentsModel');
const multer = require('multer'); // Import multer for image uploading
const path = require('path'); // To get the file extension
const moment = require('moment'); // To format dates
const fs = require('fs');

// Set up Multer for local file storage (adjust as needed for your server structure)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/students'); // specify the folder where images will be saved
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // use timestamp as filename
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit for file size
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Only image files are allowed');
        }
    }
}).single('image'); // 'image' is the field name in your form or request

// Create a new student with image and date handling
// Create a new student with image and date handling
exports.createStudent = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        try {
            const { roll_no, name, age, standard, section, app_no, address, phone_no, admit_date, grad_date, dob } = req.body;

            // Validate dates to make sure they are in the future or past, depending on context
            if (!moment(admit_date, 'YYYY-MM-DD', true).isValid()) {
                return res.status(400).json({ message: 'Invalid Admit Date format. Use YYYY-MM-DD.' });
            }
            if (!moment(grad_date, 'YYYY-MM-DD', true).isValid()) {
                return res.status(400).json({ message: 'Invalid Graduation Date format. Use YYYY-MM-DD.' });
            }
            if (!moment(dob, 'YYYY-MM-DD', true).isValid()) {
                return res.status(400).json({ message: 'Invalid Date of Birth format. Use YYYY-MM-DD.' });
            }

            const student = new Student({
                image: req.file ? `/uploads/students/${req.file.filename}` : '',
                roll_no,
                name,
                age,
                standard,
                section,
                app_no,
                address,
                phone_no,
                admit_date: moment(admit_date).toDate(),
                grad_date: moment(grad_date).toDate(),
                dob: moment(dob).toDate(),  // Save the DOB
            });

            await student.save();
            res.status(201).json({ message: "Student created successfully", student });
        } catch (error) {
            res.status(400).json({ message: "Error creating student", error: error.message });
        }
    });
};


// Get all students with image and dates handling
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(400).json({ message: "Error fetching students", error: error.message });
    }
};

// Get a student by ID with image and dates handling
exports.getStudentById = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({ message: "Error fetching student", error: error.message });
    }
};

// Update a student, including image upload and date changes
// Update a student, including image upload but excluding dates
exports.updateStudent = async (req, res) => {
    const { id } = req.params;

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }

        try {
            const { roll_no, name, age, standard, section, app_no, address, phone_no } = req.body;

            const updatedData = {
                image: req.file ? `/uploads/students/${req.file.filename}` : undefined, // Update image if uploaded
                roll_no,
                name,
                age,
                standard,
                section,
                app_no,
                address,
                phone_no,
            };

            const student = await Student.findByIdAndUpdate(id, updatedData, { new: true });
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }
            res.status(200).json({ message: "Student updated successfully", student });
        } catch (error) {
            res.status(400).json({ message: "Error updating student", error: error.message });
        }
    });
};

// Delete a student

exports.deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {
        // Find the student by ID
        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // If the student has an image, delete it from the filesystem
        if (student.image) {
            const imagePath = path.join(__dirname, '..', 'uploads', 'students', path.basename(student.image));

            fs.access(imagePath, fs.constants.F_OK, (err) => {
                if (!err) {
                    fs.unlink(imagePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error("Error deleting image file:", unlinkErr);
                            return res.status(500).json({ message: "Failed to delete the student's image" });
                        }
                        console.log('Image file deleted successfully');
                    });
                } else {
                    console.log('Image file does not exist:', imagePath);
                }
            });
        }

        // Delete the student record from the database
        await Student.findByIdAndDelete(id);

        return res.status(200).json({ message: "Student deleted successfully" });
    } catch (err) {
        console.error("Error deleting student:", err);
        return res.status(500).json({ message: "Error deleting student" });
    }
};
