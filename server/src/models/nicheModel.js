// Niche Model
import pool from '../config/db.js';

export const getAllNiches = async () => {
  const { rows } = await pool.query('SELECT * FROM niches ORDER BY id');
  return rows;
};

export const getNicheById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM niches WHERE id = $1', [id]);
  return rows[0];
};

export const getNicheByName = async (name) => {
  const { rows } = await pool.query('SELECT * FROM niches WHERE name = $1', [name]);
  return rows[0];
};
