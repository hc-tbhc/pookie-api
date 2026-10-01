const postgresErrorMap = {
  23503: {
    status: 404,
    message: "User not found"
  }
};

function errorHandler(err, req, res, next) {
  if (postgresErrorMap[err.code]) {
    const { status, message } =
      postgresErrorMap[err.code];

    return res.status(status).json({ message });
  }

  return res.status(500).json({
    message: "Internal server error"
  });
}

module.exports = {
  errorHandler
};
