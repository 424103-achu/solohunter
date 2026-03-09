import { motion } from 'framer-motion';
import { FiCheck, FiX, FiClock, FiAlertTriangle } from 'react-icons/fi';

const STATUS_STYLE = {
  'Accepted':          'text-success border-success/25 bg-success/8',
  'Wrong Answer':      'text-danger border-danger/25 bg-danger/8',
  'Compilation Error': 'text-warning border-warning/25 bg-warning/8',
  'Runtime Error':     'text-orange-400 border-orange-400/25 bg-orange-400/8',
  'Timeout':           'text-warning border-warning/25 bg-warning/8',
  'Error':             'text-danger border-danger/25 bg-danger/8',
};

const StatusBadge = ({ status }) => (
  <span className={`text-[9px] font-system tracking-wider px-1.5 py-0.5 rounded border ${STATUS_STYLE[status] || 'text-text-muted border-dark-border'}`}>
    {status}
  </span>
);

const SubmissionResult = ({ result, onClose }) => {
  if (!result) return null;

  const { passed, testResults, xp, streak, newBadges, alreadyCompleted } = result;

  // Detect a top-level compilation / language error (all tests share same error)
  const firstResult = testResults?.results?.[0];
  const isCompileError = firstResult?.status === 'Compilation Error';
  const compileError = isCompileError ? firstResult.error : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded border p-4 ${
        passed ? 'bg-success/5 border-success/20' : 'bg-danger/5 border-danger/20'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-full ${passed ? 'bg-success/15' : 'bg-danger/15'}`}>
          {passed ? <FiCheck className="text-success" size={24} /> : <FiX className="text-danger" size={24} />}
        </div>
        <div>
          <h3 className={`text-lg font-system tracking-wider ${passed ? 'text-success' : 'text-danger'}`}>
            {passed ? 'ALL TESTS PASSED' : isCompileError ? 'COMPILATION ERROR' : 'TESTS FAILED'}
          </h3>
          <p className="text-xs text-text-muted font-game">
            {testResults?.passedTests ?? 0}/{testResults?.totalTests ?? 0} test cases passed
          </p>
        </div>
      </div>

      {/* Compilation error block */}
      {compileError && (
        <div className="mb-4 p-3 rounded border border-warning/20 bg-warning/5">
          <p className="system-tag text-[8px] mb-2 text-warning!">Compiler Output</p>
          <pre className="text-xs text-warning font-mono whitespace-pre-wrap leading-relaxed">{compileError}</pre>
        </div>
      )}

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
          🔥 Streak: <span className="text-warning font-system">{streak.currentStreak}</span> days
        </div>
      )}

      {/* New badges */}
      {newBadges && newBadges.length > 0 && (
        <div className="mb-4">
          <p className="system-tag text-[8px] mb-2">🏆 New Badges</p>
          <div className="flex gap-2 flex-wrap">
            {newBadges.map((badge) => (
              <span key={badge.id} className="px-3 py-1 bg-primary/10 text-secondary rounded border border-primary/20 text-xs font-game">
                {badge.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Per-test results (skip rendering individual cards when it's a pure compile error) */}
      {testResults?.results && !isCompileError && (
        <div className="space-y-2">
          <h4 className="system-tag text-[8px]">Test Results</h4>
          {testResults.results.map((test, i) => (
            <div
              key={i}
              className={`rounded border text-sm overflow-hidden ${
                test.passed ? 'border-success/15' : 'border-danger/15'
              }`}
            >
              {/* Row header */}
              <div className={`flex items-center gap-2 px-3 py-2 ${test.passed ? 'bg-success/5' : 'bg-danger/5'}`}>
                {test.passed
                  ? <FiCheck className="text-success shrink-0" size={13} />
                  : <FiX className="text-danger shrink-0" size={13} />
                }
                <span className="font-game font-medium text-xs flex-1">Test {i + 1}</span>
                {test.status && <StatusBadge status={test.status} />}
                {test.executionTime && (
                  <span className="text-text-muted flex items-center gap-1 font-mono text-[10px]">
                    <FiClock size={10} /> {test.executionTime.toFixed(0)}ms
                  </span>
                )}
              </div>

              {/* Detail rows — always show input; show expected/got on fail; show stderr/error always if present */}
              <div className="px-3 py-2 space-y-1.5 text-xs" style={{ background: '#0a0b14' }}>
                {/* Input */}
                {test.input != null && (
                  <div className="flex gap-2">
                    <span className="text-text-muted font-game w-16 shrink-0">Input</span>
                    <code className="font-mono text-text-primary whitespace-pre-wrap break-all">{test.input || '(empty)'}</code>
                  </div>
                )}
                {/* Expected / Got — only on fail */}
                {!test.passed && (
                  <>
                    <div className="flex gap-2">
                      <span className="text-text-muted font-game w-16 shrink-0">Expected</span>
                      <code className="font-mono text-success whitespace-pre-wrap break-all">{test.expectedOutput ?? '(empty)'}</code>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-text-muted font-game w-16 shrink-0">Got</span>
                      <code className="font-mono text-danger whitespace-pre-wrap break-all">{test.actualOutput || '(no output)'}</code>
                    </div>
                  </>
                )}
                {/* Stderr / runtime error */}
                {(test.error || test.stderr) && (
                  <div className="mt-1 flex gap-2 pt-1.5 border-t border-danger/10">
                    <FiAlertTriangle className="text-danger shrink-0 mt-0.5" size={11} />
                    <pre className="text-[10px] text-danger font-mono whitespace-pre-wrap break-all leading-relaxed">
                      {test.error || test.stderr}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SubmissionResult;
