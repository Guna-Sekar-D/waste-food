const asyncHandler = require('express-async-handler');
const Food = require('../models/foodModel');

// @desc Submit food donation
// @route POST /api/food/donate
const submitFood = asyncHandler(async (req, res) => {
  try {
    console.log(req.body); // Log incoming request body to verify data
    console.log(req.file); // Log the file if you are uploading one

    const { donatorName, phone, location, foodDetails } = req.body;
    const image = req.file ? req.file.filename : null;

    const food = await Food.create({
      donatorName,
      phone,
      location,
      foodDetails,
      image,
      donatedBy: req.user._id,
    });

    res.status(201).json(food);
  } catch (error) {
    console.error(error); // Log server errors
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// @desc Get available food
// @route GET /api/food/available-food
const getAvailableFood = asyncHandler(async (req, res) => {
  const foodItems = await Food.find({ available: true }); // Filter by available food
  res.json({ food: foodItems });
});

// @desc Update food item
// @route PUT /api/food/:id
const updateFood = asyncHandler(async (req, res) => {
  const foodId = req.params.id;
  const { donatorName, phone, location, foodDetails, quantity, available } = req.body; // Get fields to update

  const food = await Food.findById(foodId);
  
  if (!food) {
    return res.status(404).json({ message: 'Food item not found' });
  }

  // Update fields
  food.donatorName = donatorName || food.donatorName;
  food.phone = phone || food.phone;
  food.location = location || food.location;
  food.foodDetails = foodDetails || food.foodDetails;
  food.quantity = quantity !== undefined ? quantity : food.quantity; // Only update if provided
  food.available = available !== undefined ? available : food.available; // Only update if provided
  if (req.file) {
    food.image = req.file.filename; // Update image if a new one is uploaded
  }

  const updatedFood = await food.save();

  res.json(updatedFood);
});


const deleteFood = asyncHandler(async (req, res) => {
  const foodItemId = req.params.id;

  // Check if the food item exists
  const foodItem = await Food.findById(foodItemId);
  if (!foodItem) {
    res.status(404);
    throw new Error('Food item not found');
  }

  // Use deleteOne instead of remove
  await Food.deleteOne({ _id: foodItemId });

  res.status(200).json({ message: 'Food item removed' });
});

module.exports = { submitFood, getAvailableFood, updateFood, deleteFood };

