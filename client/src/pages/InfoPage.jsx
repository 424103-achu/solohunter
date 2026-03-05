import { motion } from 'framer-motion';
import { FiZap, FiTrendingUp, FiAward, FiTarget, FiActivity, FiStar, FiShield, FiBook, FiCpu, FiWind } from 'react-icons/fi';
import { RANK_THRESHOLDS, getRankColor } from '../utils/rankUtils';

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
});

/* ── XP table for levels 1-10 ── */
const xpTable = Array.from({ length: 10 }, (_, i) => {
  const lvl = i + 1;
  return { level: lvl, xpRequired: Math.floor(50 * lvl * 1.2) };
});

const Section = ({ icon: Icon, title, tag, children, delay = 0 }) => (
  <motion.div {...fadeIn(delay)} className="system-window">
    <div className="system-header flex items-center gap-2">
      <Icon size={14} className="text-secondary" />
      <span>{title}</span>
      {tag && <span className="ml-auto system-tag text-[8px]">{tag}</span>}
    </div>
    <div className="system-body space-y-3 text-sm font-game text-text-secondary leading-relaxed">
      {children}
    </div>
  </motion.div>
);

const InfoPage = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <motion.div {...fadeIn(0)} className="system-window">
        <div className="system-header">
          <FiBook className="inline mr-2" size={14} />
          System Guide
        </div>
        <div className="system-body">
          <p className="text-xs text-text-muted font-game">
            A complete breakdown of how the Solo Hunter system works — XP, levels, ranks, skill points, streaks, and quests.
          </p>
        </div>
      </motion.div>

      {/* ── XP & Leveling ── */}
      <Section icon={FiZap} title="XP & Leveling" tag="CORE" delay={0.05}>
        <p>
          Complete quests to earn <span className="text-secondary">XP (Experience Points)</span>. 
          When your XP reaches the required threshold, you <span className="text-warning">level up</span> automatically.
        </p>
        <div className="p-3 border border-primary/10 rounded bg-primary/5">
          <p className="system-tag text-[8px] mb-2">XP Formula</p>
          <p className="text-secondary font-mono text-xs">
            XP needed = 50 × Level × 1.2
          </p>
          <p className="text-[10px] text-text-muted mt-1">
            Excess XP carries over to the next level. You can level up multiple times from a single quest.
          </p>
        </div>

        {/* XP Table */}
        <div className="overflow-hidden rounded border border-primary/10">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-primary/15 text-[10px] font-system text-text-muted uppercase tracking-widest bg-primary/5">
                <th className="px-3 py-2 text-left">Level</th>
                <th className="px-3 py-2 text-right">XP Required</th>
                <th className="px-3 py-2 text-left">Level</th>
                <th className="px-3 py-2 text-right">XP Required</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4].map((i) => (
                <tr key={i} className="border-b border-primary/5 hover:bg-primary/5">
                  <td className="px-3 py-1.5 text-text-primary">{xpTable[i].level}</td>
                  <td className="px-3 py-1.5 text-right text-secondary font-mono">{xpTable[i].xpRequired}</td>
                  <td className="px-3 py-1.5 text-text-primary">{xpTable[i + 5].level}</td>
                  <td className="px-3 py-1.5 text-right text-secondary font-mono">{xpTable[i + 5].xpRequired}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── XP Bonuses ── */}
      <Section icon={FiStar} title="XP Bonuses" tag="MULTIPLIER" delay={0.1}>
        <p>Your base XP reward from a quest can be boosted by multipliers:</p>
        <div className="space-y-2">
          <div className="flex items-start gap-3 p-2 border border-primary/10 rounded bg-primary/5">
            <FiActivity size={16} className="text-warning mt-0.5 shrink-0" />
            <div>
              <p className="text-text-primary font-semibold text-xs">Streak Bonus</p>
              <p className="text-[11px] text-text-muted">
                <span className="text-warning">+5%</span> per consecutive active day, up to a max of <span className="text-warning">+50%</span> (10-day streak).
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-2 border border-primary/10 rounded bg-primary/5">
            <FiTarget size={16} className="text-neon-purple mt-0.5 shrink-0" />
            <div>
              <p className="text-text-primary font-semibold text-xs">Niche Match Bonus</p>
              <p className="text-[11px] text-text-muted">
                <span className="text-neon-purple">+20%</span> XP when completing a quest that matches your chosen specialization.
              </p>
            </div>
          </div>
        </div>
        <div className="p-3 border border-primary/10 rounded bg-primary/5">
          <p className="system-tag text-[8px] mb-1">Example</p>
          <p className="text-[11px] text-text-muted">
            A quest giving <span className="text-secondary">30 base XP</span> with a 5-day streak (+25%) and niche match (+20%) → 
            <span className="text-secondary font-mono"> 30 × 1.45 = 43 XP</span>
          </p>
        </div>
      </Section>

      {/* ── Hunter Ranks ── */}
      <Section icon={FiAward} title="Hunter Ranks" tag="RANK" delay={0.15}>
        <p>
          Ranks are determined by your <span className="text-secondary">level</span>. As you level up, your rank automatically promotes.
        </p>
        <div className="overflow-hidden rounded border border-primary/10">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-primary/15 text-[10px] font-system text-text-muted uppercase tracking-widest bg-primary/5">
                <th className="px-3 py-2 text-left">Rank</th>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-center">Level Range</th>
              </tr>
            </thead>
            <tbody>
              {[...RANK_THRESHOLDS].reverse().map((r, i, arr) => {
                const next = arr[i + 1];
                const rangeStr = next
                  ? `${r.minLevel} – ${next.minLevel - 1}`
                  : `${r.minLevel}+`;
                return (
                  <tr key={r.rank} className="border-b border-primary/5 hover:bg-primary/5">
                    <td className="px-3 py-2">
                      <span
                        className="font-system text-sm font-bold px-2 py-0.5 rounded border border-primary/10"
                        style={{ color: r.color, textShadow: `0 0 8px ${r.color}40` }}
                      >
                        {r.rank}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-text-primary">{r.title}</td>
                    <td className="px-3 py-2 text-center font-mono text-text-muted">{rangeStr}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── Skill Points ── */}
      <Section icon={FiTarget} title="Skill Points" tag="SP" delay={0.2}>
        <p>Skill Points let you upgrade your abilities in the <span className="text-secondary">Skill Tree</span>.</p>
        <div className="space-y-2">
          <div className="p-2 border border-primary/10 rounded bg-primary/5 flex items-center gap-3">
            <FiTrendingUp className="text-secondary shrink-0" />
            <p className="text-[11px] text-text-muted">
              <span className="text-secondary font-semibold">+3 SP</span> every time you level up.
            </p>
          </div>
          <div className="p-2 border border-primary/10 rounded bg-primary/5 flex items-center gap-3">
            <FiActivity className="text-warning shrink-0" />
            <p className="text-[11px] text-text-muted">
              <span className="text-warning font-semibold">+1 SP bonus</span> every 7-day streak milestone (day 7, 14, 21…).
            </p>
          </div>
        </div>
        <p className="text-[10px] text-text-muted">
          Allocate points from the Dashboard or the Skill Tree page to boost your hunter stats.
        </p>
      </Section>

      {/* ── Streaks ── */}
      <Section icon={FiActivity} title="Streaks" tag="DAILY" delay={0.25}>
        <p>Stay active every day to build your <span className="text-warning">streak 🔥</span>.</p>
        <div className="space-y-2 text-[11px] text-text-muted">
          <div className="p-2 border border-primary/10 rounded bg-primary/5">
            <span className="text-text-primary font-semibold">How it works:</span> Complete at least one quest per day. Your streak increments by 1 each consecutive day.
          </div>
          <div className="p-2 border border-primary/10 rounded bg-primary/5">
            <span className="text-error font-semibold">Streak break:</span> Miss a day and your streak resets to 0. Your longest streak is always recorded.
          </div>
          <div className="p-2 border border-primary/10 rounded bg-primary/5">
            <span className="text-warning font-semibold">Streak rewards:</span>
            <ul className="list-disc ml-4 mt-1 space-y-0.5">
              <li>XP bonus: +5% per active day (caps at +50%)</li>
              <li>+1 bonus Skill Point every 7 days</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* ── Quest Types ── */}
      <Section icon={FiShield} title="Quest Types" tag="QUEST" delay={0.3}>
        <div className="space-y-2">
          <div className="p-2 border border-primary/10 rounded bg-primary/5">
            <p className="text-text-primary font-semibold text-xs mb-1">📋 Daily Quests</p>
            <p className="text-[11px] text-text-muted">
              3 quests assigned each day — <span className="text-secondary">2 coding</span> + <span className="text-success">1 fitness</span>.
              Complete them before reset to keep your streak going.
            </p>
          </div>
          <div className="p-2 border border-primary/10 rounded bg-primary/5">
            <p className="text-text-primary font-semibold text-xs mb-1">⚔️ Quest Board</p>
            <p className="text-[11px] text-text-muted">
              Browse all available coding quests. Filter by difficulty (Easy / Medium / Hard) and tackle them anytime for XP.
            </p>
          </div>
          <div className="p-2 border border-primary/10 rounded bg-primary/5">
            <p className="text-text-primary font-semibold text-xs mb-1">🏋️ Fitness Quests</p>
            <p className="text-[11px] text-text-muted">
              Physical training challenges with a built-in timer. Complete the exercise to earn XP and prove you're not just a keyboard warrior.
            </p>
          </div>
          <div className="p-2 border border-primary/10 rounded bg-primary/5">
            <p className="text-text-primary font-semibold text-xs mb-1">👹 Boss Quests</p>
            <p className="text-[11px] text-text-muted">
              Weekly hard challenges that offer large XP rewards. Defeat bosses to prove your rank.
            </p>
          </div>
        </div>
      </Section>

      {/* ── Niche / Specialization ── */}
      <Section icon={FiTarget} title="Specialization" tag="NICHE" delay={0.35}>
        <p>
          At <span className="text-secondary">Level 5</span>, you can choose a <span className="text-neon-purple">Niche</span> — your area of specialization.
        </p>
        <div className="text-[11px] text-text-muted space-y-1">
          <p>• Completing quests matching your niche gives a <span className="text-neon-purple">+20% XP bonus</span>.</p>
          <p>• Your niche is displayed on your profile and leaderboard.</p>
          <p>• Choose wisely — it defines your hunter identity.</p>
        </div>
      </Section>

      {/* ── Combat Stats ── */}
      <Section icon={FiShield} title="Combat Stats" tag="COMBAT" delay={0.4}>
        <p>
          Allocate your <span className="text-secondary">Skill Points</span> into three combat attributes from the Dashboard or Profile page.
        </p>
        <div className="space-y-2">
          <div className="flex items-start gap-3 p-2 border border-primary/10 rounded bg-primary/5">
            <FiZap size={16} className="text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-text-primary font-semibold text-xs">Strength (STR)</p>
              <p className="text-[11px] text-text-muted">
                Increases XP gain for <span className="text-red-400">hard quests</span>. Higher STR also influences the difficulty of daily quests assigned to you — pushing you toward harder challenges.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-2 border border-primary/10 rounded bg-primary/5">
            <FiCpu size={16} className="text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-text-primary font-semibold text-xs">Intelligence (INT)</p>
              <p className="text-[11px] text-text-muted">
                Unlocks <span className="text-blue-400">advanced skill tree paths</span>. Combined with STR, also affects the difficulty weighting of quests assigned to you.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-2 border border-primary/10 rounded bg-primary/5">
            <FiWind size={16} className="text-green-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-text-primary font-semibold text-xs">Agility (AGI)</p>
              <p className="text-[11px] text-text-muted">
                Increases <span className="text-green-400">XP bonus from streaks</span>. Higher AGI rewards consistent daily activity with bigger returns.
              </p>
            </div>
          </div>
        </div>
        <div className="p-3 border border-primary/10 rounded bg-primary/5">
          <p className="system-tag text-[8px] mb-2">Difficulty Scaling</p>
          <p className="text-[11px] text-text-muted">
            The system uses your <span className="text-secondary">STR + INT</span> to calculate a stat bonus that shifts your daily quest difficulty upward. 
            Formula: <span className="text-secondary font-mono">(STR + INT) / 40</span>. 
            As your stats grow, you'll see more medium and hard quests instead of easy ones.
          </p>
        </div>
        <div className="p-3 border border-primary/10 rounded bg-primary/5">
          <p className="system-tag text-[8px] mb-2">Radar Chart</p>
          <p className="text-[11px] text-text-muted">
            Your combat stats are visualized as a <span className="text-secondary">radar chart</span> on both the Dashboard and Profile pages, giving you a quick visual snapshot of your hunter's build.
          </p>
        </div>
      </Section>

      {/* ── Quick Reference ── */}
      <motion.div {...fadeIn(0.45)} className="system-window">
        <div className="system-header">
          <FiZap className="inline mr-2" size={14} />
          Quick Reference
        </div>
        <div className="system-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 border border-primary/10 rounded bg-primary/5 space-y-1">
              <p className="system-tag text-[8px]">Per Level Up</p>
              <p className="text-text-muted">+3 Skill Points</p>
              <p className="text-text-muted">Rank check & auto-promote</p>
            </div>
            <div className="p-3 border border-primary/10 rounded bg-primary/5 space-y-1">
              <p className="system-tag text-[8px]">Per 7-Day Streak</p>
              <p className="text-text-muted">+1 Bonus Skill Point</p>
              <p className="text-text-muted">XP multiplier stacks daily</p>
            </div>
            <div className="p-3 border border-primary/10 rounded bg-primary/5 space-y-1">
              <p className="system-tag text-[8px]">Niche Unlock</p>
              <p className="text-text-muted">Available at Level 5</p>
              <p className="text-text-muted">+20% XP on matching quests</p>
            </div>
            <div className="p-3 border border-primary/10 rounded bg-primary/5 space-y-1">
              <p className="system-tag text-[8px]">Daily Reset</p>
              <p className="text-text-muted">3 new quests each day</p>
              <p className="text-text-muted">2 Coding + 1 Fitness</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InfoPage;
