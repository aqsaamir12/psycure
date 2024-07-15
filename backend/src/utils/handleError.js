/**
 * Error handling middleware for Express.
 *
 * @param {Error} err - The error object containing details about the error.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object for sending an error response to the client.
 * @param {function} next - The Express next function.
 */

const handleError = function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      status: false,
      message: err.message,
      stack: err.stack,
      errors: err.errors,
    });
  };
  module.exports = handleError;
  