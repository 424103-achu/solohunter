// Submission Controller - Code submission and evaluation
import { createSubmission, updateSubmission, getSubmissionsByUser, getSubmissionsByQuest, hasPassedQuest } from '../models/submissionModel.js';
import { getQuestById, getQuestsByType } from '../models/questModel.js';
import { findUserById } from '../models/userModel.js';
import { executeCode, runCode, evaluateAgainstDescription } from '../services/judgeService.js';
import { evaluateLocally, runLocally } from '../services/localEvaluator.js';
import { grantXp, calculateXpReward, updateStreak } from '../services/xpService.js';
import { checkAndAwardBadges } from '../services/badgeService.js';
import logger from '../utils/logger.js';

/**
 * Submit code for a quest
 */
export const submitCode = async (req, res) => {
  try {
    const { questId, code, language = 'javascript' } = req.body;

    if (!questId || !code) {
      return res.status(400).json({ message: 'Quest ID and code are required' });
    }

    // Get quest
    const quest = await getQuestById(questId);
    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }

    // Get user
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create submission record
    const submission = await createSubmission(req.user.id, questId, code, language);

    // Evaluate code: use local evaluator if quest has test_cases, otherwise fall back to Gemini
    let executionResult;
    if (quest.test_cases && Array.isArray(quest.test_cases) && quest.test_cases.length > 0) {
      logger.info(`Using LOCAL evaluator for quest: ${quest.title}`);
      executionResult = evaluateLocally(code, quest.test_cases);
    } else {
      logger.info(`Using Gemini AI evaluator for quest: ${quest.title}`);
      executionResult = await evaluateAgainstDescription(code, language, quest.description);
    }

    // Calculate XP if passed
    let xpResult = null;
    let streakResult = null;
    let newBadges = [];

    if (executionResult.passed) {
      // Check if already passed (no double XP)
      const alreadyPassed = await hasPassedQuest(req.user.id, questId);

      let xpEarned = 0;
      if (!alreadyPassed) {
        // Calculate XP with bonuses
        const isNicheMatch = quest.niche_id && quest.niche_id === user.niche_id;
        xpEarned = calculateXpReward(quest.xp_reward, {
          currentStreak: user.current_streak || 0,
          isNicheMatch,
        });

        // Grant XP and handle level up
        xpResult = await grantXp(req.user.id, xpEarned);

        // Update streak
        streakResult = await updateStreak(req.user.id);

        // Check for new badges
        newBadges = await checkAndAwardBadges(req.user.id);
      }

      // Update submission
      await updateSubmission(submission.id, {
        status: 'passed',
        score: executionResult.score,
      });

      // Update user_stats quest counters
      await updateQuestStats(req.user.id, quest.quest_type);

      return res.json({
        success: true,
        passed: true,
        alreadyCompleted: alreadyPassed,
        submission: { id: submission.id, status: 'passed' },
        testResults: executionResult,
        xp: xpResult,
        streak: streakResult,
        newBadges,
      });
    } else {
      // Failed - update submission
      await updateSubmission(submission.id, {
        status: 'failed',
        score: executionResult.score,
      });

      return res.json({
        success: true,
        passed: false,
        submission: { id: submission.id, status: 'failed' },
        testResults: executionResult,
      });
    }
  } catch (err) {
    logger.error('SUBMIT CODE ERROR:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

/**
 * Helper to update quest completion stats in user_stats
 */
import pool from '../config/db.js';

const updateQuestStats = async (userId, questType) => {
  const typeColumn = {
    coding: 'coding_quests_completed',
    fitness: 'fitness_quests_completed',
    boss: 'boss_quests_completed',
    boost: 'boost_quests_completed',
    fun: 'fun_quests_completed',
  };

  const col = typeColumn[questType];
  const extraCol = col ? `, ${col} = ${col} + 1` : '';

  await pool.query(
    `UPDATE user_stats 
     SET total_quests_completed = total_quests_completed + 1,
         total_submissions = total_submissions + 1
         ${extraCol}
     WHERE user_id = $1`,
    [userId]
  );
};

/**
 * Complete a fitness quest (timer-based, no code required)
 */
export const completeFitnessQuest = async (req, res) => {
  try {
    const { questId, duration } = req.body;

    if (!questId) {
      return res.status(400).json({ message: 'Quest ID is required' });
    }

    // Get quest and verify it's a fitness quest
    const quest = await getQuestById(questId);
    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }
    if (quest.quest_type !== 'fitness') {
      return res.status(400).json({ message: 'This endpoint is for fitness quests only' });
    }

    // Get user
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already completed today
    const alreadyPassed = await hasPassedQuest(req.user.id, questId);

    // Create a submission record (code = workout log)
    const workoutLog = `Fitness quest completed. Duration: ${duration || 0}s`;
    const submission = await createSubmission(req.user.id, questId, workoutLog, 'fitness');

    // Mark as passed
    await updateSubmission(submission.id, {
      status: 'passed',
      score: 100,
      execution_time: duration || 0,
    });

    let xpResult = null;
    let streakResult = null;
    let newBadges = [];

    if (!alreadyPassed) {
      // Grant XP
      const xpEarned = calculateXpReward(quest.xp_reward, {
        currentStreak: user.current_streak || 0,
        isNicheMatch: false,
      });

      xpResult = await grantXp(req.user.id, xpEarned);
      streakResult = await updateStreak(req.user.id);
      newBadges = await checkAndAwardBadges(req.user.id);
    }

    // Update fitness stats
    await updateQuestStats(req.user.id, 'fitness');

    return res.json({
      success: true,
      passed: true,
      alreadyCompleted: alreadyPassed,
      submission: { id: submission.id, status: 'passed' },
      xp: xpResult,
      streak: streakResult,
      newBadges,
      quest: {
        id: quest.id,
        title: quest.title,
        xp_reward: quest.xp_reward,
        skill_reward: quest.skill_reward,
      },
    });
  } catch (err) {
    logger.error('COMPLETE FITNESS QUEST ERROR:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

/**
 * Get available fitness quests
 */
export const getFitnessQuests = async (req, res) => {
  try {
    const quests = await getQuestsByType('fitness');
    res.json(quests);
  } catch (err) {
    logger.error('GET FITNESS QUESTS ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Run code without submitting (sandbox execution)
 * Uses local execution — no Gemini needed
 */
export const executeCodeSandbox = async (req, res) => {
  try {
    const { code, language = 'javascript', stdin = '' } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }

    // Use local runner for JavaScript, fall back to Gemini for other languages
    if (language === 'javascript') {
      const result = runLocally(code);
      return res.json(result);
    }

    const result = await runCode(code, language, stdin);
    res.json(result);
  } catch (err) {
    logger.error('EXECUTE CODE ERROR:', err);
    res.status(500).json({ message: err.message || 'Code execution failed' });
  }
};

/**
 * Get user's submission history
 */
export const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await getSubmissionsByUser(req.user.id);
    res.json(submissions);
  } catch (err) {
    logger.error('GET SUBMISSIONS ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get submissions for a specific quest
 */
export const getQuestSubmissions = async (req, res) => {
  try {
    const submissions = await getSubmissionsByQuest(req.params.questId, req.user.id);
    res.json(submissions);
  } catch (err) {
    logger.error('GET QUEST SUBMISSIONS ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
