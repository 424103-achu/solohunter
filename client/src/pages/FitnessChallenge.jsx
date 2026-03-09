import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import FitnessTimer from '../components/fitness/FitnessTimer';
import WorkoutCard from '../components/fitness/WorkoutCard';
import { FiActivity, FiSun, FiArrowLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getFitnessQuests, completeFitnessQuest, getYogaQuests, completeYogaQuest } from '../services/submissionService';

const DIFFICULTY_DURATION = { easy: 5, medium: 10, hard: 20 };

const FitnessChallenge = () => {
  const { refreshUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [quests, setQuests] = useState([]);
  const [yogaQuests, setYogaQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [activeMode, setActiveMode] = useState('fitness');
  const [completed, setCompleted] = useState([]);
  const [result, setResult] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [activeTab, setActiveTab] = useState('fitness');

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [fitnessData, yogaData] = await Promise.all([getFitnessQuests(), getYogaQuests()]);
      const mapQuests = (data) => (data || []).map((q) => ({
        id: q.id,
        name: q.title,
        description: q.description,
        duration: DIFFICULTY_DURATION[q.difficulty] || 5,
        xpReward: q.xp_reward,
        skillReward: q.skill_reward,
        difficulty: q.difficulty,
      }));
      setQuests(mapQuests(fitnessData));
      setYogaQuests(mapQuests(yogaData));
    } catch (err) {
      console.error('Failed to load quests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = (workout, mode) => {
    setActiveWorkout(workout);
    setActiveMode(mode);
    setResult(null);
    setSearchParams({});
  };

  const handleTimerComplete = async () => {
    if (completing) return;
    const workout = activeWorkout || urlWorkout;
    const mode = activeWorkout ? activeMode : urlMode;
    if (!workout) return;
    setCompleting(true);
    try {
      const completeFn = mode === 'yoga' ? completeYogaQuest : completeFitnessQuest;
      const res = await completeFn(workout.id, workout.duration * 60);
      setCompleted((prev) => [...prev, workout.id]);
      setResult(res);
      if (res.success) refreshUser();
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || 'Failed to submit.' });
    } finally {
      setCompleting(false);
      setActiveWorkout(null);
    }
  };

  const handleBack = () => {
    setActiveWorkout(null);
    setResult(null);
    setSearchParams({});
  };

  // Derive workout from URL param (used when navigating from daily quests)
  const urlQuestId = searchParams.get('questId') || null;  // may be UUID or integer string
  const urlWorkout = urlQuestId && !loading
    // eslint-disable-next-line eqeqeq
    ? quests.find((q) => String(q.id) === urlQuestId) || yogaQuests.find((q) => String(q.id) === urlQuestId) || null
    : null;
  const urlMode = urlWorkout
    // eslint-disable-next-line eqeqeq
    ? (yogaQuests.some((q) => String(q.id) === urlQuestId) ? 'yoga' : 'fitness')
    : 'fitness';

  // The workout/mode to display — prefer manually started, fall back to URL-derived
  const displayWorkout = activeWorkout || urlWorkout;
  const displayMode = activeWorkout ? activeMode : urlMode;

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

  // ── TIMER SCREEN ────────────────────────────────────────────────────────────
  if (displayWorkout) {
    const isYoga = displayMode === 'yoga';
    const borderClass = isYoga ? '!border-warning/30' : '!border-success/30';
    const headerClass = isYoga ? '!bg-warning/10 !text-warning' : '!bg-success/10 !text-success';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5 max-w-xl mx-auto"
      >
        {/* Back */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors text-sm font-system"
        >
          <FiArrowLeft size={14} /> Back to Training Board
        </button>

        {/* Quest Info */}
        <div className={`system-window ${borderClass}`}>
          <div className={`system-header ${headerClass}`}>
            {isYoga ? '🧘 Yoga Session' : '🏋️ Training Session'}
          </div>
          <div className="system-body">
            <h2 className="font-game font-bold text-text-primary text-base mb-1">{displayWorkout.name}</h2>
            <p className="text-sm text-text-muted font-game leading-relaxed">{displayWorkout.description}</p>
            <div className="flex items-center gap-5 mt-3 text-xs text-text-muted">
              <span className="font-game">⏱ {displayWorkout.duration} min</span>
              <span className="font-mono">+{displayWorkout.xpReward} XP</span>
              {displayWorkout.skillReward > 0 && <span className="font-mono">+{displayWorkout.skillReward} SP</span>}
            </div>
          </div>
        </div>

        {/* Timer — hidden after completion */}
        {!result && !completing && (
          <FitnessTimer
            key={displayWorkout.id}
            duration={displayWorkout.duration * 60}
            onComplete={handleTimerComplete}
            label={displayWorkout.name}
            theme={displayMode}
          />
        )}

        {/* Submitting */}
        {completing && (
          <div className="system-window">
            <div className="system-body text-center py-6">
              <div className="animate-pulse text-secondary font-system text-sm tracking-wider">Submitting results...</div>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className={result.success ? 'system-window !border-success/40' : 'system-window !border-danger/30'}
          >
            <div className={result.success ? 'system-header !bg-success/10 !text-success' : 'system-header !bg-danger/10 !text-danger'}>
              {result.success ? '✓ Quest Complete' : '✗ Error'}
            </div>
            <div className="system-body space-y-4">
              {result.success ? (
                <>
                  <div className="flex items-center gap-3">
                    <FiCheckCircle className="text-success text-xl shrink-0" />
                    <p className="font-game text-text-primary text-sm">
                      {result.alreadyCompleted ? 'Already completed — no bonus XP this time.' : 'Excellent work, Hunter!'}
                    </p>
                  </div>
                  {!result.alreadyCompleted && result.xp && (
                    <div className="flex gap-6">
                      <div>
                        <p className="text-text-muted text-[10px] font-system tracking-wider mb-0.5">XP GAINED</p>
                        <p className="font-mono text-secondary text-2xl">+{result.xp.xpGained}</p>
                      </div>
                      {result.xp.leveledUp && (
                        <div>
                          <p className="text-text-muted text-[10px] font-system tracking-wider mb-0.5">NEW LEVEL</p>
                          <p className="font-mono text-warning text-2xl animate-pulse">Lv.{result.xp.newLevel} ↑</p>
                        </div>
                      )}
                      {displayWorkout.skillReward > 0 && (
                        <div>
                          <p className="text-text-muted text-[10px] font-system tracking-wider mb-0.5">SKILL PTS</p>
                          <p className="font-mono text-warning text-2xl">+{displayWorkout.skillReward}</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <FiAlertCircle className="text-danger text-xl shrink-0" />
                  <p className="text-danger text-sm font-game">{result.message}</p>
                </div>
              )}
              <button
                onClick={handleBack}
                className="w-full py-2.5 rounded border text-xs font-system tracking-wider uppercase transition-all bg-primary/10 text-secondary border-primary/20 hover:bg-primary/20"
              >
                Return to Training Board
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  }

  // ── QUEST GRID ───────────────────────────────────────────────────────────────
  const currentQuests = activeTab === 'yoga' ? yogaQuests : quests;
  const emptyMsg = activeTab === 'yoga' ? 'No yoga quests available yet.' : 'No fitness quests available yet.';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="system-window">
        <div className="system-header">{activeTab === 'yoga' ? '🧘 Yoga & Pranayama' : '🏋️ Physical Training'}</div>
        <div className="system-body">
          <p className="text-xs text-text-muted font-game">
            {activeTab === 'yoga'
              ? 'Ancient Indian yoga techniques — pranayama, asanas, and meditation. Still the body, breathe with purpose, and claim your XP.'
              : 'Train your body alongside your mind. Complete workouts to earn XP and skill points. Start the timer, do the exercise, and claim your reward when done.'}
          </p>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('fitness')}
          className={`flex items-center gap-2 px-4 py-2 rounded border text-xs font-system tracking-wider uppercase transition-all ${
            activeTab === 'fitness'
              ? 'bg-primary/15 text-secondary border-primary/40'
              : 'bg-dark-surface text-text-muted border-dark-border hover:border-primary/20'
          }`}
        >
          <FiActivity size={13} /> Physical Training
        </button>
        <button
          onClick={() => setActiveTab('yoga')}
          className={`flex items-center gap-2 px-4 py-2 rounded border text-xs font-system tracking-wider uppercase transition-all ${
            activeTab === 'yoga'
              ? 'bg-warning/10 text-warning border-warning/40'
              : 'bg-dark-surface text-text-muted border-dark-border hover:border-warning/20'
          }`}
        >
          <FiSun size={13} /> Yoga
        </button>
      </div>

      {/* Quest Grid */}
      {currentQuests.length === 0 ? (
        <div className="system-window">
          <div className="system-body text-center">
            <p className="text-text-muted text-sm font-game">{emptyMsg}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentQuests.map((workout) => (
            <WorkoutCard
              key={workout.id ?? workout.name}
              workout={workout}
              onStart={(w) => handleStart(w, activeTab)}
              completed={completed.includes(workout.id)}
              theme={activeTab}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FitnessChallenge;