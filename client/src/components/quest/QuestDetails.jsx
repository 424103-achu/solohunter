import { getDifficultyConfig } from '../../utils/difficultyMapper';
import { QUEST_TYPES } from '../../utils/constants';

/**
 * Parse structured quest description.
 * Format:  description text \n---EXAMPLES---\n examples \n---STARTER---\n code
 */
const parseDescription = (raw = '') => {
  const parts = { description: raw, examples: '', starter: '' };

  const exIdx = raw.indexOf('---EXAMPLES---');
  const stIdx = raw.indexOf('---STARTER---');

  if (exIdx !== -1) {
    parts.description = raw.substring(0, exIdx).trim();
    if (stIdx !== -1) {
      parts.examples = raw.substring(exIdx + 14, stIdx).trim();
      parts.starter = raw.substring(stIdx + 13).trim();
    } else {
      parts.examples = raw.substring(exIdx + 14).trim();
    }
  } else if (stIdx !== -1) {
    parts.description = raw.substring(0, stIdx).trim();
    parts.starter = raw.substring(stIdx + 13).trim();
  }

  return parts;
};

const QuestDetails = ({ quest }) => {
  if (!quest) return null;

  const diffConfig = getDifficultyConfig(quest.difficulty);
  const typeConfig = QUEST_TYPES[quest.quest_type] || QUEST_TYPES.main;
  const { description, examples, starter } = parseDescription(quest.description);

  // Groq quests store test_cases as JSON array on the quest object
  const testCases = Array.isArray(quest.test_cases)
    ? quest.test_cases
    : (quest.test_cases ? (() => { try { return JSON.parse(quest.test_cases); } catch { return []; } })() : []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{typeConfig.icon}</span>
          <span className={`text-[10px] font-system uppercase tracking-wider px-2 py-0.5 rounded ${diffConfig.bg} ${diffConfig.color} ${diffConfig.border} border`}>
            {diffConfig.label}
          </span>
          <span className="text-xs text-secondary font-mono">⭐ {quest.xp_reward} XP</span>
          {quest.skill_reward > 0 && (
            <span className="text-xs text-warning font-mono">+{quest.skill_reward} SP</span>
          )}
        </div>
        <h2 className="text-lg font-game font-bold text-text-primary">{quest.title}</h2>
        {quest.niche_name && (
          <span className="system-tag text-[8px]">{quest.niche_name}</span>
        )}
      </div>

      {/* Description */}
      <div className="p-4 rounded border border-primary/10" style={{ background: '#0c0e1a' }}>
        <h3 className="system-tag text-[8px] mb-2">Description</h3>
        <p className="text-sm text-text-primary font-game whitespace-pre-wrap leading-relaxed">{description}</p>
      </div>

      {/* Examples from description (non-Groq quests) */}
      {examples && (
        <div className="p-4 rounded border border-success/15" style={{ background: '#0a0f0c' }}>
          <h3 className="system-tag text-[8px] mb-2 text-success!">Examples</h3>
          <pre className="text-xs text-text-primary font-mono whitespace-pre-wrap leading-relaxed">{examples}</pre>
        </div>
      )}

      {/* Test Cases (Groq AI quests) */}
      {testCases.length > 0 && (
        <div className="space-y-2">
          <h3 className="system-tag text-[8px]">Test Cases</h3>
          {testCases.map((tc, i) => (
            <div key={i} className="rounded border border-primary/10 overflow-hidden" style={{ background: '#0c0e1a' }}>
              <div className="px-3 py-1.5 border-b border-primary/10 flex items-center gap-2" style={{ background: '#0a0b16' }}>
                <span className="text-[9px] font-system tracking-wider text-text-muted">Case {i + 1}</span>
                {tc.description && (
                  <span className="text-[9px] text-text-muted/60 truncate">— {tc.description}</span>
                )}
              </div>
              <div className="grid grid-cols-2 divide-x divide-primary/10">
                <div className="p-2.5">
                  <p className="text-[8px] font-system tracking-wider text-text-muted mb-1">INPUT</p>
                  <pre className="text-xs font-mono text-text-primary whitespace-pre-wrap break-all">{tc.input || '(empty)'}</pre>
                </div>
                <div className="p-2.5">
                  <p className="text-[8px] font-system tracking-wider text-success/70 mb-1">EXPECTED</p>
                  <pre className="text-xs font-mono text-success whitespace-pre-wrap break-all">{tc.expected_output || '(empty)'}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Starter Code */}
      {starter && (
        <div className="p-4 rounded border border-secondary/15" style={{ background: '#0c0e1a' }}>
          <h3 className="system-tag text-[8px] mb-2 text-secondary!">Starter Code</h3>
          <pre className="text-xs text-text-primary font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">{starter}</pre>
        </div>
      )}
    </div>
  );
};

export { parseDescription };
export default QuestDetails;
