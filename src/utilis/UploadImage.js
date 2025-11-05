const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dxkmjgqpf",
  api_key: "115767259243813",
  api_secret: "26l3qslRKRdyy6R5oQRVo2mcUDk",
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

module.exports = (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {
        return resolve(result.secure_url);
      }
      console.log(error.message);
      return reject({ message: error.message });
    });
  });
};
