// server/dbOperations.js
const db = require('./db');

// User operations
const userOperations = {
  // Get user by ID
  async getUserById(userId) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [
        userId,
      ]);
      return rows[0];
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  },

  // Get user by username
  async getUserByUsername(username) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [
        username,
      ]);
      return rows[0];
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw error;
    }
  },

  // Get user by email
  async getUserByEmail(email) {
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [
        email,
      ]);
      return rows[0];
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  },

  // Register a new user
  async createUser(username, email, passwordHash) {
    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      // Create user
      const [userResult] = await conn.query(
        'INSERT INTO users (username, email, password_hash, date_created) VALUES (?, ?, ?, NOW())',
        [username, email, passwordHash],
      );

      const userId = userResult.insertId;

      // Create user profile
      await conn.query('INSERT INTO user_profiles (user_id) VALUES (?)', [
        userId,
      ]);

      // Get E-Rank (assumed to be rank_id 1)
      const [rankRows] = await conn.query(
        'SELECT rank_id, required_experience FROM hunter_ranks WHERE rank_name = ? OR rank_order = ?',
        ['E', 1],
      );

      if (!rankRows.length) {
        throw new Error('E-Rank not found in hunter_ranks table');
      }

      const eRankId = rankRows[0].rank_id;
      const expToNextLevel = 100; // Default value

      // Create hunter status
      await conn.query(
        'INSERT INTO user_hunter_status (user_id, current_rank_id, current_level, total_experience, level_experience, experience_to_next_level) VALUES (?, ?, 1, 0, 0, ?)',
        [userId, eRankId, expToNextLevel],
      );

      // Initialize user stats - get all stats first
      const [statRows] = await conn.query(
        'SELECT stat_id, stat_name FROM stats',
      );

      // Insert default stat values
      for (const stat of statRows) {
        await conn.query(
          'INSERT INTO user_stats (user_id, stat_id, stat_value, last_updated) VALUES (?, ?, 10, NOW())',
          [userId, stat.stat_id],
        );
      }

      // Create user settings
      await conn.query('INSERT INTO user_settings (user_id) VALUES (?)', [
        userId,
      ]);

      await conn.commit();
      return userId;
    } catch (error) {
      await conn.rollback();
      console.error('Error creating user:', error);
      throw error;
    } finally {
      conn.release();
    }
  },

  // Update user login time
  async updateLastLogin(userId) {
    try {
      await db.query('UPDATE users SET last_login = NOW() WHERE user_id = ?', [
        userId,
      ]);
      return true;
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  },

  // Get user's hunter status (level, rank, experience)
  async getUserHunterStatus(userId) {
    try {
      const [rows] = await db.query(
        `SELECT uhs.*, hr.rank_name, hr.rank_order, hr.rank_description 
         FROM user_hunter_status uhs
         JOIN hunter_ranks hr ON uhs.current_rank_id = hr.rank_id
         WHERE uhs.user_id = ?`,
        [userId],
      );
      return rows[0];
    } catch (error) {
      console.error('Error fetching hunter status:', error);
      throw error;
    }
  },

  // Get user's stats
  async getUserStats(userId) {
    try {
      const [rows] = await db.query(
        `SELECT us.*, s.stat_name, s.stat_description 
         FROM user_stats us
         JOIN stats s ON us.stat_id = s.stat_id
         WHERE us.user_id = ?
         ORDER BY s.stat_id`,
        [userId],
      );
      return rows;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  // Get user profile
  async getUserProfile(userId) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM user_profiles WHERE user_id = ?`,
        [userId],
      );
      return rows[0];
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(userId, profileData) {
    try {
      const {
        height,
        weight,
        fitness_level,
        fitness_goals,
        equipment_available,
        preferred_workout_time,
        preferred_workout_duration,
      } = profileData;

      await db.query(
        `UPDATE user_profiles 
         SET height = ?, 
             weight = ?, 
             fitness_level = ?, 
             fitness_goals = ?, 
             equipment_available = ?, 
             preferred_workout_time = ?, 
             preferred_workout_duration = ?
         WHERE user_id = ?`,
        [
          height,
          weight,
          fitness_level,
          fitness_goals,
          equipment_available,
          preferred_workout_time,
          preferred_workout_duration,
          userId,
        ],
      );

      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Update user account
  async updateUserAccount(userId, userData) {
    try {
      const {username, email, display_name, avatar_url} = userData;

      await db.query(
        `UPDATE users
         SET username = ?,
             email = ?,
             display_name = ?,
             avatar_url = ?
         WHERE user_id = ?`,
        [username, email, display_name, avatar_url, userId],
      );

      return true;
    } catch (error) {
      console.error('Error updating user account:', error);
      throw error;
    }
  },

  // Change user's password
  async updatePassword(userId, newPasswordHash) {
    try {
      await db.query('UPDATE users SET password_hash = ? WHERE user_id = ?', [
        newPasswordHash,
        userId,
      ]);

      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  },
};

// Dungeon operations
const dungeonOperations = {
  // Get available dungeons for a user
  async getAvailableDungeons(userId) {
    try {
      // Get user's current rank
      const [userRankResult] = await db.query(
        'SELECT current_rank_id, current_level FROM user_hunter_status WHERE user_id = ?',
        [userId],
      );

      if (!userRankResult.length) {
        throw new Error('User hunter status not found');
      }

      const userRankId = userRankResult[0].current_rank_id;
      const userLevel = userRankResult[0].current_level;

      // Get dungeons available for user's rank and level
      const [dungeons] = await db.query(
        `SELECT d.*, dc.category_name, hr.rank_name as required_rank 
         FROM dungeons d
         JOIN dungeon_categories dc ON d.category_id = dc.category_id
         JOIN hunter_ranks hr ON d.required_rank_id = hr.rank_id
         JOIN dungeon_availability da ON d.dungeon_id = da.dungeon_id
         WHERE d.required_rank_id <= ? 
         AND d.required_level <= ?
         AND d.is_active = TRUE
         AND CURRENT_DATE() BETWEEN da.start_date AND IFNULL(da.end_date, CURRENT_DATE())
         ORDER BY d.category_id, d.difficulty_level`,
        [userRankId, userLevel],
      );

      return dungeons;
    } catch (error) {
      console.error('Error fetching available dungeons:', error);
      throw error;
    }
  },

  // Get dungeon details by ID with exercises
  async getDungeonDetails(dungeonId) {
    try {
      // Get dungeon basic info
      const [dungeons] = await db.query(
        `SELECT d.*, dc.category_name, hr.rank_name as required_rank
         FROM dungeons d
         JOIN dungeon_categories dc ON d.category_id = dc.category_id
         JOIN hunter_ranks hr ON d.required_rank_id = hr.rank_id
         WHERE d.dungeon_id = ?`,
        [dungeonId],
      );

      if (dungeons.length === 0) {
        throw new Error('Dungeon not found');
      }

      const dungeon = dungeons[0];

      // Get dungeon exercises
      const [exercises] = await db.query(
        `SELECT de.*, e.exercise_name, e.exercise_description, e.difficulty_level,
                e.equipment_required, e.primary_muscle_group, e.secondary_muscle_groups,
                e.demonstration_url, e.instructions, et.type_name
         FROM dungeon_exercises de
         JOIN exercises e ON de.exercise_id = e.exercise_id
         JOIN exercise_types et ON e.type_id = et.type_id
         WHERE de.dungeon_id = ?
         ORDER BY de.exercise_order`,
        [dungeonId],
      );

      dungeon.exercises = exercises;

      return dungeon;
    } catch (error) {
      console.error('Error fetching dungeon details:', error);
      throw error;
    }
  },

  // Get user's completed dungeons
  async getUserCompletedDungeons(userId) {
    try {
      const [completions] = await db.query(
        `SELECT udc.*, d.dungeon_name, d.difficulty_level, dc.category_name
         FROM user_dungeon_completions udc
         JOIN dungeons d ON udc.dungeon_id = d.dungeon_id
         JOIN dungeon_categories dc ON d.category_id = dc.category_id
         WHERE udc.user_id = ?
         ORDER BY udc.completion_date DESC`,
        [userId],
      );

      return completions;
    } catch (error) {
      console.error('Error fetching completed dungeons:', error);
      throw error;
    }
  },

  // Record dungeon completion
  async recordDungeonCompletion(userId, dungeonId, completionData) {
    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      const {
        completion_time, // in seconds
        experience_gained,
        strength_gained = 0,
        endurance_gained = 0,
        agility_gained = 0,
        discipline_gained = 0,
        recovery_gained = 0,
        user_rating = null,
        user_notes = null,
      } = completionData;

      // Record completion
      const [result] = await conn.query(
        `INSERT INTO user_dungeon_completions 
         (user_id, dungeon_id, completion_date, experience_gained, 
          strength_gained, endurance_gained, agility_gained, discipline_gained, 
          recovery_gained, completion_time, user_rating, user_notes)
         VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          dungeonId,
          experience_gained,
          strength_gained,
          endurance_gained,
          agility_gained,
          discipline_gained,
          recovery_gained,
          completion_time,
          user_rating,
          user_notes,
        ],
      );

      // Update user experience
      await conn.query(
        `UPDATE user_hunter_status 
         SET total_experience = total_experience + ?,
             level_experience = level_experience + ?
         WHERE user_id = ?`,
        [experience_gained, experience_gained, userId],
      );

      // Update user stats - first get all stats
      const [statsResult] = await conn.query(
        'SELECT stat_id, stat_name FROM stats',
      );

      // Map stat names to IDs
      const statMap = {};
      statsResult.forEach(stat => {
        statMap[stat.stat_name.toLowerCase()] = stat.stat_id;
      });

      // Update stats based on gains
      if (strength_gained > 0 && statMap.strength) {
        await updateStat(conn, userId, statMap.strength, strength_gained);
      }
      if (endurance_gained > 0 && statMap.endurance) {
        await updateStat(conn, userId, statMap.endurance, endurance_gained);
      }
      if (agility_gained > 0 && statMap.agility) {
        await updateStat(conn, userId, statMap.agility, agility_gained);
      }
      if (discipline_gained > 0 && statMap.discipline) {
        await updateStat(conn, userId, statMap.discipline, discipline_gained);
      }
      if (recovery_gained > 0 && statMap.recovery) {
        await updateStat(conn, userId, statMap.recovery, recovery_gained);
      }

      // Check for level up
      await checkForLevelUp(conn, userId);

      // Log the activity
      await conn.query(
        `INSERT INTO user_activity_logs 
         (user_id, activity_type, activity_id, log_date, experience_change, notes)
         VALUES (?, 'dungeon', ?, NOW(), ?, ?)`,
        [
          userId,
          dungeonId,
          experience_gained,
          `Completed dungeon ID: ${dungeonId}`,
        ],
      );

      await conn.commit();
      return result.insertId;
    } catch (error) {
      await conn.rollback();
      console.error('Error recording dungeon completion:', error);
      throw error;
    } finally {
      conn.release();
    }
  },
};

