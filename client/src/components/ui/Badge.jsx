const Badge = ({ name, icon, description, earned = false, earnedAt, className = '' }) => {
  return (
    <div
      className={`
        relative p-3 rounded border transition-all duration-200
        ${earned
          ? 'bg-primary/10 border-primary/25 hover:border-primary/40 hover:shadow-[0_0_10px_rgba(0,212,255,0.1)]'
          : 'bg-dark-surface/30 border-dark-border opacity-40 grayscale'
        }
        ${className}
      `}
      title={description}
    >
      {earned && <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />}
      <div className="text-center">
        <div className={`text-2xl mb-1 ${earned ? '' : 'opacity-30'}`}>
          {icon === 'sword' ? '⚔️' : icon === 'fire' ? '🔥' : icon === 'flame' ? '🔥' :
           icon === 'shield' ? '🛡️' : icon === 'crown' ? '👑' : icon === 'diamond' ? '💎' :
           icon === 'skull' ? '💀' : icon === 'trophy' ? '🏆' : icon === 'gem' ? '💎' :
           icon === 'century' ? '💯' : icon === 'volcano' ? '🌋' : 
           icon?.startsWith('rank-') ? `[${icon.split('-')[1].toUpperCase()}]` : '⭐'}
        </div>
        <p className="text-xs font-game font-medium text-text-primary truncate">{name}</p>
        {earned && earnedAt && (
          <p className="text-[10px] text-text-muted font-mono mt-1">
            {new Date(earnedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default Badge;
