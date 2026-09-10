import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Bell, Search, ChevronDown,
  LayoutDashboard, FileText, Lightbulb, Map,
  GraduationCap, Building2, Landmark, TrendingUp,
  User, Settings, LogOut, Plus, Sparkles,
  AlertTriangle, CheckCircle2, Info,
} from 'lucide-react';
import { useAppStore, useActiveRoleConfig } from '@/store';
import { ROLE_CONFIGS, MOCK_NOTIFICATIONS } from '@/mock';
import { cn } from '@/utils';
import type { Role } from '@/types';

// ── Role-specific nav items ─────────────────────────────────────────────────
const NAV_ITEMS: Record<Role, { label: string; href: string; icon: React.ReactNode }[]> = {
  citizen: [
    { label: 'Dashboard',   href: '/dashboard',    icon: <LayoutDashboard size={16} /> },
    { label: 'Problems',    href: '/problems',     icon: <FileText size={16} /> },
    { label: 'Solutions',   href: '/solutions',    icon: <Lightbulb size={16} /> },
    { label: 'Impact Map',  href: '/impact',       icon: <Map size={16} /> },
    { label: 'AI Insights', href: '/ai-insights',  icon: <Sparkles size={16} /> },
  ],
  university: [
    { label: 'Dashboard',     href: '/dashboard',     icon: <LayoutDashboard size={16} /> },
    { label: 'Research Hub',  href: '/universities',  icon: <GraduationCap size={16} /> },
    { label: 'Open Problems', href: '/problems',      icon: <FileText size={16} /> },
    { label: 'Solutions',     href: '/solutions',     icon: <Lightbulb size={16} /> },
    { label: 'AI Insights',   href: '/ai-insights',   icon: <Sparkles size={16} /> },
  ],
  industry: [
    { label: 'Dashboard',   href: '/dashboard',  icon: <LayoutDashboard size={16} /> },
    { label: 'CSR Portal',  href: '/industry',   icon: <Building2 size={16} /> },
    { label: 'Opportunities', href: '/problems', icon: <FileText size={16} /> },
    { label: 'Solutions',   href: '/solutions',  icon: <Lightbulb size={16} /> },
    { label: 'Impact',      href: '/impact',     icon: <TrendingUp size={16} /> },
  ],
  government: [
    { label: 'Dashboard',    href: '/dashboard',   icon: <LayoutDashboard size={16} /> },
    { label: 'Ward Center',  href: '/government',  icon: <Landmark size={16} /> },
    { label: 'Problem Feed', href: '/problems',    icon: <FileText size={16} /> },
    { label: 'Analytics',   href: '/ai-insights',  icon: <Sparkles size={16} /> },
    { label: 'Impact',      href: '/impact',       icon: <TrendingUp size={16} /> },
  ],
};

// ── Notification icon helper ─────────────────────────────────────────────
function NotifIcon({ type }: { type: string }) {
  if (type === 'success') return <CheckCircle2 size={14} className="text-emerald-400" />;
  if (type === 'warning') return <AlertTriangle size={14} className="text-amber-400" />;
  if (type === 'danger')  return <AlertTriangle size={14} className="text-red-400" />;
  return <Info size={14} className="text-sky-400" />;
}