// Quest operations
const questOperations = {
  // Get available quests for a user
  async getAvailableQuests(userId) {
    try {
      // Get user's current rank
      const [userRankResult] = await db.query(
        'SELECT current_rank_id FROM user_hunter_status WHERE user_id = ?',
        [userId],
      );

      if (!userRankResult.length) {
        throw new Error('User hunter status not found');
      }

      const userRankId = userRankResult[0].current_rank_id;

      // Get quests available for user's rank
      const [quests] = await db.query(
        `SELECT q.*, qc.category_name, s.stat_name as reward_stat_name 
         FROM quests q
         JOIN quest_categories qc ON q.category_id = qc.category_id
         LEFT JOIN stats s ON q.stat_reward_type = s.stat_id
         WHERE (q.required_rank_id IS NULL OR q.required_rank_id <= ?) 
         AND q.is_active = TRUE
         AND (q.start_date IS NULL OR q.start_date <= CURRENT_DATE())
         AND (q.end_date IS NULL OR q.end_date >= CURRENT_DATE())
         ORDER BY qc.category_id, q.difficulty_level`,
        [userRankId],
      );

      // Get quest objectives for each quest
      for (const quest of quests) {
        const [objectives] = await db.query(
          `SELECT * FROM quest_objectives WHERE quest_id = ?`,
          [quest.quest_id],
        );
        quest.objectives = objectives;
      }

      return quests;
    } catch (error) {
      console.error('Error fetching available quests:', error);
      throw error;
    }
  },

  // Get user's active quests with progress
  async getUserActiveQuests(userId) {
    try {
      const [userQuests] = await db.query(
        `SELECT uq.*, q.quest_name, q.quest_description, q.difficulty_level, 
                q.experience_reward, q.stat_reward_type, q.stat_reward_amount,
                qc.category_name, s.stat_name as reward_stat_name
         FROM user_quests uq
         JOIN quests q ON uq.quest_id = q.quest_id
         JOIN quest_categories qc ON q.category_id = qc.category_id
         LEFT JOIN stats s ON q.stat_reward_type = s.stat_id
         WHERE uq.user_id = ? AND uq.is_active = TRUE AND uq.is_completed = FALSE
         ORDER BY uq.start_date`,
        [userId],
      );

      // Get objectives and progress for each quest
      for (const userQuest of userQuests) {
        const [objectives] = await db.query(
          `SELECT uqo.*, qo.objective_description, qo.objective_type, qo.required_amount 
           FROM user_quest_objectives uqo
           JOIN quest_objectives qo ON uqo.objective_id = qo.objective_id
           WHERE uqo.user_quest_id = ?`,
          [userQuest.user_quest_id],
        );
        userQuest.objectives = objectives;
      }

      return userQuests;
    } catch (error) {
      console.error('Error fetching user active quests:', error);
      throw error;
    }
  },

  // Start a quest for a user
  async startQuest(userId, questId) {
    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      // Check if user already has this quest active
      const [existingQuest] = await conn.query(
        `SELECT * FROM user_quests
         WHERE user_id = ? AND quest_id = ? AND is_active = TRUE`,
        [userId, questId],
      );

      if (existingQuest.length > 0) {
        await conn.rollback();
        return {success: false, message: 'Quest already active'};
      }

      // Start the quest
      const [result] = await conn.query(
        `INSERT INTO user_quests (user_id, quest_id, is_active, is_completed, start_date)
         VALUES (?, ?, TRUE, FALSE, NOW())`,
        [userId, questId],
      );

      const userQuestId = result.insertId;

      // Get quest objectives
      const [objectives] = await conn.query(
        `SELECT * FROM quest_objectives WHERE quest_id = ?`,
        [questId],
      );

      // Create user quest objectives
      for (const objective of objectives) {
        await conn.query(
          `INSERT INTO user_quest_objectives
           (user_quest_id, objective_id, current_progress, is_completed)
           VALUES (?, ?, 0, FALSE)`,
          [userQuestId, objective.objective_id],
        );
      }

      // Log activity
      await conn.query(
        `INSERT INTO user_activity_logs
         (user_id, activity_type, activity_id, log_date, notes)
         VALUES (?, 'quest_start', ?, NOW(), ?)`,
        [userId, questId, `Started quest ID: ${questId}`],
      );

      await conn.commit();
      return {success: true, userQuestId};
    } catch (error) {
      await conn.rollback();
      console.error('Error starting quest:', error);
      throw error;
    } finally {
      conn.release();
    }
  },

  // Update quest objective progress
  async updateQuestProgress(userId, userQuestId, objectiveId, progressValue) {
    const conn = await db.getConnection();

    try {
      await conn.beginTransaction();

      // Verify user owns this quest
      const [userQuestCheck] = await conn.query(
        `SELECT uq.* FROM user_quests uq
         WHERE uq.user_quest_id = ? AND uq.user_id = ? AND uq.is_active = TRUE`,
        [userQuestId, userId],
      );

      if (userQuestCheck.length === 0) {
        await conn.rollback();
        return {success: false, message: 'Quest not found or not active'};
      }

      // Get objective details and current progress
      const [objectiveDetails] = await conn.query(
        `SELECT uqo.*, qo.required_amount
         FROM user_quest_objectives uqo
         JOIN quest_objectives qo ON uqo.objective_id = qo.objective_id
         WHERE uqo.user_quest_id = ? AND uqo.objective_id = ?`,
        [userQuestId, objectiveId],
      );

      if (objectiveDetails.length === 0) {
        await conn.rollback();
        return {success: false, message: 'Objective not found'};
      }

      const objective = objectiveDetails[0];

      // Update progress
      const newProgress = Math.min(
        objective.current_progress + progressValue,
        objective.required_amount,
      );
      const isCompleted = newProgress >= objective.required_amount;

      await conn.query(
        `UPDATE user_quest_objectives
         SET current_progress = ?,
             is_completed = ?,
             last_updated = NOW()
         WHERE user_quest_id = ? AND objective_id = ?`,
        [newProgress, isCompleted, userQuestId, objectiveId],
      );

      // Check if all objectives are completed
      const [remainingObjectives] = await conn.query(
        `SELECT COUNT(*) as count FROM user_quest_objectives
         WHERE user_quest_id = ? AND is_completed = FALSE`,
        [userQuestId],
      );

      let questCompleted = false;

      if (remainingObjectives[0].count === 0) {
        // All objectives completed, complete the quest
        await conn.query(
          `UPDATE user_quests
           SET is_completed = TRUE,
               completion_date = NOW()
           WHERE user_quest_id = ?`,
          [userQuestId],
        );

        // Get quest rewards
        const [questRewards] = await conn.query(
          `SELECT q.experience_reward, q.stat_reward_type, q.stat_reward_amount
           FROM quests q
           JOIN user_quests uq ON q.quest_id = uq.quest_id
           WHERE uq.user_quest_id = ?`,
          [userQuestId],
        );

        if (questRewards.length > 0) {
          const {experience_reward, stat_reward_type, stat_reward_amount} =
            questRewards[0];

          // Add experience
          if (experience_reward > 0) {
            await conn.query(
              `UPDATE user_hunter_status
               SET total_experience = total_experience + ?,
                   level_experience = level_experience + ?
               WHERE user_id = ?`,
              [experience_reward, experience_reward, userId],
            );
          }

          // Add stat reward
          if (stat_reward_type && stat_reward_amount > 0) {
            await updateStat(
              conn,
              userId,
              stat_reward_type,
              stat_reward_amount,
            );
          }

          // Check for level up
          await checkForLevelUp(conn, userId);

          // Log completion
          await conn.query(
            `INSERT INTO user_activity_logs
             (user_id, activity_type, activity_id, log_date, experience_change, notes)
             VALUES (?, 'quest_complete', ?, NOW(), ?, ?)`,
            [
              userId,
              userQuestCheck[0].quest_id,
              experience_reward,
              `Completed quest ID: ${userQuestCheck[0].quest_id}`,
            ],
          );
        }

        questCompleted = true;
      }

      await conn.commit();
      return {
        success: true,
        progress: newProgress,
        objectiveCompleted: isCompleted,
        questCompleted,
      };
    } catch (error) {
      await conn.rollback();
      console.error('Error updating quest progress:', error);
      throw error;
    } finally {
      conn.release();
    }
  },
};

