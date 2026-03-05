import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import RankBadge from '../components/stats/RankBadge';
import RadarChart from '../components/stats/RadarChart';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import SkillTree from '../components/skills/SkillTree';
import AllocatePointsModal from '../components/skills/AllocatePointsModal';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import { FiUser, FiCalendar, FiAward, FiTarget, FiStar } from 'react-icons/fi';

const TABS = ['overview', 'skills', 'badges'];

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { profile, stats, badges, niches, loading, fetchProfile, fetchStats, fetchBadges, fetchNiches, selectNiche } = useContext(UserContext);
  const [tab, setTab] = useState('overview');
  const [showAllocate, setShowAllocate] = useState(false);
  const [selectedNiche, setSelectedNiche] = useState('');
  const [nicheError, setNicheError] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchStats();
    fetchBadges();
    fetchNiches();
  }, []);

  const handleSelectNiche = async () => {
    if (!selectedNiche) return;
    try {
      setNicheError('');
      await selectNiche(selectedNiche);
      fetchProfile();
    } catch (err) {
      setNicheError(err.message || 'Failed to select niche');
    }
  };

  if (loading) return <Loader text="Loading profile..." />;

  const p = profile || user || {};
  const nextLevelXp = p.next_level_xp || Math.floor(50 * (p.level || 1) * 1.2);
  const xpPercent = nextLevelXp ? Math.floor((p.xp / nextLevelXp) * 100) : 0;
  const joined = p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Unknown';

  return (
    <div className="space-y-6">
      {/* Profile Header — System Window */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="system-window"
      >
        <div className="system-header">Player Status</div>
        <div className="system-body">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <RankBadge rank={p.rank || 'E'} level={p.level || 1} size="lg" />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-system neon-text">{p.username || 'Hunter'}</h1>
              <p className="text-text-muted text-sm mt-1 font-game">
                {p.niche_name ? `${p.niche_name} Specialist` : 'No specialization'}
              </p>
              <div className="flex flex-wrap gap-4 mt-3 justify-center md:justify-start text-xs text-text-muted font-game">
                <span className="flex items-center gap-1"><FiCalendar className="text-secondary" /> Joined {joined}</span>
                <span className="flex items-center gap-1"><FiStar className="text-warning" /> Level {p.level || 1}</span>
                <span className="flex items-center gap-1"><FiTarget className="text-danger" /> {p.current_streak || 0} day streak</span>
              </div>
              {/* XP Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-text-muted mb-1 font-game">
                  <span>XP</span>
                  <span className="font-mono text-secondary">{p.xp || 0} / {nextLevelXp}</span>
                </div>
                <ProgressBar value={xpPercent} max={100} color="primary" size="sm" />
              </div>
            </div>
            {p.skill_points > 0 && (
              <Button variant="primary" size="sm" onClick={() => setShowAllocate(true)}
                      className="!font-system !text-[10px] !tracking-wider !uppercase">
                <FiAward className="mr-1" /> Allocate {p.skill_points} Points
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Niche Selection (if not set and level >= 5) */}
      {!p.niche_id && (p.level || 1) >= 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="system-window !border-neon-purple/30"
        >
          <div className="system-header !bg-neon-purple/10 !text-neon-purple">⚡ Choose Your Specialization</div>
          <div className="system-body">
            <p className="text-sm text-text-muted mb-3 font-game">You've reached Level 5! Select a niche to unlock specialized skill trees.</p>
            <div className="flex gap-3 flex-wrap">
              {(niches || []).map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelectedNiche(n.id)}
                  className={`px-4 py-2 rounded border text-sm font-game transition-all ${
                    selectedNiche === n.id
                      ? 'bg-primary/15 border-primary/40 text-secondary shadow-[0_0_8px_rgba(0,212,255,0.15)]'
                      : 'bg-dark-surface border-dark-border text-text-muted hover:border-primary/30'
                  }`}
                >
                  {n.name}
                </button>
              ))}
            </div>
            {selectedNiche && (
              <Button variant="primary" size="sm" className="mt-3" onClick={handleSelectNiche}>
                Confirm Specialization
              </Button>
            )}
            {nicheError && <p className="text-danger text-sm mt-2">{nicheError}</p>}
          </div>
        </motion.div>
      )}

      {/* Tabs — System styled */}
      <div className="flex gap-1 p-1 rounded border border-primary/10" style={{ background: '#0c0e1a' }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded text-xs font-system uppercase tracking-widest transition-all ${
              tab === t ? 'bg-primary/15 text-secondary border border-primary/30' : 'text-text-muted hover:text-text-secondary border border-transparent'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="system-window">
            <div className="system-header">Combat Stats</div>
            <div className="system-body">
              <RadarChart stats={{
                strength: p.strength || stats?.strength || 1,
                intelligence: p.intelligence || stats?.intelligence || 1,
                agility: p.agility || stats?.agility || 1,
              }} />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="system-window">
            <div className="system-header">Hunter Stats</div>
            <div className="system-body space-y-3">
              {[
                { label: 'Total XP', value: p.xp || 0 },
                { label: 'Current Level', value: p.level || 1 },
                { label: 'Rank', value: `${p.rank || 'E'}-Rank` },
                { label: 'Streak Days', value: p.current_streak || 0 },
                { label: 'Available Points', value: p.skill_points || 0 },
                { label: 'Niche', value: p.niche_name || 'None' },
              ].map((s) => (
                <div key={s.label} className="flex justify-between text-sm py-1 border-b border-primary/5">
                  <span className="text-text-muted font-game">{s.label}</span>
                  <span className="text-secondary font-system text-xs tracking-wider">{s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {tab === 'skills' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <SkillTree />
        </motion.div>
      )}

      {tab === 'badges' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {badges && badges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {badges.map((badge) => (
                <Badge key={badge.id} badge={badge} />
              ))}
            </div>
          ) : (
            <div className="system-window">
              <div className="system-body text-center py-12">
                <FiAward size={32} className="mx-auto mb-3 text-primary/30" />
                <p className="text-text-muted font-game">No badges earned yet. Complete quests to earn badges!</p>
              </div>
            </div>
          )}
        </motion.div>
      )}

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

export default Profile;