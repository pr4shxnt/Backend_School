 

const multer = require('multer');
const path = require('path');

 
const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');   
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

 const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); 
  } else {
    cb(new Error('Only image files are allowed'), false); 
  }
};

 
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, 
  fileFilter: fileFilter
});

module.exports = upload;