// Helper function to update a user's stat
async function updateStat(connection, userId, statId, value) {
  await connection.query(
    `INSERT INTO user_stats (user_id, stat_id, stat_value, last_updated)
     VALUES (?, ?, ?, NOW())
     ON DUPLICATE KEY UPDATE 
     stat_value = stat_value + ?,
     last_updated = NOW()`,
    [userId, statId, value, value],
  );
}

// Helper function to check for level up
async function checkForLevelUp(connection, userId) {
  // Get user's current level and experience
  const [userResult] = await connection.query(
    `SELECT current_level, level_experience, experience_to_next_level 
     FROM user_hunter_status 
     WHERE user_id = ?`,
    [userId],
  );

  if (!userResult.length) {
    return;
  }

  const {current_level, level_experience, experience_to_next_level} =
    userResult[0];

  // Check if user has enough experience to level up
  if (level_experience >= experience_to_next_level) {
    const newLevel = current_level + 1;

    // Calculate new experience needed for next level
    // Simple formula: base 100 + (new level * 100)
    const newExpToNextLevel = 100 + newLevel * 100;

    // Level up the user
    await connection.query(
      `UPDATE user_hunter_status
       SET current_level = ?,
           level_experience = level_experience - experience_to_next_level,
           experience_to_next_level = ?
       WHERE user_id = ?`,
      [newLevel, newExpToNextLevel, userId],
    );

    // Log the level up
    await connection.query(
      `INSERT INTO user_activity_logs
       (user_id, activity_type, log_date, notes)
       VALUES (?, 'level_up', NOW(), ?)`,
      [userId, `Leveled up to ${newLevel}`],
    );

    // Check if rank up is needed based on new level
    await checkForRankUp(connection, userId);
  }
}

