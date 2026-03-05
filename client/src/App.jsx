import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark bg-grid flex items-center justify-center relative overflow-hidden">
        {/* Ambient particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full opacity-40"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animation: `particle-float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>
        <div className="text-center z-10">
          <div className="w-20 h-20 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"
               style={{ boxShadow: '0 0 20px rgba(67,97,238,0.3)' }} />
          <p className="font-system text-sm tracking-[4px] uppercase text-secondary animate-flicker">
            Entering the Dungeon...
          </p>
          <p className="system-tag mt-2">System Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark bg-grid relative">
      {/* Subtle ambient glow at top */}
      {user && (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none z-0"
             style={{ background: 'radial-gradient(ellipse, rgba(67,97,238,0.06) 0%, transparent 70%)' }} />
      )}

      {user && <Navbar />}
      <div className="flex relative z-10">
        {user && <Sidebar />}
        <main className={`flex-1 ${user ? 'ml-0 md:ml-64 pt-16' : ''}`}>
          <div className={user ? 'p-4 md:p-8' : ''}>
            <AppRoutes />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
