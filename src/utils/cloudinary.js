const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configuring cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "recyclique",
    format: async (_req, _file) => "png", // supports promises as well
    public_id: (req, file) => file.filename,
    transformation: [{
      width: 500,
      height: 500,
      crop: 'fill',
    }],
  },
});

const parser = multer({ storage });

const uploadImage = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: "recyclique",
    transformation: [{
      width: 500,
      height: 500,
      crop: 'fill',
    }],
  });
  return result;
};

module.exports = { cloudinary, parser, uploadImage };
