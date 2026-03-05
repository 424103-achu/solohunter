import { motion } from 'framer-motion';
import { FiCheck, FiX, FiClock, FiCpu } from 'react-icons/fi';

const SubmissionResult = ({ result, onClose }) => {
  if (!result) return null;

  const { passed, testResults, xp, streak, newBadges, alreadyCompleted } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded border p-4 ${
        passed
          ? 'bg-success/5 border-success/20'
          : 'bg-danger/5 border-danger/20'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-full ${passed ? 'bg-success/15' : 'bg-danger/15'}`}>
          {passed ? <FiCheck className="text-success" size={24} /> : <FiX className="text-danger" size={24} />}
        </div>
        <div>
          <h3 className={`text-lg font-system tracking-wider ${passed ? 'text-success' : 'text-danger'}`}>
            {passed ? 'QUEST COMPLETE!' : 'QUEST FAILED'}
          </h3>
          <p className="text-xs text-text-muted font-game">
            {testResults?.passedTests}/{testResults?.totalTests} test cases passed
          </p>
        </div>
      </div>

      {/* XP gained */}
      {passed && xp && !alreadyCompleted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="mb-4 p-3 bg-secondary/5 border border-secondary/15 rounded"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <div>
              <p className="text-secondary font-system tracking-wider">+{xp.xpGained} XP EARNED!</p>
              {xp.leveledUp && (
                <p className="text-sm text-secondary animate-pulse font-game">
                  🎉 Level Up! You are now Level {xp.newLevel}!
                </p>
              )}
              {xp.rankUp && (
                <p className="text-sm neon-text-purple font-game">
                  ⬆️ Rank Up! You are now {xp.newRank}-Rank!
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {alreadyCompleted && passed && (
        <div className="mb-4 p-3 bg-dark-surface/50 border border-primary/10 rounded">
          <p className="text-xs text-text-muted font-game">Quest already completed — no XP awarded.</p>
        </div>
      )}

      {/* Streak */}
      {streak && (
        <div className="mb-4 text-sm text-text-secondary font-game">
          🔥 Streak: <span className="text-warning font-system">{streak.streakDays}</span> days
        </div>
      )}

      {/* New badges */}
      {newBadges && newBadges.length > 0 && (
        <div className="mb-4">
          <p className="system-tag text-[8px] mb-2">🏆 New Badges</p>
          <div className="flex gap-2">
            {newBadges.map((badge) => (
              <span key={badge.id} className="px-3 py-1 bg-primary/10 text-secondary rounded border border-primary/20 text-xs font-game">
                {badge.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Test Results */}
      {testResults?.results && (
        <div className="space-y-2">
          <h4 className="system-tag text-[8px]">Test Results</h4>
          {testResults.results.map((test, i) => (
            <div
              key={i}
              className={`p-3 rounded border text-sm ${
                test.passed
                  ? 'bg-success/5 border-success/10'
                  : 'bg-danger/5 border-danger/10'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {test.passed ? (
                  <FiCheck className="text-success" size={14} />
                ) : (
                  <FiX className="text-danger" size={14} />
                )}
                <span className="font-game font-medium text-xs">Test Case {i + 1}</span>
                {test.executionTime && (
                  <span className="text-text-muted flex items-center gap-1 font-mono text-[10px]">
                    <FiClock size={10} /> {test.executionTime.toFixed(0)}ms
                  </span>
                )}
              </div>
              {!test.passed && (
                <div className="mt-2 space-y-1 text-xs">
                  <div><span className="text-text-muted font-game">Expected:</span> <code className="text-success font-mono">{test.expectedOutput}</code></div>
                  <div><span className="text-text-muted font-game">Got:</span> <code className="text-danger font-mono">{test.actualOutput || 'null'}</code></div>
                  {test.stderr && <div className="text-danger font-mono mt-1 text-[10px]">{test.stderr}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SubmissionResult;
