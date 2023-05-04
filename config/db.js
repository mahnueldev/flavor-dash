const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables based on current environment
if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.development.local" });
} else {
  dotenv.config({ path: ".env.production.local" });
}

const db = process.env.DB_MONGOURI;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
