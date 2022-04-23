const adminAuth = (req, res, next) => {
  if (req.user.role != "admin") {
    return res.status(401).json({
      error: {
        status: 401,
        message: "Access Denied",
      },
    });
  } else {
    next();
  }
};

module.exports = adminAuth;
