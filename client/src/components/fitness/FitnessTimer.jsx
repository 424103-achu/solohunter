import { useTimer } from '../../hooks/useTimer';
import { FiPlay, FiPause, FiRefreshCcw } from 'react-icons/fi';

const FitnessTimer = ({ duration = 300, onComplete, label = 'Workout' }) => {
  const { timeLeft, isRunning, start, pause, reset, formatTime } = useTimer(duration, onComplete);
  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="system-window">
      <div className="system-body text-center">
        <h3 className="system-tag text-[8px] mb-4">{label}</h3>
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="56" fill="none" stroke="#1b1f3a" strokeWidth="6" />
            <circle
              cx="64" cy="64" r="56" fill="none"
              stroke="var(--color-secondary)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
              className="transition-all duration-500"
              style={{ filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.3))' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-system text-2xl text-secondary" style={{ textShadow: '0 0 8px rgba(0,212,255,0.3)' }}>{formatTime()}</span>
          </div>
        </div>
        <div className="flex justify-center gap-3">
          {!isRunning ? (
            <button onClick={start} className="p-3 bg-primary/15 rounded-full border border-primary/20 hover:bg-primary/25 transition-all">
              <FiPlay className="text-secondary" />
            </button>
          ) : (
            <button onClick={pause} className="p-3 bg-warning/15 rounded-full border border-warning/20 hover:bg-warning/25 transition-all">
              <FiPause className="text-warning" />
            </button>
          )}
          <button onClick={() => reset(duration)} className="p-3 bg-dark-surface rounded-full border border-dark-border hover:border-primary/20 transition-all">
            <FiRefreshCcw className="text-text-muted" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FitnessTimer;