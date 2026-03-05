import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLeaderboard } from '../services/statsService';
import { getRankColor } from '../utils/rankUtils';
import Loader from '../components/ui/Loader';
import { FiTrendingUp, FiZap, FiAward } from 'react-icons/fi';

const SORT_OPTIONS = [
  { id: 'xp', label: 'Total XP', icon: FiZap },
  { id: 'level', label: 'Level', icon: FiTrendingUp },
  { id: 'streak', label: 'Streak', icon: FiAward },
];

const Leaderboard = () => {
  const [hunters, setHunters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('xp');

  const fetchLeaderboard = async (sort) => {
    try {
      setLoading(true);
      const data = await getLeaderboard(sort);
      setHunters(data.leaderboard || data || []);
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(sortBy);
  }, [sortBy]);

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="space-y-6">
      <div className="system-window">
        <div className="system-header">Hunter Rankings</div>
        <div className="system-body">
          <p className="text-xs text-text-muted font-game">Top hunters registered in the system</p>
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2">
        {SORT_OPTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSortBy(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-system uppercase tracking-wider transition-all ${
              sortBy === id
                ? 'bg-primary/15 text-secondary border border-primary/30 shadow-[0_0_10px_rgba(0,212,255,0.1)]'
                : 'bg-dark-surface text-text-muted border border-dark-border hover:border-primary/20'
            }`}
          >
            <Icon size={12} /> {label}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <Loader text="Loading rankings..." />
      ) : (
        <div className="system-window">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/15 text-[10px] font-system text-text-muted uppercase tracking-widest">
                <th className="px-4 py-3 text-left w-16">Rank</th>
                <th className="px-4 py-3 text-left">Hunter</th>
                <th className="px-4 py-3 text-center">Grade</th>
                <th className="px-4 py-3 text-center">Level</th>
                <th className="px-4 py-3 text-right">XP</th>
                <th className="px-4 py-3 text-right">Streak</th>
              </tr>
            </thead>
            <tbody>
              {hunters.map((hunter, i) => (
                <motion.tr
                  key={hunter.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`border-b border-primary/5 hover:bg-primary/5 transition-colors ${
                    i < 3 ? 'bg-primary/[0.03]' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className={`${i < 3 ? 'text-xl' : 'text-text-muted text-sm font-mono'}`}>
                      {getMedal(i)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-game font-semibold text-text-primary">{hunter.username}</p>
                      <p className="text-[10px] text-text-muted font-game">{hunter.niche_name || 'No Niche'}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className="font-system text-xs px-2 py-1 rounded border border-primary/10"
                      style={{ color: getRankColor(hunter.rank || 'E'), textShadow: `0 0 6px ${getRankColor(hunter.rank || 'E')}40` }}
                    >
                      {hunter.rank || 'E'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="stat-value text-sm">{hunter.level || 1}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-secondary font-mono text-sm">{(hunter.xp || 0).toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-warning font-game">
                      {hunter.current_streak || 0} 🔥
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {hunters.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-muted font-game">No hunters ranked yet. Be the first!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;