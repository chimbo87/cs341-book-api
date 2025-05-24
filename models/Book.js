const mongoose = require('mongoose');
const { StatusCodes } = require('http-status-codes');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: [true, 'Author is required']
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/.test(v);
      },
      message: props => `${props.value} is not a valid ISBN!`
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  publicationYear: {
    type: Number,
    required: [true, 'Publication year is required'],
    min: [1000, 'Publication year must be after 1000'],
    max: [new Date().getFullYear(), `Publication year cannot be in the future`]
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    enum: {
      values: ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Romance', 'Biography', 'History', 'Self-Help'],
      message: '{VALUE} is not a valid genre'
    }
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative'],
    default: 0
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search functionality
bookSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);