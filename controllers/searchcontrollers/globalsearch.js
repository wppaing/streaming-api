const { client } = require("./../../config/mongoConfig");

const globalSearch = async (query) => {
  const { keyword, limit } = query;

  const agg = [
    {
      $search: {
        index: "one",
        text: {
          query: keyword,
          path: "title",
          synonyms: "synonyms",
        },
      },
    },
    {
      $limit: Math.floor(limit - limit / 2),
    },
    {
      $project: {
        _id: 0,
        title: 1,
        score: { $meta: "searchScore" },
      },
    },
  ];

  const agg2 = [
    {
      $search: {
        autocomplete: {
          query: keyword,
          path: "name",
          // score: { boost: { value: 2 } },
        },
      },
    },
    {
      $limit: Math.floor(limit - limit / 2),
    },
    {
      $project: {
        _id: 0,
        name: 1,
        type: 1,
        images: 1,
        // score: { $meta: "searchScore" },
      },
    },
  ];

  const data = [];
  const coll = client
    .db(process.env.DEFAULT_MONGODB_NAME)
    .collection("autocompletedata");
  let cursor = await coll.aggregate(agg);
  let cursor2 = await coll.aggregate(agg2);
  await cursor.forEach((doc) => data.push(doc));
  await cursor2.forEach((doc) => data.push(doc));
  // data.sort((a, b) => b.score - a.score);
  return data;
};

module.exports = globalSearch;
