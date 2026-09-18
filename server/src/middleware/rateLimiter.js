const rateLimit = require('express-rate-limit');

/**
 * 100 requests per minute per IP (API_CONTEXT.md spec).
 */
const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: { message: 'Too many requests — try again in a minute' },
  },
});

module.exports = { rateLimiter };
