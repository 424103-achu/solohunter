import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkillPoints } from '../../hooks/useSkillPoints';
import { FiMinus, FiPlus, FiZap, FiCpu, FiWind } from 'react-icons/fi';
import Button from '../ui/Button';

const STATS = [
  { key: 'strength', label: 'Strength', icon: FiZap, color: 'text-red-400', desc: 'Increases XP gain for hard quests' },
  { key: 'intelligence', label: 'Intelligence', icon: FiCpu, color: 'text-blue-400', desc: 'Unlocks advanced skill tree paths' },
  { key: 'agility', label: 'Agility', icon: FiWind, color: 'text-green-400', desc: 'Increases XP bonus from streaks' },
];

const AllocatePointsModal = ({ isOpen, onClose, available = 0, currentStats = {}, onAllocated }) => {
  const [points, setPoints] = useState({ strength: 0, intelligence: 0, agility: 0 });
  const { allocate, allocating, error } = useSkillPoints();

  const totalAllocated = points.strength + points.intelligence + points.agility;
  const remaining = available - totalAllocated;

  const increment = (stat) => {
    if (remaining > 0) {
      setPoints((p) => ({ ...p, [stat]: p[stat] + 1 }));
    }
  };

  const decrement = (stat) => {
    if (points[stat] > 0) {
      setPoints((p) => ({ ...p, [stat]: p[stat] - 1 }));
    }
  };

  const handleAllocate = async () => {
    if (totalAllocated === 0) return;
    try {
      const result = await allocate(points.strength, points.intelligence, points.agility);
      setPoints({ strength: 0, intelligence: 0, agility: 0 });
      onAllocated?.(result);
      onClose();
    } catch {
      // Error is handled by hook
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="system-window w-full max-w-md shadow-[0_0_40px_rgba(0,212,255,0.08)]"
        >
          <div className="system-header">Allocate Stat Points</div>
          <div className="system-body">
            <p className="text-xs text-text-muted font-game mb-6">
              Available: <span className="text-secondary font-system tracking-wider">{remaining}</span> / {available} points
            </p>

            <div className="space-y-4 mb-6">
              {STATS.map(({ key, label, icon: Icon, color, desc }) => (
                <div key={key} className="flex items-center gap-4">
                  <Icon className={`${color} w-5 h-5`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-game font-medium text-text-primary">{label}</span>
                      <span className="text-[10px] text-text-muted font-mono">{currentStats[key] || 0} + {points[key]}</span>
                    </div>
                    <p className="text-[10px] text-text-muted font-game">{desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrement(key)}
                      disabled={points[key] === 0}
                      className="w-7 h-7 rounded border border-primary/15 bg-dark-surface flex items-center justify-center hover:border-primary/30 disabled:opacity-25 transition-all text-text-muted"
                    >
                      <FiMinus size={12} />
                    </button>
                    <span className="w-8 text-center font-system text-sm text-secondary">{points[key]}</span>
                    <button
                      onClick={() => increment(key)}
                      disabled={remaining === 0}
                      className="w-7 h-7 rounded border border-primary/15 bg-dark-surface flex items-center justify-center hover:border-secondary/40 disabled:opacity-25 transition-all text-text-muted"
                    >
                      <FiPlus size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {error && <p className="text-danger text-xs mb-4 font-game">{error}</p>}

            <div className="flex gap-3">
              <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
              <Button
                variant="primary"
                onClick={handleAllocate}
                loading={allocating}
                disabled={totalAllocated === 0 || allocating}
                className="flex-1"
              >
                Allocate {totalAllocated} Points
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AllocatePointsModal;
