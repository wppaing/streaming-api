const asyncHandler = require("express-async-handler");
const validateReq = require("../../helpers/uploadValidator");
const { getId } = require("./../../helpers/id-gen");
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
const imageUploader = require("./../../helpers/firebase/imageUploader");

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

  const docRef = collection(getFirestore(app), "albums");
  const images = await imageUploader(req.file.buffer);
  const i100 = images.filter((el) => Object.keys(el) == 100);
  const i300 = images.filter((el) => Object.keys(el) == 300);
  const id = getId(20)();
  const document = {
    name,
    id,
    description,
    genre,
    images,
    artist_list,
    tracks: [],
  };
  try {
    await addDoc(docRef, document);
    await insertOne("autocompletedata", {
      name,
      id,
      images: Object.values(i100[0]),
      type: "Album",
    });
    await Promise.all(
      await artist_doc_ids.map(async (artist) => {
        await updateDoc(doc(getFirestore(app), "artists", artist), {
          artist_albums: [
            {
              name,
              id,
              images: Object.values(i300[0]),
            },
          ],
        });
      })
    );
    res.status(200).json({
      status: "success",
      document,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = createAlbum;
