import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function getMoodEmoji(score: number): string {
  if (score >= 9) return '🌟';
  if (score >= 7) return '😊';
  if (score >= 5) return '😐';
  if (score >= 3) return '😔';
  return '😢';
}

export function getMoodColor(score: number): string {
  if (score >= 9) return 'bg-success';
  if (score >= 7) return 'bg-success';
  if (score >= 5) return 'bg-warning';
  if (score >= 3) return 'bg-warning';
  return 'bg-destructive';
}

export function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const sortedDates = [...dates].sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = new Date(sortedDates[0]);
  lastDate.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays > 1) return 0;

  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    const prevDate = new Date(sortedDates[i - 1]);

    const diff = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 1) {
      streak++;
    } else if (diff > 1) {
      break;
    }
  }

  return streak;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
