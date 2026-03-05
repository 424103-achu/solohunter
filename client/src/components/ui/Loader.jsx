const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`${sizes[size]} border-2 border-secondary/30 border-t-secondary rounded-full animate-spin mb-4`}
           style={{ boxShadow: '0 0 12px rgba(0,212,255,0.15)' }} />
      {text && <p className="text-text-muted text-xs font-system tracking-wider uppercase">{text}</p>}
    </div>
  );
};

export default Loader;
