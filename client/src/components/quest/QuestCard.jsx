import { Link } from 'react-router-dom';
import { getDifficultyConfig } from '../../utils/difficultyMapper';
import { QUEST_TYPES } from '../../utils/constants';
import { FiChevronRight, FiStar, FiLock } from 'react-icons/fi';

const isFitnessQuest = (quest) =>
  quest.quest_type === 'fitness' ||
  quest.quest_type === 'yoga' ||
  /push-?ups|plank|squat|hiit|cardio|stretch|workout|pull-?up|core|yoga|pranayama/i.test(quest.title || '');

const getDescriptionPreview = (desc = '') => {
  const idx = desc.indexOf('---EXAMPLES---');
  return idx !== -1 ? desc.substring(0, idx).trim() : desc;
};

const QuestCard = ({ quest, userLevel = 1 }) => {
  const diffConfig = getDifficultyConfig(quest.difficulty);
  const typeConfig = QUEST_TYPES[quest.quest_type] || QUEST_TYPES.main;
  const locked = quest.required_level > userLevel;
  const completed = quest.already_completed || quest.completed;
  const fitness = isFitnessQuest(quest);

  const questLink = locked ? '#' : fitness ? `/fitness?questId=${quest.id}` : `/quest/${quest.id}`;

  return (
    <Link
      to={questLink}
      className={`
        block p-4 rounded border transition-all duration-200 group
        ${locked
          ? 'bg-dark-surface/20 border-dark-border cursor-not-allowed opacity-50'
          : completed
            ? 'bg-success/5 border-success/15 hover:border-success/30'
            : quest.is_boss
              ? 'bg-dark-card border-danger/20 hover:border-danger/40 boss-glow'
              : 'glow-card'
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{typeConfig.icon}</span>
            <span className={`text-[10px] font-system uppercase tracking-wider px-2 py-0.5 rounded ${diffConfig.bg} ${diffConfig.color} ${diffConfig.border} border`}>
              {diffConfig.label}
            </span>
            {quest.is_boss && (
              <span className="text-[10px] font-system tracking-wider px-2 py-0.5 rounded bg-danger/10 text-danger border border-danger/25">
                💀 BOSS
              </span>
            )}
            {completed && (
              <span className="text-[10px] font-system text-success tracking-wider">✓ CLEARED</span>
            )}
          </div>

          <h3 className="text-sm font-game font-semibold text-text-primary group-hover:text-secondary transition-colors truncate">
            {quest.title}
          </h3>

          <p className="text-xs text-text-muted mt-1 line-clamp-2 font-game">
            {getDescriptionPreview(quest.description)}
          </p>

          {fitness && (
            <span className={`inline-block mt-1 text-[10px] font-system tracking-wider px-2 py-0.5 rounded border ${
              quest.quest_type === 'yoga'
                ? 'bg-warning/10 text-warning border-warning/20'
                : 'bg-success/10 text-success border-success/20'
            }`}>
              {quest.quest_type === 'yoga' ? '🧘 YOGA' : '🏋️ FITNESS'}
            </span>
          )}

          <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
            <span className="flex items-center gap-1 font-mono">
              <FiStar className="text-secondary" /> {quest.xp_reward} XP
            </span>
            <span className={`font-game ${typeConfig.color}`}>{typeConfig.label}</span>
            {quest.niche_name && (
              <span className="font-game text-text-muted">{quest.niche_name}</span>
            )}
            {quest.required_level > 1 && (
              <span className="font-mono text-text-muted">Lv.{quest.required_level}+</span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 pt-2">
          {locked ? (
            <FiLock className="text-text-muted" size={16} />
          ) : (
            <FiChevronRight className="text-text-muted group-hover:text-secondary transition-colors" size={16} />
          )}
        </div>
      </div>
    </Link>
  );
};

export default QuestCard;
