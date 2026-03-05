// XP Service - Handles XP calculations, level ups, and skill point grants
import pool from '../config/db.js';
import { getRank } from '../utils/rankCalculator.js';
import logger from '../utils/logger.js';

/**
 * Calculate XP required for next level
 * Formula: 50 * level * 1.2
 */
export const calculateNextLevelXp = (level) => {
  return Math.floor(50 * level * 1.2);
};

/**
 * Calculate XP reward with bonuses
 */
export const calculateXpReward = (baseXp, { currentStreak = 0, isNicheMatch = false }) => {
  let multiplier = 1.0;

  // Streak bonus: +5% per day, max +50%
  const streakBonus = Math.min(currentStreak * 0.05, 0.5);
  multiplier += streakBonus;

  // Niche match bonus: +20%
  if (isNicheMatch) {
    multiplier += 0.2;
  }

  return Math.floor(baseXp * multiplier);
};

/**
 * Grant XP to user and handle level up
 * Returns { leveledUp, newLevel, newRank, xpGained, skillPointsEarned }
 */
export const grantXp = async (userId, xpAmount) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get current user data
    const { rows: [user] } = await client.query(
      'SELECT id, level, xp, rank FROM users WHERE id = $1 FOR UPDATE',
      [userId]
    );

    if (!user) throw new Error('User not found');

    let { level, xp, rank } = user;
    xp += xpAmount;
    let leveledUp = false;
    let levelsGained = 0;
    let totalSkillPoints = 0;
    let nextLevelXp = calculateNextLevelXp(level);

    // Check for level up (possibly multiple levels)
    while (xp >= nextLevelXp) {
      xp -= nextLevelXp;
      level += 1;
      levelsGained += 1;
      leveledUp = true;
      nextLevelXp = calculateNextLevelXp(level);

      // Grant 3 skill points per level
      totalSkillPoints += 3;
    }

    // Recalculate rank
    const newRank = getRank(level);

    // Update user
    await client.query(
      `UPDATE users 
       SET xp = $1, level = $2, rank = $3, 
           skill_points = skill_points + $4,
           updated_at = NOW()
       WHERE id = $5`,
      [xp, level, newRank, totalSkillPoints, userId]
    );

    await client.query('COMMIT');

    logger.info(`User ${userId} gained ${xpAmount} XP. Level: ${level}, Rank: ${newRank}`);

    return {
      leveledUp,
      levelsGained,
      newLevel: level,
      newXp: xp,
      nextLevelXp,
      newRank,
      xpGained: xpAmount,
      skillPointsEarned: totalSkillPoints,
      rankChanged: rank !== newRank,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('grantXp error:', err);
    throw err;
  } finally {
    client.release();
  }
};

/**
 * Update user streak (uses user_stats table)
 */
export const updateStreak = async (userId) => {
  const { rows: [stats] } = await pool.query(
    'SELECT current_streak, longest_streak, last_active_date FROM user_stats WHERE user_id = $1',
    [userId]
  );

  if (!stats) throw new Error('User stats not found');

  const today = new Date().toISOString().split('T')[0];
  const lastDate = stats.last_active_date ? new Date(stats.last_active_date).toISOString().split('T')[0] : null;

  let newStreak = stats.current_streak;

  if (lastDate === today) {
    // Already active today, no streak change
    return { currentStreak: newStreak, updated: false };
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastDate === yesterdayStr) {
    // Consecutive day - increment streak
    newStreak += 1;
  } else {
    // Streak broken - reset to 1
    newStreak = 1;
  }

  const newLongest = Math.max(newStreak, stats.longest_streak);

  // Check for 7-day streak bonus skill point
  let bonusSkillPoint = 0;
  if (newStreak > 0 && newStreak % 7 === 0) {
    bonusSkillPoint = 1;
    await pool.query(
      'UPDATE users SET skill_points = skill_points + 1 WHERE id = $1',
      [userId]
    );
  }

  await pool.query(
    `UPDATE user_stats 
     SET current_streak = $1, longest_streak = $2, last_active_date = $3
     WHERE user_id = $4`,
    [newStreak, newLongest, today, userId]
  );

  logger.info(`User ${userId} streak: ${newStreak} days`);

  return {
    currentStreak: newStreak,
    longestStreak: newLongest,
    updated: true,
    bonusSkillPoint,
  };
};

/**
 * Check and reset streaks for users who missed a day
 * Called by daily cron job
 */
export const resetBrokenStreaks = async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const result = await pool.query(
    `UPDATE user_stats 
     SET current_streak = 0 
     WHERE last_active_date < $1 AND current_streak > 0
     RETURNING user_id`,
    [yesterdayStr]
  );

  logger.info(`Reset ${result.rowCount} broken streaks`);
  return result.rowCount;
};
