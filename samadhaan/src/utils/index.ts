import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 10_00_000) return `${(n / 10_00_000).toFixed(1)}M`;
  if (n >= 1_00_000)  return `${(n / 1_00_000).toFixed(1)}L`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatCrore(n: number): string {
  return `₹${n.toFixed(0)} Cr`;
}

export function urgencyLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Critical', color: '#ef4444' };
  if (score >= 70) return { label: 'High',     color: '#f59e0b' };
  if (score >= 50) return { label: 'Medium',   color: '#38bdf8' };
  return { label: 'Low', color: '#34d399' };
}

export function statusLabel(status: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    submitted:     { label: 'Submitted',     color: '#94a3b8' },
    under_review:  { label: 'Under Review',  color: '#38bdf8' },
    ai_processing: { label: 'AI Processing', color: '#a78bfa' },
    assigned:      { label: 'Assigned',      color: '#fbbf24' },
    in_progress:   { label: 'In Progress',   color: '#fb923c' },
    resolved:      { label: 'Resolved',      color: '#34d399' },
    closed:        { label: 'Closed',        color: '#64748b' },
  };
  return map[status] ?? { label: status, color: '#94a3b8' };
}

export function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    infrastructure: 'Infrastructure',
    sanitation:     'Sanitation',
    water:          'Water Supply',
    electricity:    'Electricity',
    healthcare:     'Healthcare',
    education:      'Education',
    environment:    'Environment',
    transport:      'Transport',
    safety:         'Safety',
    agriculture:    'Agriculture',
    digital:        'Digital',
    other:          'Other',
  };
  return map[cat] ?? cat;
}
