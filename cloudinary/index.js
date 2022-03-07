const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'RamenLog',
    allowed_formats: ['jpeg', 'png', 'jpg'],
    // format: async (req, file) => 'png', // supports promises as well
    // public_id: (req, file) => 'computed-filename-using-request',
  },
});

module.exports = {
  cloudinary,
  cloudinaryStorage,
};
