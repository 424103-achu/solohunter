import express from "express";
import {
  createNewQuest,
  fetchAllQuests,
  fetchQuestById,
  fetchAvailableQuests,
  fetchDailyQuests,
  fetchBossQuests,
  fetchQuestsByType,
  generateGroqDailyQuests,
} from "../controllers/questController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createNewQuest);
router.post("/grok/generate", protect, generateGroqDailyQuests);
router.get("/", fetchAllQuests);
router.get("/available", protect, fetchAvailableQuests);
router.get("/daily", protect, fetchDailyQuests);
router.get("/boss", protect, fetchBossQuests);
router.get("/type/:type", fetchQuestsByType);
router.get("/:id", fetchQuestById);

export default router;