    const errorHandler = (err, req, res) => {
      
      console.error("\n--- GitHub Actions Error Handler Hit ---");
      console.error("Request URL:", req.originalUrl);
      console.error("Request Method:", req.method);
      console.error("Error received:", err);
      console.error("Error name:", err.name);
      console.error("Error message:", err.message);
      console.error("Error statusCode (from err object):", err.statusCode);
      console.error("Is response already sent?", res.headersSent);
      console.error("--- End GitHub Actions Error Handler Hit ---\n");


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
