// Leaderboard Controller
import { getLeaderboard } from '../models/userModel.js';

export const fetchLeaderboard = async (req, res) => {
  try {
    const { sort = 'xp', limit = 50 } = req.query;
    const leaderboard = await getLeaderboard(sort, parseInt(limit));
    res.json(leaderboard);
  } catch (err) {
    console.error('LEADERBOARD ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
