import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getRankClass } from '../../utils/rankUtils';
import { getXpPercentage } from '../../utils/xpCalculator';
import { FiLogOut, FiUser, FiMenu } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const nextLevelXp = user.next_level_xp || Math.floor(50 * (user.level || 1) * 1.2);
  const xpPercent = getXpPercentage(user.xp, nextLevelXp);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-primary/20"
         style={{
           background: 'linear-gradient(180deg, #0c0e1af0 0%, #0a0c16f0 100%)',
           backdropFilter: 'blur(12px)',
           boxShadow: '0 2px 20px rgba(67,97,238,0.08)',
         }}>
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="flex items-center justify-between h-full px-4">
        {/* Left — Logo + Mobile menu */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-text-muted hover:text-secondary transition-colors"
            onClick={() => {
              const sidebar = document.getElementById('sidebar');
              sidebar?.classList.toggle('-translate-x-full');
            }}
          >
            <FiMenu size={22} />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded border border-primary/40 flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors animate-glow-border">
              <span className="font-system text-xs text-secondary font-bold">SH</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-system text-[10px] tracking-[3px] uppercase text-secondary block leading-none">
                Solo Hunter
              </span>
              <span className="text-[9px] tracking-[2px] uppercase text-text-muted block">
                System v1.0
              </span>
            </div>
          </Link>
        </div>

        {/* Center — Level + XP Bar */}
        <div className="flex items-center gap-4 flex-1 max-w-lg mx-6">
          <div className={`font-system text-xs font-bold px-2 py-1 rounded border ${getRankClass(user.rank)}`}
               style={{ borderColor: 'currentColor', background: 'rgba(67,97,238,0.08)' }}>
            {user.rank}
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="font-system tracking-wider text-secondary">LV.{user.level}</span>
              <span className="text-text-muted font-mono">{user.xp}/{nextLevelXp} XP</span>
            </div>
            <div className="h-[6px] bg-dark-surface rounded-sm overflow-hidden border border-primary/10">
              <div
                className="h-full rounded-sm transition-all duration-700 animate-xp-fill xp-bar-glow"
                style={{
                  width: `${xpPercent}%`,
                  background: 'linear-gradient(90deg, #4361ee, #00d4ff)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Right — User info */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-dark-surface/60 border border-dark-border rounded text-xs">
            <span className="text-orange-400">🔥</span>
            <span className="font-mono text-text-secondary">{user.current_streak || 0}</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded border border-dark-border bg-dark-surface/40 hover:border-primary/30 hover:bg-dark-surface transition-all"
            >
              <div className="w-5 h-5 rounded-sm bg-primary/20 flex items-center justify-center">
                <FiUser size={12} className="text-secondary" />
              </div>
              <span className="text-xs hidden sm:block text-text-secondary font-medium">{user.username}</span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 system-window z-50">
                <div className="system-header">Hunter Menu</div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:bg-primary/10 hover:text-secondary transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FiUser size={14} /> Profile
                  </Link>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors"
                  >
                    <FiLogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
