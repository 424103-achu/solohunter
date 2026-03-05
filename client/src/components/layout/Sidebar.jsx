import { NavLink } from 'react-router-dom';
import { FiHome, FiMap, FiUser, FiBarChart2, FiZap, FiActivity, FiInfo } from 'react-icons/fi';

const navItems = [
  { to: '/dashboard', icon: FiHome, label: 'Dashboard', tag: 'HOME' },
  { to: '/quests', icon: FiMap, label: 'Quests', tag: 'QUEST' },
  { to: '/skills', icon: FiZap, label: 'Skill Tree', tag: 'SKILL' },
  { to: '/fitness', icon: FiActivity, label: 'Training', tag: 'TRAIN' },
  { to: '/profile', icon: FiUser, label: 'Profile', tag: 'STAT' },
  { to: '/leaderboard', icon: FiBarChart2, label: 'Rankings', tag: 'RANK' },
  { to: '/info', icon: FiInfo, label: 'System Guide', tag: 'INFO' },
];

const Sidebar = () => {
  return (
    <aside
      id="sidebar"
      className="fixed left-0 top-16 bottom-0 w-64 z-40 transform -translate-x-full md:translate-x-0 transition-transform duration-300 border-r border-primary/15"
      style={{
        background: 'linear-gradient(180deg, #0c0e1a 0%, #080a14 100%)',
      }}
    >
      {/* System label */}
      <div className="px-5 pt-5 pb-3">
        <p className="system-tag text-[9px]">Navigation</p>
      </div>

      <nav className="px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label, tag }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-secondary border-l-2 border-primary'
                  : 'text-text-muted hover:bg-primary/5 hover:text-text-secondary border-l-2 border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-secondary' : 'text-text-muted group-hover:text-primary-light'} />
                <span className="font-game font-semibold text-sm tracking-wide">{label}</span>
                {isActive && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary"
                         style={{ boxShadow: '0 0 6px rgba(0,212,255,0.6)' }} />
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-5 my-4 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* System status */}
      <div className="px-5">
        <div className="p-3 border border-primary/10 rounded bg-primary/5">
          <p className="system-tag text-[8px] mb-2">System Status</p>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-text-muted">Connection</span>
              <span className="text-success flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" style={{ boxShadow: '0 0 4px rgba(0,230,118,0.6)' }} />
                Online
              </span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-text-muted">Dungeon</span>
              <span className="text-secondary">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary/10">
        <div className="text-center">
          <p className="font-system text-[8px] tracking-[3px] text-primary/40">SOLO HUNTER</p>
          <p className="text-[9px] text-text-muted/40">System v1.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
