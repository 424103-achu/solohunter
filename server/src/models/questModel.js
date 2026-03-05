import pool from "../config/db.js";

export const createQuest = async (
  title,
  description,
  difficulty,
  xp_reward,
  quest_type,
  niche_id = null,
  skill_reward = 0,
  is_ai_generated = false
) => {
  const query = `
    INSERT INTO quests
    (title, description, difficulty, xp_reward, skill_reward, quest_type, niche_id, is_ai_generated)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  const values = [
    title,
    description,
    difficulty,
    xp_reward,
    skill_reward,
    quest_type,
    niche_id,
    is_ai_generated,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getAllQuests = async () => {
  const { rows } = await pool.query(
    `SELECT q.*, n.name as niche_name 
     FROM quests q 
     LEFT JOIN niches n ON q.niche_id = n.id
     WHERE q.is_active = TRUE 
     ORDER BY q.created_at DESC`
  );
  return rows;
};

export const getQuestById = async (id) => {
  const { rows } = await pool.query(
    `SELECT q.*, n.name as niche_name 
     FROM quests q 
     LEFT JOIN niches n ON q.niche_id = n.id
     WHERE q.id = $1`,
    [id]
  );
  return rows[0];
};

export const getQuestsByType = async (questType) => {
  const { rows } = await pool.query(
    `SELECT q.*, n.name as niche_name 
     FROM quests q 
     LEFT JOIN niches n ON q.niche_id = n.id
     WHERE q.quest_type = $1 AND q.is_active = TRUE 
     ORDER BY q.created_at DESC`,
    [questType]
  );
  return rows;
};

export const getQuestsByNiche = async (nicheId) => {
  const { rows } = await pool.query(
    `SELECT q.*, n.name as niche_name 
     FROM quests q 
     LEFT JOIN niches n ON q.niche_id = n.id
     WHERE q.niche_id = $1 AND q.is_active = TRUE 
     ORDER BY q.created_at DESC`,
    [nicheId]
  );
  return rows;
};

export const getQuestsByDifficulty = async (difficulty) => {
  const { rows } = await pool.query(
    `SELECT q.*, n.name as niche_name 
     FROM quests q 
     LEFT JOIN niches n ON q.niche_id = n.id
     WHERE q.difficulty = $1 AND q.is_active = TRUE 
     ORDER BY q.created_at DESC`,
    [difficulty]
  );
  return rows;
};