import React, { useState, useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';
import { store } from './services/store';

// Simple Router
enum Page {
  DASHBOARD = 'dashboard',
  LEADERBOARD = 'leaderboard',
  PROFILE = 'profile',
  LOGIN = 'login'
}

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LOGIN);
  const [user, setUser] = useState(store.getCurrentUser());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const u = store.getCurrentUser();
    setUser(u);
    if (u) setCurrentPage(Page.DASHBOARD);
  }, []);

  const handleLogout = () => {
    store.logout();
    setUser(null);
    setCurrentPage(Page.LOGIN);
  };

  const NavItem = ({ page, label, icon }: { page: Page, label: string, icon: string }) => (
    <button 
        onClick={() => { setCurrentPage(page); setIsMobileMenuOpen(false); }}
        className={`
            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full md:w-auto
            ${currentPage === page 
                ? 'bg-white/10 text-cyan-400 shadow-[0_0_20px_rgba(0,245,255,0.1)]' 
                : 'text-white/60 hover:text-white hover:bg-white/5'}
        `}
    >
        <span>{icon}</span>
        <span className="font-medium">{label}</span>
    </button>
  );

  if (!user || currentPage === Page.LOGIN) {
    return <Login onLogin={() => {
        setUser(store.getCurrentUser());
        setCurrentPage(Page.DASHBOARD);
    }} />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row max-w-7xl mx-auto md:p-6 relative z-10">
      
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-black/50 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
        <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">JEE APP</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">☰</button>
      </div>

      {/* Sidebar Navigation */}
      <nav className={`
        fixed md:sticky md:top-6 inset-0 md:inset-auto z-40 bg-black/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none
        w-full md:w-64 md:h-[calc(100vh-3rem)] md:mr-6 flex flex-col p-6 border-r md:border-r-0 border-white/10
        transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="hidden md:block mb-10 px-2">
            <h1 className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                JEE<br/>TRACKER
            </h1>
        </div>

        {/* User Mini Profile */}
        <div className="flex items-center gap-3 mb-8 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-black" style={{ backgroundColor: user.avatarColor }}>
                {user.displayName.substring(0,2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
                <div className="font-bold truncate">{user.displayName}</div>
                <div className="text-xs text-green-400 flex items-center gap-1">● Online</div>
            </div>
        </div>

        <div className="space-y-2 flex-1">
            <NavItem page={Page.DASHBOARD} label="Dashboard" icon="📊" />
            <NavItem page={Page.LEADERBOARD} label="Leaderboard" icon="🏆" />
            <NavItem page={Page.PROFILE} label="My Profile" icon="👤" />
        </div>

        <div className="mt-auto pt-6 border-t border-white/10">
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            >
                🚪 Logout
            </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-0 overflow-x-hidden pb-20 md:pb-0">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {currentPage === Page.DASHBOARD && <Dashboard />}
            {currentPage === Page.LEADERBOARD && <Leaderboard />}
            {currentPage === Page.PROFILE && <Profile />}
        </div>
      </main>

    </div>
  );
};

export default App;