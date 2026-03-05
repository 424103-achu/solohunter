const Button = ({ children, variant = 'primary', size = 'md', disabled = false, loading = false, className = '', ...props }) => {
  const variants = {
    primary: 'bg-primary/15 hover:bg-primary/25 text-secondary border border-primary/30 hover:shadow-[0_0_12px_rgba(0,212,255,0.12)]',
    secondary: 'bg-dark-surface hover:bg-dark-border text-text-primary border border-dark-border hover:border-primary/20',
    danger: 'bg-danger/10 hover:bg-danger/20 text-danger border border-danger/25',
    success: 'bg-success/10 hover:bg-success/20 text-success border border-success/25',
    ghost: 'bg-transparent hover:bg-primary/5 text-text-secondary border border-transparent hover:border-primary/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`
        ${variants[variant]} ${sizes[size]}
        rounded font-game font-medium transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
