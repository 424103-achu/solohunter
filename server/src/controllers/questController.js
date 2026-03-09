import {
  createQuest,
  getAllQuests,
  getQuestById,
  getQuestsByType,
  getQuestsByNiche,
} from "../models/questModel.js";
import { getAvailableQuests, getDailyQuests, getBossQuests } from "../services/questEngineService.js";
import logger from "../utils/logger.js";

export const createNewQuest = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      xp_reward,
      quest_type,
      niche_id,
      skill_reward,
      is_ai_generated,
    } = req.body;

    if (!title || !description || !difficulty || !xp_reward || !quest_type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const quest = await createQuest(
      title, description, difficulty, xp_reward, quest_type,
      niche_id, skill_reward, is_ai_generated
    );

    res.status(201).json(quest);
  } catch (err) {
    console.error("CREATE QUEST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchAllQuests = async (req, res) => {
  try {
    const quests = await getAllQuests();
    res.json(quests);
  } catch (err) {
    console.error("FETCH QUESTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchQuestById = async (req, res) => {
  try {
    const quest = await getQuestById(req.params.id);

    if (!quest) {
      return res.status(404).json({ message: "Quest not found" });
    }

    res.json(quest);
  } catch (err) {
    console.error("FETCH QUEST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchAvailableQuests = async (req, res) => {
  try {
    const quests = await getAvailableQuests(req.user.id);
    res.json(quests);
  } catch (err) {
    console.error("FETCH AVAILABLE QUESTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchDailyQuests = async (req, res) => {
  try {
    const quests = await getDailyQuests(req.user.id);
    res.json(quests);
  } catch (err) {
    console.error("GET DAILY QUESTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchBossQuests = async (req, res) => {
  try {
    const quests = await getBossQuests(req.user.id);
    res.json(quests);
  } catch (err) {
    console.error("GET BOSS QUESTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchQuestsByType = async (req, res) => {
  try {
    const quests = await getQuestsByType(req.params.type);
    res.json(quests);
  } catch (err) {
    console.error("FETCH QUESTS BY TYPE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /quests/grok/generate
 * Returns today's daily quests for the user (generates via Groq on first call of the day).
 */
export const generateGroqDailyQuests = async (req, res) => {
  try {
    const quests = await getDailyQuests(req.user.id);
    res.json(quests);
  } catch (err) {
    logger.error("GROQ GENERATE QUESTS ERROR:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};