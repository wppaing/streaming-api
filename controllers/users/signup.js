const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const insertOne = require("../../helpers/mongo/insertOne");
const findOne = require("../../helpers/mongo/findOne");
const generateToken = require("../../helpers/generateToken");

// @desc    Register a new user
// @route   POST api/signup
// @access  public

const signUp = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({
      error: {
        status: 400,
        message: "Missing fields",
      },
    });
  }
  // check if user already exists
  const userExists = await findOne("users", { email });
  if (userExists) {
    return res.status(400).json({
      error: {
        status: 400,
        message: "User already exists",
      },
    });
  }

  const salt = await bcrypt.genSalt();
  const hashedPass = await bcrypt.hash(password, salt);
  const id = await insertOne("users", {
    name: username,
    email,
    password: hashedPass,
  });
  if (id) {
    res.status(201).json({
      id,
      message: "success",
      token: generateToken({ id, email }, "7d"),
    });
  }
});

module.exports = signUp;
