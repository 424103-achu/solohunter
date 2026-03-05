// Stats Routes
import express from 'express';
import { fetchStats } from '../controllers/statsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, fetchStats);

export default router;
