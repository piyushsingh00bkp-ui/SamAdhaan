import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAppStore, useActiveRoleConfig } from '@/store';
import { ShieldAlert, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Role } from '@/types';
import PageWrapper from '@/components/layout/PageWrapper';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  requireAuth?: boolean;
}

export function ProtectedRoute({ children, allowedRoles, requireAuth = false }: ProtectedRouteProps) {
  const { user, isAuthenticated, activeRole, setActiveRole } = useAppStore();
  const location = useLocation();
  const activeConfig = useActiveRoleConfig();

  // If strict login is required and user is not authenticated
  if (requireAuth && !isAuthenticated && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required and active persona does not match
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(activeRole)) {
    const requiredRole = allowedRoles[0];

    return (
      <PageWrapper>
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-stone-200 dark:border-slate-800 p-6 sm:p-8 text-center shadow-xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
              <ShieldAlert size={32} />
            </div>

            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                Persona Access Guard
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Restricted Console
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                This console requires the <strong className="text-emerald-700 dark:text-emerald-400 uppercase font-bold">{requiredRole}</strong> persona. Your active persona is currently <strong className="capitalize text-slate-800 dark:text-slate-200 font-bold">{activeConfig?.label || activeRole}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 text-xs text-left space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Required Persona:</span>
                <span className="font-bold text-slate-900 dark:text-white capitalize">{requiredRole}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Active Persona:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 capitalize">{activeConfig?.label || activeRole}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                onClick={() => setActiveRole(requiredRole)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <UserCheck size={15} />
                <span>Switch to {requiredRole.toUpperCase()} Persona</span>
              </Button>

              <Link
                to="/dashboard"
                className="block w-full py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return <>{children}</>;
}
