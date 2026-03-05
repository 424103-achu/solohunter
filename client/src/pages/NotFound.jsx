import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="system-window max-w-md mx-auto">
          <div className="system-header !text-danger">⚠ System Error</div>
          <div className="system-body py-10">
            <h1 className="text-7xl font-system neon-text mb-4" style={{ textShadow: '0 0 30px rgba(0,212,255,0.3), 0 0 60px rgba(67,97,238,0.2)' }}>404</h1>
            <h2 className="text-xl font-system text-text-primary mb-2 tracking-wider">GATE NOT FOUND</h2>
            <p className="text-text-muted font-game text-sm mb-8">
              This dungeon doesn't exist. The gate has been sealed.
            </p>
            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 bg-primary/15 text-secondary rounded border border-primary/30 font-system text-xs tracking-widest uppercase hover:bg-primary/25 hover:shadow-[0_0_15px_rgba(0,212,255,0.15)] transition-all"
            >
              Return to Base
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;