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
    { label: 'Impact Map',          href: '/impact',       icon: <Map size={15} /> },
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

function NotifIcon({ type }: { type: string }) {
  if (type === 'success' || type === 'RESOLUTION' || type === 'ASSIGNED')
    return <CheckCircle2 size={14} className="text-emerald-600" />;
  if (type === 'warning' || type === 'SLA_ALERT' || type === 'HOTSPOT')
    return <AlertTriangle size={14} className="text-amber-600" />;
  if (type === 'danger' || type === 'CRITICAL')
    return <AlertTriangle size={14} className="text-red-600" />;
  if (type === 'CSR' || type === 'GRANT')
    return <Building2 size={14} className="text-emerald-600" />;
  if (type === 'UNIVERSITY' || type === 'RESEARCH')
    return <GraduationCap size={14} className="text-indigo-600" />;
  return <Info size={14} className="text-blue-600" />;
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
    <div className="bg-[#0a192f] text-white text-[11px] select-none">
      {/* National Tricolor Top Strip */}
      <div className="tricolor-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Official Government of India Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold tracking-wide">भारत सरकार</span>
            <span className="text-slate-400">|</span>
            <span className="text-white font-medium">Government of India</span>
          </div>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-slate-300">
            आवासन और शहरी कार्य मंत्रालय | Ministry of Housing & Urban Affairs (MoHUA)
          </span>
        </div>

        {/* Right: Accessibility Toolbar, Helpline & Language Selector */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          <div className="hidden sm:flex items-center gap-1 text-emerald-400 font-semibold">
            <Phone size={11} />
            <span>Toll-Free Helpline: <strong>1800-11-2026</strong></span>
          </div>

          <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded border border-white/15 text-[10px]">
            <span className="text-slate-300 mr-1 hidden sm:inline">Text:</span>
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

          <div className="flex items-center gap-1 text-slate-200">
            <Globe size={11} className="text-amber-400" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-white text-[10px] focus:outline-none cursor-pointer"
            >
              <option value="English" className="bg-slate-900 text-white">English</option>
              <option value="Hindi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
              <option value="Marathi" className="bg-slate-900 text-white">मराठी (Marathi)</option>
              <option value="Bengali" className="bg-slate-900 text-white">বাংলা (Bengali)</option>
            </select>
          </div>

          <div className="hidden lg:flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
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
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100 cursor-pointer shadow-sm"
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
        <span>{config.label} Portal</span>
        <ChevronDown size={12} className={cn('transition-transform duration-200 opacity-70 text-blue-800', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-2 left-0 w-72 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl z-50 p-2 space-y-1"
          >
            <p className="text-[10px] text-amber-700 uppercase tracking-widest font-bold px-3 py-1.5">
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
                  activeRole === r.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                )}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: `${r.color}20`, color: r.color }}
                >
                  <span className="text-xs font-bold">{r.label[0]}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900">{r.label} Portal</p>
                  <p className="text-[11px] text-slate-500 truncate">{r.description}</p>
                </div>
                {activeRole === r.id && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full mt-2 shrink-0 bg-blue-600" />
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
      // Fallback
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
        className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-all text-slate-700 cursor-pointer"
        aria-label="Official Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-orange-600 text-white text-[9px] font-black flex items-center justify-center shadow-md shadow-orange-500/50"
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
            className="absolute top-full mt-2 right-0 w-84 sm:w-96 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Official Alerts & Telemetry</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                >
                  <CheckCheck size={13} />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer',
                  filter === 'all' ? 'bg-white text-blue-900 font-bold shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={cn(
                  'px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer',
                  filter === 'unread' ? 'bg-white text-blue-900 font-bold shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Unread ({unreadCount})
              </button>

              <button
                onClick={fetchLiveNotifications}
                disabled={loading}
                className="ml-auto text-slate-500 hover:text-slate-800 transition-colors p-1 rounded-md"
                title="Refresh alerts"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            <div className="flex flex-col divide-y divide-slate-100 max-h-80 overflow-y-auto">
              {displayedNotifications.length === 0 ? (
                <div className="py-8 px-4 text-center text-slate-500 text-xs">
                  <Bell size={24} className="mx-auto mb-2 opacity-30 text-slate-400" />
                  <p className="font-semibold text-slate-700">No {filter === 'unread' ? 'unread ' : ''}notifications</p>
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
                        'flex gap-3 px-4 py-3 transition-colors hover:bg-slate-50 cursor-pointer relative group',
                        isUnread ? 'bg-blue-50/60' : 'bg-transparent'
                      )}
                    >
                      <div className="mt-1 shrink-0">
                        <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                          <NotifIcon type={n.type} />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <p className={cn('text-xs truncate', isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-700')}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-500 shrink-0 flex items-center gap-1">
                            <Clock size={10} />
                            {formatRelativeTime(n.createdAt)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                          {n.message}
                        </p>
                      </div>

                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-orange-600 shrink-0 self-center" />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                View Dashboard
              </Link>
              <Link
                to="/problems"
                onClick={() => setOpen(false)}
                className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 transition-colors"
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
        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-all cursor-pointer"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
          {initials}
        </div>
        <span className="text-xs font-bold text-slate-800 max-w-[85px] truncate hidden sm:block">
          {user?.name || 'Officer'}
        </span>
        <ChevronDown size={12} className={cn('transition-transform duration-200 text-slate-500', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-2 right-0 w-56 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl z-50 p-1.5 space-y-1"
          >
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-xs font-black text-slate-900 truncate">{user?.name || 'Citizen User'}</p>
              <p className="text-[11px] text-blue-700 truncate font-mono">{user?.email || 'citizen@samadhaan.gov.in'}</p>
            </div>

            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors font-medium"
            >
              <User size={14} className="text-slate-500" />
              <span>Citizen Profile & Score</span>
            </Link>

            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors font-medium"
            >
              <LayoutDashboard size={14} className="text-slate-500" />
              <span>National Dashboard</span>
            </Link>

            <div className="border-t border-slate-100 pt-1">
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                  navigate('/login');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors font-bold cursor-pointer"
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
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
      {/* 1. Official National Government Top Header Bar */}
      <NationalGovHeader />

      {/* 2. Main Light GovTech Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        {/* Left: Brand Identity & Official Emblem */}
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-blue-700 flex items-center justify-center text-white font-black text-lg shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform border border-amber-300">
              🏛️
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
                  समा<span className="text-orange-600">धान</span>
                </span>
                <span className="text-xs font-black text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">SAMADHAAN</span>
              </div>
              <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase mt-0.5">
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
                  'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-blue-700 hover:bg-slate-100'
                )}
              >
                <span className={cn('transition-colors', isActive ? 'text-white' : 'text-blue-600')}>
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
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
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
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-700 hover:bg-slate-100 transition-all border border-slate-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 cursor-pointer"
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
            className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg"
          >
            <div className="pb-2 border-b border-slate-100">
              <RoleSwitcher />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all',
                    location.pathname === item.href
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <Link
              to="/problems/new"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-md"
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
