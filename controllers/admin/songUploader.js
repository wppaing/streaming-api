const asyncHandler = require("express-async-handler");
const path = require("path");
const validateReq = require("./../../helpers/uploadValidator");
const app = require("./../../config/firebaseConfig");
const {
  doc,
  collection,
  getFirestore,
  addDoc,
  updateDoc,
  arrayUnion,
} = require("firebase/firestore");
const schema = require("./../../schemas/admin/songSchema");
const { ref, getStorage } = require("firebase/storage");
const { getFileId, getId } = require("./../../helpers/id-gen");
const insertOne = require("./../../helpers/mongo/insertOne");
const getDocIds = require("./../../helpers/firebase/docId");
const getDocument = require("./../../helpers/firebase/getDocument");
const firebaseUploader = require("./../../helpers/firebase/firebaseUploader");
const imageUploader = require("./../../helpers/firebase/imageUploader");

// @desc   Upload a song to database
// @route  POST /upload-song
// @access Private

const uploadSong = asyncHandler(async (req, res, next) => {
  validateReq(schema, req, res);
  const whiteList = ["audio/x-m4a", "audio/mpeg"];
  // if (!whiteList.includes(req.file.mimetype)) {
  //   return res.status(400).json({
  //     error: {
  //       status: 400,
  //       message: "Wrong file type",
  //     },
  //   });
  // }

  const {
    name,
    album_id,
    album_name,
    artist_list,
    genre,
    language,
    lrc_content,
    play_duration,
  } = req.body;

  const albumDocId = await getDocIds("albums", "id", "==", [{ id: album_id }]);
  const albumDoc = await getDocument("albums", "id", "==", album_id);
  const docRef = collection(getFirestore(app), "songs");
  const songRef = ref(
    getStorage(app),
    `/songs/${getFileId(30)()}${path.extname(req.file.originalname)}`
  );
  const id = getId(30)();
  const songUrl = await firebaseUploader(songRef, req.file.buffer, {
    contentType: "audio/mpeg",
  });
  const images = albumDoc.images;
  const i100 = images.filter((el) => Object.keys(el) == 100);
  const document = {
    id,
    name,
    album_id,
    album_name,
    artist_list,
    genre,
    language,
    images,
    lrc_exists: lrc_content.length === 0 ? false : true,
    lrc_content,
    play_duration,
    play_url_list: [songUrl],
  };
  try {
    await addDoc(docRef, document);
    await insertOne("autocompletedata", {
      name,
      id,
      images: Object.values(i100[0]),
      type: "Song",
      artist_list,
    });
    await updateDoc(doc(getFirestore(app), "albums", albumDocId[0]), {
      tracks: arrayUnion({
        name,
        id,
        play_duration,
      }),
    });
    res.status(200).json({
      status: "success",
      document,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = uploadSong;
