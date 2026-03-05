import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QuestContext } from '../context/QuestContext';
import { useAuth } from '../hooks/useAuth';
import { submitCode, runCode } from '../services/submissionService';
import { parseDescription } from '../components/quest/QuestDetails';
import CodingEditor from '../components/quest/CodingEditor';
import QuestDetails from '../components/quest/QuestDetails';
import SubmissionResult from '../components/quest/SubmissionResult';
import Timer from '../components/quest/Timer';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { FiPlay, FiSend, FiArrowLeft, FiCode } from 'react-icons/fi';

const CodingChallenge = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedQuest, fetchQuestById, loading } = useContext(QuestContext);
  const { refreshUser } = useAuth();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [runOutput, setRunOutput] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) fetchQuestById(id);
  }, [id]);

  useEffect(() => {
    if (selectedQuest) {
      // Prefer starter_code from DB, then parse from description, then default
      if (selectedQuest.starter_code) {
        setCode(selectedQuest.starter_code);
      } else if (selectedQuest.description) {
        const { starter } = parseDescription(selectedQuest.description);
        if (starter) {
          setCode(starter);
        } else {
          setCode('// Write your solution here\n');
        }
      } else {
        setCode('// Write your solution here\n');
      }
    }
  }, [selectedQuest, language]);

  const handleRun = async () => {
    try {
      setRunning(true);
      setRunOutput(null);
      setError(null);
      const output = await runCode(code, language);
      setRunOutput(output);
    } catch (err) {
      setError(err.response?.data?.message || 'Run failed');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setResult(null);
      setError(null);
      const res = await submitCode(id, code, language);
      setResult(res);
      if (res.passed) refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !selectedQuest) return <Loader text="Loading quest..." />;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Top Bar — System styled */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-primary/20"
           style={{ background: 'linear-gradient(90deg, #0c0e1a 0%, #111428 100%)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/quests')} className="text-text-muted hover:text-secondary transition-colors">
            <FiArrowLeft size={18} />
          </button>
          <div>
            <h2 className="font-game font-bold text-text-primary tracking-wide">{selectedQuest.title}</h2>
            <div className="flex items-center gap-2 text-[10px] text-text-muted">
              <span className={`uppercase font-system tracking-wider px-2 py-0.5 rounded border ${
                selectedQuest.difficulty === 'easy' ? 'bg-success/10 text-success border-success/20' :
                selectedQuest.difficulty === 'medium' ? 'bg-warning/10 text-warning border-warning/20' :
                'bg-danger/10 text-danger border-danger/20'
              }`}>
                {selectedQuest.difficulty}
              </span>
              <span className="text-secondary font-mono">+{selectedQuest.xp_reward} XP</span>
              {selectedQuest.is_boss && (
                <span className="text-danger font-system tracking-wider boss-glow px-2 py-0.5 rounded border border-danger/30 bg-danger/10">BOSS</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Timer duration={selectedQuest.is_boss ? 3600 : 1800} />
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`p-2 rounded transition-all ${
              showDetails ? 'bg-primary/15 text-secondary border border-primary/30' : 'bg-dark-surface text-text-muted border border-dark-border'
            }`}
          >
            <FiCode size={16} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Quest Details Panel */}
        {showDetails && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-primary/15 overflow-y-auto"
            style={{ background: 'linear-gradient(180deg, #0c0e1a 0%, #080a14 100%)' }}
          >
            <div className="p-4">
              <QuestDetails quest={selectedQuest} />
            </div>
          </motion.div>
        )}

        {/* Editor & Output */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 min-h-0">
            <CodingEditor code={code} language={language} onChange={setCode} onLanguageChange={setLanguage} />
          </div>

          {/* Output Area */}
          <div className="border-t border-primary/15" style={{ background: '#0c0e1a' }}>
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-primary/10">
              <Button variant="ghost" size="sm" onClick={handleRun} loading={running} disabled={running || submitting}
                      className="!text-success !border !border-success/20 hover:!bg-success/10 font-system text-[10px] tracking-wider">
                <FiPlay className="mr-1" size={12} /> RUN
              </Button>
              <Button variant="primary" size="sm" onClick={handleSubmit} loading={submitting} disabled={running || submitting}
                      className="!bg-primary/15 !border !border-primary/30 !text-secondary hover:!bg-primary/25 font-system text-[10px] tracking-wider">
                <FiSend className="mr-1" size={12} /> SUBMIT
              </Button>
              {error && <span className="text-xs text-danger flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-danger" />{error}</span>}
            </div>

            <div className="p-4 max-h-64 overflow-y-auto">
              {result ? (
                <SubmissionResult result={result} />
              ) : runOutput ? (
                <div className="bg-dark-surface/50 rounded border border-primary/10 p-3">
                  <h4 className="system-tag text-[8px] mb-2">Output</h4>
                  <pre className="text-sm text-text-primary font-mono whitespace-pre-wrap">
                    {runOutput.stdout || runOutput.output || 'No output'}
                  </pre>
                  {runOutput.stderr && (
                    <pre className="text-sm text-danger font-mono whitespace-pre-wrap mt-2">{runOutput.stderr}</pre>
                  )}
                </div>
              ) : (
                <p className="text-xs text-text-muted text-center py-4 font-game">
                  Run your code or submit to see results
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingChallenge;