const asyncHandler = require("express-async-handler");
const findOne = require("./../../helpers/mongo/findOne");
const bcrypt = require("bcryptjs");
const generateToken = require("./../../helpers/generateToken");

// @desc   Authenticate user
// @route  POST api/users/login
// @access public

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: {
        status: 400,
        message: "Invalid credentials",
      },
    });
  }
  const user = await findOne("users", { email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      message: "success",
      id: user.id,
      username: user.name,
      email: user.email,
      token: generateToken({ email: user.email }, "7d"),
    });
  } else {
    res.status(404).json({
      error: {
        status: 404,
        message: "User not found",
      },
    });
  }
});

module.exports = login;
