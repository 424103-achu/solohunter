// Rank thresholds and info
export const RANK_THRESHOLDS = [
  { rank: 'S', minLevel: 38, color: '#FFD700', title: 'Shadow Monarch', bgGradient: 'from-yellow-600 to-amber-400' },
  { rank: 'A', minLevel: 26, color: '#FF4500', title: 'National Level Hunter', bgGradient: 'from-red-600 to-orange-500' },
  { rank: 'B', minLevel: 18, color: '#9B59B6', title: 'Elite Hunter', bgGradient: 'from-purple-700 to-violet-500' },
  { rank: 'C', minLevel: 10, color: '#3498DB', title: 'Veteran Hunter', bgGradient: 'from-blue-600 to-cyan-500' },
  { rank: 'D', minLevel: 5, color: '#2ECC71', title: 'Skilled Hunter', bgGradient: 'from-green-600 to-emerald-400' },
  { rank: 'E', minLevel: 1, color: '#95A5A6', title: 'Novice Hunter', bgGradient: 'from-gray-600 to-slate-400' },
];

export const getRankColor = (rank) => {
  const info = RANK_THRESHOLDS.find((t) => t.rank === rank);
  return info?.color || '#95A5A6';
};

export const getRankTitle = (rank) => {
  const info = RANK_THRESHOLDS.find((t) => t.rank === rank);
  return info?.title || 'Novice Hunter';
};

export const getRankClass = (rank) => {
  return `rank-${rank?.toLowerCase() || 'e'}`;
};
