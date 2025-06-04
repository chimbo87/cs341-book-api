// middlewares/errorHandler.js - Updated
const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = 'Something went wrong on the server';
  let errors = null;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Validation failed';
    errors = Object.values(err.errors).map(el => ({
      field: el.path,
      message: el.message
    }));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = 'Token expired';
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = StatusCodes.CONFLICT;
    message = 'Duplicate field value entered';
    errors = [{ 
      field: Object.keys(err.keyPattern)[0],
      message: `This ${Object.keys(err.keyPattern)[0]} already exists`
    }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};