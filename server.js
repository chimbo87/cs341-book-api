require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const { StatusCodes } = require('http-status-codes');

// Import routes
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');

// Import error handler
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);

// Test route
app.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'Book Shop API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));