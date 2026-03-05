import { findUserById, updateUserNiche, updateUserProfile, getUserStats, allocateCombatStats } from "../models/userModel.js";
import { getAllNiches } from "../models/nicheModel.js";
import { getUserBadges, getAllBadgesForUser } from "../services/badgeService.js";
import { getQuestStats } from "../services/questEngineService.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const next_level_xp = Math.floor(50 * (user.level || 1) * 1.2);
    res.json({ ...user, next_level_xp });
  } catch (err) {
    console.error("GET USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const [badges, questStats] = await Promise.all([
      getUserBadges(req.user.id),
      getQuestStats(req.user.id),
    ]);

    // Compute next_level_xp so the client can show XP progress
    const next_level_xp = Math.floor(50 * (user.level || 1) * 1.2);

    res.json({ ...user, next_level_xp, badges, questStats });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: "Username required" });

    const updated = await updateUserProfile(req.user.id, { username });
    res.json(updated);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: "Username already taken" });
    }
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const selectNiche = async (req, res) => {
  try {
    const { nicheId } = req.body;
    if (!nicheId) return res.status(400).json({ message: "Niche ID required" });

    // Check user level >= 5
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.level < 5) {
      return res.status(403).json({ message: "Must be Level 5 to select a niche" });
    }

    const updated = await updateUserNiche(req.user.id, nicheId);
    res.json({ message: "Niche selected", ...updated });
  } catch (err) {
    console.error("SELECT NICHE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchUserStats = async (req, res) => {
  try {
    const stats = await getUserStats(req.user.id);
    if (!stats) return res.status(404).json({ message: "Stats not found" });
    res.json(stats);
  } catch (err) {
    console.error("FETCH STATS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchNiches = async (req, res) => {
  try {
    const niches = await getAllNiches();
    res.json(niches);
  } catch (err) {
    console.error("FETCH NICHES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchAllBadges = async (req, res) => {
  try {
    const badges = await getAllBadgesForUser(req.user.id);
    res.json(badges);
  } catch (err) {
    console.error("FETCH BADGES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const allocateStatPoints = async (req, res) => {
  try {
    const { strength = 0, intelligence = 0, agility = 0 } = req.body;

    // Validate inputs
    if (strength < 0 || intelligence < 0 || agility < 0) {
      return res.status(400).json({ message: "Stat values cannot be negative" });
    }
    const total = strength + intelligence + agility;
    if (total <= 0) {
      return res.status(400).json({ message: "Must allocate at least 1 point" });
    }

    const result = await allocateCombatStats(req.user.id, strength, intelligence, agility);
    res.json(result);
  } catch (err) {
    if (err.message === 'Not enough skill points') {
      return res.status(400).json({ message: err.message });
    }
    console.error("ALLOCATE STATS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};