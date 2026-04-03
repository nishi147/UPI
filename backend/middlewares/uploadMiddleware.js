const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dthwzsl69',
  api_key: process.env.CLOUDINARY_API_KEY || '947577268937244',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'rof5UNzuHapNE-3hD9xQtpxXUWo'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'upi-payments',
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    if (!file.mimetype.match(/jpeg|jpg|png|gif/)) {
        cb(new Error('Images only! (JPG/PNG)'), false);
        return;
    }
    cb(null, true);
  }
});

module.exports = upload;
