const asyncHandler = require("express-async-handler");
const path = require("path");
const validateReq = require("./../../helpers/uploadValidator");
const schema = require("./../../schemas/admin/artistSchema");
const app = require("./../../config/firebaseConfig");
const {
  ref,
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");
const { addDoc, collection, getFirestore } = require("firebase/firestore");
const { getFileId, getId } = require("./../../helpers/id-gen");
const insertOne = require("./../../helpers/mongo/insertOne");

// @desc   Upload a new artist
// @route  POST /upload-artist
// @access Private

const uploadArtist = asyncHandler(async (req, res, next) => {
  validateReq(schema, req, res);

  const { name, description, country } = req.body;
  const imgRef = ref(
    getStorage(app),
    `/images/${getFileId(26)()}${path.extname(req.file.originalname)}`
  );
  const docRef = collection(getFirestore(app), "artists");
  const uploadTask = uploadBytesResumable(imgRef, req.file.buffer);
  uploadTask.on(
    "state_changed",
    (snapshot) => {},
    (err) => {
      next(err);
    },
    async (complete) => {
      try {
        const id = getId(16)();
        const url = await getDownloadURL(uploadTask.snapshot.ref);

        await addDoc(docRef, {
          artist_info: {
            name,
            id,
            images: [url],
            follower_num: 0,
            album_num: 0,
            song_num: 0,
            description,
            country,
          },
          artist_albums: [],
          artist_tracks: {
            name: req.body.name,
            id,
            tracks: [],
          },
        });
        await insertOne("autocompletedata", {
          name,
          id,
          type: "artist",
        });
        res.status(200).json({
          status: "success",
        });
      } catch (error) {
        next(error);
      }
    }
  );
});

module.exports = uploadArtist;
