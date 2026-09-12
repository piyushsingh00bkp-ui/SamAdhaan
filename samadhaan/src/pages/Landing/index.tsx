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
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl px-3.5 py-2.5 border border-slate-200 text-xs shadow-xl">
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
      {/* ── 1. OFFICIAL NATIONAL HERO BANNER (LIGHT THEME) ─────────────── */}
      <section className="relative min-h-[82vh] flex items-center bg-gradient-to-b from-blue-50/60 via-slate-50 to-white border-b border-slate-200 overflow-hidden py-16">
        {/* Subtle decorative Indian tricolor backdrops */}
        <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-orange-100/60 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Column: Official Title & Grievance Tracker */}
          <div className="lg:col-span-7 space-y-6">
            {/* National Ministry Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-xs font-bold text-orange-900 shadow-sm"
            >
              <span>🇮🇳</span>
              <span>भारत सरकार • Ministry of Housing & Urban Affairs (MoHUA)</span>
              <span className="text-orange-400">•</span>
              <span className="text-emerald-700 font-bold">24x7 CPGRAMS Aligned</span>
            </motion.div>

            {/* Main National Headlines */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <p className="text-sm md:text-base font-bold text-blue-900 tracking-wide uppercase">
                राष्ट्रीय नागरिक समाधान एवं बहु-हितधारक नवाचार मंच
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                National Multi-Stakeholder <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-indigo-800 to-orange-600">
                  GovTech Civic Redressal
                </span> Portal
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-medium"
            >
              Uniting 1.4 Billion Indian Citizens, Municipal Corporations, Academic R&D Labs (IIT/COEP/NIT), and Corporate CSR Funds under Section 135 to resolve urban infrastructure grievances with statutory SLA accountability.
            </motion.p>

            {/* Official Citizen Grievance Tracking Search Box */}
            <motion.form
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              onSubmit={handleTrackGrievance}
              className="p-2 rounded-2xl bg-white border-2 border-blue-200 flex flex-col sm:flex-row gap-2 max-w-xl shadow-lg"
            >
              <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 text-slate-700">
                <Search size={18} className="text-orange-600 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter Grievance Tracking ID (e.g. PRB-001, PRB-PUN-01)..."
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none"
                />
              </div>
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold py-2.5 px-5 shrink-0 shadow-md shadow-orange-600/20"
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
                <Button size="lg" className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-md shadow-orange-500/20">
                  <span className="flex items-center gap-2">
                    <span>Log Citizen Grievance</span>
                    <ArrowRight size={16} />
                  </span>
                </Button>
              </Link>
              <Link to="/government">
                <Button size="lg" variant="secondary" className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-sm font-bold shadow-sm">
                  <span>Municipal Command Desk</span>
                </Button>
              </Link>
              <Link to="/impact">
                <Button size="lg" variant="ghost" className="text-blue-900 hover:text-blue-700 hover:bg-blue-50 text-sm font-bold">
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
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <p className="text-[10px] text-orange-600 uppercase tracking-widest font-black">National Telemetry</p>
                  <h3 className="text-base font-black text-slate-900 mt-0.5">2026 Grievance Resolution Velocity</h3>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>SLA Live</span>
                </div>
              </div>

              {/* Area Chart in Light Theme */}
              <ResponsiveContainer width="100%" height={190}>
                <AreaChart data={liveTrends}>
                  <defs>
                    <linearGradient id="govReported" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="govResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="problems" name="Reported" stroke="#2563eb" fill="url(#govReported)" strokeWidth={2.5} dot={false} />
                  <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#059669" fill="url(#govResolved)" strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-slate-500 text-[11px] font-medium">Total Grievances</p>
                  <p className="text-lg font-black text-slate-900">48,293</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <p className="text-emerald-800 text-[11px] font-bold">SLA Resolution Rate</p>
                  <p className="text-lg font-black text-emerald-700">94.2%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. OFFICIAL FOUR-STAKEHOLDER SERVICES GRID (LIGHT THEME) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 bg-slate-50 border-b border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold text-blue-800 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
            Multi-Stakeholder Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Dedicated Portals for Every Civic Pillar
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
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
              color: '#2563eb',
              bgColor: '#eff6ff',
              link: '/problems',
              btn: 'Browse Grievances'
            },
            {
              title: 'Municipal Ward Command',
              hindi: 'नगर निगम कमान केंद्र',
              desc: 'Official ULB console for Ward Nodal Officers to issue emergency polymer work-orders and digital sanction gazettes.',
              icon: Landmark,
              color: '#ea580c',
              bgColor: '#fff7ed',
              link: '/government',
              btn: 'Open Ward Center'
            },
            {
              title: 'University R&D Hub',
              hindi: 'विश्वविद्यालय अनुसंधान केंद्र',
              desc: 'Connect IIT, COEP, and NIT engineering faculty and student labs with funded real-world civic grand challenges.',
              icon: GraduationCap,
              color: '#7c3aed',
              bgColor: '#f5f3ff',
              link: '/universities',
              btn: 'View R&D Challenges'
            },
            {
              title: 'Corporate CSR Gateway',
              hindi: 'कॉर्पोरेट सामाजिक उत्तरदायित्व',
              desc: 'Deploy corporate CSR funds under Section 135 & Schedule VII with 100% tax exemption and verifiable SROI multipliers.',
              icon: Building2,
              color: '#059669',
              bgColor: '#ecfdf5',
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
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: card.bgColor, color: card.color }}
                  >
                    <card.icon size={20} />
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold">{card.hindi}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {card.desc}
                </p>
              </div>

              <Link to={card.link}>
                <Button size="sm" className="w-full bg-slate-50 hover:bg-blue-600 text-slate-800 hover:text-white border border-slate-200 text-xs font-bold transition-all">
                  <span>{card.btn}</span>
                  <ArrowRight size={13} className="ml-1" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 3. STATUTORY 4-STAGE REDRESSAL WORKFLOW (LIGHT THEME) ────── */}
      <section className="bg-white py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              Statutory 4-Stage Redressal Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              From Citizen Report to Deployed Solution
            </h2>
            <p className="text-slate-600 text-sm font-medium">
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
                badgeBg: 'bg-blue-50 text-blue-800 border-blue-200'
              },
              {
                step: '02',
                title: 'Municipal Routing',
                desc: 'Grievance is escalated to the responsible Ward Nodal Officer with automated SLA countdown and inter-agency directive.',
                sla: 'Within 24 Hours',
                badgeBg: 'bg-orange-50 text-orange-800 border-orange-200'
              },
              {
                step: '03',
                title: 'University R&D Match',
                desc: 'Academic labs (IIT/COEP/JNTU) are matched to provide geopolymer material mixes, IoT sensors, or drainage designs.',
                sla: '7-14 Days',
                badgeBg: 'bg-purple-50 text-purple-800 border-purple-200'
              },
              {
                step: '04',
                title: 'CSR Co-Funding & Sanction',
                desc: 'Corporate CSR sponsors pledge grant capital under Schedule VII, followed by official digital gazette publication.',
                sla: 'Full Resolution',
                badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200'
              },
            ].map((step) => (
              <div key={step.step} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono text-blue-900">{step.step}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${step.badgeBg}`}>
                    {step.sla}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. OFFICIAL CALL TO ACTION BANNER (LIGHT THEME) ──────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="rounded-3xl p-8 sm:p-12 border border-blue-200 bg-gradient-to-r from-blue-50 via-slate-50 to-orange-50 text-center space-y-6 shadow-md">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-orange-800 uppercase tracking-widest bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
              Digital India Civic Infrastructure Cell
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              Ready to Resolve Your Ward's Civic Grievances?
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              Join thousands of active citizens, municipal engineers, university researchers, and corporate CSR officers building India's smart urban future.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/problems/new">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm px-8 shadow-lg shadow-orange-600/20">
                Log a Grievance Now
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 text-sm font-bold shadow-sm">
                Access National Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
