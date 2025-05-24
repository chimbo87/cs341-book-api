const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxlength: [100, 'Author name cannot be more than 100 characters']
  },
  birthDate: {
    type: Date,
    required: [true, 'Birth date is required']
  },
  nationality: {
    type: String,
    required: [true, 'Nationality is required'],
    maxlength: [50, 'Nationality cannot be more than 50 characters']
  },
  biography: {
    type: String,
    maxlength: [2000, 'Biography cannot be more than 2000 characters']
  },
  website: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Author', authorSchema);