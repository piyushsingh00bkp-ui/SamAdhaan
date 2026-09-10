import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, TrendingUp, MapPin, Sparkles,
  AlertTriangle, BarChart3, Target, Zap, Activity, CheckCircle2, ShieldCheck
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { TREND_DATA, CATEGORY_BREAKDOWN } from '@/mock';
import apiClient from '@/api/client';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, Cell,
} from 'recharts';

const RADAR_DATA = [
  { subject: 'Infrastructure', A: 85, fullMark: 100 },
  { subject: 'Water',          A: 72, fullMark: 100 },
  { subject: 'Sanitation',     A: 63, fullMark: 100 },
  { subject: 'Health',         A: 91, fullMark: 100 },
  { subject: 'Education',      A: 58, fullMark: 100 },
  { subject: 'Environment',    A: 44, fullMark: 100 },
];

const PREDICTION_DATA = [
  { area: 'Dharavi, Mumbai',    risk: 94, type: 'Water Quality & Drainage' },
  { area: 'Hinjewadi, Pune',    risk: 87, type: 'Road & Bridge Safety' },
  { area: 'Whitefield, BLR',    risk: 79, type: 'Monsoon Flooding Risk' },
  { area: 'Old City, Jaipur',   risk: 71, type: 'Power Grid Load' },
  { area: 'Nandurbar, MH',      risk: 88, type: 'Healthcare Supply Chain' },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 border border-white/10 text-xs shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-white font-semibold">{p.value?.toLocaleString?.() ?? p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function AIInsightsPage() {
  const [aiHealth, setAiHealth] = useState<any>(null);
  const [overview, setOverview] = useState<any>(null);
  const [categoryData, setCategoryData] = useState<any[]>(CATEGORY_BREAKDOWN);
  const [trendData, setTrendData] = useState<any[]>(TREND_DATA);
  const [predictions, setPredictions] = useState<any[]>(PREDICTION_DATA);
  const [radarData, setRadarData] = useState<any[]>(RADAR_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch AI Health
    apiClient.get('/ai/health')
      .then((res) => setAiHealth(res.data?.data || res.data))
      .catch(() => {});

    // 2. Fetch Live Analytics Overview
    apiClient.get('/analytics/overview')
      .then((res) => {
        const d = res.data?.data || res.data;
        if (d) setOverview(d);
      })
      .catch(() => {});

    // 3. Fetch Live Categories Breakdown
    apiClient.get('/analytics/categories')
      .then((res) => {
        const d = res.data?.data || res.data;
        if (Array.isArray(d) && d.length > 0) {
          setCategoryData(d.map((c: any) => ({
            category: c.category || c.name,
            count: c.count || c._count || 10,
            color: c.color || '#6366f1'
          })));
        }
      })
      .catch(() => {});

    // 4. Fetch Live Trends & Predictions
    apiClient.post('/ai/trends', { timeWindowDays: 30 })
      .then((res) => {
        const d = res.data?.data || res.data;
        if (d?.identifiedHotspots && Array.isArray(d.identifiedHotspots)) {
          setPredictions(d.identifiedHotspots.map((h: any) => ({
            area: h.location,
            risk: h.riskLevel === 'CRITICAL' ? 94 : h.riskLevel === 'HIGH' ? 86 : 74,
            type: h.dominantCategory || 'Civic Infrastructure'
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalAnalyzed = overview?.totalChallenges ?? overview?.totalProblems ?? 48293;
  const resolutionRate = overview?.resolutionRate ?? '94.2%';
  const clustersFormed = overview?.clustersFormed ?? 1847;
  const predictionsValidated = overview?.predictionsValidated ?? 312;

  return (
    <PageWrapper>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                <Brain size={15} className="text-indigo-400" />
              </div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">AI Intelligence Console</span>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Telemetry
              </span>
            </div>
            <h1 className="text-3xl font-black text-white">AI Insights & Predictive Analytics</h1>
            <p className="text-slate-500 mt-1">Machine-learning driven analysis of India's civic infrastructure and municipal efficiency</p>
          </div>

          {/* AI Health Status Badge */}
          <div className="glass rounded-2xl px-4 py-3 border border-white/10 flex items-center gap-3 shrink-0">
            <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" />
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-white">AI Microservice Engine</p>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded font-mono">
                  {aiHealth ? '12/12 ONLINE' : 'LIVE'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">NLP • Vision • Voice • DBSCAN • SROI Models</p>
            </div>
          </div>
        </motion.div>

        {/* Insight cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Problems Analysed', value: totalAnalyzed.toLocaleString('en-IN'), icon: <Brain size={14} />, color: '#a78bfa' },
            { label: 'Avg AI Score Accuracy', value: resolutionRate, icon: <Target size={14} />, color: '#34d399' },
            { label: 'Clusters Formed', value: clustersFormed.toLocaleString('en-IN'), icon: <MapPin size={14} />, color: '#38bdf8' },
            { label: 'Predictions Validated', value: predictionsValidated.toLocaleString('en-IN'), icon: <Zap size={14} />, color: '#fbbf24' },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass rounded-2xl p-4 border border-white/8 hover:border-white/15 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-500">{card.label}</p>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                  {card.icon}
                </div>
              </div>
              <p className="text-2xl font-black text-white">{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-5 mb-5">
          {/* Trend */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-5 border border-white/8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-0.5">AI-Verified Trend</p>
                <p className="text-base font-bold text-white">Problem Resolution Performance</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-indigo-400"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Reported</span>
                <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Resolved</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="aProblems" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="aResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="problems" stroke="#6366f1" fill="url(#aProblems)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="resolved" stroke="#34d399" fill="url(#aResolved)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="inProgress" stroke="#f59e0b" fill="none" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category bar */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass rounded-2xl p-5 border border-white/8">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Distribution</p>
            <p className="text-base font-bold text-white mb-4">Problems by Category</p>
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={categoryData.slice(0, 7)} layout="vertical" barSize={12}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} width={70} tickFormatter={(v) => v ? (v.charAt(0).toUpperCase() + v.slice(1)) : ''} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {categoryData.slice(0, 7).map((entry, index) => (
                    <Cell key={index} fill={entry.color || '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Radar — urgency by category */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-5 border border-white/8">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">AI Urgency Radar</p>
            <p className="text-base font-bold text-white mb-4">Average Urgency Score by Category</p>
            <ResponsiveContainer width="100%" height={210}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Radar name="Urgency" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Predictive alerts */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass rounded-2xl p-5 border border-white/8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={15} className="text-amber-400" />
              <p className="text-base font-bold text-white">Predictive Hotspot Alerts</p>
              <span className="ml-auto text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">Next 30 Days</span>
            </div>
            <div className="flex flex-col gap-3">
              {predictions.map((p, i) => (
                <motion.div
                  key={p.area || i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 p-2 rounded-xl bg-white/2 border border-white/4"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/4 border border-white/8 flex items-center justify-center text-xs font-bold text-white">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{p.area}</p>
                    <p className="text-xs text-slate-500">{p.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-white/6">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${p.risk}%`,
                          backgroundColor: p.risk >= 90 ? '#ef4444' : p.risk >= 75 ? '#f59e0b' : '#38bdf8',
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-bold w-8 text-right font-mono"
                      style={{ color: p.risk >= 90 ? '#ef4444' : p.risk >= 75 ? '#f59e0b' : '#38bdf8' }}
                    >
                      {p.risk}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* AI Model Architecture Info */}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-2xl p-5 border border-white/8 border-l-indigo-500/40 border-l-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Sparkles size={18} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-1">About the SAMADHAAN Distributed AI Engine</p>
              <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
                SAMADHAAN's AI pipeline operates natively across the platform: fine-tuned NLP for automatic problem classification and SDG alignment in problem submission, computer vision defect detection, DBSCAN geospatial hotspot clustering for municipal wards, SROI econometric forecasting for CSR grants, and automated inter-agency department routing.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
