const logger = require('../utils/logger');

function errorMiddleware(err, req, res, next) {
  logger.error(`${req.method} ${req.originalUrl} - Error: ${err.message}`, err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = { errorMiddleware };
