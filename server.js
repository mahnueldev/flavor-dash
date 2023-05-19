const path = require('path');
const connectDB = require('./config/db');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('./middleware/logger');
const {accessLogMiddleware, errorLogMiddleware } = require('./middleware/morganWare');
const verifyJWT= require('./middleware/verifyJWT');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


connectDB();
// Cross Origin Resource Sharing
app.use(cors(corsOptions));


// Use HTTP request logger
app.use(accessLogMiddleware);
app.use(errorLogMiddleware);
// app.use(logger.notFound);
// app.use(logger.errorHandler);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the cookie-parser middleware
app.use(cookieParser());
 

// Routes
app.use('/api/register', require('./routes/register'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reset', require('./routes/reset'));
app.use('/api/refresh', require('./routes/refresh'));
app.use('/api/logout', require('./routes/logout'));
app.use(verifyJWT);
app.use('/api/user', require('./routes/users'));


//server
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
