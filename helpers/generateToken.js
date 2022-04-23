const jwt = require("jsonwebtoken");

const generateToken = (payload, expiry) => {
  return jwt.sign(payload, process.env.JWT_SECRET_CODE, {
    expiresIn: expiry,
  });
};

module.exports = generateToken;
