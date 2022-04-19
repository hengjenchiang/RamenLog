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
  params: async (req, file) => {
    return {
      folder: process.env.CLOUDINARY_FOLDER || 'RamenLog',
      allowed_formats: ['jpeg', 'png', 'jpg'],
      format: 'jpg', // supports promises as well
      // public_id: (req, file) => 'computed-filename-using-request',
      transformation: [{ width: 2048, aspect_ratio: 1.5, crop: 'lfill' }],
    };
  },
});

module.exports = {
  cloudinary,
  cloudinaryStorage,
};
