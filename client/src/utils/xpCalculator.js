/**
 * Calculate XP percentage for progress bar
 */
export const getXpPercentage = (currentXp, nextLevelXp) => {
  if (!nextLevelXp || nextLevelXp <= 0) return 0;
  return Math.min(100, Math.round((currentXp / nextLevelXp) * 100));
};

/**
 * Format large XP numbers
 */
export const formatXp = (xp) => {
  if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`;
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`;
  return xp?.toString() || '0';
};

/**
 * Calculate total XP needed for a specific level
 */
export const xpForLevel = (level) => {
  return Math.floor(100 * Math.pow(1.15, level - 1));
};
