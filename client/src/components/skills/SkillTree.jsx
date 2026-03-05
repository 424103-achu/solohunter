import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSkillTree, unlockSkill } from '../../services/skillService';
import SkillNode from './SkillNode';
import Loader from '../ui/Loader';

const SkillTree = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(null);
  const [error, setError] = useState(null);

  const fetchTree = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSkillTree();
      setSkills(data.skills || data || []);
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
      await unlockSkill(skill.id);
      await fetchTree(); // Refresh tree
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unlock skill');
    } finally {
      setUnlocking(null);
    }
  };

  if (loading) return <Loader text="Loading skill tree..." />;

  if (error) {
    return (
      <div className="system-window">
        <div className="system-body text-center py-8">
          <p className="text-danger font-game mb-4">{error}</p>
          <button onClick={fetchTree} className="text-secondary font-system text-xs tracking-wider hover:underline">
            RETRY
          </button>
        </div>
      </div>
    );
  }

  // Group skills by tier/level if they have a tier property
  const grouped = skills.reduce((acc, skill) => {
    const tier = skill.tier || skill.required_level || 0;
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(skill);
    return acc;
  }, {});

  const tiers = Object.keys(grouped).sort((a, b) => a - b);

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {tiers.map((tier, tierIndex) => (
          <motion.div
            key={tier}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: tierIndex * 0.1 }}
          >
            <h3 className="system-tag text-[8px] mb-3">
              Tier {parseInt(tier) + 1}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {grouped[tier].map((skill) => (
                <SkillNode
                  key={skill.id}
                  skill={skill}
                  onUnlock={handleUnlock}
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
      </AnimatePresence>

      {skills.length === 0 && (
        <div className="system-window">
          <div className="system-body text-center py-12">
            <p className="text-text-muted font-game">No skills available. Select a niche to unlock skill trees.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillTree;
