const { client } = require("../../config/mongoConfig");
const dbName = process.env.DEFAULT_MONGODB_NAME;

const findOne = async (collectionName, query) => {
  const result = client.db(dbName).collection(collectionName).findOne(query);
  return result;
};

module.exports = findOne;
