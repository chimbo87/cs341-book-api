const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { authenticate, authorize } = require('../middlewares/auth');
const bookController = require('../controllers/books');

// Validation rules
const bookValidationRules = [
  check('title').notEmpty().withMessage('Title is required').trim().escape(),
  check('author').notEmpty().withMessage('Author is required').isMongoId(),
  check('isbn').notEmpty().withMessage('ISBN is required').trim().escape(),
  check('price').notEmpty().withMessage('Price is required').isFloat({ min: 0 }),
  check('publicationYear').notEmpty().withMessage('Publication year is required').isInt({ min: 1000, max: new Date().getFullYear() }),
  check('genre').notEmpty().withMessage('Genre is required').isIn(['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance', 'Biography', 'History', 'Self-Help']),
  check('stockQuantity').optional().isInt({ min: 0 }),
  check('description').optional().trim().escape()
];

// Routes
// router.get('/', bookController.getAllBooks);
// router.get('/:id', bookController.getBook);
// router.post('/', bookValidationRules, bookController.createBook);
// router.put('/:id', bookValidationRules, bookController.updateBook);
// router.delete('/:id', bookController.deleteBook);

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBook);
router.post('/', authenticate, authorize(['admin']), bookValidationRules, bookController.createBook);
router.put('/:id', authenticate, authorize(['admin']), bookValidationRules, bookController.updateBook);
router.delete('/:id', authenticate, authorize(['admin']), bookController.deleteBook);

module.exports = router;