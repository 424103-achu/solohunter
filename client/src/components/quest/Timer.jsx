import { useTimer } from '../../hooks/useTimer';
import { FiClock, FiPlay, FiPause, FiRefreshCcw } from 'react-icons/fi';

const Timer = ({ duration = 1800, onTimeUp, autoStart = false }) => {
  const { timeLeft, isRunning, start, pause, reset, formatTime } = useTimer(duration, onTimeUp);

  const percentage = (timeLeft / duration) * 100;
  const isWarning = percentage <= 25;
  const isCritical = percentage <= 10;

  return (
    <div className={`flex items-center gap-3 px-3 py-1.5 rounded border ${
      isCritical ? 'bg-danger/10 border-danger/25' :
      isWarning ? 'bg-warning/10 border-warning/25' :
      'bg-dark-surface/50 border-primary/15'
    }`}>
      <FiClock className={`${
        isCritical ? 'text-danger animate-pulse' :
        isWarning ? 'text-warning' :
        'text-secondary/60'
      }`} size={14} />
      <span className={`font-system text-sm tracking-wider ${
        isCritical ? 'text-danger' :
        isWarning ? 'text-warning' :
        'text-secondary'
      }`}>
        {formatTime()}
      </span>
      <div className="flex gap-1">
        {!isRunning ? (
          <button onClick={start} className="p-1 text-text-muted hover:text-success transition-colors" title="Start">
            <FiPlay size={14} />
          </button>
        ) : (
          <button onClick={pause} className="p-1 text-text-muted hover:text-warning transition-colors" title="Pause">
            <FiPause size={14} />
          </button>
        )}
        <button onClick={() => reset(duration)} className="p-1 text-text-muted hover:text-secondary transition-colors" title="Reset">
          <FiRefreshCcw size={14} />
        </button>
      </div>
    </div>
  );
};

export default Timer;