// ── Role Switcher Dropdown ─────────────────────────────────────────────────
function RoleSwitcher() {
  const [open, setOpen] = useState(false);
  const { activeRole, setActiveRole } = useAppStore();
  const config = useActiveRoleConfig();
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-200',
          'text-sm font-medium focus:outline-none',
          open ? 'bg-white/8 border-white/15' : 'bg-white/4 border-white/8 hover:bg-white/7 hover:border-white/12'
        )}
      >
        <span className="text-base leading-none">{config.icon}</span>
        <span style={{ color: config.color }}>{config.label}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="text-slate-400" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-2 right-0 w-72 glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/60 z-50"
          >
            <div className="px-4 pt-3 pb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Switch View
              </p>
            </div>
            <div className="p-2 flex flex-col gap-1">
              {ROLE_CONFIGS.map((role) => {
                const isActive = role.id === activeRole;
                return (
                  <button
                    key={role.id}
                    onClick={() => { setActiveRole(role.id as Role); setOpen(false); }}
                    className={cn(
                      'flex items-start gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all',
                      isActive ? 'bg-white/8' : 'hover:bg-white/5'
                    )}
                  >
                    <span className="text-xl mt-0.5">{role.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-semibold"
                          style={{ color: isActive ? role.color : '#e2e8f0' }}
                        >
                          {role.label}
                        </span>
                        {isActive && (
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: `${role.color}20`,
                              color: role.color,
                            }}
                          >
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-tight mt-0.5">
                        {role.description}
                      </p>
                    </div>
                    {isActive && (
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: role.color }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="px-4 py-3 border-t border-white/6">
              <p className="text-xs text-slate-600">
                🔒 Demo Mode — all data is simulated
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Notification Bell ──────────────────────────────────────────────────────
function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { unreadCount, setUnreadCount } = useAppStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    setOpen((o) => !o);
    if (!open) setUnreadCount(0);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/4 border border-white/8 hover:bg-white/8 hover:border-white/15 transition-all text-slate-400 hover:text-white"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] font-bold flex items-center justify-center"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-2 right-0 w-80 glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/60 z-50"
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              <span className="text-xs text-slate-500">All read</span>
            </div>
            <div className="flex flex-col divide-y divide-white/5 max-h-72 overflow-y-auto">
              {MOCK_NOTIFICATIONS.map((n) => (
                <div key={n.id} className={cn('flex gap-3 px-4 py-3 transition-colors hover:bg-white/4', !n.read && 'bg-indigo-500/5')}>
                  <div className="mt-0.5 shrink-0"><NotifIcon type={n.type} /></div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white">{n.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-white/6">
              <Link to="/notifications" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                View all notifications →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── User Menu ──────────────────────────────────────────────────────────────
function UserMenu() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAppStore();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() ?? 'U';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl bg-white/4 border border-white/8 hover:bg-white/8 hover:border-white/15 transition-all"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </div>
        <span className="text-sm font-medium text-slate-300 max-w-20 truncate hidden sm:block">
          {user?.name.split(' ')[0]}
        </span>
        <ChevronDown size={12} className="text-slate-500 hidden sm:block" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-2 right-0 w-56 glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/60 z-50"
          >
            <div className="px-4 py-3 border-b border-white/6">
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <p className="text-xs text-slate-600 mt-1">Impact Score: <span className="text-amber-400 font-semibold">{user?.impactScore}</span></p>
            </div>
            <div className="p-2">
              {[
                { icon: <User size={14} />, label: 'Profile', href: '/profile' },
                { icon: <Settings size={14} />, label: 'Settings', href: '/settings' },
              ].map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/6 transition-all"
                >
                  <span className="text-slate-500">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => { logout(); navigate('/login'); setOpen(false); }}
                className="flex items-center gap-2.5 px-3 py-2 w-full rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Navbar ─────────────────────────────────────────────────────────────
export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { activeRole, isAuthenticated, user } = useAppStore();
  const config = useActiveRoleConfig();
  const navItems = NAV_ITEMS[activeRole];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isActive = (href: string) =>
    href === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          scrolled
            ? 'glass border-b border-white/8 shadow-xl shadow-black/40'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        {/* Role indicator strip */}
        <div
          className="h-0.5 w-full transition-all duration-500"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${config.color}80 30%, ${config.color} 50%, ${config.color}80 70%, transparent 100%)`,
          }}
        />

        <div className="max-w-screen-xl mx-auto px-4 lg:px-6">
          <div className="flex items-center h-14 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-900/50">
                <span className="text-white text-sm font-black">S</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-tight text-white">SAMADHAAN</span>
                <span className="text-[9px] text-slate-500 tracking-widest uppercase">GovTech Platform</span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-1 ml-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
                    isActive(item.href)
                      ? 'text-white bg-white/8'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  <span className={isActive(item.href) ? 'text-indigo-400' : 'text-slate-600'}>
                    {item.icon}
                  </span>
                  {item.label}
                  {isActive(item.href) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex-1" />

            {/* Right section */}
            <div className="flex items-center gap-2">
              {/* Report Problem CTA */}
              <Link
                to="/problems/new"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-600/30 hover:border-indigo-500/50 transition-all text-sm font-medium"
              >
                <Plus size={14} />
                Report
              </Link>

              {/* Role Switcher */}
              <RoleSwitcher />

              {/* Notifications */}
              {isAuthenticated && <NotificationBell />}

              {/* User Menu or Auth Buttons */}
              {isAuthenticated && user ? (
                <UserMenu />
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/8 transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/4 border border-white/8 hover:bg-white/8 transition-all text-slate-400"
              >
                {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden glass border-t border-white/8 overflow-hidden"
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        isActive(item.href)
                          ? 'bg-white/8 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      )}
                    >
                      <span className={isActive(item.href) ? 'text-indigo-400' : 'text-slate-600'}>
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="mt-2 pt-2 border-t border-white/6 flex flex-col gap-2">
                  <Link
                    to="/problems/new"
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all"
                  >
                    <Plus size={14} />
                    Report a Problem
                  </Link>
                  {!isAuthenticated && (
                    <div className="flex gap-2 pt-1">
                      <Link
                        to="/login"
                        className="flex-1 text-center py-2 rounded-xl text-xs font-semibold bg-white/6 text-white border border-white/10"
                      >
                        Log In
                      </Link>
                      <Link
                        to="/signup"
                        className="flex-1 text-center py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      {/* Spacer for fixed header */}
      <div className="h-[57px]" />
    </>
  );
}
