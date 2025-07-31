    const errorHandler = (err, req, res) => {

      const statusCode = err.statusCode || 500;
      const message = err.message || 'An unexpected error occurred on the server.';


      if (res.headersSent) {
        return;
      }

      res.setHeader('Content-Type', 'application/json');
      res.status(statusCode).json({
        message,
      });
    };

    module.exports = errorHandler;
