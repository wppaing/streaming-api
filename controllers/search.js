const asyncHandler = require("express-async-handler");
const { client } = require("../config/mongoConfig");
const queryMongo = require("./../helpers/querymongo");

// @desc   Global search endpoint
// @route  GET /search?keyword=
// @access Public

const search = asyncHandler(async (req, res, next) => {
  const data = [];
  try {
    const autocomplete = [];
    const coll = client.db("streamservice").collection("autocompletedata");
    const agg = [
      { $search: { autocomplete: { query: req.query.keyword, path: "name" } } },
      { $limit: 5 },
      { $project: { _id: 1, name: 1, type: 1, image: 1 } },
    ];
    const result = await coll.aggregate(agg);
    await result.forEach((doc) => autocomplete.push(doc));
    data.push({ items: autocomplete, section_title: "best-matches" });

    res.status(200).json({
      section_list: data,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = search;
