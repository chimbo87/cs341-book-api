const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = 'Something went wrong on the server';

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = StatusCodes.BAD_REQUEST;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    statusCode = StatusCodes.CONFLICT;
    message = 'Duplicate field value entered';
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Resource not found';
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

module.exports = errorHandler;