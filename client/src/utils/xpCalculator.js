/**
 * Calculate XP percentage for progress bar
 */
export const getXpPercentage = (currentXp, nextLevelXp) => {
  if (!nextLevelXp || nextLevelXp <= 0) return 0;
  return Math.min(100, Math.round((currentXp / nextLevelXp) * 100));
};
