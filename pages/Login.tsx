import React, { useState } from 'react';
import { Button, Input, GlassCard } from '../components/UI';
import { store } from '../services/store';

export const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    // Simulate Login
    const success = store.login(username);
    if (success) {
        onLogin();
    } else {
        setError("User not found (Try 'topper_01')");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <GlassCard className="w-full max-w-md p-8 md:p-12 border-t border-white/20">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-black mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 animate-pulse">
                JEE TRACKER
            </h1>
            <p className="text-white/50 text-sm">Study Hard. Compete. Succeed.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Username</label>
                <Input 
                    placeholder="Enter your username..." 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </div>
            
            <div className="opacity-50 pointer-events-none">
                <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Password</label>
                <Input type="password" placeholder="••••••••" value="password" readOnly />
            </div>

            {error && <div className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded">{error}</div>}

            <Button variant="primary" className="w-full justify-center !text-lg !py-4 shadow-[0_0_40px_rgba(0,245,255,0.3)] hover:shadow-[0_0_60px_rgba(0,245,255,0.5)]">
                ENTER DASHBOARD
            </Button>
        </form>

        <div className="mt-8 text-center text-xs text-white/30">
            <p>Demo Accounts: topper_01, jee_aspirant, physics_lover</p>
        </div>
      </GlassCard>
    </div>
  );
};