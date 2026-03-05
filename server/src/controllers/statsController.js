// Stats Controller
import { getUserStats } from '../models/userModel.js';
import { getQuestStats } from '../services/questEngineService.js';

export const fetchStats = async (req, res) => {
  try {
    const [userStats, questStats] = await Promise.all([
      getUserStats(req.user.id),
      getQuestStats(req.user.id),
    ]);

    res.json({
      combat: userStats,
      quests: questStats,
    });
  } catch (err) {
    console.error('FETCH STATS ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
