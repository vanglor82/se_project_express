const errorHandler = (err, req, res) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  const message = err.message || "An unexpected error occurred on the server.";
  res.setHeader("Content-Type", "application/json");
  res.status(statusCode).json({
    message,
  });
};

module.exports = errorHandler;
