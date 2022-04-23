const asyncHandler = require("express-async-handler");
const { client } = require("../../config/mongoConfig");

// @desc   Find an artist
// @route  GET /search/artist?name=
// @access Protected

const artistSearch = asyncHandler(async (req, res) => {
  try {
    const result = await client
      .db("streamservice")
      .collection("artists")
      .findOne({
        name: req.query.name,
      });
    res.json(result);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

module.exports = artistSearch;
