import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSkillTree, unlockSkill } from '../services/skillService';
import SkillNode from '../components/skills/SkillNode';
import Loader from '../components/ui/Loader';
import { FiZap } from 'react-icons/fi';

const SkillTreePage = () => {
  const [skills, setSkills] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchTree = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSkillTree();
      setSkills(data.skills || []);
      setUserStats(data.userStats || null);
      setMessage(data.message || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load skill tree');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  const handleUnlock = async (skill) => {
    try {
      setUnlocking(skill.id);
      setError(null);
      const result = await unlockSkill(skill.id);
      setToast(`${skill.name} ${skill.unlocked ? 'upgraded' : 'unlocked'}!`);
      setTimeout(() => setToast(null), 3000);
      await fetchTree();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unlock skill');
    } finally {
      setUnlocking(null);
    }
  };

  if (loading) return <Loader text="Loading skill tree..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="system-window">
        <div className="system-header">
          <FiZap className="inline mr-2" />
          Skill Tree
        </div>
        <div className="system-body">
          <div className="flex items-center justify-between">
            <p className="text-xs text-text-muted font-game">
              Spend skill points to unlock and upgrade abilities in your niche.
            </p>
            {userStats && (
              <div className="text-right">
                <span className="text-[10px] font-system tracking-wider text-text-muted">AVAILABLE SP</span>
                <p className="text-lg font-system text-secondary" style={{ textShadow: '0 0 8px rgba(0,212,255,0.3)' }}>
                  {userStats.skillPoints}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="system-window !border-success/30"
          >
            <div className="system-body text-center">
              <p className="text-success font-game text-sm">{toast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <div className="system-window !border-danger/30">
          <div className="system-body text-center">
            <p className="text-danger font-game text-sm mb-2">{error}</p>
            <button onClick={fetchTree} className="text-secondary font-system text-xs tracking-wider hover:underline">
              RETRY
            </button>
          </div>
        </div>
      )}

      {/* No niche selected message */}
      {message && skills.length === 0 && (
        <div className="system-window">
          <div className="system-body text-center py-12">
            <FiZap className="mx-auto text-3xl text-text-muted mb-4" />
            <p className="text-text-muted font-game text-sm">{message}</p>
            <p className="text-text-muted/60 font-game text-xs mt-2">Choose a niche from your Profile to unlock skill paths.</p>
          </div>
        </div>
      )}

      {/* Skill Grid grouped by cost tier */}
      {skills.length > 0 && (
        <SkillGrid skills={skills} onUnlock={handleUnlock} unlocking={unlocking} />
      )}
    </div>
  );
};

/** Group skills by unlock_cost tier and render */
const SkillGrid = ({ skills, onUnlock, unlocking }) => {
  const grouped = skills.reduce((acc, skill) => {
    const tier = skill.unlock_cost || 0;
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(skill);
    return acc;
  }, {});

  const tiers = Object.keys(grouped).sort((a, b) => a - b);

  return (
    <div className="space-y-8">
      {tiers.map((tier, tierIndex) => (
        <motion.div
          key={tier}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: tierIndex * 0.1 }}
        >
          <h3 className="system-tag text-[8px] mb-3">
            Tier {tierIndex + 1} — {tier} SP to unlock
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped[tier].map((skill) => (
              <SkillNode
                key={skill.id}
                skill={skill}
                onUnlock={onUnlock}
                loading={unlocking === skill.id}
              />
            ))}
          </div>
          {tierIndex < tiers.length - 1 && (
            <div className="flex justify-center mt-4">
              <div className="w-px h-8 bg-gradient-to-b from-primary/30 to-transparent" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default SkillTreePage;
