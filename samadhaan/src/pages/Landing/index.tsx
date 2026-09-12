import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight, Sparkles, MapPin, Users, TrendingUp,
  Zap, Shield, Globe, CheckCircle, ChevronRight,
  Brain, Building2, GraduationCap, Landmark, User,
  Search, ShieldCheck, CheckCircle2, Phone, Award,
  FileText, Clock, Layers, DollarSign, ExternalLink
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { PLATFORM_STATS, TREND_DATA } from '@/mock';
import { formatNumber, formatCrore } from '@/utils';
import apiClient from '@/api/client';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 border border-white/10 text-xs shadow-xl backdrop-blur-md">
      <p className="text-slate-400 mb-1">{label} 2026</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-300 capitalize">{p.name}:</span>
          <span className="text-white font-bold">{p.value.toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [liveTrends, setLiveTrends] = useState<any[]>(TREND_DATA);
  const [trackingId, setTrackingId] = useState('');
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
      {/* ── 1. OFFICIAL NATIONAL HERO BANNER ───────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center bg-gradient-to-b from-gov-navy-950 via-gov-navy-900 to-gov-navy-800 border-b border-blue-900/30 overflow-hidden py-16">
        {/* Subtle tricolor background glow */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Column: Official Title & Grievance Tracker */}
          <div className="lg:col-span-7 space-y-6">
            {/* National Ministry Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-bold text-amber-300"
            >
              <span>🇮🇳</span>
              <span>भारत सरकार • Ministry of Housing & Urban Affairs (MoHUA)</span>
              <span className="text-amber-500">•</span>
              <span className="text-emerald-400 font-semibold">Live 24x7 CPGRAMS Aligned</span>
            </motion.div>

            {/* Main National Headlines */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <p className="text-sm md:text-base font-bold text-slate-300 tracking-wider">
                राष्ट्रीय नागरिक समाधान एवं बहु-हितधारक नवाचार मंच
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                National Multi-Stakeholder <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300">
                  GovTech Civic Redressal
                </span> Portal
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl"
            >
              Uniting 1.4 Billion Indian Citizens, Municipal Corporations, Academic R&D Labs (IIT/COEP/NIT), and Corporate CSR Funds under Section 135 to resolve urban infrastructure grievances with statutory SLA accountability.
            </motion.p>

            {/* Official Citizen Grievance Tracking Search Box */}
            <motion.form
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              onSubmit={handleTrackGrievance}
              className="p-2.5 rounded-2xl bg-gov-navy-950/90 border border-blue-500/30 flex flex-col sm:flex-row gap-2 max-w-xl shadow-xl"
            >
              <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 text-slate-300">
                <Search size={16} className="text-amber-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter Grievance ID (e.g. PRB-001, PRB-PUN-01)..."
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
              <Button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-gov-navy-950 text-xs font-black py-2.5 px-5 shrink-0 shadow-md shadow-amber-500/30"
              >
                Track Grievance Status
              </Button>
            </motion.form>

            {/* Quick Action Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <Link to="/problems/new">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-gov-navy-950 font-black text-sm shadow-xl shadow-orange-500/20 border border-amber-300/40">
                  <span className="flex items-center gap-2">
                    <span>Log Citizen Grievance</span>
                    <ArrowRight size={16} />
                  </span>
                </Button>
              </Link>
              <Link to="/government">
                <Button size="lg" variant="secondary" className="bg-gov-navy-800 hover:bg-gov-navy-700 text-white border border-blue-500/30 text-sm font-bold">
                  <span>Municipal Command Desk</span>
                </Button>
              </Link>
              <Link to="/impact">
                <Button size="lg" variant="ghost" className="text-slate-300 hover:text-white text-sm font-semibold">
                  <span>National Impact Map →</span>
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Hero Column: Official Telemetry Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5"
          >
            <div className="gov-card rounded-3xl p-6 border border-blue-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-white/8 pb-3">
                <div>
                  <p className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">National Telemetry</p>
                  <h3 className="text-base font-black text-white mt-0.5">2026 Grievance Resolution Trend</h3>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SLA Live</span>
                </div>
              </div>

              {/* Area Chart */}
              <ResponsiveContainer width="100%" height={190}>
                <AreaChart data={liveTrends}>
                  <defs>
                    <linearGradient id="govReported" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="govResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="problems" name="Reported" stroke="#3b82f6" fill="url(#govReported)" strokeWidth={2.5} dot={false} />
                  <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" fill="url(#govResolved)" strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/6 text-xs">
                <div className="p-2.5 rounded-xl bg-white/3 border border-white/6">
                  <p className="text-slate-400 text-[11px]">Total Grievances</p>
                  <p className="text-lg font-black text-white">48,293</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                  <p className="text-emerald-300 text-[11px]">SLA Resolution Rate</p>
                  <p className="text-lg font-black text-emerald-400">94.2%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. OFFICIAL FOUR-STAKEHOLDER SERVICES GRID ───────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Multi-Stakeholder Framework
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Dedicated Portals for Every Civic Pillar
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Seamlessly integrating citizen reports with municipal governance, university research, and corporate capital.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: 'Citizen Grievance Redressal',
              hindi: 'नागरिक शिकायत निवारण',
              desc: 'Log civic defects with AI computer vision triage, auto-generated location pins, and transparent SLA tracking.',
              icon: User,
              color: '#3b82f6',
              link: '/problems',
              btn: 'Browse Grievances'
            },
            {
              title: 'Municipal Ward Command',
              hindi: 'नगर निगम कमान केंद्र',
              desc: 'Official ULB console for Ward Nodal Officers to issue emergency polymer work-orders and digital sanction gazettes.',
              icon: Landmark,
              color: '#f59e0b',
              link: '/government',
              btn: 'Open Ward Center'
            },
            {
              title: 'University R&D Hub',
              hindi: 'विश्वविद्यालय अनुसंधान केंद्र',
              desc: 'Connect IIT, COEP, and NIT engineering faculty and student labs with funded real-world civic grand challenges.',
              icon: GraduationCap,
              color: '#8b5cf6',
              link: '/universities',
              btn: 'View R&D Challenges'
            },
            {
              title: 'Corporate CSR Gateway',
              hindi: 'कॉर्पोरेट सामाजिक उत्तरदायित्व',
              desc: 'Deploy corporate CSR funds under Section 135 & Schedule VII with 100% tax exemption and verifiable SROI multipliers.',
              icon: Building2,
              color: '#10b981',
              link: '/industry',
              btn: 'Pledge CSR Grant'
            },
          ].map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="gov-card rounded-3xl p-6 border border-white/8 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${card.color}20`, color: card.color }}
                  >
                    <card.icon size={20} />
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">{card.hindi}</span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <Link to={card.link}>
                <Button size="sm" className="w-full bg-white/5 hover:bg-blue-600 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all">
                  <span>{card.btn}</span>
                  <ArrowRight size={13} className="ml-1" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 3. STATUTORY 4-STAGE REDRESSAL WORKFLOW ──────────────────── */}
      <section className="bg-gov-navy-900 border-y border-blue-900/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Statutory 4-Stage Redressal Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              From Citizen Report to Deployed Solution
            </h2>
            <p className="text-slate-400 text-sm">
              Standard operating procedure aligned with Municipal SLA Turnaround Guidelines.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Citizen Lodgement',
                desc: 'Citizen reports grievance with photo and GPS coordinates. AI vision automatically evaluates defect severity and clusters duplicates.',
                sla: 'Instant (<2 sec)',
                color: '#3b82f6'
              },
              {
                step: '02',
                title: 'Municipal Routing',
                desc: 'Grievance is escalated to the responsible Ward Nodal Officer with automated SLA countdown and inter-agency directive.',
                sla: 'Within 24 Hours',
                color: '#f59e0b'
              },
              {
                step: '03',
                title: 'University R&D Match',
                desc: 'Academic labs (IIT/COEP/JNTU) are matched to provide geopolymer material mixes, IoT sensors, or drainage designs.',
                sla: '7-14 Days',
                color: '#8b5cf6'
              },
              {
                step: '04',
                title: 'CSR Co-Funding & Sanction',
                desc: 'Corporate CSR sponsors pledge grant capital under Schedule VII, followed by official digital gazette publication.',
                sla: 'Full Resolution',
                color: '#10b981'
              },
            ].map((step, idx) => (
              <div key={step.step} className="p-6 rounded-3xl bg-gov-navy-950 border border-white/8 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono text-amber-400">{step.step}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-300">
                    {step.sla}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. OFFICIAL CALL TO ACTION BANNER ────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="gov-card rounded-3xl p-8 sm:p-12 border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-gov-navy-900 to-blue-950/40 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
              Digital India Civic Infrastructure Cell
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Ready to Resolve Your Ward's Civic Grievances?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Join thousands of active citizens, municipal engineers, university researchers, and corporate CSR officers building India's smart urban future.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/problems/new">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-400 text-gov-navy-950 font-black text-sm px-8 shadow-xl shadow-amber-500/25">
                Log a Grievance Now
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="bg-white/10 hover:bg-white/15 text-white border border-white/20 text-sm font-bold">
                Access National Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
