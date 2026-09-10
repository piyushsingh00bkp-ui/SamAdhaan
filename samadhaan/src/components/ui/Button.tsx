import { forwardRef } from 'react';
import { cn } from '@/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'saffron' | 'outline';
type Size = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40 border border-indigo-500/30',
  secondary:
    'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-white/20',
  ghost:
    'hover:bg-white/6 text-slate-300 hover:text-white',
  danger:
    'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30',
  saffron:
    'bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold shadow-lg shadow-amber-900/30',
  outline:
    'border border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10',
};

const sizes: Record<Size, string> = {
  xs: 'px-2.5 py-1 text-xs gap-1',
  sm: 'px-3.5 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, leftIcon, rightIcon, children, className, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-[0.97]',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
);
Button.displayName = 'Button';
