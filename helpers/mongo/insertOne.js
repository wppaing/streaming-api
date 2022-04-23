const { client } = require("./../../config/mongoConfig");
const dbName = process.env.DEFAULT_MONGODB_NAME;

const insertOne = async (collectionName, document) => {
  const id = await (
    await client.db(dbName).collection(collectionName).insertOne(document)
  ).insertedId;
  return id;
};

module.exports = insertOne;
