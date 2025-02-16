const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');

if (process.env.NODE_ENV === 'development') {
  console.log('Using local environment variables');
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});
app.use('/uploads', express.static('uploads'));
// Auth routes
app.use('/api/auth', authRoutes);
//upload routes
app.use('/api', require('./routes/upload'));
const PORT = process.env.PORT || 5600;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
