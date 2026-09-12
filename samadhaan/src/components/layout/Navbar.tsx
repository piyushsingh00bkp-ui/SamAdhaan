import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Bell, Search, ChevronDown,
  LayoutDashboard, FileText, Lightbulb, Map,
  GraduationCap, Building2, Landmark, TrendingUp,
  User, Settings, LogOut, Plus, Sparkles,
  AlertTriangle, CheckCircle2, Info, CheckCheck,
  Clock, ExternalLink, RefreshCw, Phone, Globe,
  ShieldCheck, HelpCircle, Eye
} from 'lucide-react';
import { useAppStore, useActiveRoleConfig } from '@/store';
import { ROLE_CONFIGS } from '@/mock';
import { cn } from '@/utils';
import type { Role } from '@/types';
import apiClient from '@/api/client';

// ── Role-specific nav items ─────────────────────────────────────────────────
const NAV_ITEMS: Record<Role, { label: string; href: string; icon: React.ReactNode }[]> = {
  citizen: [
    { label: 'Citizen Dashboard',   href: '/dashboard',    icon: <LayoutDashboard size={15} /> },
    { label: 'Grievance Redressal', href: '/problems',     icon: <FileText size={15} /> },
    { label: 'R&D Prototypes',      href: '/solutions',    icon: <Lightbulb size={15} /> },
    { label: 'Geo-Spatial Map',     href: '/impact',       icon: <Map size={15} /> },
    { label: 'AI Intelligence',     href: '/ai-insights',  icon: <Sparkles size={15} /> },
  ],
  university: [
    { label: 'HEI Dashboard',        href: '/dashboard',     icon: <LayoutDashboard size={15} /> },
    { label: 'University R&D Hub',   href: '/universities',  icon: <GraduationCap size={15} /> },
    { label: 'Open Civic Challenges',href: '/problems',      icon: <FileText size={15} /> },
    { label: 'Deployed Solutions',   href: '/solutions',     icon: <Lightbulb size={15} /> },
    { label: 'AI Analytics',         href: '/ai-insights',   icon: <Sparkles size={15} /> },
  ],
  industry: [
    { label: 'CSR Dashboard',       href: '/dashboard',  icon: <LayoutDashboard size={15} /> },
    { label: 'CSR Co-Funding Hub',  href: '/industry',   icon: <Building2 size={15} /> },
    { label: 'Vetted Opportunities',href: '/problems',   icon: <FileText size={15} /> },
    { label: 'SROI Impact',         href: '/impact',     icon: <TrendingUp size={15} /> },
    { label: 'AI Insights',         href: '/ai-insights',icon: <Sparkles size={15} /> },
  ],
  government: [
    { label: 'Command Desk',        href: '/dashboard',   icon: <LayoutDashboard size={15} /> },
    { label: 'Municipal Ward Hub',  href: '/government',  icon: <Landmark size={15} /> },
    { label: 'Grievance Pipeline',  href: '/problems',    icon: <FileText size={15} /> },
    { label: 'Predictive Radar',    href: '/ai-insights', icon: <Sparkles size={15} /> },
    { label: 'National Map',        href: '/impact',      icon: <TrendingUp size={15} /> },
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
  return <Info size={14} className="text-sky-400" />;
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

// ── Official National Government Top Header Bar ───────────────────────────
function NationalGovHeader() {
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [lang, setLang] = useState('English');

  const handleFontChange = (size: 'sm' | 'md' | 'lg') => {
    setFontSize(size);
    document.documentElement.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg');
    document.documentElement.classList.add(`font-scale-${size}`);
  };

  return (
    <div className="bg-gov-navy-950 border-b border-white/8 text-[11px] text-slate-300 select-none">
      {/* National Tricolor Top Strip */}
      <div className="tricolor-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Official Government of India Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold tracking-wide">भारत सरकार</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-200 font-medium">Government of India</span>
          </div>
          <span className="hidden md:inline text-slate-600">•</span>
          <span className="hidden md:inline text-slate-400">
            आवासन और शहरी कार्य मंत्रालय | Ministry of Housing & Urban Affairs (MoHUA)
          </span>
        </div>

        {/* Right: Accessibility Toolbar, Helpline & Language Selector */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          {/* Toll Free Helpline */}
          <div className="hidden sm:flex items-center gap-1 text-emerald-400 font-semibold">
            <Phone size={11} />
            <span>Toll-Free Helpline: <strong>1800-11-2026</strong></span>
          </div>

          {/* Text Size Accessibility Controls (GIGW Compliant) */}
          <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded border border-white/10 text-[10px]">
            <span className="text-slate-400 mr-1 hidden sm:inline">Text:</span>
            <button
              onClick={() => handleFontChange('sm')}
              className={cn('px-1 rounded hover:text-white', fontSize === 'sm' && 'text-amber-400 font-bold')}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              onClick={() => handleFontChange('md')}
              className={cn('px-1 rounded hover:text-white', fontSize === 'md' && 'text-amber-400 font-bold')}
              title="Standard Font Size"
            >
              A
            </button>
            <button
              onClick={() => handleFontChange('lg')}
              className={cn('px-1 rounded hover:text-white', fontSize === 'lg' && 'text-amber-400 font-bold')}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 text-slate-300">
            <Globe size={11} className="text-amber-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-slate-200 text-[10px] focus:outline-none cursor-pointer"
            >
              <option value="English" className="bg-slate-900 text-white">English</option>
              <option value="Hindi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
              <option value="Marathi" className="bg-slate-900 text-white">मराठी (Marathi)</option>
              <option value="Bengali" className="bg-slate-900 text-white">বাংলা (Bengali)</option>
            </select>
          </div>

          <div className="hidden lg:flex items-center gap-1 text-[10px] text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            <ShieldCheck size={11} />
            <span>Digital India Aligned</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 bg-gov-navy-800/80 border-blue-500/30 text-blue-200 hover:bg-gov-navy-700 cursor-pointer shadow-sm"
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
        <span>{config.label} Portal</span>
        <ChevronDown size={12} className={cn('transition-transform duration-200 opacity-70', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-2 left-0 w-72 glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/70 z-50 p-2 space-y-1 bg-gov-navy-900"
          >
            <p className="text-[10px] text-amber-400 uppercase tracking-widest font-bold px-3 py-1.5">
              Select Stakeholder Portal
            </p>
            {ROLE_CONFIGS.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setActiveRole(r.id);
                  setOpen(false);
                }}
                className={cn(
                  'w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all cursor-pointer',
                  activeRole === r.id ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-white/5'
                )}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: `${r.color}20`, color: r.color }}
                >
                  <span className="text-xs font-bold">{r.label[0]}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white">{r.label} Portal</p>
                  <p className="text-[11px] text-slate-400 truncate">{r.description}</p>
                </div>
                {activeRole === r.id && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-amber-400" />
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
      // Handled cleanly
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveNotifications();
    const interval = setInterval(fetchLiveNotifications, 30000);
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
    } catch {}
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
        className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gov-navy-800 border border-white/10 hover:bg-gov-navy-700 transition-all text-slate-300 hover:text-white cursor-pointer"
        aria-label="Official Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 text-gov-navy-950 text-[9px] font-black flex items-center justify-center shadow-md shadow-amber-500/50"
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
            className="absolute top-full mt-2 right-0 w-84 sm:w-96 glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/80 z-50 flex flex-col bg-gov-navy-900"
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-white/6">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Official Alerts & Telemetry</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                >
                  <CheckCheck size={13} />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-white/2 border-b border-white/4 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer',
                  filter === 'all' ? 'bg-blue-600/30 text-white font-bold border border-blue-500/30' : 'text-slate-400 hover:text-white'
                )}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer',
                  filter === 'unread' ? 'bg-blue-600/30 text-white font-bold border border-blue-500/30' : 'text-slate-400 hover:text-white'
                )}
              >
                Unread ({unreadCount})
              </button>

              <button
                onClick={fetchLiveNotifications}
                disabled={loading}
                className="ml-auto text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-md"
                title="Refresh alerts"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            <div className="flex flex-col divide-y divide-white/5 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
              {displayedNotifications.length === 0 ? (
                <div className="py-8 px-4 text-center text-slate-500 text-xs">
                  <Bell size={24} className="mx-auto mb-2 opacity-30" />
                  <p className="font-semibold text-slate-400">No {filter === 'unread' ? 'unread ' : ''}notifications</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">You are up to date with municipal and AI dispatch notices.</p>
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
                        isUnread ? 'bg-blue-600/10' : 'bg-transparent'
                      )}
                    >
                      <div className="mt-1 shrink-0">
                        <div className="w-7 h-7 rounded-xl bg-gov-navy-800 border border-white/8 flex items-center justify-center">
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
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 self-center animate-pulse" />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-4 py-2.5 border-t border-white/6 bg-white/2 flex items-center justify-between text-xs">
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                View Command Desk
              </Link>
              <Link
                to="/problems"
                onClick={() => setOpen(false)}
                className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Live Grievances</span>
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
        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl bg-gov-navy-800 border border-white/10 hover:bg-gov-navy-700 transition-all cursor-pointer"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-gov-navy-950 text-xs font-black">
          {initials}
        </div>
        <span className="text-xs font-bold text-slate-200 max-w-[85px] truncate hidden sm:block">
          {user?.name || 'Officer'}
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
            className="absolute top-full mt-2 right-0 w-56 glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/80 z-50 p-1.5 space-y-1 bg-gov-navy-900"
          >
            <div className="px-3 py-2 border-b border-white/6">
              <p className="text-xs font-black text-white truncate">{user?.name || 'Citizen User'}</p>
              <p className="text-[11px] text-amber-400 truncate font-mono">{user?.email || 'citizen@samadhaan.gov.in'}</p>
            </div>

            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/6 transition-colors"
            >
              <User size={14} className="text-slate-400" />
              <span>Citizen Profile & Score</span>
            </Link>

            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/6 transition-colors"
            >
              <LayoutDashboard size={14} className="text-slate-400" />
              <span>National Dashboard</span>
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
                <span>Secure Sign Out</span>
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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-gov-navy-950/95 border-b border-blue-900/40 shadow-xl">
      {/* 1. Official National Government Top Header */}
      <NationalGovHeader />

      {/* 2. Main GovTech Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        {/* Left: Brand Identity & Emblem */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-blue-600 flex items-center justify-center text-gov-navy-950 font-black text-base shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform border border-amber-300/40">
              🏛️
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-white leading-none">
                  समा<span className="text-amber-400">धान</span>
                </span>
                <span className="text-xs font-bold text-blue-300">SAMADHAAN</span>
              </div>
              <span className="text-[9px] font-bold text-amber-300/90 tracking-wider uppercase mt-0.5">
                National Multi-Stakeholder GovTech Platform
              </span>
            </div>
          </Link>

          <div className="hidden md:block">
            <RoleSwitcher />
          </div>
        </div>

        {/* Center: Main Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-gov-navy-800'
                )}
              >
                <span className={cn('transition-colors', isActive ? 'text-white' : 'text-blue-400')}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Report Grievance, Notifications, Profile */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/problems/new"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-gov-navy-950 text-xs font-black shadow-lg shadow-orange-500/20 transition-all cursor-pointer border border-amber-300/40"
          >
            <Plus size={14} />
            <span>Log Grievance</span>
          </Link>

          {/* Dynamic Notification Bell */}
          <NotificationBell />

          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-gov-navy-800 transition-all border border-white/10"
              >
                Official Sign In
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gov-navy-800 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
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
            className="lg:hidden border-t border-white/8 bg-gov-navy-950/98 backdrop-blur-2xl px-4 py-4 space-y-3"
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
                      ? 'bg-blue-600 text-white'
                      : 'bg-gov-navy-800 text-slate-300 hover:bg-gov-navy-700'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <Link
              to="/problems/new"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 text-gov-navy-950 text-xs font-black shadow-lg shadow-amber-500/25"
            >
              <Plus size={14} />
              <span>Log Grievance with AI Triage</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
