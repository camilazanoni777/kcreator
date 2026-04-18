import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  User,
  DailyCheckin,
  Task,
  Habit,
  Goal,
  FinanceTransaction,
  CoupleCheckin
} from '@/types';
import { calculateStreak } from '@/lib/utils';

interface AppState {
  // User
  currentUser: User | null;
  isAuthenticated: boolean;

  // Data
  checkins: DailyCheckin[];
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  transactions: FinanceTransaction[];
  coupleCheckins: CoupleCheckin[];

  // Actions
  setUser: (user: User | null) => void;
  addCheckin: (checkin: DailyCheckin) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addHabit: (habit: Habit) => void;
  completeHabit: (habitId: string, date: string) => void;
  addGoal: (goal: Goal) => void;
  updateGoalProgress: (goalId: string, progress: number) => void;
  addTransaction: (transaction: FinanceTransaction) => void;
  addCoupleCheckin: (checkin: CoupleCheckin) => void;

  // Computed
  getTodayTasks: () => Task[];
  getActiveHabits: () => Habit[];
  getActiveGoals: () => Goal[];
  getCurrentStreak: () => number;
  getMoodAverage: () => number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentUser: null,
      isAuthenticated: false,
      checkins: [],
      tasks: [],
      habits: [],
      goals: [],
      transactions: [],
      coupleCheckins: [],

      // Actions
      setUser: (user) => set({ currentUser: user, isAuthenticated: !!user }),

      addCheckin: (checkin) =>
        set((state) => ({ checkins: [...state.checkins, checkin] })),

      addTask: (task) =>
        set((state) => ({ tasks: [...state.tasks, task] })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter(t => t.id !== id),
        })),

      addHabit: (habit) =>
        set((state) => ({ habits: [...state.habits, habit] })),

      completeHabit: (habitId, date) =>
        set((state) => ({
          habits: state.habits.map(h => {
            if (h.id !== habitId) return h;
            if (h.completedDates.includes(date)) return h;

            const newDates = [...h.completedDates, date];
            return {
              ...h,
              completedDates: newDates,
              streak: calculateStreak(newDates),
              bestStreak: Math.max(h.bestStreak, calculateStreak(newDates)),
            };
          }),
        })),

      addGoal: (goal) =>
        set((state) => ({ goals: [...state.goals, goal] })),

      updateGoalProgress: (goalId, progress) =>
        set((state) => ({
          goals: state.goals.map(g =>
            g.id === goalId
              ? { ...g, progress: Math.min(100, Math.max(0, progress)), updatedAt: new Date() }
              : g
          ),
        })),

      addTransaction: (transaction) =>
        set((state) => ({ transactions: [...state.transactions, transaction] })),

      addCoupleCheckin: (checkin) =>
        set((state) => ({ coupleCheckins: [...state.coupleCheckins, checkin] })),

      // Computed
      getTodayTasks: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().tasks.filter(t => {
          if (!t.dueDate) return false;
          const due = new Date(t.dueDate).toISOString().split('T')[0];
          return due === today && t.status !== 'completed';
        });
      },

      getActiveHabits: () =>
        get().habits.filter(h => h.streak > 0 || h.completedDates.length === 0),

      getActiveGoals: () =>
        get().goals.filter(g => g.status === 'active'),

      getCurrentStreak: () => {
        const allDates = get().habits.flatMap(h => h.completedDates);
        return calculateStreak(allDates);
      },

      getMoodAverage: () => {
        const checkins = get().checkins;
        if (checkins.length === 0) return 0;

        const sum = checkins.reduce((acc, c) => acc + c.moodScore, 0);
        return Math.round(sum / checkins.length);
      },
    }),
    {
      name: 'lumina-storage',
    }
  )
);
