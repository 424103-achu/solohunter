import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestContext } from '../context/QuestContext';
import QuestCard from '../components/quest/QuestCard';
import Loader from '../components/ui/Loader';
import { FiSearch, FiFilter } from 'react-icons/fi';

const TABS = [
  { id: 'all', label: 'All Quests' },
  { id: 'daily', label: 'Daily' },
  { id: 'main', label: 'Main' },
  { id: 'special', label: 'Special' },
  { id: 'boss', label: 'Boss' },
];

const DIFFICULTIES = ['all', 'easy', 'medium', 'hard'];

const QuestPage = () => {
  const { quests, dailyQuests, bossQuests, fetchAllQuests, fetchDailyQuests, fetchBossQuests, loading } = useContext(QuestContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAllQuests();
    fetchDailyQuests();
    fetchBossQuests();
  }, []);

  const getFilteredQuests = () => {
    let list = [];
    switch (tab) {
      case 'daily': list = dailyQuests; break;
      case 'boss': list = bossQuests; break;
      case 'main': list = quests.filter((q) => q.quest_type === 'main'); break;
      case 'special': list = quests.filter((q) => q.quest_type === 'special'); break;
      default: list = quests.filter((q) => q.quest_type !== 'fitness');
    }
    if (difficulty !== 'all') list = list.filter((q) => q.difficulty === difficulty);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((q) => q.title?.toLowerCase().includes(s) || q.description?.toLowerCase().includes(s));
    }
    return list;
  };

  const filtered = getFilteredQuests();

  return (
    <div className="space-y-5">
      {/* Header — System Window */}
      <div className="system-window">
        <div className="system-header">Quest Board</div>
        <div className="system-body">
          <p className="text-xs text-text-muted font-game">Accept quests to gain XP and level up. Boss quests award special rewards.</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={14} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quests..."
            className="w-full pl-10 pr-4 py-2.5 bg-dark/80 border border-primary/15 rounded text-text-primary placeholder-text-muted/50 focus:border-primary/50 focus:outline-none transition-colors text-sm"
          />
        </div>
        <div className="flex gap-1.5">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-2 rounded text-[11px] font-system tracking-wider uppercase transition-all ${
                difficulty === d
                  ? 'bg-primary/15 text-secondary border border-primary/30'
                  : 'bg-dark-surface/50 text-text-muted border border-dark-border hover:border-primary/20'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 p-1 rounded bg-dark-surface/50 border border-dark-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded text-xs font-game font-semibold tracking-wide transition-all ${
              tab === t.id
                ? 'bg-primary/15 text-secondary border border-primary/20'
                : 'text-text-muted hover:text-text-secondary border border-transparent'
            }`}
          >
            {t.id === 'boss' && '💀 '}{t.label}
          </button>
        ))}
      </div>

      {/* Quest Grid */}
      {loading ? (
        <Loader text="Scanning available quests..." />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={tab + difficulty + search}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {filtered.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    onClick={() => navigate(`/quest/${quest.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-text-muted system-window">
                <div className="system-body">
                  <FiFilter size={28} className="mx-auto mb-3 text-primary/30" />
                  <p className="font-game text-sm">No quests found matching your filters.</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default QuestPage;