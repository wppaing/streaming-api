const { client } = require("./../../config/mongoConfig");
const dbName = process.env.DEFAULT_MONGODB_NAME;

const updateOne = async (collectionName, filter, document) => {
  const isSuccess = await (
    await client
      .db(dbName)
      .collection(collectionName)
      .updateOne(filter, document)
  ).acknowledged;
  return isSuccess;
};

module.exports = updateOne;
