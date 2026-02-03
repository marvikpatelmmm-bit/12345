import { User, Task, TaskStatus, Subject, DailySummary } from '../types';

// Initial Mock Data
const MOCK_USERS: User[] = [
  {
    id: 'u1',
    username: 'topper_01',
    displayName: 'Aravind',
    avatarColor: '#00f5ff',
    streak: 22,
    totalStudyMinutes: 2280,
    tasksCompleted: 45,
    successRate: 92,
    isOnline: true,
  },
  {
    id: 'u2',
    username: 'jee_aspirant',
    displayName: 'Priya',
    avatarColor: '#bf5af2',
    streak: 15,
    totalStudyMinutes: 2100,
    tasksCompleted: 40,
    successRate: 88,
    isOnline: false,
  },
  {
    id: 'u3',
    username: 'physics_lover',
    displayName: 'Rahul',
    avatarColor: '#30d158',
    streak: 8,
    totalStudyMinutes: 1920,
    tasksCompleted: 38,
    successRate: 85,
    isOnline: true,
    currentActivity: {
      taskName: 'Rotational Motion PYQs',
      subject: Subject.PHYSICS,
      startedAt: Date.now() - 1000 * 60 * 45 // Started 45 mins ago
    }
  }
];

const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    userId: 'u1',
    name: 'Integration Calculus',
    subject: Subject.MATHS,
    estimatedMinutes: 60,
    actualMinutes: 55,
    status: TaskStatus.COMPLETED,
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 't2',
    userId: 'u1',
    name: 'Electrostatics Theory',
    subject: Subject.PHYSICS,
    estimatedMinutes: 90,
    actualMinutes: 0,
    status: TaskStatus.PENDING,
    date: new Date().toISOString().split('T')[0]
  }
];

// Simple Event Bus for updates
type Listener = () => void;
const listeners: Listener[] = [];

const notify = () => {
  listeners.forEach(l => l());
  saveState();
};

const saveState = () => {
  localStorage.setItem('jee_app_users', JSON.stringify(state.users));
  localStorage.setItem('jee_app_tasks', JSON.stringify(state.tasks));
  localStorage.setItem('jee_app_currentUser', JSON.stringify(state.currentUser));
};

const loadState = () => {
  const users = localStorage.getItem('jee_app_users');
  const tasks = localStorage.getItem('jee_app_tasks');
  const currentUser = localStorage.getItem('jee_app_currentUser');
  
  if (users) state.users = JSON.parse(users);
  if (tasks) state.tasks = JSON.parse(tasks);
  if (currentUser) state.currentUser = JSON.parse(currentUser);
};

// Global Store State
const state = {
  users: MOCK_USERS,
  tasks: MOCK_TASKS,
  currentUser: null as User | null,
  summaries: [] as DailySummary[]
};

// Initialize
try {
  loadState();
} catch (e) {
  console.error("Failed to load state", e);
}

export const store = {
  subscribe: (listener: Listener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  },

  // Auth
  login: (username: string) => {
    // For demo, just pick the first user or find by username
    const user = state.users.find(u => u.username === username) || state.users[0];
    state.currentUser = user;
    notify();
    return true;
  },
  
  logout: () => {
    state.currentUser = null;
    notify();
  },

  getCurrentUser: () => state.currentUser,
  getAllUsers: () => state.users,

  // Tasks
  getTasksForDate: (userId: string, date: string) => {
    return state.tasks.filter(t => t.userId === userId && t.date === date);
  },

  addTask: (task: Omit<Task, 'id' | 'actualMinutes' | 'status' | 'userId'>) => {
    if (!state.currentUser) return;
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      userId: state.currentUser.id,
      actualMinutes: 0,
      status: TaskStatus.PENDING,
    };
    state.tasks = [...state.tasks, newTask];
    notify();
  },

  startTask: (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task && state.currentUser) {
      task.status = TaskStatus.ACTIVE;
      task.startedAt = Date.now();
      
      // Update User Activity
      const user = state.users.find(u => u.id === state.currentUser!.id);
      if (user) {
        user.currentActivity = {
          taskName: task.name,
          subject: task.subject,
          startedAt: Date.now()
        };
      }
      notify();
    }
  },

  completeTask: (taskId: string, minutesTaken: number) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task && state.currentUser) {
      task.status = minutesTaken > task.estimatedMinutes ? TaskStatus.DELAYED : TaskStatus.COMPLETED;
      task.completedAt = Date.now();
      task.actualMinutes = minutesTaken;

      // Clear User Activity
      const user = state.users.find(u => u.id === state.currentUser!.id);
      if (user) {
        user.currentActivity = undefined;
        user.tasksCompleted += 1;
        user.totalStudyMinutes += minutesTaken;
        
        // Update success rate
        const userTasks = state.tasks.filter(t => t.userId === user.id && (t.status === TaskStatus.COMPLETED || t.status === TaskStatus.DELAYED));
        const success = userTasks.filter(t => t.status === TaskStatus.COMPLETED).length;
        user.successRate = Math.round((success / userTasks.length) * 100);
      }
      notify();
    }
  },
  
  getLeaderboard: () => {
    return [...state.users].sort((a, b) => b.tasksCompleted - a.tasksCompleted);
  }
};