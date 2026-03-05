// Daily Quest Job - Runs daily to reset streaks and manage daily quests
import cron from 'node-cron';
import pool from '../config/db.js';
import { resetBrokenStreaks } from '../services/xpService.js';
import logger from '../utils/logger.js';

// Run every day at midnight
const dailyQuestJob = cron.schedule('0 0 * * *', async () => {
  logger.info('Running daily quest job...');
  try {
    const resetCount = await resetBrokenStreaks();

    // Clean up old daily quest assignments (keep last 7 days)
    const { rowCount } = await pool.query(
      `DELETE FROM daily_quest_progress WHERE assigned_date < CURRENT_DATE - INTERVAL '7 days'`
    );
    logger.info(`Daily job complete. Reset ${resetCount} streaks. Cleaned ${rowCount} old daily assignments.`);
  } catch (err) {
    logger.error('Daily quest job error:', err);
  }
}, {
  scheduled: false,
});

export const startDailyQuestJob = () => {
  dailyQuestJob.start();
  logger.info('Daily quest job scheduled (midnight)');
};

export default dailyQuestJob;
