const Author = require('../models/Author');
const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');

// Get all authors
exports.getAllAuthors = async (req, res, next) => {
  try {
    const authors = await Author.find({});
    res.status(StatusCodes.OK).json({ count: authors.length, authors });
  } catch (error) {
    next(error);
  }
};

// Get single author
exports.getAuthor = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Author not found' });
    }
    res.status(StatusCodes.OK).json({ author });
  } catch (error) {
    next(error);
  }
};

// Create author
exports.createAuthor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const author = new Author(req.body);
    await author.save();
    res.status(StatusCodes.CREATED).json({ author });
  } catch (error) {
    next(error);
  }
};

// Update author
exports.updateAuthor = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!author) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Author not found' });
    }

    res.status(StatusCodes.OK).json({ author });
  } catch (error) {
    next(error);
  }
};

// Delete author
exports.deleteAuthor = async (req, res, next) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Author not found' });
    }
    res.status(StatusCodes.OK).json({ message: 'Author deleted successfully' });
  } catch (error) {
    next(error);
  }
};