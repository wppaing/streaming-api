const uploadFirebase = require("./firebaseUploader");
const cropImage = require("../cropImage");
const { getFileId } = require("../id-gen");
const {
  ref,
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");
const app = require("./../../config/firebaseConfig");

// @desc   Upload an image to firebase storage
// @return An array of images with different resolutions

const imageUploader = async (fileBuffer) => {
  const folderId = getFileId(26)();
  const imgArr = [
    { 1000: await cropImage(fileBuffer, 1000, 1000) },
    { 300: await cropImage(fileBuffer, 300, 300) },
    { 100: await cropImage(fileBuffer, 100, 100) },
  ];
  const urlArr = [];
  await Promise.all(
    imgArr.map(async (el) => {
      const iterable = Object.keys(el).map(async (key) => {
        const imageRef = ref(getStorage(app), `/images/${folderId}/${key}`);
        const url = await uploadFirebase(imageRef, el[key], {
          contentType: "image/jpeg",
        });
        urlArr.push({ [key]: url });
      });
      return Promise.all(iterable);
    })
  );
  return urlArr;
};

module.exports = imageUploader;
