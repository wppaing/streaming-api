const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const findOne = require("../helpers/mongo/findOne");

const protectRoute = asyncHandler(async (req, res, next) => {
  const authorization = req.headers["authorization"];
  if (!authorization) {
    return res.status(401).json({
      error: {
        status: 401,
        message: "No token provided",
      },
    });
  }
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      const token = authorization.split(" ")[1];
      const decodedtoken = jwt.verify(token, process.env.JWT_SECRET_CODE);
      const user = await findOne("users", { email: decodedtoken.email });
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        error: {
          status: 401,
          message: "Not authorized",
        },
      });
    }
  }
});

module.exports = protectRoute;
