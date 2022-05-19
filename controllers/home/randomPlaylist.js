const asyncHanler = require("express-async-handler");
const { collection, getFirestore, getDocs } = require("firebase/firestore");
const app = require("../../config/firebaseConfig");
const getRandom = require("../../helpers/getRandom");

// @desc   Get random playlist in homepage
// @route  GET /homepage/playlists
// @access Private

const getRandomPlaylist = asyncHanler(async (req, res, next) => {
  const docIds = [];
  const docRef = collection(getFirestore(app), "albums");
  const snapshot = await getDocs(docRef);
  snapshot.forEach((doc) => {
    docIds.push(doc.data());
  });
  const randomArr = getRandom(docIds, 5);
  res.status(200).json(randomArr);
});

module.exports = getRandomPlaylist;
