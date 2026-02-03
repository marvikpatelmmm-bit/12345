import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/UI';
import { store } from '../services/store';
import { User } from '../types';

export const Leaderboard = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(store.getLeaderboard());
  }, []);

  const maxTasks = Math.max(...users.map(u => u.tasksCompleted), 1);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2">
            🏆 LEADERBOARD 🏆
        </h1>
        <p className="text-white/50">Competing for academic glory</p>
      </div>

      <div className="grid gap-6">
        {/* Top 1 */}
        {users[0] && (
            <GlassCard className="p-8 border-yellow-500/30 bg-yellow-500/5 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-20 text-9xl">🥇</div>
                 <div className="flex items-center gap-6 relative z-10">
                    <div 
                        className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-black border-4 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.4)]"
                        style={{ backgroundColor: users[0].avatarColor }}
                    >
                        {users[0].displayName.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                        <div className="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-1">Current Leader</div>
                        <h2 className="text-3xl font-bold">{users[0].displayName}</h2>
                        <div className="flex gap-4 mt-2 text-sm text-white/70">
                            <span>✅ {users[0].tasksCompleted} tasks</span>
                            <span>⏱ {Math.round(users[0].totalStudyMinutes / 60)}h studied</span>
                            <span>🔥 {users[0].streak} day streak</span>
                        </div>
                    </div>
                 </div>
            </GlassCard>
        )}

        {/* Rest of List */}
        <div className="space-y-4">
            {users.slice(1).map((user, index) => (
                <GlassCard key={user.id} className="p-6 flex items-center justify-between" hoverEffect>
                    <div className="flex items-center gap-4">
                        <div className="font-mono text-xl text-white/30 font-bold">#{index + 2}</div>
                        <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-black"
                            style={{ backgroundColor: user.avatarColor }}
                        >
                            {user.displayName.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-bold text-lg">{user.displayName}</div>
                            <div className="text-xs text-white/50">{user.username}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-xl">{user.tasksCompleted}</div>
                        <div className="text-xs text-white/40 uppercase">Tasks</div>
                    </div>
                </GlassCard>
            ))}
        </div>

        {/* Comparison Chart */}
        <GlassCard className="p-8 mt-8">
            <h3 className="font-bold mb-6 text-lg">Weekly Comparison</h3>
            <div className="space-y-6">
                {users.map(user => (
                    <div key={user.id}>
                        <div className="flex justify-between text-sm mb-2">
                            <span>{user.displayName}</span>
                            <span className="text-white/50">{user.tasksCompleted} tasks</span>
                        </div>
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className="h-full rounded-full relative"
                                style={{ 
                                    width: `${(user.tasksCompleted / maxTasks) * 100}%`,
                                    backgroundColor: user.avatarColor,
                                    boxShadow: `0 0 15px ${user.avatarColor}40`
                                }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] bg-[length:200%_100%]" style={{ backgroundImage: 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.3) 50%, transparent 75%)' }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>

      </div>
    </div>
  );
};