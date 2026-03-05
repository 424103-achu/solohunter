// Global error handler middleware

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack || err.message || err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Postgres unique violation
  if (err.code === '23505') {
    statusCode = 409;
    message = 'Resource already exists';
  }

  // Postgres foreign key violation
  if (err.code === '23503') {
    statusCode = 400;
    message = 'Referenced resource not found';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
