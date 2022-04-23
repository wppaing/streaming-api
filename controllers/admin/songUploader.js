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
} = require("firebase/firestore");
const schema = require("./../../schemas/admin/songSchema");
const {
  uploadBytesResumable,
  ref,
  getStorage,
  getDownloadURL,
} = require("firebase/storage");
const { getFileId, getId } = require("./../../helpers/id-gen");
const insertOne = require("./../../helpers/mongo/insertOne");
const getDocIds = require("./../../helpers/firebase/docId");
const getDocument = require("./../../helpers/firebase/getDocument");

// @desc   Upload a song to database
// @route  POST /upload-song
// @access Private

const artistUploader = asyncHandler(async (req, res, next) => {
  validateReq(schema, req, res);

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

  const uploadTask = uploadBytesResumable(songRef, req.file.buffer);
  uploadTask.on(
    "state_changed",
    (snapshot) => {},
    (error) => {
      next(error);
    },
    async (complete) => {
      const id = getId(30)();
      try {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(docRef, {
          id,
          name,
          album_id,
          album_name,
          artist_list,
          genre,
          language,
          images: albumDoc.images,
          lrc_exists: lrc_content.length === 0 ? false : true,
          lrc_content,
          play_duration,
          play_url_list: [url],
        });
        await insertOne("songs", {
          name,
          id,
        });
        await updateDoc(doc(getFirestore(app), "albums", albumDocId[0]), {
          tracks: [
            {
              name,
              id,
              play_duration,
            },
          ],
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

module.exports = artistUploader;
