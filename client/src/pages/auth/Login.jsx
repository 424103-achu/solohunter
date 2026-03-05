import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { FiMail, FiLock, FiLogIn, FiChevronRight } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('All fields are required');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark bg-grid px-4 py-8 relative overflow-hidden">
      {/* Layered background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Central gate glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]"
             style={{ background: 'radial-gradient(circle, rgba(67,97,238,0.1) 0%, rgba(0,212,255,0.03) 40%, transparent 70%)' }} />
        {/* Vertical light beam */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full opacity-[0.06]"
             style={{ background: 'linear-gradient(180deg, transparent, #00d4ff, transparent)' }} />
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
               style={{
                 width: `${1 + (i % 3)}px`,
                 height: `${1 + (i % 3)}px`,
                 background: i % 2 === 0 ? 'rgba(0,212,255,0.4)' : 'rgba(67,97,238,0.35)',
                 left: `${5 + i * 8}%`,
                 top: `${10 + (i % 5) * 18}%`,
                 animation: `particle-float ${3 + i * 0.5}s ease-in-out infinite`,
                 animationDelay: `${i * 0.25}s`,
               }} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        {/* Gate Emblem */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
            className="relative w-24 h-24 mx-auto mb-5"
          >
            {/* Outer ring */}
            <div className="absolute inset-0 rounded border border-primary/20 animate-[glow-border_4s_ease-in-out_infinite]"
                 style={{ boxShadow: '0 0 25px rgba(67,97,238,0.15)' }} />
            {/* Inner ring */}
            <div className="absolute inset-2 rounded border border-secondary/15" />
            {/* Core */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-system text-2xl text-secondary font-bold tracking-wider"
                    style={{ textShadow: '0 0 20px rgba(0,212,255,0.5), 0 0 40px rgba(0,212,255,0.2)' }}>
                SH
              </span>
            </div>
            {/* Radial background */}
            <div className="absolute inset-0 rounded"
                 style={{ background: 'radial-gradient(circle, rgba(67,97,238,0.12) 0%, transparent 70%)' }} />
          </motion.div>

          <h1 className="font-system text-2xl tracking-[5px] uppercase text-text-primary mb-2">
            Solo <span className="neon-text">Hunter</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-primary/30" />
            <p className="system-tag text-[9px] tracking-[3px]">SYSTEM ACCESS REQUIRED</p>
            <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-primary/30" />
          </div>
        </div>

        {/* Login Form — Auth Window */}
        <form onSubmit={handleSubmit} className="auth-window auth-scan rounded-sm relative">
          {/* Header bar */}
          <div className="px-6 py-4 border-b border-primary/15 flex items-center justify-between relative z-[1]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <span className="font-system text-[10px] tracking-[3px] uppercase text-secondary/80">
                Hunter Authentication
              </span>
            </div>
            <span className="font-system text-[8px] text-text-muted/40 tracking-wider">v2.1</span>
          </div>

          {/* HUD decorative line */}
          <div className="hud-line" />

          <div className="px-8 py-7 space-y-7 relative z-[1]">
            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-danger/8 border-l-2 border-danger/60 text-danger text-xs flex items-center gap-2 font-game"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" />
                {error}
              </motion.div>
            )}

            {/* Email Input */}
            <div>
              <label className="flex items-center gap-2 mb-3">
                <FiChevronRight className="text-secondary/50" size={10} />
                <span className="text-[10px] font-system tracking-[2px] uppercase text-text-muted/70">Email</span>
              </label>
              <div className="sys-input-wrap">
                <span className="corner-bl" /><span className="corner-br" />
                <div className="relative flex items-center">
                  <FiMail className="absolute left-4 text-primary/40 pointer-events-none z-[1]" size={15} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hunter@example.com"
                    className="sys-input text-center"
                  />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="flex items-center gap-2 mb-3">
                <FiChevronRight className="text-secondary/50" size={10} />
                <span className="text-[10px] font-system tracking-[2px] uppercase text-text-muted/70">Password</span>
              </label>
              <div className="sys-input-wrap">
                <span className="corner-bl" /><span className="corner-br" />
                <div className="relative flex items-center">
                  <FiLock className="absolute left-4 text-primary/40 pointer-events-none z-[1]" size={15} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="sys-input text-center"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hud-line my-5" />

            {/* Gate Button */}
            <button
              type="submit"
              disabled={loading}
              className="gate-btn w-full py-4 rounded-sm bg-primary/12 border border-primary/30 text-secondary font-system text-xs tracking-[3px] uppercase flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
              ) : (
                <>
                  <FiLogIn size={13} />
                  <span>Enter the Gate</span>
                </>
              )}
            </button>

            {/* Footer */}
            <div className="text-center py-3">
              <p className="text-[11px] text-text-muted/50 font-game">
                Not a hunter yet?{' '}
                <Link to="/register" className="text-secondary/70 hover:text-secondary transition-colors font-medium">
                  Awaken Now
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="px-6 py-3 border-t border-primary/10 flex items-center justify-between relative z-[1]">
            <span className="text-[8px] font-system text-text-muted/25 tracking-wider">GATE::AUTH</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-success/50" />
              <span className="text-[8px] font-system text-success/40 tracking-wider">ONLINE</span>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;