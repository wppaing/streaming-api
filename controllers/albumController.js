const asyncHandler = require('express-async-handler');
const app = require('../config/firebaseConfig');
const {
  collection,
  getFirestore,
  query,
  getDocs,
  where,
} = require('firebase/firestore');
const Joi = require('joi');
const ref = collection(getFirestore(app), 'albums');

// @desc   Get album details
// @route  GET /album?id
// @access Private

const getAlbum = asyncHandler(async (req, res) => {
  const validation = Joi.object({
    id: Joi.string().required(),
  }).validate(req.query, { abortEarly: false });

  if (validation.error) {
    return res.status(400).json({
      error: {
        status: 400,
        message: validation.error.details,
      },
    });
  }

  const id = req.query.id;
  const q = query(ref, where('id', '==', id));
  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {
    const data = doc.data();

    if (!data) {
      return res.status(404).json({
        error: {
          status: 404,
          message: 'Not found',
        },
      });
    }
    res.status(200).json(data);
  });
});

module.exports = getAlbum;
