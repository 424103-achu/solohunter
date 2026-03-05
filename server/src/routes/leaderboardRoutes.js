// Leaderboard Routes
import express from 'express';
import { fetchLeaderboard } from '../controllers/leaderboardController.js';

const router = express.Router();

// ?sort=xp|level|streak&limit=50
router.get('/', fetchLeaderboard);

export default router;
