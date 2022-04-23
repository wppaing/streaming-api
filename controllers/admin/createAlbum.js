const asyncHandler = require("express-async-handler");
const path = require("path");
const validateReq = require("../../helpers/uploadValidator");
const { getFileId, getId } = require("./../../helpers/id-gen");
const {
  ref,
  getStorage,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const app = require("./../../config/firebaseConfig");
const schema = require("./../../schemas/admin/albumSchema");
const {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
} = require("firebase/firestore");
const getDocIds = require("./../../helpers/firebase/docId");
const insertOne = require("./../../helpers/mongo/insertOne");

// @desc   Create an album
// @route  POST /create-album
// @access Private

const createAlbum = asyncHandler(async (req, res, next) => {
  validateReq(schema, req, res);
  const { name, description, artist_list, genre } = req.body;
  const artist_doc_ids = await getDocIds(
    "artists",
    "artist_info.id",
    "==",
    artist_list
  );

  const imageRef = ref(
    getStorage(app),
    `/images/${getFileId(26)()}${path.extname(req.file.originalname)}`
  );
  const docRef = collection(getFirestore(app), "albums");

  const uploadTask = uploadBytesResumable(imageRef, req.file.buffer);
  uploadTask.on(
    "state_changed",
    (snapshot) => {},
    (error) => {
      next(error);
    },
    async (completed) => {
      const id = getId(20)();
      try {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(docRef, {
          name,
          id,
          description,
          genre,
          images: [url],
          artist_list,
          tracks: [],
        });
        await insertOne("albums", {
          name,
          id,
        });
        await Promise.all(
          await artist_doc_ids.map(async (artist) => {
            await updateDoc(doc(getFirestore(app), "artists", artist), {
              artist_albums: [
                {
                  name,
                  id,
                },
              ],
            });
          })
        );
        res.status(200).json({
          status: "success",
        });
      } catch (error) {
        next(error);
      }
    }
  );
});

module.exports = createAlbum;
