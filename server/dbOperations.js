// server/dbOperations.js
const db = require('./db');

// User operations
const userOperations = {
  // Get user by ID
  async getUserById(userId) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
      return rows[0];
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Register a new user
  async createUser(username, email, passwordHash) {
    try {
      const [result] = await db.query(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, passwordHash]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user login time
  async updateLastLogin(userId) {
    try {
      await db.query(
        'UPDATE users SET last_login = NOW() WHERE user_id = ?',
        [userId]
      );
      return true;
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }
};

// Dungeon operations
const dungeonOperations = {
  // Get available dungeons for a user
  async getAvailableDungeons(userId) {
    try {
      // Get user's current rank
      const [userRankResult] = await db.query(
        'SELECT current_rank_id FROM user_hunter_status WHERE user_id = ?',
        [userId]
      );

      if (!userRankResult.length) {
        throw new Error('User hunter status not found');
      }

      const userRankId = userRankResult[0].current_rank_id;

      // Get dungeons available for user's rank
      const [dungeons] = await db.query(
        `SELECT d.*, dc.category_name 
         FROM dungeons d
         JOIN dungeon_categories dc ON d.category_id = dc.category_id
         JOIN dungeon_availability da ON d.dungeon_id = da.dungeon_id
         WHERE d.required_rank_id <= ? 
         AND d.is_active = TRUE
         AND CURRENT_DATE() BETWEEN da.start_date AND IFNULL(da.end_date, CURRENT_DATE())
         ORDER BY d.category_id, d.difficulty_level`,
        [userRankId]
      );

      return dungeons;
    } catch (error) {
      console.error('Error fetching available dungeons:', error);
      throw error;
    }
  },

  // Record dungeon completion
  async recordDungeonCompletion(userId, dungeonId, experienceGained, statsGained, completionTime) {
    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      // Record completion
      const [result] = await conn.query(
        `INSERT INTO user_dungeon_completions 
         (user_id, dungeon_id, experience_gained, strength_gained, endurance_gained,
          agility_gained, discipline_gained, recovery_gained, completion_time)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, dungeonId, experienceGained, 
         statsGained.strength || 0, statsGained.endurance || 0,
         statsGained.agility || 0, statsGained.discipline || 0, 
         statsGained.recovery || 0, completionTime]
      );

      // Update user experience
      await conn.query(
        `UPDATE user_hunter_status 
         SET total_experience = total_experience + ?,
             level_experience = level_experience + ?
         WHERE user_id = ?`,
        [experienceGained, experienceGained, userId]
      );

      // Update user stats
      if (statsGained.strength) {
        await updateStat(conn, userId, 1, statsGained.strength); // Assuming 1 is Strength stat_id
      }
      if (statsGained.endurance) {
        await updateStat(conn, userId, 2, statsGained.endurance); // Assuming 2 is Endurance stat_id
      }
      // ... update other stats similarly

      await conn.commit();
      return result.insertId;
    } catch (error) {
      await conn.rollback();
      console.error('Error recording dungeon completion:', error);
      throw error;
    } finally {
      conn.release();
    }
  }
};

// Helper function to update a user's stat
async function updateStat(connection, userId, statId, value) {
  await connection.query(
    `INSERT INTO user_stats (user_id, stat_id, stat_value)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE 
     stat_value = stat_value + ?,
     last_updated = CURRENT_TIMESTAMP`,
    [userId, statId, value, value]
  );
}

module.exports = {
  userOperations,
  dungeonOperations
};