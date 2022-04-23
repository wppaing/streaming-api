const queryMongo = async (client, collection, query) => {
  const result = await client
    .db("streamservice")
    .collection(collection)
    .findOne(query);
  return result;
};

module.exports = queryMongo;
