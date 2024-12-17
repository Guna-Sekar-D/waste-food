const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// Admin signup function
const signupAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ username, role: 'admin' });
  if (userExists) {
    return res.status(400).json({ message: 'Admin already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin user
  const adminUser = await User.create({
    username,
    password: hashedPassword,
    role: 'admin', // Setting role as admin
  });

  if (adminUser) {
    res.status(201).json({
      _id: adminUser._id,
      username: adminUser.username,
      role: adminUser.role,
    });
  } else {
    res.status(400).json({ message: 'Invalid admin data' });
  }
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const admin = await User.findOne({ username, role: 'admin' });

  console.log(admin);
  if (!admin) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Use the method defined in the user schema
  const isPasswordMatch = await admin.comparePassword(password);
  console.log(isPasswordMatch);

  if (isPasswordMatch) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Generate JWT token if passwords match
  const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({
    _id: admin._id,
    username: admin.username,
    role: admin.role,
    token,
  });
});



// General user login function for Donators and Receivers
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Find the user (either Donator or Receiver)
  const user = await User.findOne({ username });
  if (user && ( !await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token,
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Admin function to create new users (Donator/Receiver)
const createUser = asyncHandler(async (req, res) => {
  const { username, password, role } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    username,
    password: hashedPassword,
    role,  // 'donator' or 'receiver'
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { username } = req.params;

  // Find and delete the user
  const user = await User.findOneAndDelete({ username });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({ message: `User ${username} deleted successfully` });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}); // Adjust the query as needed
  res.json(users);
});

module.exports = { signupAdmin, loginAdmin, loginUser, createUser, deleteUser, getAllUsers };
