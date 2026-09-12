import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, TrendingUp, MapPin, Sparkles,
  AlertTriangle, BarChart3, Target, Zap, Activity, CheckCircle2, ShieldCheck,
  PieChart as PieIcon, RefreshCw, Layers
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { TREND_DATA, CATEGORY_BREAKDOWN } from '@/mock';
import apiClient from '@/api/client';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, Cell, PieChart, Pie, Legend
} from 'recharts';

const RADAR_DATA = [
  { subject: 'Infrastructure', A: 85, fullMark: 100 },
  { subject: 'Water & Drainage', A: 72, fullMark: 100 },
  { subject: 'Solid Waste', A: 63, fullMark: 100 },
  { subject: 'Public Health', A: 91, fullMark: 100 },
  { subject: 'Education Facilities', A: 58, fullMark: 100 },
  { subject: 'Green Mobility', A: 74, fullMark: 100 },
];

const PREDICTION_DATA = [
  { area: 'Dharavi, Mumbai', risk: 94, type: 'Water Quality & Drainage', action: 'IoT Sensor Grid Dispatched' },
  { area: 'Hinjewadi, Pune', risk: 87, type: 'Road & Bridge Pothole Cluster', action: 'COEP Asphalt Mix Assigned' },
  { area: 'Whitefield, Bengaluru', risk: 79, type: 'Monsoon Flooding Risk', action: 'Pre-Monsoon Desilting SLA' },
  { area: 'Old City, Jaipur', risk: 71, type: 'Power Grid Load Anomaly', action: 'Transformer Smart Switch' },
  { area: 'Nandurbar, Maharashtra', risk: 88, type: 'Healthcare Supply Chain', action: 'Solar Cold-Chain Van' },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl px-3.5 py-2.5 border border-emerald-200 text-xs shadow-xl">
      {label && <p className="text-slate-600 font-bold mb-1">{label}</p>}
      {payload.map((p: any) => (
        <div key={p.dataKey || p.name} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color || p.fill || '#059669' }} />
          <span className="text-slate-700 font-medium capitalize">{p.name || p.dataKey}:</span>
          <span className="text-slate-900 font-bold">{p.value?.toLocaleString?.('en-IN') ?? p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function AIInsightsPage() {
  const [aiHealth, setAiHealth] = useState<any>(null);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const [healthRes, overviewRes] = await Promise.all([
        apiClient.get('/ai/health').catch(() => null),
        apiClient.get('/analytics/overview').catch(() => null),
      ]);
      if (healthRes?.data) setAiHealth(healthRes.data?.data || healthRes.data);
      if (overviewRes?.data) setOverview(overviewRes.data?.data || overviewRes.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
              <Brain size={18} />
            </div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Gemini AI Predictive Intelligence & SLA Radar
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            National Civic AI Analytics & Predictive Risk Radar
          </h1>
          <p className="text-slate-600 max-w-3xl text-sm sm:text-base leading-relaxed">
            Real-time multi-modal defect classification, predictive municipal hotspot clustering, and automated university CSR matching algorithms.
          </p>
        </motion.div>

        {/* 4 AI Telemetry Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Gemini Engine Health', val: 'Online & Active', icon: Activity, sub: 'Latency: 142ms' },
            { label: 'Classification Accuracy', val: '97.8%', icon: ShieldCheck, sub: 'Multi-Modal Vision' },
            { label: 'Predictive Risk Hotspots', val: '14 Wards', icon: AlertTriangle, sub: 'Statutory SLA' },
            { label: 'R&D Co-Matches Generated', val: '189 Tripartite', icon: Sparkles, sub: 'Universities & CSR' },
          ].map((item, i) => (
            <div
              key={item.label}
              className="bg-white rounded-2xl p-5 border-2 border-emerald-100 shadow-xs hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-500 font-medium">{item.label}</p>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                  <item.icon size={16} />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-black text-slate-900">{item.val}</p>
              <span className="text-[10px] text-emerald-700 font-bold">{item.sub}</span>
            </div>
          ))}
        </div>

        {/* Charts: Radar + Trend */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-50 pb-3">
              <div>
                <p className="text-[11px] text-emerald-800 uppercase tracking-wider font-bold">Severity Matrix</p>
                <h3 className="text-base font-bold text-slate-900">National Civic Risk Radar</h3>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                AI Assessed
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={RADAR_DATA}>
                  <PolarGrid stroke="#d1fae5" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }} />
                  <Radar name="Severity Index" dataKey="A" stroke="#059669" fill="#10b981" fillOpacity={0.4} strokeWidth={2} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Predictive Hotspot Table */}
          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-emerald-50 pb-3">
              <div>
                <p className="text-[11px] text-emerald-800 uppercase tracking-wider font-bold">Early Warning System</p>
                <h3 className="text-base font-bold text-slate-900">Predictive High-Risk Municipal Clusters</h3>
              </div>
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full">
                SLA Priority
              </span>
            </div>

            <div className="divide-y divide-emerald-50">
              {PREDICTION_DATA.map((p, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{p.area}</p>
                    <p className="text-[11px] text-slate-500">{p.type}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                      Risk: {p.risk}%
                    </span>
                    <p className="text-[10px] text-emerald-700 font-medium mt-0.5">{p.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
