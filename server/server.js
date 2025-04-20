const express = require('express');
const path = require('path');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./utils/errorHandler');
const connectDB = require('./config/db');

// Load env vars
require('dotenv').config();

// Connect to database
connectDB();

// Route files
const apiRoutes = require('./routes');

const app = express();

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use((req, res, next) => {
  req.query = { ...req.query };
  next();
});

// Sanitize data
app.use(mongoSanitize({
  replaceWith: '_'
}));

// Set security headers
app.use(helmet());
app.use(xss());
app.use(hpp());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1', apiRoutes);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
}); 