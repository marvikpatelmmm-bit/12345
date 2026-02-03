import React, { useState, useEffect } from 'react';
import { GlassCard, Button, SubjectBadge, Modal, Input } from '../components/UI';
import { CircularTimer } from '../components/CircularTimer';
import { store } from '../services/store';
import { Task, TaskStatus, Subject, User } from '../types';

export const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(store.getCurrentUser());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  // Timer State for active task
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [elapsed, setElapsed] = useState(0);

  // New Task Form State
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState<Subject>(Subject.MATHS);
  const [newTaskDuration, setNewTaskDuration] = useState('60');

  useEffect(() => {
    const updateData = () => {
      const user = store.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        setTasks(store.getTasksForDate(user.id, new Date().toISOString().split('T')[0]));
        
        // Find active task
        const allTasks = store.getTasksForDate(user.id, new Date().toISOString().split('T')[0]);
        const active = allTasks.find(t => t.status === TaskStatus.ACTIVE);
        
        if (active) {
            setActiveTask(active);
            if (active.startedAt) {
                const secondsSinceStart = Math.floor((Date.now() - active.startedAt) / 1000);
                setElapsed(secondsSinceStart);
            }
        } else {
            setActiveTask(null);
            setElapsed(0);
        }
      }
      setUsers(store.getAllUsers());
    };

    updateData();
    const unsubscribe = store.subscribe(updateData);
    
    // Live Timer Interval
    const interval = setInterval(() => {
        if (activeTask && activeTask.startedAt) {
            setElapsed(Math.floor((Date.now() - activeTask.startedAt) / 1000));
        }
    }, 1000);

    return () => {
        unsubscribe();
        clearInterval(interval);
    };
  }, [activeTask?.id]);

  const handleAddTask = () => {
    store.addTask({
      name: newTaskName,
      subject: newTaskSubject,
      estimatedMinutes: parseInt(newTaskDuration),
      date: new Date().toISOString().split('T')[0]
    });
    setNewTaskName('');
    setIsTaskModalOpen(false);
  };

  const handleStartTask = (taskId: string) => {
    store.startTask(taskId);
  };

  const handleCompleteTask = () => {
    if (activeTask) {
        store.completeTask(activeTask.id, Math.ceil(elapsed / 60));
        setActiveTask(null);
    }
  };

  if (!currentUser) return null;

  const pendingTasks = tasks.filter(t => t.status === TaskStatus.PENDING);
  const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED || t.status === TaskStatus.DELAYED);

  // Stats calculation
  const progress = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* COLUMN 1: TASKS */}
      <div className="space-y-6">
        <GlassCard className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">Your Day</h2>
                <Button onClick={() => setIsTaskModalOpen(true)} className="!px-3 !py-1 text-sm">+ Add</Button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 max-h-[600px]">
                {/* Active Task Mini Card if hidden from middle col on mobile? No, show all here */}
                {activeTask && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 flex justify-between items-center animate-pulse">
                        <div>
                            <div className="text-xs text-cyan-400 font-bold uppercase mb-1">▶ Now Playing</div>
                            <div className="font-medium">{activeTask.name}</div>
                        </div>
                        <SubjectBadge subject={activeTask.subject} />
                    </div>
                )}

                {/* Pending */}
                {pendingTasks.length > 0 && (
                    <div>
                        <div className="text-xs text-white/40 uppercase tracking-widest mb-3">Pending</div>
                        <div className="space-y-3">
                            {pendingTasks.map(task => (
                                <div key={task.id} className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all flex justify-between items-center">
                                    <div>
                                        <div className="font-medium mb-1">{task.name}</div>
                                        <div className="flex gap-2 text-xs text-white/50">
                                            <span>⏱ {task.estimatedMinutes}m</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <SubjectBadge subject={task.subject} />
                                        <button 
                                            onClick={() => handleStartTask(task.id)}
                                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-cyan-500/20 hover:text-cyan-400 flex items-center justify-center transition-colors"
                                        >
                                            ▶
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Completed */}
                {completedTasks.length > 0 && (
                    <div>
                        <div className="text-xs text-white/40 uppercase tracking-widest mb-3 mt-6">Done</div>
                        <div className="space-y-3 opacity-60">
                            {completedTasks.map(task => (
                                <div key={task.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                                    <div className="line-through text-white/50">{task.name}</div>
                                    <span className="text-green-400 text-sm">✓</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {tasks.length === 0 && (
                    <div className="text-center py-10 text-white/30">
                        No tasks for today.<br/>Plan your study session!
                    </div>
                )}
            </div>
        </GlassCard>
      </div>

      {/* COLUMN 2: ACTIVE SESSION */}
      <div className="space-y-6">
        <GlassCard className="p-8 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

            {activeTask ? (
                <>
                    <div className="text-center mb-8 relative z-10">
                        <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase mb-4 animate-pulse">
                            ● Currently Studying
                        </div>
                        <h2 className="text-3xl font-bold mb-2">{activeTask.name}</h2>
                        <SubjectBadge subject={activeTask.subject} />
                    </div>

                    <div className="mb-8 relative z-10">
                        <CircularTimer 
                            totalSeconds={activeTask.estimatedMinutes * 60} 
                            elapsedSeconds={elapsed} 
                        />
                    </div>

                    <div className="flex gap-4 relative z-10">
                        <Button variant="primary" onClick={handleCompleteTask}>Complete Task</Button>
                    </div>
                    
                    {/* Motivational Quote */}
                    <div className="mt-8 text-white/30 text-sm italic">
                        "Consistency is key."
                    </div>
                </>
            ) : (
                <div className="text-center opacity-50">
                    <div className="text-6xl mb-4">💤</div>
                    <h3 className="text-xl font-bold mb-2">Ready to focus?</h3>
                    <p className="text-sm">Select a pending task from the left to start.</p>
                </div>
            )}
        </GlassCard>

        {/* Live Feed */}
        <div className="bg-transparent">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4 px-2">Friends Live Activity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {users.filter(u => u.id !== currentUser.id).map(user => (
                    <GlassCard key={user.id} className="p-4" hoverEffect>
                        <div className="flex items-center gap-3 mb-3">
                            <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black text-sm"
                                style={{ backgroundColor: user.avatarColor }}
                            >
                                {user.displayName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <div className="font-bold text-sm">{user.displayName}</div>
                                <div className="text-xs text-white/50 flex items-center gap-1">
                                    <span className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                                    {user.isOnline ? 'Online' : 'Offline'}
                                </div>
                            </div>
                        </div>
                        {user.currentActivity ? (
                            <div className="text-sm">
                                <div className="text-cyan-400 text-xs mb-1">Studying {user.currentActivity.subject}</div>
                                <div className="truncate opacity-80">{user.currentActivity.taskName}</div>
                            </div>
                        ) : (
                            <div className="text-xs text-white/30 italic">Currently idle...</div>
                        )}
                    </GlassCard>
                ))}
            </div>
        </div>
      </div>

      {/* COLUMN 3: STATS */}
      <div className="space-y-6">
        <GlassCard className="p-6">
            <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
            
            {/* Rank Card */}
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10">
                <div className="text-xs text-white/50 uppercase">Your Rank</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-yellow-400">#{store.getLeaderboard().findIndex(u => u.id === currentUser.id) + 1}</span>
                    <span className="text-sm font-normal text-white/50">of {users.length}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">Today's Progress</span>
                    <span className="font-bold text-cyan-400">{progress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Stat Grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white/5 text-center">
                    <div className="text-2xl font-bold">{currentUser.tasksCompleted}</div>
                    <div className="text-[10px] uppercase text-white/40">Total Tasks</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 text-center">
                    <div className="text-2xl font-bold text-orange-400">🔥 {currentUser.streak}</div>
                    <div className="text-[10px] uppercase text-white/40">Day Streak</div>
                </div>
            </div>
        </GlassCard>
        
        {/* Mini Leaderboard */}
        <GlassCard className="p-6">
            <h3 className="text-lg font-bold mb-4">Top Performers</h3>
            <div className="space-y-4">
                {store.getLeaderboard().slice(0, 3).map((u, i) => (
                    <div key={u.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                            <span className={`font-mono font-bold ${i===0 ? 'text-yellow-400' : i===1 ? 'text-gray-300' : 'text-orange-600'}`}>
                                {i+1}
                            </span>
                            <span className={u.id === currentUser.id ? 'text-cyan-400 font-bold' : 'text-white/80'}>
                                {u.displayName}
                            </span>
                        </div>
                        <span className="text-white/40">{u.tasksCompleted} tasks</span>
                    </div>
                ))}
            </div>
        </GlassCard>
      </div>

      {/* ADD TASK MODAL */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Add New Task">
        <div className="space-y-4">
            <div>
                <label className="block text-xs text-white/50 mb-1">Task Name</label>
                <Input 
                    value={newTaskName} 
                    onChange={e => setNewTaskName(e.target.value)} 
                    placeholder="e.g. Chapter 4 Exercises"
                    autoFocus
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-white/50 mb-1">Subject</label>
                    <select 
                        className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                        value={newTaskSubject}
                        onChange={(e) => setNewTaskSubject(e.target.value as Subject)}
                    >
                        {Object.values(Subject).map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-white/50 mb-1">Estimate (mins)</label>
                    <select 
                        className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
                        value={newTaskDuration}
                        onChange={(e) => setNewTaskDuration(e.target.value)}
                    >
                        <option value="15" className="bg-gray-900">15 min</option>
                        <option value="30" className="bg-gray-900">30 min</option>
                        <option value="45" className="bg-gray-900">45 min</option>
                        <option value="60" className="bg-gray-900">1 hr</option>
                        <option value="90" className="bg-gray-900">1.5 hr</option>
                        <option value="120" className="bg-gray-900">2 hr</option>
                    </select>
                </div>
            </div>

            <div className="pt-4">
                <Button variant="primary" className="w-full" onClick={handleAddTask}>Add to Plan</Button>
            </div>
        </div>
      </Modal>

    </div>
  );
};