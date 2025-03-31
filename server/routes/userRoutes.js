// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { userOperations } = require('../dbOperations');

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
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

// Register a new user (basic version - would need password hashing in production)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // In a real app, you'd hash the password before storing
    const userId = await userOperations.createUser(username, email, password);
    
    res.status(201).json({ 
      message: 'User created successfully',
      userId
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

