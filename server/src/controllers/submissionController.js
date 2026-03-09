// Submission Controller - Code submission and evaluation
import { createSubmission, updateSubmission, getSubmissionsByUser, getSubmissionsByQuest, hasPassedQuest } from '../models/submissionModel.js';
import { getQuestById, getQuestsByType } from '../models/questModel.js';
import { findUserById } from '../models/userModel.js';
import { evaluateAgainstDescription } from '../services/judgeService.js';
import { evaluateLocally } from '../services/localEvaluator.js';
import { evaluateWithTestCases, runSandbox } from '../services/codeRunner.js';
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

    // Block re-submission if already completed
    const alreadyPassedEarly = await hasPassedQuest(req.user.id, questId);
    if (alreadyPassedEarly) {
      return res.json({
        success: true,
        passed: true,
        alreadyCompleted: true,
        message: 'You have already completed this quest.',
      });
    }

    // Create submission record
    const submission = await createSubmission(req.user.id, questId, code, language);

    // Evaluate code based on quest type
    let executionResult;
    if (quest.is_ai_generated && Array.isArray(quest.test_cases) && quest.test_cases.length > 0) {
      // Groq AI quest — run with user-selected language (not quest.language)
      logger.info(`Using codeRunner for Groq quest: ${quest.title} (${language})`);
      executionResult = await evaluateWithTestCases(code, language, quest.test_cases);
    } else if (quest.test_cases && Array.isArray(quest.test_cases) && quest.test_cases.length > 0) {
      // Legacy JS quest — use VM sandbox evaluator
      logger.info(`Using local JS evaluator for quest: ${quest.title}`);
      executionResult = evaluateLocally(code, quest.test_cases);
    } else {
      // No test cases — Gemini description evaluation fallback
      logger.info(`Using Gemini AI evaluator for quest: ${quest.title}`);
      executionResult = await evaluateAgainstDescription(code, language, quest.description);
    }

    // Calculate XP if passed
    let xpResult = null;
    let streakResult = null;
    let newBadges = [];

    if (executionResult.passed) {
      // Calculate XP with bonuses
      const isNicheMatch = quest.niche_id && quest.niche_id === user.niche_id;
      const xpEarned = calculateXpReward(quest.xp_reward, {
        currentStreak: user.current_streak || 0,
        isNicheMatch,
      });

      xpResult = await grantXp(req.user.id, xpEarned);
      streakResult = await updateStreak(req.user.id);
      newBadges = await checkAndAwardBadges(req.user.id);

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
        alreadyCompleted: false,
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
    yoga: 'fitness_quests_completed',
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
 * Get available yoga quests
 */
export const getYogaQuests = async (req, res) => {
  try {
    const quests = await getQuestsByType('yoga');
    res.json(quests);
  } catch (err) {
    logger.error('GET YOGA QUESTS ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Complete a yoga quest (timer-based, no code required)
 */
export const completeYogaQuest = async (req, res) => {
  try {
    const { questId, duration } = req.body;
    if (!questId) return res.status(400).json({ message: 'Quest ID is required' });

    const quest = await getQuestById(questId);
    if (!quest) return res.status(404).json({ message: 'Quest not found' });
    if (quest.quest_type !== 'yoga') return res.status(400).json({ message: 'This endpoint is for yoga quests only' });

    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const alreadyPassed = await hasPassedQuest(req.user.id, questId);

    const log = `Yoga quest completed. Duration: ${duration || 0}s`;
    const submission = await createSubmission(req.user.id, questId, log, 'yoga');
    await updateSubmission(submission.id, { status: 'passed', score: 100, execution_time: duration || 0 });

    let xpResult = null;
    let streakResult = null;
    let newBadges = [];

    if (!alreadyPassed) {
      const xpEarned = calculateXpReward(quest.xp_reward, { currentStreak: user.current_streak || 0, isNicheMatch: false });
      xpResult = await grantXp(req.user.id, xpEarned);
      streakResult = await updateStreak(req.user.id);
      newBadges = await checkAndAwardBadges(req.user.id);
    }

    await updateQuestStats(req.user.id, 'yoga');

    return res.json({
      success: true,
      passed: true,
      alreadyCompleted: alreadyPassed,
      submission: { id: submission.id, status: 'passed' },
      xp: xpResult,
      streak: streakResult,
      newBadges,
      quest: { id: quest.id, title: quest.title, xp_reward: quest.xp_reward, skill_reward: quest.skill_reward },
    });
  } catch (err) {
    logger.error('COMPLETE YOGA QUEST ERROR:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

/**
 * Run code without submitting (sandbox execution)
 * Runs code locally for all supported languages
 */
/**
 * Check code against all test cases WITHOUT saving to DB or awarding XP.
 * Used by the RUN button to preview results before the user chooses to submit.
 */
export const checkCode = async (req, res) => {
  try {
    const { questId, code, language = 'javascript' } = req.body;
    if (!questId || !code) {
      return res.status(400).json({ message: 'Quest ID and code are required' });
    }

    const quest = await getQuestById(questId);
    if (!quest) return res.status(404).json({ message: 'Quest not found' });

    let executionResult;
    if (quest.is_ai_generated && Array.isArray(quest.test_cases) && quest.test_cases.length > 0) {
      executionResult = await evaluateWithTestCases(code, language, quest.test_cases);
    } else if (quest.test_cases && Array.isArray(quest.test_cases) && quest.test_cases.length > 0) {
      executionResult = evaluateLocally(code, quest.test_cases);
    } else {
      executionResult = await evaluateAgainstDescription(code, language, quest.description);
    }

    res.json({ checked: true, passed: executionResult.passed, testResults: executionResult });
  } catch (err) {
    logger.error('CHECK CODE ERROR:', err);
    res.status(500).json({ message: err.message || 'Code check failed' });
  }
};

export const executeCodeSandbox = async (req, res) => {
  try {
    const { code, language = 'javascript', stdin = '' } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }

    const result = await runSandbox(code, language, stdin);
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

/**
 * Check if the current user has already completed a quest
 */
export const getQuestStatus = async (req, res) => {
  try {
    const { questId } = req.params;
    const completed = await hasPassedQuest(req.user.id, questId);
    res.json({ completed });
  } catch (err) {
    logger.error('GET QUEST STATUS ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
