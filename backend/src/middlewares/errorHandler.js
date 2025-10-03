// A Global Error Handler to handle all AppErrors - which passed through nextFunction
const globalErrorHandler = () =>
  function (err, req, res, next) {
    // Log the error for debugging (e.g., using a logging library like Winston)
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const status = err.status || "error";
    const message = err.message || "Something went wrong!";

    // Send a user-friendly error response (avoid leaking sensitive information)
    res.status(statusCode).json({ status, message });
  };

module.exports = { globalErrorHandler };
