const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authorController = require('../controllers/authors');

// Validation rules
const authorValidationRules = [
  check('name').notEmpty().withMessage('Name is required').trim().escape(),
  check('birthDate').notEmpty().withMessage('Birth date is required').isDate(),
  check('nationality').notEmpty().withMessage('Nationality is required').trim().escape(),
  check('biography').optional().trim().escape(),
  check('website').optional().isURL().withMessage('Invalid URL format'),
  check('isActive').optional().isBoolean()
];

// Routes
router.get('/', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthor);
router.post('/', authorValidationRules, authorController.createAuthor);
router.put('/:id', authorValidationRules, authorController.updateAuthor);
router.delete('/:id', authorController.deleteAuthor);

module.exports = router;