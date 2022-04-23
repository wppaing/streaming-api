const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required(),
  album_id: Joi.string().required(),
  album_name: Joi.string().required(),
  artist_list: Joi.array()
    .items({
      id: Joi.string().required(),
      name: Joi.string().required(),
    })
    .required(),
  genre: Joi.string().required(),
  language: Joi.string().required(),
  lrc_content: Joi.string().allow(""),
  play_duration: Joi.number(),
});

module.exports = schema;
