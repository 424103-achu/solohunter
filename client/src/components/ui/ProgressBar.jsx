const ProgressBar = ({ value = 0, max = 100, color = 'primary', showLabel = true, size = 'md', className = '' }) => {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  const colors = {
    primary: 'from-primary to-secondary',
    success: 'from-green-500 to-emerald-400',
    danger: 'from-red-500 to-rose-400',
    accent: 'from-amber-500 to-yellow-400',
    rank: 'from-purple-500 to-violet-400',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs text-text-muted font-game mb-1">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div className={`w-full bg-dark-surface/60 rounded-full ${heights[size]} overflow-hidden border border-primary/5`}>
        <div
          className={`${heights[size]} bg-gradient-to-r ${colors[color]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percent}%`, boxShadow: percent > 5 ? '0 0 8px rgba(0,212,255,0.2)' : 'none' }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
