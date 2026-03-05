import pool from "../config/db.js";

export const createUser = async (username, email, hashedPassword) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, level, xp, rank, skill_points, created_at`,
      [username, email, hashedPassword]
    );

    // Create user_stats row
    await client.query(
      `INSERT INTO user_stats (user_id) VALUES ($1)`,
      [rows[0].id]
    );

    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const findUserByEmail = async (email) => {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return rows[0];
};

export const findUserById = async (id) => {
  const { rows } = await pool.query(
    `SELECT u.id, u.username, u.email, u.level, u.xp, u.rank,
            u.skill_points, u.avatar_url, u.is_active,
            u.created_at, u.updated_at,
            un.niche_id,
            n.name as niche_name,
            us.current_streak, us.longest_streak, us.last_active_date,
            us.total_quests_completed, us.total_submissions,
            us.strength, us.intelligence, us.agility
     FROM users u
     LEFT JOIN user_niches un ON u.id = un.user_id
     LEFT JOIN niches n ON un.niche_id = n.id
     LEFT JOIN user_stats us ON u.id = us.user_id
     WHERE u.id = $1`,
    [id]
  );
  return rows[0];
};

export const findUserByUsername = async (username) => {
  const { rows } = await pool.query(
    `SELECT u.id, u.username, u.level, u.xp, u.rank, u.created_at,
            un.niche_id,
            us.current_streak
     FROM users u
     LEFT JOIN user_niches un ON u.id = un.user_id
     LEFT JOIN user_stats us ON u.id = us.user_id
     WHERE u.username = $1`,
    [username]
  );
  return rows[0];
};

export const updateUserNiche = async (userId, nicheId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM user_niches WHERE user_id = $1', [userId]);
    const { rows } = await client.query(
      `INSERT INTO user_niches (user_id, niche_id) VALUES ($1, $2) RETURNING user_id, niche_id`,
      [userId, nicheId]
    );
    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const updateUserProfile = async (userId, { username }) => {
  const { rows } = await pool.query(
    "UPDATE users SET username = $1, updated_at = NOW() WHERE id = $2 RETURNING id, username, email",
    [username, userId]
  );
  return rows[0];
};

export const getLeaderboard = async (sortBy = 'xp', limit = 50) => {
  const validSorts = {
    xp: 'u.xp DESC',
    level: 'u.level DESC, u.xp DESC',
    streak: 'us.current_streak DESC',
  };
  const orderBy = validSorts[sortBy] || validSorts.xp;

  const { rows } = await pool.query(
    `SELECT u.id, u.username, u.level, u.xp, u.rank,
            us.current_streak,
            n.name as niche_name
     FROM users u
     LEFT JOIN user_niches un ON u.id = un.user_id
     LEFT JOIN niches n ON un.niche_id = n.id
     LEFT JOIN user_stats us ON u.id = us.user_id
     ORDER BY ${orderBy}
     LIMIT $1`,
    [limit]
  );
  return rows;
};

export const getUserStats = async (userId) => {
  const { rows: [stats] } = await pool.query(
    `SELECT us.*, u.skill_points
     FROM user_stats us
     JOIN users u ON u.id = us.user_id
     WHERE us.user_id = $1`,
    [userId]
  );
  return stats;
};

export const spendSkillPoints = async (userId, cost) => {
  const { rows } = await pool.query(
    `UPDATE users SET skill_points = skill_points - $1, updated_at = NOW()
     WHERE id = $2 AND skill_points >= $1
     RETURNING id, skill_points`,
    [cost, userId]
  );
  if (rows.length === 0) throw new Error('Not enough skill points');
  return rows[0];
};

export const allocateCombatStats = async (userId, strength, intelligence, agility) => {
  const totalCost = strength + intelligence + agility;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Deduct skill points
    const { rows: [user] } = await client.query(
      `UPDATE users SET skill_points = skill_points - $1, updated_at = NOW()
       WHERE id = $2 AND skill_points >= $1
       RETURNING id, skill_points`,
      [totalCost, userId]
    );
    if (!user) throw new Error('Not enough skill points');

    // Increment combat stats
    const { rows: [stats] } = await client.query(
      `UPDATE user_stats
       SET strength = strength + $1,
           intelligence = intelligence + $2,
           agility = agility + $3
       WHERE user_id = $4
       RETURNING strength, intelligence, agility`,
      [strength, intelligence, agility, userId]
    );

    await client.query('COMMIT');
    return { skill_points: user.skill_points, ...stats };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};