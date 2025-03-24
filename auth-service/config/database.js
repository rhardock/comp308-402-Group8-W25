const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Auth Service connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error (Auth Service):', error);
    process.exit(1);
  }
};

module.exports = connectDB;
