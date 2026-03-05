import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { FiUser, FiMail, FiLock, FiUserPlus, FiChevronRight } from 'react-icons/fi';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await register(username, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Hunter Name', icon: FiUser, type: 'text', value: username, setter: setUsername, placeholder: 'SungJinWoo' },
    { label: 'Email', icon: FiMail, type: 'email', value: email, setter: setEmail, placeholder: 'hunter@example.com' },
    { label: 'Password', icon: FiLock, type: 'password', value: password, setter: setPassword, placeholder: 'Enter password' },
    { label: 'Confirm Password', icon: FiLock, type: 'password', value: confirmPassword, setter: setConfirmPassword, placeholder: 'Confirm password' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark bg-grid px-4 py-8 relative overflow-hidden">
      {/* Layered background effects — purple variant */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]"
             style={{ background: 'radial-gradient(circle, rgba(177,74,237,0.08) 0%, rgba(177,74,237,0.02) 40%, transparent 70%)' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full opacity-[0.05]"
             style={{ background: 'linear-gradient(180deg, transparent, #b14aed, transparent)' }} />
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
               style={{
                 width: `${1 + (i % 3)}px`,
                 height: `${1 + (i % 3)}px`,
                 background: i % 2 === 0 ? 'rgba(177,74,237,0.4)' : 'rgba(67,97,238,0.3)',
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
        className="w-full max-w-lg z-10"
      >
        {/* Awakening Emblem */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
            className="relative w-24 h-24 mx-auto mb-5"
          >
            <div className="absolute inset-0 rounded border border-neon-purple/25 animate-[glow-border_4s_ease-in-out_infinite]"
                 style={{ boxShadow: '0 0 25px rgba(177,74,237,0.15)' }} />
            <div className="absolute inset-2 rounded border border-neon-purple/12" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-system text-2xl neon-text-purple font-bold tracking-wider"
                    style={{ textShadow: '0 0 20px rgba(177,74,237,0.5), 0 0 40px rgba(177,74,237,0.2)' }}>
                SH
              </span>
            </div>
            <div className="absolute inset-0 rounded"
                 style={{ background: 'radial-gradient(circle, rgba(177,74,237,0.1) 0%, transparent 70%)' }} />
          </motion.div>

          <h1 className="font-system text-2xl tracking-[5px] uppercase text-text-primary mb-2">
            Hunter <span className="neon-text-purple">Awakening</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-neon-purple/30" />
            <p className="system-tag text-[9px] tracking-[3px]">NEW HUNTER REGISTRATION</p>
            <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-neon-purple/30" />
          </div>
        </div>

        {/* Register Form — Auth Window (Purple) */}
        <form onSubmit={handleSubmit} className="auth-window auth-window--purple auth-scan rounded-sm relative">
          {/* Header */}
          <div className="px-6 py-4 border-b border-neon-purple/15 flex items-center justify-between relative z-[1]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
              <span className="font-system text-[10px] tracking-[3px] uppercase text-neon-purple/80">
                Awakening Protocol
              </span>
            </div>
            <span className="font-system text-[8px] text-text-muted/40 tracking-wider">v2.1</span>
          </div>

          <div className="hud-line" style={{ background: 'linear-gradient(90deg, transparent, #b14aed, transparent)', opacity: 0.2 }} />

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

            {/* Input Fields */}
            {fields.map(({ label, icon: Icon, type, value, setter, placeholder }) => (
              <div key={label}>
                <label className="flex items-center gap-2 mb-3">
                  <FiChevronRight className="text-neon-purple/50" size={10} />
                  <span className="text-[10px] font-system tracking-[2px] uppercase text-text-muted/70">{label}</span>
                </label>
                <div className="sys-input-wrap">
                  <span className="corner-bl" /><span className="corner-br" />
                  <div className="relative flex items-center">
                    <Icon className="absolute left-4 text-neon-purple/35 pointer-events-none z-[1]" size={15} />
                    <input
                      type={type}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      placeholder={placeholder}
                      className="sys-input text-center"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="hud-line my-5" style={{ background: 'linear-gradient(90deg, transparent, #b14aed, transparent)', opacity: 0.15 }} />

            {/* Awaken Button */}
            <button
              type="submit"
              disabled={loading}
              className="gate-btn w-full py-4 rounded-sm bg-neon-purple/12 border border-neon-purple/30 text-neon-purple font-system text-xs tracking-[3px] uppercase flex items-center justify-center gap-2 disabled:opacity-40"
              style={{ '--shimmer-color': 'rgba(177,74,237,0.08)' }}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-neon-purple/30 border-t-neon-purple rounded-full animate-spin" />
              ) : (
                <>
                  <FiUserPlus size={13} />
                  <span>Awaken</span>
                </>
              )}
            </button>
            <div className="text-center py-3">
              <p className="text-[11px] text-text-muted/50 font-game">
                Already a hunter?{' '}
                <Link to="/login" className="text-secondary/70 hover:text-secondary transition-colors font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="px-6 py-3 border-t border-neon-purple/10 flex items-center justify-between relative z-[1]">
            <span className="text-[8px] font-system text-text-muted/25 tracking-wider">GATE::AWAKEN</span>
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

export default Register;