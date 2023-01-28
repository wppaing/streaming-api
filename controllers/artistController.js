const asyncHandler = require('express-async-handler');
const app = require('../config/firebaseConfig');
const {
  collection,
  query,
  getFirestore,
  limit,
  where,
} = require('firebase/firestore');
const ref = collection(getFirestore(app), 'artists');
const getFirebaseDoc = require('../helpers/firebase/getDocument');

// @desc   Get a list of artists
// @route  GET /artist?id=&&limit=
// @access Private

const getArtist = asyncHandler(async (req, res) => {
  let q;
  if (req.query.id && !req.query.limit) {
    q = query(ref, where('artist_info.id', '==', req.query.id));
  } else if (!req.query.id && req.query.limit) {
    q = query(ref, limit(req.query.limit));
  }

  const doc = await getFirebaseDoc(
    'artists',
    'artist_info.id',
    '==',
    req.query.id
  );

  if (!doc) {
    res.status(404).json({
      error: {
        status: 404,
        message: 'Not found',
      },
    });
  }
  res.status(200).json(doc);
});

module.exports = getArtist;
