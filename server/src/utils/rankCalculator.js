// Rank Calculator - Solo Leveling style ranks
// E(1-4) → D(5-9) → C(10-17) → B(18-25) → A(26-37) → S(38+)

export const RANK_THRESHOLDS = [
  { rank: 'S', minLevel: 38, color: '#FFD700', title: 'Shadow Monarch' },
  { rank: 'A', minLevel: 26, color: '#FF4500', title: 'National Level Hunter' },
  { rank: 'B', minLevel: 18, color: '#9B59B6', title: 'Elite Hunter' },
  { rank: 'C', minLevel: 10, color: '#3498DB', title: 'Veteran Hunter' },
  { rank: 'D', minLevel: 5, color: '#2ECC71', title: 'Skilled Hunter' },
  { rank: 'E', minLevel: 1, color: '#95A5A6', title: 'Novice Hunter' },
];

export const getRank = (level) => {
  for (const threshold of RANK_THRESHOLDS) {
    if (level >= threshold.minLevel) {
      return threshold.rank;
    }
  }
  return 'E';
};

// Get max difficulty a rank can access
export const getMaxDifficulty = (rank) => {
  switch (rank) {
    case 'S':
    case 'A':
    case 'B':
      return 'hard';
    case 'C':
    case 'D':
      return 'medium';
    case 'E':
    default:
      return 'easy';
  }
};
