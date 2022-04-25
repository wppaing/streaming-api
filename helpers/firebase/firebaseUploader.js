const { uploadBytesResumable, getDownloadURL } = require("firebase/storage");

const firebaseUploader = async (reference, buffer, metadata) => {
  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(reference, buffer, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        reject(error);
      },
      async (complete) => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
};

module.exports = firebaseUploader;
