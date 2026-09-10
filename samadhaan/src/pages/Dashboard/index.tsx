import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  TrendingUp, MapPin, CheckCircle2, Clock, AlertTriangle,
  Plus, Sparkles, ArrowRight, Users, FileText,
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge, UrgencyBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppStore, useActiveRoleConfig } from '@/store';
import { MOCK_PROBLEMS, MOCK_SOLUTIONS, PLATFORM_STATS, TREND_DATA } from '@/mock';
import { formatNumber } from '@/utils';
import apiClient from '@/api/client';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { CATEGORY_BREAKDOWN } from '@/mock';

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 border border-white/10 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-white font-semibold">{p.value?.toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user, login } = useAppStore();
  const roleConfig = useActiveRoleConfig();
  const [stats, setStats] = useState(PLATFORM_STATS);
  const [recentProblems, setRecentProblems] = useState(MOCK_PROBLEMS.slice(0, 4));
  const activeSolutions = MOCK_SOLUTIONS.filter((s) => s.status === 'active');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [overviewRes, challengesRes, userRes] = await Promise.allSettled([
          apiClient.get('/analytics/overview'),
          apiClient.get('/challenges?limit=4'),
          apiClient.get('/users/me'),
        ]);

        if (overviewRes.status === 'fulfilled' && overviewRes.value.data?.data) {
          const o = overviewRes.value.data.data;
          setStats((prev) => ({
            ...prev,
            totalProblems: o.totalChallenges || prev.totalProblems,
            resolvedProblems: o.resolvedChallenges || prev.resolvedProblems,
            activeProblems: o.activeChallenges || prev.activeProblems,
            peopleImpacted: o.totalPeopleImpacted || prev.peopleImpacted,
          }));
        }

        if (challengesRes.status === 'fulfilled') {
          const items = challengesRes.value.data?.data?.items || challengesRes.value.data?.data;
          if (Array.isArray(items) && items.length > 0) {
            setRecentProblems(
              items.slice(0, 4).map((c: any) => ({
                id: c.id,
                title: c.title,
                description: c.description,
                category: (c.category?.toLowerCase().includes('water') ? 'water' : c.category?.toLowerCase().includes('sanit') ? 'sanitation' : 'infrastructure') as any,
                status: (c.status?.toLowerCase().includes('resolv') ? 'resolved' : c.status?.toLowerCase().includes('progress') ? 'in_progress' : 'submitted') as any,
                location: { lat: c.latitude ?? 18.5204, lng: c.longitude ?? 73.8567 },
                locationName: c.locationName || `${c.city || ''}, ${c.state || ''}`,
                state: c.state || 'Maharashtra',
                district: c.district || 'Pune',
                aiUrgencyScore: c.aiUrgencyScore ?? c.severity ?? 85,
                aiTags: c.aiTags ?? [c.category, 'Civic Issue'],
                upvotes: c.upvotes ?? 1,
                reportedBy: c.author?.name ?? 'Citizen',
                reportedAt: c.createdAt ?? new Date().toISOString(),
                updatedAt: c.updatedAt ?? new Date().toISOString(),
                mediaCount: c.mediaUrls?.length ?? 0,
                commentCount: c._count?.comments ?? 0,
                similarProblemIds: [],
              }))
            );
          }
        }

        if (userRes.status === 'fulfilled' && userRes.value.data?.data) {
          const u = userRes.value.data.data;
          if (user) {
            login({
              ...user,
              id: u.id || user.id,
              name: u.name || user.name,
              email: u.email || user.email,
              problemsReported: u.problemsReported ?? user.problemsReported ?? 0,
              solutionsContributed: u.solutionsContributed ?? user.solutionsContributed ?? 0,
              evidenceUploaded: u.evidenceUploaded ?? 0,
              totalUpvotes: u.totalUpvotes ?? 0,
              resolvedProblems: u.resolvedProblems ?? 0,
              impactScore: u.impactScore ?? user.impactScore ?? 10,
              citizenProfile: u.citizenProfile || user.citizenProfile,
            });
          }
        }
      } catch (err) {
        // Fallback gracefully
      }
    };
    loadDashboardData();
  }, []);

  return (
    <PageWrapper withFooter={false}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{roleConfig.icon}</span>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: roleConfig.color }}>
                {roleConfig.label} Dashboard
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">
              Good morning, {user?.name.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass rounded-2xl px-4 py-2 border border-white/8">
              <p className="text-xs text-slate-500">Impact Score</p>
              <p className="text-2xl font-black text-amber-400">{user?.impactScore}</p>
            </div>
            <Link to="/problems/new">
              <Button leftIcon={<Plus size={14} />}>Report Problem</Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Problems" value={stats.totalProblems} formatter={formatNumber} icon={<FileText size={14} />} color="#6366f1" delay={0} />
          <StatCard label="Resolved" value={stats.resolvedProblems} formatter={formatNumber} icon={<CheckCircle2 size={14} />} color="#34d399" trend={8} delay={0.08} />
          <StatCard label="In Progress" value={stats.activeProblems} formatter={formatNumber} icon={<Clock size={14} />} color="#f59e0b" delay={0.16} />
          <StatCard label="People Impacted" value={stats.peopleImpacted} formatter={formatNumber} icon={<Users size={14} />} color="#38bdf8" delay={0.24} />
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Trend chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass rounded-2xl p-5 border border-white/8"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Resolution Trend</p>
                <p className="text-base font-bold text-white">2026 Progress</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                {[{ color: '#6366f1', label: 'Reported' }, { color: '#34d399', label: 'Resolved' }].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: l.color }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={TREND_DATA}>
                <defs>
                  <linearGradient id="dProblems" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="problems" stroke="#6366f1" fill="url(#dProblems)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="resolved" stroke="#34d399" fill="url(#dResolved)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category donut */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass rounded-2xl p-5 border border-white/8"
          >
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">By Category</p>
            <p className="text-base font-bold text-white mb-4">Problem Types</p>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={CATEGORY_BREAKDOWN.slice(0, 6)} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="count">
                  {CATEGORY_BREAKDOWN.slice(0, 6).map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => [v.toLocaleString('en-IN'), 'Count']} contentStyle={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 mt-2">
              {CATEGORY_BREAKDOWN.slice(0, 4).map((cat) => (
                <div key={cat.category} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs text-slate-500 flex-1 capitalize">{cat.category}</span>
                  <span className="text-xs text-white font-medium">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Insight panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-5 border border-white/8 border-l-indigo-500/40 border-l-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                <Sparkles size={13} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-indigo-400 font-semibold">AI Insights</p>
                <p className="text-sm font-bold text-white">For Your Area</p>
              </div>
              <span className="ml-auto text-xs text-slate-600 bg-white/4 px-2 py-0.5 rounded-full border border-white/6">Demo</span>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { icon: <AlertTriangle size={13} />, color: '#ef4444', text: 'Water contamination cluster detected in your district (8 related reports)' },
                { icon: <TrendingUp size={13} />, color: '#f59e0b', text: 'Pothole complaints up 34% this week — monsoon pattern match' },
                { icon: <Sparkles size={13} />, color: '#a78bfa', text: '3 university teams available to work on road infrastructure' },
              ].map((insight, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ backgroundColor: `${insight.color}08`, border: `1px solid ${insight.color}18` }}>
                  <span style={{ color: insight.color }} className="mt-0.5 shrink-0">{insight.icon}</span>
                  <p className="text-xs text-slate-400 leading-relaxed">{insight.text}</p>
                </div>
              ))}
            </div>
            <Link to="/ai-insights">
              <Button variant="outline" size="sm" className="w-full mt-4" rightIcon={<ArrowRight size={12} />}>
                View Full AI Report
              </Button>
            </Link>
          </motion.div>

          {/* Recent Problems */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="lg:col-span-2 glass rounded-2xl p-5 border border-white/8"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-base font-bold text-white">Recent Problems</p>
              <Link to="/problems" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                View all →
              </Link>
            </div>
            <div className="flex flex-col divide-y divide-white/5">
              {recentProblems.map((problem) => (
                <Link
                  key={problem.id}
                  to={`/problems/${problem.id}`}
                  className="flex items-start gap-3 py-3 hover:bg-white/3 -mx-2 px-2 rounded-xl transition-colors group"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold"
                    style={{
                      backgroundColor: problem.aiUrgencyScore >= 90 ? '#ef444420' : problem.aiUrgencyScore >= 70 ? '#f59e0b20' : '#38bdf820',
                      color: problem.aiUrgencyScore >= 90 ? '#ef4444' : problem.aiUrgencyScore >= 70 ? '#f59e0b' : '#38bdf8',
                    }}
                  >
                    {problem.aiUrgencyScore}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate group-hover:text-indigo-300 transition-colors">
                      {problem.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin size={10} className="text-slate-600 shrink-0" />
                      <span className="text-xs text-slate-500 truncate">{problem.locationName}</span>
                    </div>
                  </div>
                  <StatusBadge status={problem.status} />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Active Solutions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3 glass rounded-2xl p-5 border border-white/8"
          >
            <div className="flex items-center justify-between mb-5">
              <p className="text-base font-bold text-white">Active Solutions</p>
              <Link to="/solutions" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View all →</Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeSolutions.map((sol) => (
                <div key={sol.id} className="bg-white/3 rounded-xl p-4 border border-white/6 hover:border-white/12 transition-colors">
                  <p className="text-xs text-slate-500 mb-1 truncate">{sol.problemTitle}</p>
                  <p className="text-sm font-semibold text-white mb-3 leading-tight">{sol.title}</p>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1.5 rounded-full bg-white/6">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${sol.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                      />
                    </div>
                    <span className="text-xs font-medium text-white">{sol.progress}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mt-2">
                    <span>{sol.team.length} partners</span>
                    <span className="text-emerald-400 font-medium">
                      ₹{sol.fundingSecured}L / ₹{sol.fundingRequired}L
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
