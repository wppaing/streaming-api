const app = require("./../../config/firebaseConfig");
const {
  collection,
  getFirestore,
  getDocs,
  query,
  where,
} = require("firebase/firestore");

// @desc   Get doucment from custom queries
// @return Firestore document

const getDocument = async (collectionName, field, condition, value) => {
  let document;
  const docRef = collection(getFirestore(app), collectionName);
  const snapshot = await getDocs(query(docRef, where(field, condition, value)));
  snapshot.forEach((doc) => (document = doc.data()));
  return document;
};

module.exports = getDocument;
