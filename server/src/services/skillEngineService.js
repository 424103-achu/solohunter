// Skill Engine Service - Manages skill trees and unlocking
import pool from '../config/db.js';
import logger from '../utils/logger.js';

/**
 * Get the skill tree for a specific niche
 */
export const getSkillTree = async (nicheId) => {
  const { rows: skills } = await pool.query(
    `SELECT * FROM skills WHERE niche_id = $1 ORDER BY unlock_cost ASC, name ASC`,
    [nicheId]
  );

  return skills;
};

/**
 * Get skill tree with user's unlock progress
 */
export const getSkillTreeForUser = async (userId) => {
  const { rows: [user] } = await pool.query(
    `SELECT u.level, u.skill_points, un.niche_id
     FROM users u
     LEFT JOIN user_niches un ON u.id = un.user_id
     WHERE u.id = $1`,
    [userId]
  );

  if (!user || !user.niche_id) {
    return { skills: [], message: 'Select a niche first (available at Level 5)' };
  }

  const { rows: skills } = await pool.query(
    `SELECT s.*,
       COALESCE(us.current_level, 0) as current_level,
       CASE WHEN us.skill_id IS NOT NULL THEN true ELSE false END as unlocked
     FROM skills s
     LEFT JOIN user_skills us ON s.id = us.skill_id AND us.user_id = $1
     WHERE s.niche_id = $2
     ORDER BY s.unlock_cost ASC, s.name ASC`,
    [userId, user.niche_id]
  );

  // Add canUnlock / canUpgrade flags
  const enrichedSkills = skills.map((skill) => {
    const canUnlock = !skill.unlocked && user.skill_points >= skill.unlock_cost;
    const canUpgrade = skill.unlocked && skill.current_level < skill.max_level && user.skill_points >= skill.unlock_cost;
    return { ...skill, can_unlock: canUnlock, can_upgrade: canUpgrade };
  });

  return {
    skills: enrichedSkills,
    userStats: {
      level: user.level,
      skillPoints: user.skill_points,
    },
  };
};

/**
 * Attempt to unlock or upgrade a skill
 */
export const unlockSkill = async (userId, skillId) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get skill requirements
    const { rows: [skill] } = await client.query(
      'SELECT * FROM skills WHERE id = $1',
      [skillId]
    );

    if (!skill) throw new Error('Skill not found');

    // Get user data
    const { rows: [user] } = await client.query(
      `SELECT u.skill_points, un.niche_id
       FROM users u
       LEFT JOIN user_niches un ON u.id = un.user_id
       WHERE u.id = $1 FOR UPDATE`,
      [userId]
    );

    if (!user) throw new Error('User not found');

    // Check niche match
    if (skill.niche_id !== user.niche_id) {
      throw new Error('Skill does not match your niche');
    }

    // Check if already at max level
    const { rows: existing } = await client.query(
      'SELECT current_level FROM user_skills WHERE user_id = $1 AND skill_id = $2',
      [userId, skillId]
    );

    if (existing.length > 0 && existing[0].current_level >= skill.max_level) {
      throw new Error('Skill already at max level');
    }

    // Check skill points
    if (user.skill_points < skill.unlock_cost) {
      throw new Error(`Not enough skill points. Need ${skill.unlock_cost}, have ${user.skill_points}`);
    }

    // Deduct skill points
    await client.query(
      'UPDATE users SET skill_points = skill_points - $1, updated_at = NOW() WHERE id = $2',
      [skill.unlock_cost, userId]
    );

    // Unlock or upgrade skill
    if (existing.length > 0) {
      await client.query(
        'UPDATE user_skills SET current_level = current_level + 1 WHERE user_id = $1 AND skill_id = $2',
        [userId, skillId]
      );
    } else {
      await client.query(
        'INSERT INTO user_skills (user_id, skill_id, current_level) VALUES ($1, $2, 1)',
        [userId, skillId]
      );
    }

    await client.query('COMMIT');

    logger.info(`User ${userId} unlocked/upgraded skill: ${skill.name}`);
    return { success: true, skill };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
