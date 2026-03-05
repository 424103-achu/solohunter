// Skill Routes
import express from 'express';
import { fetchSkillTree, unlockUserSkill } from '../controllers/skillController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/tree', protect, fetchSkillTree);
router.post('/unlock', protect, unlockUserSkill);

export default router;
