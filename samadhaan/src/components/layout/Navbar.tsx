import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Bell, Search, ChevronDown,
  LayoutDashboard, FileText, Lightbulb, Map,
  GraduationCap, Building2, Landmark, TrendingUp,
  User, Settings, LogOut, Plus, Sparkles,
  AlertTriangle, CheckCircle2, Info, CheckCheck,
  Clock, ExternalLink, RefreshCw
} from 'lucide-react';
import { useAppStore, useActiveRoleConfig } from '@/store';
import { ROLE_CONFIGS } from '@/mock';
import { cn } from '@/utils';
import type { Role } from '@/types';
import apiClient from '@/api/client';

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
  if (type === 'success' || type === 'RESOLUTION' || type === 'ASSIGNED')
    return <CheckCircle2 size={14} className="text-emerald-400" />;
  if (type === 'warning' || type === 'SLA_ALERT' || type === 'HOTSPOT')
    return <AlertTriangle size={14} className="text-amber-400" />;
  if (type === 'danger' || type === 'CRITICAL')
    return <AlertTriangle size={14} className="text-red-400" />;
  if (type === 'CSR' || type === 'GRANT')
    return <Building2 size={14} className="text-emerald-400" />;
  if (type === 'UNIVERSITY' || type === 'RESEARCH')
    return <GraduationCap size={14} className="text-violet-400" />;
  return <Info size={14} className="text-indigo-400" />;
}

function formatRelativeTime(dateStr?: string) {
  if (!dateStr) return 'Just now';
  try {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return 'Recently';
  }
}

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-01',
    title: 'Municipal Works Sanction Issued',
    message: 'Ward 47 Hinjewadi road stabilization and drainage dispatch order approved by Executive Engineer.',
    type: 'success',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    link: '/government'
  },
  {
    id: 'notif-02',
    title: 'AI Multi-Stakeholder Match',
    message: 'COEP Technological University & Tata Trusts CSR co-matched for Clean Water Sensor Array.',
    type: 'CSR',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    link: '/universities'
  },
  {
    id: 'notif-03',
    title: 'SLA Escalation Milestone',
    message: 'Critical Pothole Cluster on Ring Road reached 84 upvotes and transitioned to In-Progress.',
    type: 'warning',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    link: '/problems'
  }
];

