const { StatusCodes } = require('http-status-codes');
const passport = require('passport');

// Middleware to check if user is authenticated
exports.authenticate = passport.authenticate('jwt', { session: false });

// Middleware to check if user has admin role
exports.authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'You are not authorized to access this resource'
      });
    }
    next();
  };
};