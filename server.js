const path = require('path');
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const mongoose = require('mongoose');
const logger = require('./middleware/logger');
const { accessLogMiddleware, errorLogMiddleware } = require('./middleware/morganWare');
const verifyJWT = require('./middleware/verifyJWT');
// const authApiKey = require('./middleware/authApiKey');

app.use(express.json()); // Use express.json() for parsing JSON data


connectDB();


// Use HTTP request logger
app.use(accessLogMiddleware);
app.use(errorLogMiddleware);
// app.use(logger.notFound);
// app.use(logger.errorHandler);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the cookie-parser middleware
app.use(cookieParser());


// Cross Origin Resource Sharing
app.use(cors(corsOptions));
// Routes
app.use('/api/register', require('./routes/v1/register'));
app.use('/api/auth', require('./routes/v1/auth'));
app.use('/api/reset', require('./routes/v1/reset'));
app.use('/api/refresh', require('./routes/v1/refresh'));
app.use('/api/logout', require('./routes/v1/logout'));
// Recipe route functions
app.use('/api/recipe', require('./routes/v1/recipe'));
app.use('/api/users', require('./routes/v1/users'));

app.use(verifyJWT);
app.use('/api/user', require('./routes/v1/user'));



//server
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
