const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  donatorName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  foodDetails: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false, // Image is optional
  },
  donatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  available: {
    type: Boolean,
    default: true, // Set default availability to true
  },
  quantity: {
    type: Number,
    default: 1, // Set default quantity to 1
    required: true,
  },
}, {
  timestamps: true, // Automatically create createdAt and updatedAt timestamps
});

// Create a food model
const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
