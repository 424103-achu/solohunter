// Badge Model
import pool from '../config/db.js';

export const getAllBadges = async () => {
  const { rows } = await pool.query('SELECT * FROM badges ORDER BY id');
  return rows;
};

export const getBadgeById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM badges WHERE id = $1', [id]);
  return rows[0];
};

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

export const awardBadge = async (userId, badgeId) => {
  const { rows } = await pool.query(
    `INSERT INTO user_badges (user_id, badge_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, badge_id) DO NOTHING
     RETURNING *`,
    [userId, badgeId]
  );
  return rows[0];
};
