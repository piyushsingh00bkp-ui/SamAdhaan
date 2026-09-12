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
import { useAppStore, useActiveRoleConfig, useLanguage } from '@/store';
import { ROLE_CONFIGS } from '@/mock';
import { cn } from '@/utils';
import type { Role } from '@/types';
import apiClient from '@/api/client';
import { t, SupportedLang } from '@/i18n';

// ── Dynamic Nav Item Builder with i18n ─────────────────────────────────────
const getNavItems = (role: Role, lang: SupportedLang) => {
  const map: Record<Role, { label: string; href: string; icon: React.ReactNode }[]> = {
    citizen: [
      { label: t(lang, 'navDashboard'),   href: '/dashboard',    icon: <LayoutDashboard size={15} /> },
      { label: t(lang, 'navGrievance'),   href: '/problems',     icon: <FileText size={15} /> },
      { label: t(lang, 'navPrototypes'),  href: '/solutions',    icon: <Lightbulb size={15} /> },
      { label: t(lang, 'navImpactMap'),   href: '/impact',       icon: <Map size={15} /> },
      { label: t(lang, 'navAIInsights'),  href: '/ai-insights',  icon: <Sparkles size={15} /> },
    ],
    university: [
      { label: t(lang, 'navDashboard'),     href: '/dashboard',     icon: <LayoutDashboard size={15} /> },
      { label: t(lang, 'navUniversities'),  href: '/universities',  icon: <GraduationCap size={15} /> },
      { label: t(lang, 'navGrievance'),     href: '/problems',      icon: <FileText size={15} /> },
      { label: t(lang, 'navPrototypes'),    href: '/solutions',     icon: <Lightbulb size={15} /> },
      { label: t(lang, 'navAIInsights'),    href: '/ai-insights',   icon: <Sparkles size={15} /> },
    ],
    industry: [
      { label: t(lang, 'navDashboard'),   href: '/dashboard',  icon: <LayoutDashboard size={15} /> },
      { label: t(lang, 'navIndustry'),    href: '/industry',   icon: <Building2 size={15} /> },
      { label: t(lang, 'navGrievance'),   href: '/problems',   icon: <FileText size={15} /> },
      { label: t(lang, 'navImpactMap'),   href: '/impact',     icon: <TrendingUp size={15} /> },
      { label: t(lang, 'navAIInsights'),  href: '/ai-insights',icon: <Sparkles size={15} /> },
    ],
    government: [
      { label: t(lang, 'navDashboard'),    href: '/dashboard',   icon: <LayoutDashboard size={15} /> },
      { label: t(lang, 'navCommandDesk'),  href: '/government',  icon: <Landmark size={15} /> },
      { label: t(lang, 'navGrievance'),    href: '/problems',    icon: <FileText size={15} /> },
      { label: t(lang, 'navAIInsights'),   href: '/ai-insights', icon: <Sparkles size={15} /> },
      { label: t(lang, 'navImpactMap'),    href: '/impact',      icon: <TrendingUp size={15} /> },
    ],
  };
  return map[role] || map.citizen;
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
    return <GraduationCap size={14} className="text-emerald-700" />;
  return <Info size={14} className="text-emerald-600" />;
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
    message: 'Ward 47 road stabilization and drainage dispatch order approved by Executive Engineer.',
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

// ── Official National Government Top Header Bar with Language Switcher ───
function NationalGovHeader() {
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const { language, setLanguage } = useAppStore();

  const handleFontChange = (size: 'sm' | 'md' | 'lg') => {
    setFontSize(size);
    document.documentElement.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg');
    document.documentElement.classList.add(`font-scale-${size}`);
  };

  return (
    <div className="bg-emerald-800 text-white text-[11px] select-none">
      {/* National Tricolor Top Strip */}
      <div className="tricolor-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Official Government of India Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-300 font-bold tracking-wide">{t(language, 'govIndia')}</span>
            <span className="text-emerald-300">|</span>
            <span className="text-white font-medium">Government of India</span>
          </div>
          <span className="hidden md:inline text-emerald-300">•</span>
          <span className="hidden md:inline text-emerald-100">
            {t(language, 'ministry')}
          </span>
        </div>

        {/* Right: Accessibility Toolbar, Helpline & Language Selector */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          <div className="hidden sm:flex items-center gap-1 text-emerald-100 font-semibold">
            <Phone size={11} className="text-amber-300" />
            <span>{t(language, 'tollFree')}: <strong className="text-white">1800-11-2026</strong></span>
          </div>

          <div className="flex items-center gap-1 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700 text-[10px]">
            <span className="text-emerald-200 mr-1 hidden sm:inline">{t(language, 'textSize')}:</span>
            <button
              onClick={() => handleFontChange('sm')}
              className={cn('px-1 rounded hover:text-white', fontSize === 'sm' && 'text-amber-300 font-bold')}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              onClick={() => handleFontChange('md')}
              className={cn('px-1 rounded hover:text-white', fontSize === 'md' && 'text-amber-300 font-bold')}
              title="Standard Font Size"
            >
              A
            </button>
            <button
              onClick={() => handleFontChange('lg')}
              className={cn('px-1 rounded hover:text-white', fontSize === 'lg' && 'text-amber-300 font-bold')}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* Real Language Switcher: English, Hindi, Bengali */}
          <div className="flex items-center gap-1 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700 text-[10px]">
            <Globe size={10} className="text-emerald-300" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLang)}
              className="bg-transparent text-white font-bold border-none focus:outline-none cursor-pointer text-[10px]"
            >
              <option value="en" className="text-slate-900">English</option>
              <option value="hi" className="text-slate-900">हिन्दी (Hindi)</option>
              <option value="bn" className="text-slate-900">বাংলা (Bengali)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main GovTech White & Green Navbar ───────────────────────────────────────
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, activeRole, setActiveRole, logout, language } = useAppStore();
  const activeConfig = useActiveRoleConfig();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Live Dynamic Notifications State
  const [notifications, setNotifications] = useState<any[]>(DEFAULT_NOTIFICATIONS);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const roleRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const fetchLiveNotifications = async () => {
    try {
      setLoadingNotifs(true);
      const res = await apiClient.get('/notifications');
      const data = res.data?.data || res.data;
      if (Array.isArray(data) && data.length > 0) {
        setNotifications(data);
      }
    } catch {
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    fetchLiveNotifications();
    const interval = setInterval(fetchLiveNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = async () => {
    try {
      await apiClient.patch('/notifications/read-all');
    } catch {}
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markSingleAsRead = async (id: string, link?: string) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
    } catch {}
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setNotifDropdownOpen(false);
    if (link) navigate(link);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifDropdownOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const role: Role = activeRole || 'citizen';
  const navItems = getNavItems(role, language);

  return (
    <>
      <NationalGovHeader />

      <header
        className={cn(
          'sticky top-0 z-40 transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">

            {/* ── Brand Emblem Logo ── */}
            <Link to="/" className="flex items-center gap-3.5 group shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center text-emerald-800 font-black shadow-sm group-hover:bg-emerald-100 transition-colors">
                <span className="text-xl">🏛️</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-900 leading-none">
                    SAM<span className="text-emerald-600">ADHAAN</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    GOV.IN
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5">
                  {t(language, 'brandTagline')}
                </span>
              </div>
            </Link>

            {/* ── Desktop Navigation Links ── */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200',
                      isActive
                        ? 'text-emerald-900 bg-emerald-100/80 border border-emerald-300 font-bold shadow-xs'
                        : 'text-slate-700 hover:text-emerald-800 hover:bg-emerald-50'
                    )}
                  >
                    <span className={isActive ? 'text-emerald-700' : 'text-slate-500'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* ── Right Controls ── */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* Role Switcher */}
              <div ref={roleRef} className="relative hidden md:block">
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-900 hover:bg-emerald-100 transition-colors shadow-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="capitalize">{activeConfig?.label || activeRole}</span>
                  <ChevronDown size={13} className={cn('transition-transform text-emerald-700', roleDropdownOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {roleDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-emerald-200 shadow-xl py-2 z-50 overflow-hidden"
                    >
                      <div className="px-3 py-1.5 border-b border-emerald-100">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Switch Persona</p>
                      </div>
                      {ROLE_CONFIGS.map((cfg) => {
                        const isSelected = cfg.id === activeRole;
                        return (
                          <button
                            key={cfg.id}
                            onClick={() => {
                              setActiveRole(cfg.id);
                              setRoleDropdownOpen(false);
                            }}
                            className={cn(
                              'w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors',
                              isSelected
                                ? 'bg-emerald-50 text-emerald-900 font-bold border-l-4 border-emerald-600'
                                : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-900'
                            )}
                          >
                            <div>
                              <div className="capitalize font-bold">{cfg.label}</div>
                              <div className="text-[10px] text-slate-500 font-normal">{cfg.description}</div>
                            </div>
                            {isSelected && <CheckCircle2 size={14} className="text-emerald-600 shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dynamic Notification Bell */}
              <div ref={notifRef} className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 sm:p-2.5 rounded-xl bg-white border border-emerald-200 text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer shadow-xs"
                  title="Notifications"
                >
                  <Bell size={17} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-600 text-[9px] font-black text-white items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-[calc(100vw-32px)] sm:w-96 max-w-sm rounded-2xl bg-white border border-emerald-200 shadow-2xl py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/50">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{t(language, 'notifications')}</h4>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                              {unreadCount} unread
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCheck size={13} />
                            <span>{t(language, 'markRead')}</span>
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-emerald-50 scrollbar-thin scrollbar-thumb-emerald-200">
                        {loadingNotifs ? (
                          <div className="p-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                            <RefreshCw size={14} className="animate-spin text-emerald-600" />
                            <span>Syncing bulletin...</span>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-500">
                            No notifications at this time.
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => markSingleAsRead(notif.id, notif.link)}
                              className={cn(
                                'p-3 sm:p-3.5 flex gap-3 hover:bg-emerald-50/60 transition-colors cursor-pointer text-left',
                                !notif.read ? 'bg-emerald-50/30' : 'bg-white'
                              )}
                            >
                              <div className="shrink-0 mt-0.5">
                                <NotifIcon type={notif.type} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <p className={cn('text-xs truncate', !notif.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700')}>
                                    {notif.title}
                                  </p>
                                  <span className="text-[10px] text-slate-400 shrink-0">
                                    {formatRelativeTime(notif.createdAt)}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                                  {notif.message}
                                </p>
                              </div>
                              {!notif.read && (
                                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 self-center" />
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      <div className="p-2 border-t border-emerald-100 bg-emerald-50/30 text-center">
                        <Link
                          to="/dashboard"
                          onClick={() => setNotifDropdownOpen(false)}
                          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 block py-1"
                        >
                          View Full Redressal Desk →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Citizen Action Button */}
              <Link
                to="/problems/new"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>{t(language, 'fileGrievance')}</span>
              </Link>

              {/* User Profile / Login */}
              {user ? (
                <div ref={userRef} className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-emerald-200 hover:bg-emerald-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-emerald-200 shadow-xl py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-emerald-100">
                          <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-900"
                        >
                          <User size={14} />
                          <span>{t(language, 'myProfile')}</span>
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
                        >
                          <LogOut size={14} />
                          <span>{t(language, 'logout')}</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 hover:bg-emerald-50 border border-emerald-200 transition-colors"
                >
                  {t(language, 'login')}
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl border border-emerald-200 text-slate-700 hover:bg-emerald-50 transition-colors"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Navigation Drawer ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white border-b border-emerald-200 px-4 py-4 space-y-3 shadow-xl"
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900"
                  >
                    <span className="text-emerald-600">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Persona Switcher */}
              <div className="pt-3 border-t border-emerald-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Switch Role / Persona</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {ROLE_CONFIGS.map((cfg) => {
                    const isSelected = cfg.id === activeRole;
                    return (
                      <button
                        key={cfg.id}
                        onClick={() => {
                          setActiveRole(cfg.id);
                          setMobileMenuOpen(false);
                        }}
                        className={cn(
                          'flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold text-left transition-all',
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-50 text-slate-700 hover:bg-emerald-50 border border-slate-200'
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                        <span className="truncate capitalize">{cfg.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-100 flex flex-col gap-2">
                <Link
                  to="/problems/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                >
                  <Plus size={15} />
                  <span>{t(language, 'fileGrievance')}</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
