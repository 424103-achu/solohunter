import { useTimer } from '../../hooks/useTimer';
import { FiPlay, FiPause, FiRefreshCcw } from 'react-icons/fi';

const FitnessTimer = ({ duration = 300, onComplete, label = 'Workout', theme = 'fitness' }) => {
  const { timeLeft, isRunning, start, pause, reset, formatTime } = useTimer(duration, onComplete);
  const progress = ((duration - timeLeft) / duration) * 100;
  const isYoga = theme === 'yoga';

  const ringColor = isYoga ? 'var(--color-warning, #f59e0b)' : 'var(--color-secondary)';
  const ringGlow = isYoga ? 'drop-shadow(0 0 6px rgba(245,158,11,0.35))' : 'drop-shadow(0 0 6px rgba(0,212,255,0.3))';
  const timeTextClass = isYoga ? 'text-warning' : 'text-secondary';
  const timeShadow = isYoga ? '0 0 8px rgba(245,158,11,0.35)' : '0 0 8px rgba(0,212,255,0.3)';
  const playBtnClass = isYoga
    ? 'p-3 bg-warning/15 rounded-full border border-warning/20 hover:bg-warning/25 transition-all'
    : 'p-3 bg-primary/15 rounded-full border border-primary/20 hover:bg-primary/25 transition-all';
  const playIconClass = isYoga ? 'text-warning' : 'text-secondary';

  return (
    <div className="system-window">
      <div className="system-body text-center">
        <h3 className="system-tag text-[8px] mb-4">{label}</h3>
        <div className="relative w-36 h-36 mx-auto mb-6">
          <svg className="w-36 h-36 -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="56" fill="none" stroke="#1b1f3a" strokeWidth="6" />
            <circle
              cx="64" cy="64" r="56" fill="none"
              stroke={ringColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
              className="transition-all duration-500"
              style={{ filter: ringGlow }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <span className={`font-system text-3xl ${timeTextClass}`} style={{ textShadow: timeShadow }}>
              {formatTime()}
            </span>
            <span className="text-[9px] font-system tracking-widest text-text-muted uppercase">
              {isRunning ? 'running' : timeLeft === 0 ? 'done' : 'paused'}
            </span>
          </div>
        </div>
        <p className="text-xs text-text-muted font-game mb-4">
          {!isRunning && timeLeft === duration
            ? 'Press play to begin your session'
            : isRunning
              ? 'Timer running — stay focused!'
              : timeLeft === 0
                ? 'Session complete!'
                : 'Paused — press play to continue'}
        </p>
        <div className="flex justify-center gap-3">
          {!isRunning ? (
            <button onClick={start} className={playBtnClass} disabled={timeLeft === 0}>
              <FiPlay className={playIconClass} />
            </button>
          ) : (
            <button onClick={pause} className="p-3 bg-danger/10 rounded-full border border-danger/20 hover:bg-danger/20 transition-all">
              <FiPause className="text-danger" />
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