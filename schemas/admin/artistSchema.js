const Joi = require("joi");

const schema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  country: Joi.string().required(),
});

module.exports = schema;
