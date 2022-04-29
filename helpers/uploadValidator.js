const validateReq = (schema, req, res) => {
  const validation = schema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    res.status(400).json({
      error: {
        status: 400,
        message: validation.error,
      },
    });
  }
  if (!req.file) {
    res.status(400);
    throw new Error("Missing files");
  }
};

module.exports = validateReq;
