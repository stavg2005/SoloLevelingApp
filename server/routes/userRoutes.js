// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userOperations } = require('../dbOperations');
const auth = require('../middleware/auth');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'solo-leveling-secret-key';

// Get user profile (protected route)
router.get('/profile/:userId', auth, async (req, res) => {
  try {
    // Ensure the requested user ID matches the authenticated user's ID
    if (req.params.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const userId = req.params.userId;
    const user = await userOperations.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
        // Don't return password hash
    delete user.password_hash;

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await userOperations.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const userId = await userOperations.createUser(username, email, passwordHash);

    res.status(201).json({
      message: 'User created successfully',
      userId,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Get user by username
    const user = await userOperations.getUserByUsername(username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login time
    await userOperations.updateLastLogin(user.user_id);

    const userData = await userOperations.getUserData(user.user_id);
    // Create JWT token
    const token = jwt.sign(
      { id: user.user_id, username: user.username },
      JWT_SECRET,
      { expiresIn: '30d' } // Token expires in 30 days
    );

    // Return user data and token
    res.json({
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// In server/routes/userRoutes.js - Add a new route for getting user data
router.get('/data/:userId', auth, async (req, res) => {
    try {
      // Ensure the requested user ID matches the authenticated user's ID
      if (req.params.userId !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const userId = req.params.userId;
      const userData = await userOperations.getUserData(userId);

      res.json(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
module.exports = router;
