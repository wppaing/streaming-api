const { client } = require("./../../config/mongoConfig");

const globalSearch = async (query) => {
  const { keyword, limit, type } = query;
  const limitt = limit || 10;

  const agg = [
    {
      $search: {
        text: {
          query: keyword,
          path: "name",
        },
      },
    },
    {
      $limit: Math.floor(limitt - limitt / 2),
    },
    {
      $project: {
        _id: 0,
        id: 1,
        name: 1,
        images: 1,
        type: 1,
      },
    },
  ];

  const autocomplete = [
    {
      $search: {
        index: "autocomplete",
        compound: {
          filter: {
            text: {
              query: type,
              path: "type",
            },
          },
          should: [
            {
              autocomplete: {
                query: keyword,
                path: "name",
              },
            },
          ],
        },
      },
    },
    {
      $limit: Math.floor(limitt - limitt / 2),
    },
    {
      $project: {
        _id: 0,
        id: 1,
        name: 1,
        images: 1,
        type: 1,
      },
    },
  ];

  const data = [];
  const coll = client
    .db(process.env.DEFAULT_MONGODB_NAME)
    .collection("autocompletedata");
  let cursor = await coll.aggregate(agg);
  await cursor.forEach((doc) => data.push(doc));
  let autocompleteCursor = await coll.aggregate(autocomplete);
  await autocompleteCursor.forEach((doc) => data.push(doc));

  // data.sort((a, b) => b.score - a.score);
  return data;
};

module.exports = globalSearch;
