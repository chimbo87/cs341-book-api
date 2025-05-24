const Book = require('../models/Book');
const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');

// Get all books
exports.getAllBooks = async (req, res, next) => {
  try {
    const { genre, minPrice, maxPrice, search } = req.query;
    let query = {};

    if (genre) query.genre = genre;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (search) query.$text = { $search: search };

    const books = await Book.find(query).populate('author', 'name');
    res.status(StatusCodes.OK).json({ count: books.length, books });
  } catch (error) {
    next(error);
  }
};

// Get single book
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('author');
    if (!book) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Book not found' });
    }
    res.status(StatusCodes.OK).json({ book });
  } catch (error) {
    next(error);
  }
};

// Create book
exports.createBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const book = new Book(req.body);
    await book.save();
    res.status(StatusCodes.CREATED).json({ book });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(StatusCodes.CONFLICT).json({ message: 'ISBN already exists' });
    }
    next(error);
  }
};

// Update book
exports.updateBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!book) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Book not found' });
    }

    res.status(StatusCodes.OK).json({ book });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(StatusCodes.CONFLICT).json({ message: 'ISBN already exists' });
    }
    next(error);
  }
};

// Delete book
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Book not found' });
    }
    res.status(StatusCodes.OK).json({ message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
};