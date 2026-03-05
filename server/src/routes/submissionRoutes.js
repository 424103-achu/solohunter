// Submission Routes
import express from 'express';
import { submitCode, executeCodeSandbox, getUserSubmissions, getQuestSubmissions, completeFitnessQuest, getFitnessQuests } from '../controllers/submissionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Fitness quests
router.get('/fitness', protect, getFitnessQuests);
router.post('/fitness/complete', protect, completeFitnessQuest);

// Submit code for a quest
router.post('/submit', protect, submissionLimiter, submitCode);

// Run code in sandbox (no quest submission)
router.post('/run', protect, submissionLimiter, executeCodeSandbox);

// Get user's submission history
router.get('/history', protect, getUserSubmissions);

// Get submissions for a specific quest
router.get('/quest/:questId', protect, getQuestSubmissions);

export default router;
