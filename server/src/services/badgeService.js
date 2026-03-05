// Badge Service - Check and award badges to users
import pool from '../config/db.js';
import logger from '../utils/logger.js';

/**
 * Check all badge conditions for a user and award any earned badges
 */
export const checkAndAwardBadges = async (userId) => {
  try {
    // Get user data with streak from user_stats
    const { rows: [user] } = await pool.query(
      `SELECT u.*, us.current_streak
       FROM users u
       LEFT JOIN user_stats us ON u.id = us.user_id
       WHERE u.id = $1`,
      [userId]
    );

    if (!user) return [];

    // Get quest stats
    const { rows: [questStats] } = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE s.status = 'passed') as quests_completed,
        COUNT(*) FILTER (WHERE s.status = 'passed' AND q.quest_type = 'boss') as bosses_defeated,
        COALESCE(SUM(s.score), 0) as total_score
       FROM submissions s
       JOIN quests q ON s.quest_id = q.id
       WHERE s.user_id = $1`,
      [userId]
    );

    // Get all badges not yet earned
    const { rows: unearnedBadges } = await pool.query(
      `SELECT b.* FROM badges b
       WHERE b.id NOT IN (
         SELECT badge_id FROM user_badges WHERE user_id = $1
       )`,
      [userId]
    );

    const earnedBadges = [];

    for (const badge of unearnedBadges) {
      let earned = false;

      switch (badge.requirement_type) {
        case 'quests_completed':
          earned = parseInt(questStats.quests_completed) >= badge.requirement_value;
          break;
        case 'streak_days':
          earned = (user.current_streak || 0) >= badge.requirement_value;
          break;
        case 'level':
          earned = user.level >= badge.requirement_value;
          break;
        case 'rank':
          earned = user.level >= badge.requirement_value;
          break;
        case 'boss_defeated':
          earned = parseInt(questStats.bosses_defeated) >= badge.requirement_value;
          break;
        case 'total_score':
          earned = parseInt(questStats.total_score) >= badge.requirement_value;
          break;
      }

      if (earned) {
        await pool.query(
          'INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [userId, badge.id]
        );
        earnedBadges.push(badge);
        logger.info(`User ${userId} earned badge: ${badge.name}`);
      }
    }

    return earnedBadges;
  } catch (err) {
    logger.error('Badge check error:', err);
    return [];
  }
};

/**
 * Get all badges for a user
 */
export const getUserBadges = async (userId) => {
  const { rows } = await pool.query(
    `SELECT b.*, ub.earned_at
     FROM badges b
     JOIN user_badges ub ON b.id = ub.badge_id
     WHERE ub.user_id = $1
     ORDER BY ub.earned_at DESC`,
    [userId]
  );
  return rows;
};

/**
 * Get all badges (for display - shows earned status for user)
 */
export const getAllBadgesForUser = async (userId) => {
  const { rows } = await pool.query(
    `SELECT b.*, 
       CASE WHEN ub.user_id IS NOT NULL THEN true ELSE false END as earned,
       ub.earned_at
     FROM badges b
     LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.user_id = $1
     ORDER BY b.id`,
    [userId]
  );
  return rows;
};