// ── Role Switcher Dropdown ─────────────────────────────────────────────────
function RoleSwitcher() {
  const [open, setOpen] = useState(false);
  const { activeRole, setActiveRole } = useAppStore();
  const config = useActiveRoleConfig();
  const ref = useRef<HTMLDivElement>(null);

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
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200"
        style={{
          backgroundColor: `${config.color}15`,
          borderColor: `${config.color}35`,
          color: config.color,
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
        <span>{config.label}</span>
        <ChevronDown size={12} className={cn('transition-transform duration-200 opacity-60', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-2 left-0 w-72 glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/60 z-50 p-2 space-y-1"
          >
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold px-3 py-1.5">
              Switch Perspective
            </p>
            {ROLE_CONFIGS.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRole(r.id);
                  setOpen(false);
                }}
                className={cn(
                  'w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all',
                  activeRole === r.id ? 'bg-white/8 border border-white/10' : 'hover:bg-white/4'
                )}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: `${r.color}20`, color: r.color }}
                >
                  <span className="text-xs font-bold">{r.label[0]}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white">{r.label}</p>
                  <p className="text-[11px] text-slate-400 truncate">{r.description}</p>
                </div>
                {activeRole === r.id && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: r.color }} />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Notification Bell ──────────────────────────────────────────────────────
function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<any[]>(DEFAULT_NOTIFICATIONS);
  const [loading, setLoading] = useState(false);
  const { unreadCount, setUnreadCount, isAuthenticated } = useAppStore();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  const fetchLiveNotifications = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await apiClient.get('/notifications');
      const data = res.data?.data || res.data;
      if (Array.isArray(data) && data.length > 0) {
        setNotifications(data);
        const unread = data.filter((n: any) => !n.isRead && !n.read).length;
        setUnreadCount(unread);
      }
    } catch {
      // Fallback smoothly
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveNotifications();
    const interval = setInterval(fetchLiveNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    const unread = notifications.filter((n) => !n.read && !n.isRead).length;
    setUnreadCount(unread);
  }, [notifications]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true, isRead: true })));
    setUnreadCount(0);
    try {
      await apiClient.patch('/notifications/read-all');
    } catch {
      // Handled in state
    }
  };

  const handleItemClick = async (n: any) => {
    if (!n.read && !n.isRead) {
      setNotifications((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, read: true, isRead: true } : item))
      );
      try {
        await apiClient.patch(`/notifications/${n.id}/read`);
      } catch {}
    }
    setOpen(false);
    if (n.link) {
      navigate(n.link);
    }
  };

  const displayedNotifications = filter === 'unread'
    ? notifications.filter((n) => !n.read && !n.isRead)
    : notifications;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/4 border border-white/8 hover:bg-white/8 hover:border-white/15 transition-all text-slate-400 hover:text-white cursor-pointer"
        aria-label="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] font-black flex items-center justify-center shadow-lg shadow-indigo-500/50"
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
            className="absolute top-full mt-2 right-0 w-84 sm:w-96 glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/80 z-50 flex flex-col"
          >
            {/* Notification Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-white/6">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Live Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                >
                  <CheckCheck size={13} />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Filter Pill Tabs */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/2 border-b border-white/4 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer',
                  filter === 'all' ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-white'
                )}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer',
                  filter === 'unread' ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-white'
                )}
              >
                Unread ({unreadCount})
              </button>

              <button
                onClick={fetchLiveNotifications}
                disabled={loading}
                className="ml-auto text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-md"
                title="Refresh notifications"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            {/* Notifications Feed */}
            <div className="flex flex-col divide-y divide-white/5 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
              {displayedNotifications.length === 0 ? (
                <div className="py-8 px-4 text-center text-slate-500 text-xs">
                  <Bell size={24} className="mx-auto mb-2 opacity-30" />
                  <p className="font-semibold text-slate-400">No {filter === 'unread' ? 'unread ' : ''}notifications</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">You're all caught up with municipal & AI updates.</p>
                </div>
              ) : (
                displayedNotifications.map((n) => {
                  const isUnread = !n.read && !n.isRead;
                  return (
                    <div
                      key={n.id}
                      onClick={() => handleItemClick(n)}
                      className={cn(
                        'flex gap-3 px-4 py-3 transition-colors hover:bg-white/6 cursor-pointer relative group',
                        isUnread ? 'bg-indigo-500/8' : 'bg-transparent'
                      )}
                    >
                      <div className="mt-1 shrink-0">
                        <div className="w-7 h-7 rounded-xl bg-white/4 border border-white/8 flex items-center justify-center">
                          <NotifIcon type={n.type} />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <p className={cn('text-xs truncate', isUnread ? 'font-bold text-white' : 'font-medium text-slate-300')}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-500 shrink-0 flex items-center gap-1">
                            <Clock size={10} />
                            {formatRelativeTime(n.createdAt)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                          {n.message}
                        </p>
                      </div>

                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 self-center animate-pulse" />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Footer */}
            <div className="px-4 py-2.5 border-t border-white/6 bg-white/2 flex items-center justify-between text-xs">
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/problems"
                onClick={() => setOpen(false)}
                className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Live Feed</span>
                <ExternalLink size={11} />
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

  const initials = user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'U';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl bg-white/4 border border-white/8 hover:bg-white/8 hover:border-white/15 transition-all cursor-pointer"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </div>
        <span className="text-xs font-medium text-slate-300 max-w-[80px] truncate hidden sm:block">
          {user?.name || 'Account'}
        </span>
        <ChevronDown size={12} className={cn('transition-transform duration-200 text-slate-400', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-2 right-0 w-52 glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/60 z-50 p-1.5 space-y-1"
          >
            <div className="px-3 py-2 border-b border-white/6">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Citizen User'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || 'citizen@samadhaan.gov.in'}</p>
            </div>

            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/6 transition-colors"
            >
              <User size={14} className="text-slate-400" />
              <span>My Profile & Score</span>
            </Link>

            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/6 transition-colors"
            >
              <LayoutDashboard size={14} className="text-slate-400" />
              <span>Citizen Dashboard</span>
            </Link>

            <div className="border-t border-white/6 pt-1">
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                  navigate('/login');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Navbar ────────────────────────────────────────────────────────────
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { activeRole, isAuthenticated } = useAppStore();
  const location = useLocation();
  const navItems = NAV_ITEMS[activeRole] ?? NAV_ITEMS.citizen;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/8 backdrop-blur-xl bg-surface-base/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        {/* Left: Brand Logo & Role Selector */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-white leading-none">
                SAM<span className="text-indigo-400">ADHAAN</span>
              </span>
              <span className="text-[9px] font-semibold text-slate-500 tracking-wider uppercase">
                GovTech AI Platform
              </span>
            </div>
          </Link>

          <div className="hidden md:block">
            <RoleSwitcher />
          </div>
        </div>

        {/* Center: Main Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                )}
              >
                <span className={cn('transition-colors', isActive ? 'text-indigo-400' : 'text-slate-400')}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Quick Actions, Notification Bell & User */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/problems/new"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Report Issue</span>
          </Link>

          {/* Dynamic Notification Bell */}
          <NotificationBell />

          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/4 border border-white/8 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/8 bg-surface-base/95 backdrop-blur-2xl px-4 py-4 space-y-3"
          >
            <div className="pb-2 border-b border-white/6">
              <RoleSwitcher />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all',
                    location.pathname === item.href
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/4 text-slate-300 hover:bg-white/8'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <Link
              to="/problems/new"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              <Plus size={14} />
              <span>Report Grievance</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
