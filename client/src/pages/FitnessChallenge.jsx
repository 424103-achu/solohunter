import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import FitnessTimer from '../components/fitness/FitnessTimer';
import WorkoutCard from '../components/fitness/WorkoutCard';
import { FiActivity, FiAward, FiTrendingUp } from 'react-icons/fi';
import { getFitnessQuests, completeFitnessQuest } from '../services/submissionService';

// Estimated durations per difficulty (in minutes) for the timer
const DIFFICULTY_DURATION = { easy: 5, medium: 10, hard: 20 };

const FitnessChallenge = () => {
  const { refreshUser } = useAuth();
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadFitnessQuests();
  }, []);

  const loadFitnessQuests = async () => {
    try {
      const data = await getFitnessQuests();
      // Map DB quests to workout format
      const mapped = (data || []).map((q) => ({
        id: q.id,
        name: q.title,
        description: q.description,
        duration: DIFFICULTY_DURATION[q.difficulty] || 5,
        xpReward: q.xp_reward,
        skillReward: q.skill_reward,
        difficulty: q.difficulty,
      }));
      setQuests(mapped);
    } catch (err) {
      console.error('Failed to load fitness quests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = (workout) => {
    setActiveWorkout(workout);
    setResult(null);
  };

  const handleComplete = async () => {
    if (!activeWorkout) return;

    try {
      const res = await completeFitnessQuest(
        activeWorkout.id,
        activeWorkout.duration * 60
      );
      setCompleted((prev) => [...prev, activeWorkout.id]);
      setResult(res);
      if (res.success) refreshUser();
    } catch (err) {
      console.error('Failed to complete fitness quest:', err);
      setResult({ success: false, message: err.response?.data?.message || 'Failed to submit' });
    } finally {
      setActiveWorkout(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="system-window w-64">
          <div className="system-body text-center">
            <div className="animate-pulse text-secondary font-system text-sm">Loading training regimen...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="system-window">
        <div className="system-header">🏋️ Physical Training</div>
        <div className="system-body">
          <p className="text-xs text-text-muted font-game">
            Train your body alongside your mind. Complete workouts to earn XP and skill points.
            Start the timer, do the exercise, and claim your reward when done.
          </p>
        </div>
      </div>

      {/* XP Result Toast */}
      <AnimatePresence>
        {result?.success && result?.xp && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="system-window !border-success/30"
          >
            <div className="system-body flex items-center gap-4">
              <FiAward className="text-warning text-xl" />
              <div>
                <p className="font-game text-success text-sm font-semibold">Quest Complete!</p>
                <div className="flex gap-4 mt-1 text-xs font-mono">
                  {result.xp && (
                    <span className="text-secondary">
                      <FiTrendingUp className="inline mr-1" />
                      +{result.xp.xpGained} XP
                    </span>
                  )}
                  {result.xp?.leveledUp && (
                    <span className="text-warning animate-pulse">
                      LEVEL UP → Lv.{result.xp.newLevel}!
                    </span>
                  )}
                  {result.quest && (
                    <span className="text-text-muted">+{result.quest.skill_reward} SP</span>
                  )}
                </div>
                {result.alreadyCompleted && (
                  <p className="text-xs text-text-muted mt-1">Already completed — no bonus XP</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Workout */}
      {activeWorkout && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="system-window !border-success/30"
        >
          <div className="system-header !bg-success/10 !text-success">Active Training</div>
          <div className="system-body">
            <div className="flex items-center gap-3 mb-2">
              <FiActivity className="text-success animate-pulse" />
              <h3 className="font-game font-semibold text-text-primary">{activeWorkout.name}</h3>
            </div>
            <p className="text-xs text-text-muted font-game mb-4">{activeWorkout.description}</p>
            <FitnessTimer
              duration={activeWorkout.duration * 60}
              onComplete={handleComplete}
              label={activeWorkout.name}
            />
          </div>
        </motion.div>
      )}

      {/* Workout Grid */}
      {quests.length === 0 ? (
        <div className="system-window">
          <div className="system-body text-center">
            <p className="text-text-muted text-sm font-game">No fitness quests available yet. Check back later!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quests.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onStart={handleStart}
              completed={completed.includes(workout.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FitnessChallenge;