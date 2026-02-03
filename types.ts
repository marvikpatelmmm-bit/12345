export enum Subject {
  MATHS = 'Maths',
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  OTHER = 'Other'
}

export enum TaskStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DELAYED = 'delayed',
  SKIPPED = 'skipped'
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarColor: string; // Hex code
  streak: number;
  totalStudyMinutes: number;
  tasksCompleted: number;
  successRate: number;
  isOnline: boolean;
  currentActivity?: {
    taskName: string;
    subject: Subject;
    startedAt: number;
  };
}

export interface Task {
  id: string;
  userId: string;
  name: string;
  subject: Subject;
  estimatedMinutes: number;
  actualMinutes: number;
  status: TaskStatus;
  date: string; // ISO date string YYYY-MM-DD
  startedAt?: number;
  completedAt?: number;
}

export interface DailySummary {
  id: string;
  userId: string;
  date: string;
  mathsProblems: number;
  physicsProblems: number;
  chemistryProblems: number;
  notes: string;
  rating: number; // 1-5
}