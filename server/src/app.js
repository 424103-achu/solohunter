import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import questRoutes from "./routes/questRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";

import errorHandler from "./middleware/errorHandler.js";
import { apiLimiter, authLimiter } from "./middleware/rateLimiter.js";
import { startDailyQuestJob } from "./jobs/dailyQuestJob.js";
import { startWeeklyBossJob } from "./jobs/weeklyBossJob.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5174",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// Rate limiting
app.use("/api/", apiLimiter);
app.use("/api/auth/", authLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/quests", questRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Solo Hunter RPG API is running", timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

// Start cron jobs
startDailyQuestJob();
startWeeklyBossJob();

export default app;