// Helper function to check for rank up
async function checkForRankUp(connection, userId) {
  // Get user's current level and rank
  const [userResult] = await connection.query(
    `SELECT uhs.current_level, uhs.current_rank_id, hr.rank_order
     FROM user_hunter_status uhs
     JOIN hunter_ranks hr ON uhs.current_rank_id = hr.rank_id
     WHERE uhs.user_id = ?`,
    [userId],
  );

  if (!userResult.length) {
    return;
  }

  const {current_level, current_rank_id, rank_order} = userResult[0];

  // Get next rank (if any)
  const [nextRankResult] = await connection.query(
    `SELECT rank_id, rank_name, required_experience
     FROM hunter_ranks
     WHERE rank_order = ?
     LIMIT 1`,
    [rank_order + 1],
  );

  // If there's a next rank and the user's level meets the threshold
  if (
    nextRankResult.length &&
    current_level >= nextRankResult[0].required_experience
  ) {
    // Promote user to next rank
    await connection.query(
      `UPDATE user_hunter_status
       SET current_rank_id = ?
       WHERE user_id = ?`,
      [nextRankResult[0].rank_id, userId],
    );

    // Log the rank up
    await connection.query(
      `INSERT INTO user_activity_logs
       (user_id, activity_type, log_date, notes)
       VALUES (?, 'rank_up', NOW(), ?)`,
      [userId, `Ranked up to ${nextRankResult[0].rank_name}`],
    );
  }
}

module.exports = {
  userOperations,
  dungeonOperations,
  questOperations,
};
