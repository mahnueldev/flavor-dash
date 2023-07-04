const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.development.local" });
} else {
  dotenv.config({ path: ".env.production.local" });
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadToCloudinary(image, options = {}) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, options, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
}

function deleteFromCloudinaryById(publicId) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (result === 'ok') {
        resolve();
      } else {
        reject(error);
      }
    });
  });
}

function deleteAllFromCloudinary(folder) {
  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources_by_prefix(folder, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
}

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinaryById,
  deleteAllFromCloudinary
};
