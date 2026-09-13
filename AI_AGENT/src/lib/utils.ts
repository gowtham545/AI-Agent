import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export function getStatusColor(status: string): { bg: string; text: string; border: string; dot: string } {
  switch (status) {
    case 'Active':
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-500',
      };
    case 'Under Review':
    case 'In Review':
      return {
        bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
        text: 'text-indigo-700 dark:text-indigo-400',
        border: 'border-indigo-500/30',
        dot: 'bg-indigo-500',
      };
    case 'Draft':
      return {
        bg: 'bg-slate-500/10 dark:bg-slate-500/20',
        text: 'text-slate-700 dark:text-slate-400',
        border: 'border-slate-500/30',
        dot: 'bg-slate-400',
      };
    case 'Superseded':
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-500/20',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-500/30',
        dot: 'bg-amber-500',
      };
    case 'Archived':
      return {
        bg: 'bg-rose-500/10 dark:bg-rose-500/20',
        text: 'text-rose-700 dark:text-rose-400',
        border: 'border-rose-500/30',
        dot: 'bg-rose-500',
      };
    default:
      return {
        bg: 'bg-gray-500/10',
        text: 'text-gray-700',
        border: 'border-gray-300',
        dot: 'bg-gray-400',
      };
  }
}

export function getPriorityColor(priority: string): { bg: string; text: string; badgeBg: string } {
  switch (priority) {
    case 'Critical':
      return { bg: 'bg-red-500', text: 'text-red-700 dark:text-red-400', badgeBg: 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' };
    case 'High':
      return { bg: 'bg-orange-500', text: 'text-orange-700 dark:text-orange-400', badgeBg: 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800' };
    case 'Medium':
      return { bg: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-400', badgeBg: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' };
    case 'Low':
    default:
      return { bg: 'bg-gray-400', text: 'text-gray-600 dark:text-gray-400', badgeBg: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700' };
  }
}
