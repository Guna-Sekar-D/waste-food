const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');
const path = require('path');
const cors = require('cors');  // Import cors

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/food', foodRoutes);

// Make uploads folder publicly accessible
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Error handling
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
