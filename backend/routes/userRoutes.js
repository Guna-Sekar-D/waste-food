const express = require('express');
const { signupAdmin, loginAdmin, createUser, loginUser, deleteUser, getAllUsers } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware'); // Middleware for protection (JWT)

const router = express.Router();

// Admin Signup Route
router.post('/signup', signupAdmin);

// Admin Login Route
router.post('/login', loginAdmin);

// User Login Route (for Donators and Receivers)
router.post('/login-user', loginUser);

// Admin Create User Route (only Admin can create Donators or Receivers)
router.post('/create-user', protect, admin, createUser); // Protect this route with JWT and admin check

router.delete('/delete-user/:username',protect,admin,deleteUser);

router.get('/all-users', protect, admin, getAllUsers);

module.exports = router;
