// server/routes/dungeonRoutes.js
const express = require('express');
const router = express.Router();
const { dungeonOperations } = require('../dbOperations');

// Get available dungeons
router.get('/available/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const dungeons = await dungeonOperations.getAvailableDungeons(userId);

    res.json(dungeons);
  } catch (error) {
    console.error('Error fetching dungeons:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete a dungeon
router.post('/complete', async (req, res) => {
  try {
    const { userId, dungeonId, experienceGained, statsGained, completionTime } = req.body;

    const completionId = await dungeonOperations.recordDungeonCompletion(
      userId, dungeonId, experienceGained, statsGained, completionTime
    );

    res.status(201).json({ 
      message: 'Dungeon completed successfully',
      completionId
    });
  } catch (error) {
    console.error('Error completing dungeon:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;