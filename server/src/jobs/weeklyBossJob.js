// Weekly Boss Job - Rotates boss quests weekly
import cron from 'node-cron';
import pool from '../config/db.js';
import logger from '../utils/logger.js';

// Run every Monday at midnight
const weeklyBossJob = cron.schedule('0 0 * * 1', async () => {
  logger.info('Running weekly boss quest rotation...');
  try {
    // Deactivate old boss quests (optional rotation logic)
    // For now, just log that the job ran
    logger.info('Weekly boss job complete.');
  } catch (err) {
    logger.error('Weekly boss job error:', err);
  }
}, {
  scheduled: false,
});

export const startWeeklyBossJob = () => {
  weeklyBossJob.start();
  logger.info('Weekly boss job scheduled (Monday midnight)');
};

export default weeklyBossJob;
