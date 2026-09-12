import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Sparkles, MapPin, Users, TrendingUp,
  Zap, Shield, Globe, CheckCircle, ChevronRight,
  Brain, Building2, GraduationCap, Landmark, User,
  Search, ShieldCheck, CheckCircle2, Phone, Award,
  FileText, Clock, Layers, DollarSign, ExternalLink
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { PLATFORM_STATS, TREND_DATA } from '@/mock';
import { formatNumber, formatCrore } from '@/utils';
import apiClient from '@/api/client';
import { useLanguage } from '@/store';
import { t } from '@/i18n';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl px-3.5 py-2.5 border border-emerald-200 text-xs shadow-xl">
      <p className="text-slate-500 font-bold mb-1">{label} 2026</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-700 capitalize font-medium">{p.name}:</span>
          <span className="text-slate-900 font-bold">{p.value.toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [liveTrends, setLiveTrends] = useState<any[]>(TREND_DATA);
  const [trackingId, setTrackingId] = useState('');
  const language = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/analytics/trends')
      .then((res) => {
        const d = res.data?.data || res.data;
        if (Array.isArray(d) && d.length > 0) setLiveTrends(d);
      })
      .catch(() => {});
  }, []);

  const handleTrackGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/problems/${trackingId.trim().toUpperCase()}`);
    } else {
      navigate('/problems');
    }
  };

  return (
    <PageWrapper>
      {/* ── 1. OFFICIAL NATIONAL HERO BANNER ───────────────────────────────── */}
      <section className="relative min-h-[82vh] flex items-center bg-gradient-to-b from-emerald-50/70 via-green-50/30 to-white border-b border-emerald-100 overflow-hidden py-16">
        <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-emerald-100/50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 rounded-full bg-green-100/60 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-950 shadow-xs"
            >
              <span>🏛️</span>
              <span>{t(language, 'nationalPortalBadge')}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                {t(language, 'subHeader')}
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-medium"
            >
              {t(language, 'heroDesc')}
            </motion.p>

            {/* Grievance Search Box */}
            <motion.form
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              onSubmit={handleTrackGrievance}
              className="p-2 rounded-2xl bg-white border-2 border-emerald-400 flex flex-col sm:flex-row gap-2 max-w-xl shadow-lg shadow-emerald-600/5"
            >
              <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 text-slate-700">
                <Search size={18} className="text-emerald-600 shrink-0" />
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder={t(language, 'trackPlaceholder')}
                  className="w-full bg-transparent border-none text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
                />
              </div>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl cursor-pointer shadow-sm"
              >
                <span>{t(language, 'trackButton')}</span>
                <ArrowRight size={14} className="ml-1" />
              </Button>
            </motion.form>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-500 font-semibold">{t(language, 'quickAccess')}:</span>
              <Link to="/problems/new" className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold transition-colors">
                + {t(language, 'fileGrievance')}
              </Link>
              <Link to="/impact" className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold transition-colors">
                🗺️ {t(language, 'navImpactMap')}
              </Link>
              <Link to="/industry" className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold transition-colors">
                💼 {t(language, 'navIndustry')}
              </Link>
            </div>
          </div>

          {/* Right Hero Column: Real-time Telemetry Card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-xl shadow-emerald-700/5 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <h3 className="font-bold text-slate-900 text-sm">National Civic Redressal Telemetry</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  LIVE NIC SYNC
                </span>
              </div>

              {/* 4 Official Stat Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <p className="text-[11px] text-slate-600 font-medium">{t(language, 'resolvedGrievances')}</p>
                  <p className="text-2xl font-black text-emerald-800 mt-1">31,847</p>
                  <span className="text-[10px] text-emerald-700 font-bold">↑ {t(language, 'slaTarget')}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <p className="text-[11px] text-slate-600 font-medium">{t(language, 'activeWards')}</p>
                  <p className="text-2xl font-black text-emerald-800 mt-1">1,420</p>
                  <span className="text-[10px] text-emerald-700 font-bold">28 States & UTs</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <p className="text-[11px] text-slate-600 font-medium">{t(language, 'csrPool')}</p>
                  <p className="text-2xl font-black text-emerald-800 mt-1">₹847 Cr</p>
                  <span className="text-[10px] text-emerald-700 font-bold">Sec 135 Compliant</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <p className="text-[11px] text-slate-600 font-medium">{t(language, 'universityPilots')}</p>
                  <p className="text-2xl font-black text-emerald-800 mt-1">234</p>
                  <span className="text-[10px] text-emerald-700 font-bold">IIT / COEP / NIT Labs</span>
                </div>
              </div>

              {/* Live AreaChart */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Monthly Redressal & Resolution Velocity</span>
                  <span className="text-emerald-700 font-bold">2026 Trend</span>
                </div>
                <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={liveTrends} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="resolved" stroke="#059669" strokeWidth={2.5} fill="url(#emeraldGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. STATUTORY 4-STAGE REDRESSAL PROCESS ───────────────────────── */}
      <section className="py-16 bg-white border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
              Transparent Municipal Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t(language, 'redressalTitle')}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {t(language, 'redressalDesc')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: t(language, 'step1Title'),
                desc: t(language, 'step1Desc'),
                icon: <FileText size={20} className="text-emerald-700" />,
              },
              {
                step: '02',
                title: t(language, 'step2Title'),
                desc: t(language, 'step2Desc'),
                icon: <Clock size={20} className="text-emerald-700" />,
              },
              {
                step: '03',
                title: t(language, 'step3Title'),
                desc: t(language, 'step3Desc'),
                icon: <GraduationCap size={20} className="text-emerald-700" />,
              },
              {
                step: '04',
                title: t(language, 'step4Title'),
                desc: t(language, 'step4Desc'),
                icon: <CheckCircle2 size={20} className="text-emerald-700" />,
              }
            ].map((p, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border-2 border-emerald-100 hover:border-emerald-400 transition-all shadow-sm hover:shadow-md relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    {p.icon}
                  </div>
                  <span className="text-2xl font-black text-emerald-300 group-hover:text-emerald-600 transition-colors">
                    {p.step}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{p.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
