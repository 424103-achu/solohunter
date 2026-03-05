import { motion } from 'framer-motion';
import { getRankColor, getRankTitle } from '../../utils/rankUtils';

const RankBadge = ({ rank = 'E', level = 1, size = 'md' }) => {
  const color = getRankColor(rank);
  const title = getRankTitle(rank);

  const sizes = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-16 h-16 text-xl',
    lg: 'w-24 h-24 text-3xl',
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="flex flex-col items-center gap-2"
    >
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center font-system tracking-wider border-2 relative`}
        style={{ 
          borderColor: color, 
          color: color, 
          boxShadow: `0 0 20px ${color}33, 0 0 40px ${color}11, inset 0 0 15px ${color}10`,
          background: `radial-gradient(circle, ${color}12 0%, transparent 70%)`,
          textShadow: `0 0 10px ${color}60`,
        }}
      >
        {rank}
        {(rank === 'S' || rank === 'A') && (
          <motion.div
            animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: `0 0 25px ${color}50` }}
          />
        )}
      </div>
      <div className="text-center">
        <p className="text-[10px] font-system tracking-widest uppercase" style={{ color, textShadow: `0 0 6px ${color}40` }}>{rank}-Rank</p>
        <p className="text-[10px] text-text-muted font-game">{title}</p>
      </div>
    </motion.div>
  );
};

export default RankBadge;
