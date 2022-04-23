const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required(),
  artist_list: Joi.array()
    .items({
      id: Joi.string().required(),
      name: Joi.string().required(),
    })
    .required(),
  description: Joi.string().required(),
  genre: Joi.string().required(),
});

module.exports = schema;
