// Quest Engine Service - Manages quest availability and generation
import pool from '../config/db.js';
import logger from '../utils/logger.js';

/**
 * Get available quests for a user based on their level, rank, and niche
 */
export const getAvailableQuests = async (userId) => {
  const { rows: [user] } = await pool.query(
    `SELECT u.id, u.level, u.rank, un.niche_id
     FROM users u
     LEFT JOIN user_niches un ON u.id = un.user_id
     WHERE u.id = $1`,
    [userId]
  );

  if (!user) throw new Error('User not found');

  // All quests are accessible regardless of rank
  const { rows: quests } = await pool.query(
    `SELECT q.*, n.name as niche_name,
       CASE WHEN q.niche_id = $2 THEN true ELSE false END as is_niche_match,
       CASE WHEN s.id IS NOT NULL THEN true ELSE false END as already_completed
     FROM quests q
     LEFT JOIN niches n ON q.niche_id = n.id
     LEFT JOIN submissions s ON s.quest_id = q.id AND s.user_id = $1 AND s.status = 'passed'
     WHERE q.is_active = TRUE
     ORDER BY 
       CASE WHEN q.niche_id = $2 THEN 0 ELSE 1 END,
       q.quest_type,
       q.difficulty,
       q.created_at DESC`,
    [userId, user.niche_id]
  );

  return quests;
};

/**
 * Get daily quests for a user.
 * Assigns 3 random quests once per day and persists them in daily_quest_progress.
 */
export const getDailyQuests = async (userId) => {
  const { rows: [user] } = await pool.query(
    `SELECT u.level, u.rank, un.niche_id
     FROM users u
     LEFT JOIN user_niches un ON u.id = un.user_id
     WHERE u.id = $1`,
    [userId]
  );

  if (!user) throw new Error('User not found');

  // Check if daily quests are already assigned for today
  const today = new Date().toISOString().split('T')[0];
  const { rows: existing } = await pool.query(
    `SELECT dqp.quest_id, dqp.completed, q.*, n.name as niche_name
     FROM daily_quest_progress dqp
     JOIN quests q ON dqp.quest_id = q.id
     LEFT JOIN niches n ON q.niche_id = n.id
     WHERE dqp.user_id = $1 AND dqp.assigned_date = $2
     ORDER BY q.difficulty`,
    [userId, today]
  );

  if (existing.length > 0) {
    return existing;
  }

  // No quests assigned today — pick 2 coding dailies + 1 fitness quest
  const { rows: codingPicked } = await pool.query(
    `SELECT q.*, n.name as niche_name
     FROM quests q
     LEFT JOIN niches n ON q.niche_id = n.id
     WHERE q.is_active = TRUE
       AND q.quest_type = 'daily'
     ORDER BY RANDOM()
     LIMIT 2`
  );

  const { rows: fitnessPicked } = await pool.query(
    `SELECT q.*, n.name as niche_name
     FROM quests q
     LEFT JOIN niches n ON q.niche_id = n.id
     WHERE q.is_active = TRUE
       AND q.quest_type = 'fitness'
     ORDER BY RANDOM()
     LIMIT 1`
  );

  const picked = [...codingPicked, ...fitnessPicked];

  // Persist the assignment
  for (const q of picked) {
    await pool.query(
      `INSERT INTO daily_quest_progress (user_id, quest_id, assigned_date)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      [userId, q.id, today]
    );
  }

  return picked;
};

/**
 * Get boss quests accessible to user
 */
export const getBossQuests = async (userId) => {
  const { rows: [user] } = await pool.query(
    'SELECT level, rank FROM users WHERE id = $1',
    [userId]
  );

  if (!user) throw new Error('User not found');

  const { rows } = await pool.query(
    `SELECT q.*, n.name as niche_name,
       CASE WHEN s.id IS NOT NULL THEN true ELSE false END as already_defeated
     FROM quests q
     LEFT JOIN niches n ON q.niche_id = n.id
     LEFT JOIN submissions s ON s.quest_id = q.id AND s.user_id = $1 AND s.status = 'passed'
     WHERE q.quest_type = 'boss'
       AND q.is_active = TRUE
     ORDER BY q.created_at ASC`,
    [userId]
  );

  return rows;
};

/**
 * Get quest completion stats for a user
 */
export const getQuestStats = async (userId) => {
  const { rows: [stats] } = await pool.query(
    `SELECT 
       COUNT(DISTINCT s.quest_id) FILTER (WHERE s.status = 'passed') as total_completed,
       COUNT(DISTINCT s.quest_id) FILTER (WHERE s.status = 'passed' AND q.quest_type = 'daily') as daily_completed,
       COUNT(DISTINCT s.quest_id) FILTER (WHERE s.status = 'passed' AND q.quest_type = 'main') as main_completed,
       COUNT(DISTINCT s.quest_id) FILTER (WHERE s.status = 'passed' AND q.quest_type = 'boss') as boss_completed,
       COUNT(DISTINCT s.quest_id) FILTER (WHERE s.status = 'passed' AND q.quest_type = 'special') as special_completed,
       COUNT(*) as total_submissions
     FROM submissions s
     JOIN quests q ON s.quest_id = q.id
     WHERE s.user_id = $1`,
    [userId]
  );

  return stats;
};
