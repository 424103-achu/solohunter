import { motion } from 'framer-motion';
import { FiZap, FiClock, FiCheck, FiStar } from 'react-icons/fi';

const DIFFICULTY_COLORS = {
  easy: 'text-success',
  medium: 'text-warning',
  hard: 'text-danger',
};

const WorkoutCard = ({ workout, onStart, completed = false, theme = 'fitness' }) => {
  const { name, description, duration, xpReward, skillReward, difficulty } = workout || {};
  const isYoga = theme === 'yoga';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => !completed && onStart?.(workout)}
      className={`rounded border p-4 transition-all ${
        completed
          ? 'bg-success/5 border-success/15 opacity-60 cursor-default'
          : isYoga
            ? 'bg-warning/5 border-warning/15 hover:border-warning/30 hover:shadow-[0_0_12px_rgba(251,191,36,0.08)] cursor-pointer'
            : 'glow-card cursor-pointer'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-game font-semibold text-text-primary text-sm">{name || 'Workout'}</h4>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase font-system tracking-wider ${DIFFICULTY_COLORS[difficulty] || 'text-text-muted'}`}>
            {difficulty}
          </span>
          {completed && <FiCheck className="text-success" />}
        </div>
      </div>
      <p className="text-xs text-text-muted font-game mb-3 line-clamp-3">{description}</p>
      <div className="flex items-center gap-4 text-xs text-text-muted mb-4">
        <span className="flex items-center gap-1 font-game"><FiClock size={12} /> {duration || 5} min</span>
        <span className={`flex items-center gap-1 font-mono`}><FiZap className={isYoga ? 'text-warning' : 'text-secondary'} size={12} /> +{xpReward || 10} XP</span>
        {skillReward > 0 && (
          <span className="flex items-center gap-1 font-mono"><FiStar className="text-warning" size={12} /> +{skillReward} SP</span>
        )}
      </div>
      {!completed && (
        <button
          onClick={() => onStart?.(workout)}
          className={`w-full py-2 rounded border text-xs font-system tracking-wider uppercase transition-all ${
            isYoga
              ? 'bg-warning/10 text-warning border-warning/25 hover:bg-warning/20 hover:shadow-[0_0_10px_rgba(251,191,36,0.15)]'
              : 'bg-primary/10 text-secondary border-primary/20 hover:bg-primary/20 hover:shadow-[0_0_10px_rgba(0,212,255,0.1)]'
          }`}
        >
          {isYoga ? 'Begin Session' : 'Start Training'}
        </button>
      )}
    </motion.div>
  );
};

export default WorkoutCard;