// File: errorHandler.js
// Path: backend/middleware/errorHandler.js

exports.errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
