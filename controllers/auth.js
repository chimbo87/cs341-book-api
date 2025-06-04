const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const passport = require('passport');
const { validationResult } = require('express-validator');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// Local registration
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(StatusCodes.CONFLICT).json({ message: 'Email already in use' });
    }

    const user = await User.create({ email, password, name });
    
    const token = generateToken(user);
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Local login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    
    res.status(StatusCodes.OK).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Google OAuth callback
exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: info ? info.message : 'Google authentication failed'
      });
    }

    const token = generateToken(user);
    
    // Redirect or send token based on your frontend needs
    res.status(StatusCodes.OK).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  })(req, res, next);
};

// Get current user
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(StatusCodes.OK).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// Logout (client-side should remove token)
exports.logout = (req, res) => {
  res.status(StatusCodes.OK).json({ success: true, message: 'Logged out successfully' });
};