const asyncHandler = require("express-async-handler");
const app = require("../config/firebaseConfig");
const {
  collection,
  query,
  getFirestore,
  limit,
  getDocs,
  where,
} = require("firebase/firestore");
const ref = collection(getFirestore(app), "artists");

// @desc   Get a list of artists
// @route  GET /artist?id=&&limit=
// @access Private

const getArtist = asyncHandler(async (req, res, next) => {
  const data = [];
  let q = query(ref);
  if (req.query.id && !req.query.limit) {
    q = query(ref, where("artist_info.id", "==", id));
  } else if (!req.query.id && req.query.limit) {
    q = query(ref, limit(req.query.limit));
  }

  try {
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => data.push(doc.data()));
    if (!data) {
      res.status(404).json({
        error: {
          status: 404,
          message: "Not found",
        },
      });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = getArtist;
