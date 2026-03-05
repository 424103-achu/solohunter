// Difficulty selector based on user level, stats, and rank
import { getMaxDifficulty } from './rankCalculator.js';

const DIFFICULTY_WEIGHTS = {
  easy: { minLevel: 1, baseChance: 0.6 },
  medium: { minLevel: 5, baseChance: 0.3 },
  hard: { minLevel: 15, baseChance: 0.1 },
};

/**
 * Select appropriate quest difficulty based on user profile
 */
export const selectDifficulty = (userLevel, rank, stats = {}) => {
  const maxDiff = getMaxDifficulty(rank);
  const { strength = 1, intelligence = 1 } = stats;

  // Calculate stat bonus (higher stats = harder quests more likely)
  const statBonus = (strength + intelligence) / 40;

  const weights = [];

  if (maxDiff === 'easy') {
    return 'easy';
  }

  if (maxDiff === 'medium' || maxDiff === 'hard') {
    weights.push({ difficulty: 'easy', weight: Math.max(0.2, 0.6 - statBonus) });
    weights.push({ difficulty: 'medium', weight: 0.3 + statBonus });
  }

  if (maxDiff === 'hard') {
    weights.push({ difficulty: 'hard', weight: 0.1 + statBonus });
  }

  // Normalize weights
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  const random = Math.random() * totalWeight;

  let cumulative = 0;
  for (const w of weights) {
    cumulative += w.weight;
    if (random <= cumulative) {
      return w.difficulty;
    }
  }

  return 'easy';
};

/**
 * Get difficulty for a specific quest type
 */
export const getDifficultyForQuestType = (questType, userLevel) => {
  switch (questType) {
    case 'daily':
      if (userLevel >= 30) return 'medium';
      return 'easy';
    case 'boss':
      return 'hard';
    case 'special':
      return userLevel >= 20 ? 'hard' : 'medium';
    case 'main':
    default:
      return selectDifficulty(userLevel, 'E');
  }
};
