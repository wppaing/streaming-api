const sharp = require("sharp");

const cropImage = async (buffer, width, height) => {
  return new Promise((resolve, reject) => {
    sharp(buffer)
      .resize(width, height)
      .toBuffer()
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

module.exports = cropImage;
