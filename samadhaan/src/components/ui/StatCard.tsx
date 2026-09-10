import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { cn } from '@/utils';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  formatter?: (n: number) => string;
}

export function AnimatedCounter({
  value,
  duration = 2,
  className,
  formatter = (n) => Math.round(n).toLocaleString('en-IN'),
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: duration * 1000, bounce: 0 });

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, value, motionVal]);

  useEffect(() => {
    return spring.on('change', (v) => {
      if (ref.current) ref.current.textContent = formatter(v);
    });
  }, [spring, formatter]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      0
    </span>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  formatter?: (n: number) => string;
  icon?: React.ReactNode;
  color?: string;
  trend?: number;
  delay?: number;
}

export function StatCard({ label, value, suffix, prefix, formatter, icon, color = '#6366f1', trend, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass rounded-2xl p-5 flex flex-col gap-3 hover:border-white/15 transition-colors"
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        {icon && (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}18`, color }}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <div className="flex items-baseline gap-1">
          {prefix && <span className="text-lg text-slate-400">{prefix}</span>}
          <span className="text-2xl font-bold text-white">
            <AnimatedCounter
              value={value}
              formatter={formatter ?? ((n) => Math.round(n).toLocaleString('en-IN'))}
            />
          </span>
          {suffix && <span className="text-sm text-slate-400">{suffix}</span>}
        </div>
        {trend !== undefined && (
          <span className={cn('text-xs font-medium mb-0.5', trend >= 0 ? 'text-emerald-400' : 'text-red-400')}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
    </motion.div>
  );
}
