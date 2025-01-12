const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    full_name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  standard: {
    type: Number,
    required: true,
    trim: true,
  }
  ,
  faculty: {
    type: String,
    required: true,
  }}
, {
  timestamps: true,
});


const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
