const asyncHandler = require("express-async-handler");
const getDocument = require("../helpers/firebase/getDocument");
const Joi = require("joi");
const updateOne = require("../helpers/mongo/updateOne");

// @desc   Get song details
// @route  GET /song?id
// @access Private

const getSong = asyncHandler(async (req, res, next) => {
  const validation = Joi.object({ id: Joi.string().required() }).validate(
    req.query
  );
  if (validation.error) {
    return res.status(400).json({
      error: {
        status: 400,
        message: validation.error.details,
      },
    });
  }
  try {
    const data = await getDocument("songs", "id", "==", req.query.id);
    if (!data) {
      return res.status(404).json({
        error: {
          status: 404,
          message: "Not found",
        },
      });
    }
    // Increment listen count of the song
    await updateOne(
      "listencount",
      { id: req.query.id, type: "song" },
      { $inc: { qty: 1 } }
    );
    // Also increment to artist profile
    await updateOne(
      "listencount",
      { id: data.artist_list[0].id, type: "artist" },
      { $inc: { qty: 1 } }
    );
    res.json(data);
  } catch (error) {
    next(error);
  }
});

module.exports = getSong;
