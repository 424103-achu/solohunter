// Submission Model
import pool from '../config/db.js';

export const createSubmission = async (userId, questId, code, language) => {
  const { rows } = await pool.query(
    `INSERT INTO submissions (user_id, quest_id, code, language, status)
     VALUES ($1, $2, $3, $4, 'pending')
     RETURNING *`,
    [userId, questId, code, language]
  );
  return rows[0];
};

export const updateSubmission = async (id, { status, score = 0, execution_time = null, memory_used = null }) => {
  const { rows } = await pool.query(
    `UPDATE submissions 
     SET status = $1, score = $2, execution_time = $3, memory_used = $4
     WHERE id = $5
     RETURNING *`,
    [status, score, execution_time, memory_used, id]
  );
  return rows[0];
};

export const getSubmissionById = async (id) => {
  const { rows } = await pool.query(
    `SELECT s.*, q.title as quest_title
     FROM submissions s
     JOIN quests q ON s.quest_id = q.id
     WHERE s.id = $1`,
    [id]
  );
  return rows[0];
};

export const getSubmissionsByUser = async (userId, limit = 50) => {
  const { rows } = await pool.query(
    `SELECT s.*, q.title as quest_title, q.difficulty
     FROM submissions s
     JOIN quests q ON s.quest_id = q.id
     WHERE s.user_id = $1
     ORDER BY s.submitted_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return rows;
};

export const getSubmissionsByQuest = async (questId, userId) => {
  const { rows } = await pool.query(
    `SELECT * FROM submissions
     WHERE quest_id = $1 AND user_id = $2
     ORDER BY submitted_at DESC`,
    [questId, userId]
  );
  return rows;
};

export const hasPassedQuest = async (userId, questId) => {
  const { rows } = await pool.query(
    `SELECT id FROM submissions
     WHERE user_id = $1 AND quest_id = $2 AND status = 'passed'
     LIMIT 1`,
    [userId, questId]
  );
  return rows.length > 0;
};
