import React, { useState, useEffect } from 'react';
import { GlassCard, SubjectBadge } from '../components/UI';
import { store } from '../services/store';
import { User, Task } from '../types';

export const Profile = () => {
  const [user, setUser] = useState<User | null>(store.getCurrentUser());
  const [history, setHistory] = useState<Task[]>([]);

  useEffect(() => {
    const u = store.getCurrentUser();
    if (u) {
        setUser(u);
        // Mock getting all history
        setHistory(store.getTasksForDate(u.id, new Date().toISOString().split('T')[0])); 
    }
  }, []);

  if (!user) return null;

  // Mock Heatmap Data
  const heatmapDays = Array(14).fill(0).map((_, i) => ({
    date: `Day ${i+1}`,
    value: Math.floor(Math.random() * 5) // 0-4 intensity
  }));

  const getHeatmapColor = (val: number) => {
    if (val === 0) return 'bg-white/5';
    if (val === 1) return 'bg-cyan-900/50';
    if (val === 2) return 'bg-cyan-700/60';
    if (val === 3) return 'bg-cyan-500/70';
    return 'bg-cyan-400 shadow-[0_0_10px_rgba(0,245,255,0.5)]';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <GlassCard className="p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" />
        
        <div 
            className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold text-black border-4 border-white/10 shadow-2xl"
            style={{ backgroundColor: user.avatarColor }}
        >
            {user.displayName.substring(0,2).toUpperCase()}
        </div>
        
        <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold mb-1">{user.displayName}</h1>
            <div className="text-cyan-400 font-mono mb-4">@{user.username}</div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1">📅 Joined Jan 2024</span>
                <span className="flex items-center gap-1">⚡ Active today</span>
            </div>
        </div>

        <div className="flex flex-col items-center p-4 bg-white/5 rounded-xl border border-white/10">
            <span className="text-3xl font-bold text-orange-400">🔥 {user.streak}</span>
            <span className="text-xs uppercase tracking-widest text-white/50">Day Streak</span>
        </div>
      </GlassCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{user.tasksCompleted}</div>
            <div className="text-xs text-white/40 uppercase">Total Tasks</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{user.successRate}%</div>
            <div className="text-xs text-white/40 uppercase">Success Rate</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">{Math.round(user.totalStudyMinutes / 60)}h</div>
            <div className="text-xs text-white/40 uppercase">Study Hours</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-pink-400 mb-1">#{store.getLeaderboard().findIndex(u => u.id === user.id) + 1}</div>
            <div className="text-xs text-white/40 uppercase">Rank</div>
        </GlassCard>
      </div>

      {/* Heatmap */}
      <GlassCard className="p-6">
        <h3 className="font-bold mb-4 text-white/80">Activity Heatmap (Last 14 Days)</h3>
        <div className="flex justify-between gap-2 overflow-x-auto pb-2">
            {heatmapDays.map((day, i) => (
                <div key={i} className="flex flex-col gap-2 items-center">
                    <div className={`w-10 h-10 rounded-lg ${getHeatmapColor(day.value)} transition-all hover:scale-110`} title={`${day.value} tasks`} />
                    <span className="text-[10px] text-white/30">{day.date}</span>
                </div>
            ))}
        </div>
      </GlassCard>

      {/* Recent History */}
      <GlassCard className="p-6">
        <h3 className="font-bold mb-4 text-white/80">Recent Tasks</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="text-white/30 border-b border-white/5">
                        <th className="pb-3 pl-2">Task</th>
                        <th className="pb-3">Subject</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right pr-2">Duration</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {history.map(task => (
                        <tr key={task.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-4 pl-2 font-medium">{task.name}</td>
                            <td className="py-4"><SubjectBadge subject={task.subject} /></td>
                            <td className="py-4">
                                <span className={`
                                    text-xs uppercase font-bold
                                    ${task.status === 'completed' ? 'text-green-400' : ''}
                                    ${task.status === 'pending' ? 'text-yellow-400' : ''}
                                    ${task.status === 'active' ? 'text-cyan-400' : ''}
                                `}>
                                    {task.status}
                                </span>
                            </td>
                            <td className="py-4 text-right pr-2 text-white/50">{task.estimatedMinutes}m</td>
                        </tr>
                    ))}
                    {history.length === 0 && (
                        <tr><td colSpan={4} className="py-8 text-center text-white/30">No history available yet.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </GlassCard>
    </div>
  );
};