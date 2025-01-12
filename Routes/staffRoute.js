const express = require('express');
const router = express.Router();
const staffcontroller = require('../controllers/staffcontroller');

// Routes
router.post('/create', staffcontroller.upload.single('image'), staffcontroller.createStaff);
router.get('/', staffcontroller.getAllStaff);
router.put('/:id', staffcontroller.upload.single('image'), staffcontroller.updateStaff);
router.delete('/:id', staffcontroller.deleteStaff);

module.exports = router;
