const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const authController = require('../controllers/auth');

// Local registration validation
const registerValidation = [
  check('name').notEmpty().withMessage('Name is required').trim().escape(),
  check('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
  check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

// Local login validation
const loginValidation = [
  check('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
  check('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/me', passport.authenticate('jwt', { session: false }), authController.getMe);
router.get('/logout', passport.authenticate('jwt', { session: false }), authController.logout);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email']
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  authController.googleCallback
);

module.exports = router;