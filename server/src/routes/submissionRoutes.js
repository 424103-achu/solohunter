// Submission Routes
import express from 'express';
import { submitCode, checkCode, executeCodeSandbox, getUserSubmissions, getQuestSubmissions, completeFitnessQuest, getFitnessQuests, completeYogaQuest, getYogaQuests, getQuestStatus } from '../controllers/submissionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { submissionLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Fitness quests
router.get('/fitness', protect, getFitnessQuests);
router.post('/fitness/complete', protect, completeFitnessQuest);

// Yoga quests
router.get('/yoga', protect, getYogaQuests);
router.post('/yoga/complete', protect, completeYogaQuest);

// Submit code for a quest
router.post('/submit', protect, submissionLimiter, submitCode);

// Check code against all test cases (no XP awarded, no DB save)
router.post('/check', protect, submissionLimiter, checkCode);

// Run code in sandbox (no quest submission)
router.post('/run', protect, submissionLimiter, executeCodeSandbox);

// Get user's submission history
router.get('/history', protect, getUserSubmissions);

// Get submissions for a specific quest
router.get('/quest/:questId', protect, getQuestSubmissions);

// Check if a quest has been completed by the current user
router.get('/status/:questId', protect, getQuestStatus);

export default router;
