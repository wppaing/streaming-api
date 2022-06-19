const asyncHandler = require("express-async-handler");
const validateReq = require("./../../helpers/uploadValidator");
const schema = require("./../../schemas/admin/artistSchema");
const app = require("./../../config/firebaseConfig");

const { addDoc, collection, getFirestore } = require("firebase/firestore");
const { getId } = require("./../../helpers/id-gen");
const insertOne = require("./../../helpers/mongo/insertOne");
const imageUploader = require("./../../helpers/firebase/imageUploader");

// @desc   Upload a new artist
// @route  POST /upload-artist
// @access Private

const uploadArtist = asyncHandler(async (req, res, next) => {
  validateReq(schema, req, res);
  const whiteList = ["image/png", "image/jpeg"];
  if (!whiteList.includes(req.file.mimetype)) {
    return res.status(400).json({
      error: {
        status: 400,
        message: "Wrong file type",
      },
    });
  }

  const { name, description, country } = req.body;
  const docRef = collection(getFirestore(app), "artists");
  const images = await imageUploader(req.file.buffer);
  const i100 = images.filter((el) => Object.keys(el) == 100);
  const id = getId(16)();
  const document = {
    artist_info: {
      name,
      id,
      images,
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
  };
  try {
    await addDoc(docRef, document);
    await insertOne("autocompletedata", {
      name,
      id,
      images: Object.values(i100[0]),
      type: "Artist",
    });
    await insertOne("listencount", {
      id,
      type: "artist",
      qty: 0,
    });
    res.status(200).json({
      status: "success",
      document,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = uploadArtist;
