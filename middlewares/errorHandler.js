const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;

  process.env.NODE_ENV === "production"
    ? res.status(statusCode).json({
        error: {
          status: statusCode,
          message: err.message,
        },
      })
    : res.status(statusCode).json({
        error: {
          status: statusCode,
          message: err.message,
          stack: err.stack,
        },
      });
};

module.exports = errorHandler;
