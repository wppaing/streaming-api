const asyncHandler = require('express-async-handler');
const { client } = require('../config/mongoConfig');
const queryMongo = require('./../helpers/querymongo');
const globalSearch = require('./searchcontrollers/globalsearch');

// @desc   Global search endpoint
// @route  GET /search?keyword= &limit= &type=
// @access Public

const search = asyncHandler(async (req, res) => {
  const data = await globalSearch(req.query);
  res.status(200).json({
    section_list: data,
  });
});

module.exports = search;
