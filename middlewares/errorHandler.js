const errorHandler = (err, req, res, _next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  const message = err.message || 'An unexpected error occurred on the server.';

  if (process.env.NODE_ENV === 'development') {
    res.status(statusCode).json({ message, stack: err.stack, status: 'error' });
  } else {
    res.status(statusCode).json({ message, status: 'error' });
  }
};

module.exports = errorHandler;
