import { cn } from '@/utils';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  dot?: boolean;
  className?: string;
}

export function Badge({ children, color = '#6366f1', dot, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        className
      )}
      style={{
        backgroundColor: `${color}20`,
        color,
        border: `1px solid ${color}40`,
      }}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: color }}
        />
      )}
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  submitted:     { label: 'Submitted',     color: '#94a3b8' },
  under_review:  { label: 'Under Review',  color: '#38bdf8' },
  ai_processing: { label: 'AI Processing', color: '#a78bfa' },
  assigned:      { label: 'Assigned',      color: '#fbbf24' },
  in_progress:   { label: 'In Progress',   color: '#fb923c' },
  resolved:      { label: 'Resolved',      color: '#34d399' },
  closed:        { label: 'Closed',        color: '#64748b' },
  proposed:      { label: 'Proposed',      color: '#94a3b8' },
  approved:      { label: 'Approved',      color: '#38bdf8' },
  active:        { label: 'Active',        color: '#fb923c' },
  completed:     { label: 'Completed',     color: '#34d399' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const cfg = STATUS_MAP[status] ?? { label: status, color: '#94a3b8' };
  return (
    <Badge color={cfg.color} dot className={className}>
      {cfg.label}
    </Badge>
  );
}

interface UrgencyBadgeProps {
  score: number;
  className?: string;
}

export function UrgencyBadge({ score, className }: UrgencyBadgeProps) {
  const color =
    score >= 90 ? '#ef4444' :
    score >= 70 ? '#f59e0b' :
    score >= 50 ? '#38bdf8' :
                  '#34d399';
  const label =
    score >= 90 ? 'Critical' :
    score >= 70 ? 'High' :
    score >= 50 ? 'Medium' : 'Low';

  return (
    <Badge color={color} className={cn('font-mono', className)}>
      AI {score} · {label}
    </Badge>
  );
}
