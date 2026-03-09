import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestContext } from '../context/QuestContext';
import { useAuth } from '../hooks/useAuth';
import { submitCode, checkCode, getQuestStatus } from '../services/submissionService';
import { parseDescription } from '../components/quest/QuestDetails';
import CodingEditor from '../components/quest/CodingEditor';
import QuestDetails from '../components/quest/QuestDetails';
import SubmissionResult from '../components/quest/SubmissionResult';
import Timer from '../components/quest/Timer';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { FiPlay, FiSend, FiArrowLeft, FiCode, FiRefreshCw, FiCheck } from 'react-icons/fi';

// Language-specific boilerplate used when a quest has no per-language starter
const DEFAULT_STARTER = {
  python: `import sys
input = sys.stdin.readline

def solve():
    # Write your solution here
    pass

solve()
`,
  java: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Write your solution here
    }
}
`,
};

const CodingChallenge = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedQuest, fetchQuestById, loading } = useContext(QuestContext);
  const { refreshUser } = useAuth();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [starterCodes, setStarterCodes] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);      // final submit result (with XP)
  const [checkResult, setCheckResult] = useState(null); // run/check result (no XP)
  const [showDetails, setShowDetails] = useState(true);
  const [error, setError] = useState(null);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  useEffect(() => {
    if (id) fetchQuestById(id);
  }, [id]);

  // Reset all transient state immediately when navigating to a (different) quest URL
  useEffect(() => {
    setCode('');
    setStarterCodes({});
    setLanguage('python');
    setCheckResult(null);
    setResult(null);
    setError(null);
    setAlreadyCompleted(false);
  }, [id]);

  // Set starter code once the correct quest has loaded for the current URL id
  useEffect(() => {
    if (!selectedQuest || String(selectedQuest.id) !== String(id)) return;

    const defaultLang = 'python';
    setLanguage(defaultLang);

    // 1. Try to parse starter_codes JSON map (Groq AI quests: { python: '...', java: '...' })
    let codesMap = {};
    if (selectedQuest.starter_code) {
      try {
        const parsed = JSON.parse(selectedQuest.starter_code);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          codesMap = parsed;
        }
      } catch { /* plain string */ }
    }

    // 2. For quests with only a plain starter_code string, detect the language and slot it in;
    //    fill the other slot with the default boilerplate so switching always works.
    if (Object.keys(codesMap).length === 0) {
      const plain = selectedQuest.starter_code
        || (selectedQuest.description ? parseDescription(selectedQuest.description).starter : '')
        || '';
      const isJava = /public\s+class\s+Main/.test(plain);
      const isPython = /def\s+\w+|import\s+\w+|print\s*\(/.test(plain);
      if (isJava) {
        codesMap = { java: plain, python: DEFAULT_STARTER.python };
      } else if (isPython) {
        codesMap = { python: plain, java: DEFAULT_STARTER.java };
      } else {
        codesMap = { ...DEFAULT_STARTER };
      }
    }

    // 3. Fill any missing language slot with default boilerplate
    if (!codesMap.python) codesMap.python = DEFAULT_STARTER.python;
    if (!codesMap.java)   codesMap.java   = DEFAULT_STARTER.java;

    setStarterCodes(codesMap);
    setCode(codesMap[defaultLang]);
  }, [id, selectedQuest?.id]);

  // Check if already completed on quest load
  useEffect(() => {
    if (!id) return;
    getQuestStatus(id).then(({ completed }) => {
      if (completed) setAlreadyCompleted(true);
    }).catch(() => {});
  }, [id]);

  const handleRun = async () => {
    try {
      setRunning(true);
      setCheckResult(null);
      setResult(null);
      setError(null);
      const res = await checkCode(id, code, language);
      setCheckResult(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Run failed');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const res = await submitCode(id, code, language);
      setResult(res);
      if (res.passed) {
        refreshUser();
        setAlreadyCompleted(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const isAiQuest = !!selectedQuest?.is_ai_generated;
  const allTestsPassed = checkResult?.passed === true;

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    // Always swap to the language-specific starter (guaranteed to exist after quest load)
    setCode(starterCodes[lang] || DEFAULT_STARTER[lang] || '');
    setCheckResult(null);
    setResult(null);
    setError(null);
  };

  if (loading || !selectedQuest) return <Loader text="Loading quest..." />;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b border-primary/20 shrink-0"
        style={{ background: 'linear-gradient(90deg, #08091a 0%, #0e1022 100%)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate('/quests')}
            className="text-text-muted hover:text-secondary transition-colors shrink-0"
          >
            <FiArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h2 className="font-game font-bold text-text-primary tracking-wide truncate">
              {selectedQuest.title}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] uppercase font-system tracking-wider px-2 py-0.5 rounded border ${
                selectedQuest.difficulty === 'easy'   ? 'bg-success/10 text-success border-success/20' :
                selectedQuest.difficulty === 'medium' ? 'bg-warning/10 text-warning border-warning/20' :
                                                        'bg-danger/10 text-danger border-danger/20'
              }`}>
                {selectedQuest.difficulty}
              </span>
              <span className="text-[10px] text-secondary font-mono">+{selectedQuest.xp_reward} XP</span>
              {isAiQuest && (
                <span className="text-[10px] font-system tracking-wider px-2 py-0.5 rounded border border-primary/25 bg-primary/10 text-primary-light">
                  AI · {selectedQuest.language?.toUpperCase()}
                </span>
              )}
              {alreadyCompleted && (
                <span className="text-[10px] font-system tracking-wider px-2 py-0.5 rounded border border-success/40 bg-success/10 text-success flex items-center gap-1">
                  <FiCheck size={9} /> COMPLETED
                </span>
              )}
              {selectedQuest.is_boss && (
                <span className="text-[10px] text-danger font-system tracking-wider boss-glow px-2 py-0.5 rounded border border-danger/30 bg-danger/10">BOSS</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Timer duration={selectedQuest.is_boss ? 3600 : 1800} />
          <button
            onClick={() => setShowDetails(!showDetails)}
            title={showDetails ? 'Hide problem' : 'Show problem'}
            className={`p-2 rounded transition-all ${
              showDetails
                ? 'bg-primary/15 text-secondary border border-primary/30'
                : 'bg-dark-surface text-text-muted border border-dark-border'
            }`}
          >
            <FiCode size={16} />
          </button>
        </div>
      </div>

      {/* Main split layout — two independent side-by-side panels */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT: Problem panel — shown/hidden independently */}
        {showDetails && (
          <div
            className="w-[380px] shrink-0 flex flex-col border-r border-primary/15 overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #0a0c1a 0%, #080912 100%)' }}
          >
            <div className="flex-1 overflow-y-auto p-4">
              <QuestDetails quest={selectedQuest} />
            </div>
          </div>
        )}

        {/* RIGHT: Code panel — always visible, fills remaining space */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#08091a' }}>
          {/* Editor — fills available space */}
          <div className="flex-1 min-h-0">
            {Object.keys(starterCodes).length > 0 ? (
              <CodingEditor
                key={`editor-${showDetails}`}
                code={code}
                language={language}
                questId={id}
                onChange={setCode}
                onLanguageChange={handleLanguageChange}
                aiQuest={isAiQuest}
                readOnly={alreadyCompleted}
                layoutKey={showDetails}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-text-muted text-xs font-game tracking-wider">
                Loading editor…
              </div>
            )}
          </div>

          {/* Output / Action bar — fixed height */}
          <div className="border-t border-primary/15 shrink-0" style={{ background: '#08091a' }}>
            {/* Action buttons */}
            <div className="flex items-center gap-3 px-4 py-2 border-b border-primary/10 flex-wrap">
              {alreadyCompleted ? (
                <span className="text-[11px] font-system tracking-wider text-success flex items-center gap-1.5 py-1.5">
                  <FiCheck size={12} /> Quest already completed — XP awarded
                </span>
              ) : (
                <>
                  <button
                    onClick={handleRun}
                    disabled={running || submitting}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-system tracking-wider rounded border border-success/25 text-success bg-success/5 hover:bg-success/15 disabled:opacity-40 transition-colors"
                  >
                    <FiPlay size={11} />
                    {running ? 'Running…' : 'RUN ALL TESTS'}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={running || submitting || !allTestsPassed || !!result}
                    title={!allTestsPassed ? 'Run all tests first — all must pass' : 'Submit and claim XP'}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-system tracking-wider rounded border transition-all ${
                      allTestsPassed && !result
                        ? 'border-secondary/50 text-secondary bg-secondary/10 hover:bg-secondary/20 shadow-[0_0_8px_rgba(0,212,255,0.2)]'
                        : 'border-primary/15 text-text-muted bg-transparent opacity-40 cursor-not-allowed'
                    } disabled:cursor-not-allowed`}
                  >
                    <FiSend size={11} />
                    {submitting ? 'Submitting…' : 'SUBMIT'}
                  </button>
                  {checkResult && !checkResult.passed && !result && (
                    <button
                      onClick={() => { setCheckResult(null); setError(null); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-system tracking-wider rounded border border-warning/25 text-warning bg-warning/5 hover:bg-warning/15 transition-colors"
                    >
                      <FiRefreshCw size={11} /> TRY AGAIN
                    </button>
                  )}
                  {allTestsPassed && !result && (
                    <span className="text-[10px] font-system tracking-wider text-success flex items-center gap-1">
                      <FiCheck size={10} /> All tests passed — submit to claim XP!
                    </span>
                  )}
                  {error && (
                    <span className="text-xs text-danger flex items-center gap-1.5 ml-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-danger shrink-0" />
                      {error}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Output content */}
            <div className="h-48 overflow-y-auto p-3">
              <AnimatePresence mode="wait">
                {alreadyCompleted && !result ? (
                  <motion.div
                    key="completed-banner"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 px-4 py-3 rounded border border-success/30 bg-success/5"
                  >
                    <FiCheck size={16} className="text-success shrink-0" />
                    <div>
                      <p className="text-sm font-game text-success">Quest Completed</p>
                      <p className="text-xs text-text-muted mt-0.5">You have already solved this quest and earned XP.</p>
                    </div>
                  </motion.div>
                ) : result ? (
                  <motion.div key="result" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    <SubmissionResult result={result} />
                  </motion.div>
                ) : checkResult ? (
                  <motion.div key="check" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    <SubmissionResult result={checkResult} />
                  </motion.div>
                ) : (
                  <motion.p
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-text-muted text-center py-6 font-game"
                  >
                    Click “Run All Tests” to check your solution against all test cases
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CodingChallenge;