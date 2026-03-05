import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserContext } from '../context/UserContext';
import { QuestContext } from '../context/QuestContext';
import { AuthContext } from '../context/AuthContext';
import RankBadge from '../components/stats/RankBadge';
import RadarChart from '../components/stats/RadarChart';
import ProgressBar from '../components/ui/ProgressBar';
import QuestCard from '../components/quest/QuestCard';
import AllocatePointsModal from '../components/skills/AllocatePointsModal';
import Loader from '../components/ui/Loader';
import { FiZap, FiTarget, FiTrendingUp, FiAward, FiCpu, FiWind } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { profile, stats, loading: profileLoading, fetchProfile, fetchStats } = useContext(UserContext);
  const { dailyQuests, fetchDailyQuests, quests, fetchAllQuests, loading: questLoading } = useContext(QuestContext);
  const [showAllocate, setShowAllocate] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchStats();
    fetchDailyQuests();
    fetchAllQuests();
  }, []);

  if (profileLoading) return <Loader text="Scanning Hunter data..." />;

  const p = profile || user || {};
  const nextLevelXp = p.next_level_xp || Math.floor(50 * (p.level || 1) * 1.2);
  const xpPercent = nextLevelXp ? Math.floor((p.xp / nextLevelXp) * 100) : 0;

  const statCards = [
    { label: 'Level', value: p.level || 1, icon: FiTrendingUp, glow: 'rgba(67,97,238,0.15)', border: 'border-primary/20' },
    { label: 'Streak', value: `${p.current_streak || 0}`, icon: FiZap, glow: 'rgba(251,191,36,0.1)', border: 'border-warning/20', suffix: '🔥' },
    { label: 'Rank', value: `${p.rank || 'E'}`, icon: FiAward, glow: 'rgba(177,74,237,0.1)', border: 'border-neon-purple/20' },
    { label: 'Skill Points', value: p.skill_points || 0, icon: FiTarget, glow: 'rgba(0,230,118,0.1)', border: 'border-success/20' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Status Window Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="system-window"
      >
        <div className="system-header">Player Status</div>
        <div className="system-body">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-game font-bold text-text-primary tracking-wide">
                Welcome back, <span className="neon-text">{p.username || 'Hunter'}</span>
              </h1>
              <p className="text-text-muted text-xs mt-1 font-game">
                {p.niche_name ? `${p.niche_name} Specialist` : 'No specialization yet'}
              </p>
            </div>
            <RankBadge rank={p.rank || 'E'} level={p.level || 1} size="md" />
          </div>

          {/* XP Bar */}
          <div className="mt-5">
            <div className="flex justify-between items-center mb-2">
              <span className="system-tag text-[9px]">Experience Points</span>
              <span className="font-mono text-[11px] text-text-muted">
                {p.xp || 0} / {nextLevelXp} XP
              </span>
            </div>
            <ProgressBar value={xpPercent} max={100} color="primary" size="md" showLabel={false} />
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`glow-card p-4 cursor-pointer group ${card.border}`}
            style={{ background: `linear-gradient(135deg, #0c0e1a 0%, #111428 100%)` }}
            onClick={card.label === 'Skill Points' && p.skill_points > 0 ? () => setShowAllocate(true) : undefined}
          >
            <div className="flex items-center justify-between mb-3">
              <card.icon className="text-text-muted group-hover:text-secondary transition-colors" size={16} />
              <span className="system-tag text-[7px]">{card.label}</span>
            </div>
            <p className="stat-value text-2xl text-text-primary">
              {card.value}
              {card.suffix && <span className="ml-1 text-base">{card.suffix}</span>}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Combat Stats & Daily Quests ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Radar Chart — System Window */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="system-window"
        >
          <div className="system-header">Combat Stats</div>
          <div className="system-body">
            <RadarChart stats={{
              strength: p.strength || stats?.strength || 1,
              intelligence: p.intelligence || stats?.intelligence || 1,
              agility: p.agility || stats?.agility || 1,
            }} />
            <div className="grid grid-cols-3 text-center mt-4 text-xs gap-2">
              <div className="p-2 rounded bg-red-500/5 border border-red-500/10">
                <FiZap className="mx-auto text-red-400 mb-1" size={14} />
                <p className="stat-value text-sm text-text-primary">{p.strength || stats?.strength || 1}</p>
                <p className="text-[9px] text-text-muted font-system tracking-wider">STR</p>
              </div>
              <div className="p-2 rounded bg-blue-500/5 border border-blue-500/10">
                <FiCpu className="mx-auto text-blue-400 mb-1" size={14} />
                <p className="stat-value text-sm text-text-primary">{p.intelligence || stats?.intelligence || 1}</p>
                <p className="text-[9px] text-text-muted font-system tracking-wider">INT</p>
              </div>
              <div className="p-2 rounded bg-green-500/5 border border-green-500/10">
                <FiWind className="mx-auto text-green-400 mb-1" size={14} />
                <p className="stat-value text-sm text-text-primary">{p.agility || stats?.agility || 1}</p>
                <p className="text-[9px] text-text-muted font-system tracking-wider">AGI</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Daily Quests — System Window */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 system-window"
        >
          <div className="system-header flex items-center justify-between">
            <span>Daily & Special Quests</span>
            <Link to="/quests" className="text-[10px] text-secondary hover:text-primary-light transition-colors tracking-normal normal-case font-medium">
              View All →
            </Link>
          </div>
          <div className="system-body">
            {questLoading ? (
              <Loader text="Loading quests..." />
            ) : dailyQuests.length > 0 || quests.some(q => q.quest_type === 'special') ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Daily quests */}
                {dailyQuests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} compact />
                ))}
                {/* Special quests */}
                {quests.filter(q => q.quest_type === 'special').map((quest) => (
                  <QuestCard key={quest.id} quest={quest} compact />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-text-muted">
                <p className="font-game text-sm">No daily or special quests available. Check back tomorrow!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Allocate Points Modal */}
      <AllocatePointsModal
        isOpen={showAllocate}
        onClose={() => setShowAllocate(false)}
        available={p.skill_points || 0}
        currentStats={{
          strength: p.strength || stats?.strength || 1,
          intelligence: p.intelligence || stats?.intelligence || 1,
          agility: p.agility || stats?.agility || 1,
        }}
        onAllocated={() => {
          fetchProfile();
          fetchStats();
        }}
      />
    </div>
  );
};

export default Dashboard;