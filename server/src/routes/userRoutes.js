import express from "express";
import {
  getCurrentUser,
  getUserProfile,
  updateProfile,
  selectNiche,
  fetchUserStats,
  fetchNiches,
  fetchAllBadges,
  allocateStatPoints,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getCurrentUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateProfile);
router.post("/niche", protect, selectNiche);
router.get("/stats", protect, fetchUserStats);
router.post("/stats/allocate", protect, allocateStatPoints);
router.get("/niches", fetchNiches);
router.get("/badges", protect, fetchAllBadges);

export default router;