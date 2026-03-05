import { motion } from 'framer-motion';
import { FiLock, FiCheck, FiArrowUp } from 'react-icons/fi';

const SkillNode = ({ skill, onUnlock, loading }) => {
  const { name, description, unlock_cost, unlocked, can_unlock, can_upgrade, current_level, max_level } = skill;

  const actionable = can_unlock || can_upgrade;

  const getNodeStyles = () => {
    if (unlocked && !can_upgrade) return 'bg-primary/10 border-primary/30 text-secondary shadow-[0_0_10px_rgba(0,212,255,0.08)]';
    if (actionable) return 'bg-dark-card border-secondary/30 text-text-primary hover:border-secondary/50 hover:shadow-[0_0_12px_rgba(0,212,255,0.1)] cursor-pointer';
    return 'bg-dark-card/50 border-dark-border text-text-muted opacity-50';
  };

  return (
    <motion.div
      whileHover={actionable ? { scale: 1.03 } : {}}
      whileTap={actionable ? { scale: 0.97 } : {}}
      onClick={() => actionable && onUnlock(skill)}
      className={`relative p-4 rounded border transition-all ${getNodeStyles()}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
          unlocked ? 'bg-primary/15 border-primary/30' : actionable ? 'bg-secondary/10 border-secondary/20' : 'bg-dark-surface border-dark-border'
        }`}>
          {unlocked ? (
            <FiCheck className="text-secondary" size={14} />
          ) : (
            <FiLock className="text-text-muted" size={12} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-game font-semibold text-sm">{name}</h4>
          {unlocked && max_level > 1 && (
            <div className="flex items-center gap-1 mt-0.5">
              {Array.from({ length: max_level }).map((_, i) => (
                <div key={i} className={`w-2 h-1 rounded-full ${
                  i < current_level ? 'bg-secondary' : 'bg-dark-border'
                }`} />
              ))}
              <span className="text-[9px] font-mono text-text-muted ml-1">{current_level}/{max_level}</span>
            </div>
          )}
        </div>
      </div>
      <p className="text-[11px] text-text-muted font-game mb-2 line-clamp-2">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-system tracking-wider">
          {unlocked && !can_upgrade ? (
            <span className="text-success">MAX LEVEL</span>
          ) : unlocked && can_upgrade ? (
            <span className="flex items-center gap-1 text-secondary">
              <FiArrowUp size={10} /> Upgrade: {unlock_cost} SP
            </span>
          ) : (
            <span>Cost: <span className="text-secondary font-medium">{unlock_cost} SP</span></span>
          )}
        </span>
      </div>
      {loading && (
        <div className="absolute inset-0 bg-dark/80 rounded flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </motion.div>
  );
};

export default SkillNode;
