const { v4: uuidv4 } = require('uuid');

/**
 * Centralized error handler.
 * Structured JSON response with correlation IDs.
 */
function errorHandler(err, _req, res, _next) {
  const correlationId = uuidv4();
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  // Log the full error in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${correlationId}]`, err);
  }

  res.status(status).json({
    error: {
      message,
      correlationId,
      ...(err.details && { details: err.details }),
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
}

/**
 * 404 handler for unmatched routes.
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
}

/**
 * Helper to create an error with a status code.
 */
class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { errorHandler, notFoundHandler, AppError };
