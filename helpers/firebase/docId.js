const {
  collection,
  getDocs,
  query,
  where,
  getFirestore,
} = require("firebase/firestore");
const app = require("./../../config/firebaseConfig");

// @desc   Get doucment id from custom queries
// @return An array of document ids

const getDocIds = async (collectionName, field, condition, valueArray) => {
  const ids = [];
  const collectionRef = collection(getFirestore(app), collectionName);
  const iterable = await valueArray.map(async (el) => {
    const snapshot = await getDocs(
      query(collectionRef, where(field, condition, el.id))
    );
    snapshot.forEach((doc) => {
      ids.push(doc.id);
    });
  });
  await Promise.all(iterable);
  return ids;
};

module.exports = getDocIds;
