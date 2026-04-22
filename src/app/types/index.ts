export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    partnerId?: string;
    createdAt: Date;
}

export interface Couple {
    id: string;
    user1Id: string;
    user2Id: string;
    createdAt: Date;
    alignmentScore: number;
}

export type Mood = 'excellent' | 'good' | 'neutral' | 'low' | 'poor';

export interface DailyCheckin {
    id: string;
    userId: string;
    date: string;
    mood: Mood;
    moodScore: number;
    energyLevel: number;
    feelings: string[];
    notes?: string;
    triggers?: string[];
    needs?: string[];
    createdAt: Date;
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskScope = 'private' | 'couple';

export interface Task {
    id: string;
    userId: string;
    coupleId?: string;
    title: string;
    description?: string;
    priority: TaskPriority;
    status: TaskStatus;
    scope: TaskScope;
    dueDate?: Date;
    category?: string;
    tags: string[];
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Habit {
    id: string;
    userId: string;
    coupleId?: string;
    title: string;
    description?: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    scope: 'private' | 'couple';
    targetDays?: number[];
    streak: number;
    bestStreak: number;
    completedDates: string[];
    createdAt: Date;
}
export type GoalStatus = 'active' | 'paused' | 'completed' | 'abandoned';

export interface Goal {
    id: string;
    userId: string;
    coupleId?: string;
    title: string;
    description?: string;
    status: GoalStatus;
    progress: number;
    targetValue: number;
    currentValue: number;
    unit: string;
    deadline?: Date;
    milestones: Milestone[];
    scope: 'private' | 'couple';
    createdAt: Date;
    updatedAt: Date;
}

export interface Milestone {
    id: string;
    title: string;
    progress: number;
    completed: boolean;
    completedAt?: Date;
}

export type TransactionType = 'income' | 'expense';

export interface FinanceTransaction {
    id: string;
    userId: string;
    coupleId?: string;
    type: TransactionType;
    amount: number;
    category: string;
    description?: string;
    date: string;
    scope: 'private' | 'couple';
    createdAt: Date;
}

export interface CoupleCheckin {
    id: string;
    coupleId: string;
    date: string;
    communicationScore: number;
    intimacyScore: number;
    alignmentScore: number;
    notes?: string;
    gratitude?: string;
    createdAt: Date;
}

export interface DashboardStats {
    tasksCompleted: number;
    habitsConsistency: number;
    moodAverage: number;
    goalsProgress: number;
    coupleAlignment: number;
    financeBalance: number;
    streakDays: number;
}
