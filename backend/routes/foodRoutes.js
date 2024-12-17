const express = require('express');
const {
  submitFood,
  getAvailableFood,
  updateFood,
  deleteFood,
} = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Route to submit food donation
router.post('/donate', protect, upload.single('image'), submitFood);

// Route to get available food
router.get('/available-food', protect, getAvailableFood);

// Route to update food item by ID
router.put('/:id', protect, upload.single('image'), updateFood);

// Route to delete food item by ID
router.delete('/:id', protect, deleteFood);

module.exports = router;

