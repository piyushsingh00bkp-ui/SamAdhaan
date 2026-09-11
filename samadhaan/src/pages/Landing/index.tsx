import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight, Sparkles, MapPin, Users, TrendingUp,
  Zap, Shield, Globe, CheckCircle, ChevronRight,
  Brain, Building2, GraduationCap, Landmark, User,
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

// ── Particle canvas background ─────────────────────────────────────────────
function ParticleBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor:
              i % 3 === 0 ? 'rgba(99,102,241,0.4)' :
              i % 3 === 1 ? 'rgba(167,139,250,0.3)' :
                            'rgba(245,158,11,0.25)',
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            delay: Math.random() * 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ── Flow step component ────────────────────────────────────────────────────
const FLOW_STEPS = [
  { icon: User,          label: 'Citizen',       desc: 'Reports problem',          color: '#38bdf8' },
  { icon: Brain,         label: 'AI Engine',     desc: 'Tags, scores, clusters',   color: '#a78bfa' },
  { icon: GraduationCap, label: 'Universities',  desc: 'Research & prototyping',   color: '#818cf8' },
  { icon: Building2,     label: 'Industry',      desc: 'Funding & implementation', color: '#34d399' },
  { icon: Landmark,      label: 'Government',    desc: 'Policy & execution',       color: '#fbbf24' },
];

function FlowDiagram() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-0">
      {FLOW_STEPS.map((step, i) => (
        <div key={step.label} className="flex flex-col md:flex-row items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
            className="flex flex-col items-center text-center"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 border"
              style={{
                backgroundColor: `${step.color}15`,
                borderColor: `${step.color}30`,
                boxShadow: `0 0 24px ${step.color}20`,
              }}
            >
              <step.icon size={24} style={{ color: step.color }} />
            </div>
            <p className="text-sm font-semibold text-white">{step.label}</p>
            <p className="text-xs text-slate-500 mt-0.5 max-w-24">{step.desc}</p>
          </motion.div>
          {i < FLOW_STEPS.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 + 0.3 }}
              className="flex items-center justify-center md:mx-3 my-3 md:my-0"
            >
              <div className="hidden md:flex items-center gap-1">
                <div className="w-8 h-px bg-gradient-to-r from-white/10 to-white/30" />
                <ChevronRight size={14} className="text-slate-500" />
              </div>
              <div className="md:hidden w-px h-8 bg-gradient-to-b from-white/10 to-white/30" />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Feature cards ──────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Brain,
    title: 'AI-Powered Triage',
    desc: 'Every problem is auto-tagged, urgency-scored (0–100), and clustered with geospatially similar issues — reducing duplicate reports by 68%.',
    color: '#a78bfa',
    tag: 'AI',
  },
  {
    icon: MapPin,
    title: 'Geo-Intelligence',
    desc: 'Real-time heatmaps across 487 cities identify problem density zones, enabling proactive resource allocation before crises escalate.',
    color: '#38bdf8',
    tag: 'Maps',
  },
  {
    icon: Users,
    title: 'Collaborative Solutions',
    desc: 'Universities, industry partners, and government bodies co-create solutions. Track team composition, funding, and delivery milestones.',
    color: '#34d399',
    tag: 'Ecosystem',
  },
  {
    icon: Shield,
    title: 'Transparency Engine',
    desc: 'Every problem gets a public audit trail. Citizens track status in real-time. Government bodies publish resolution reports automatically.',
    color: '#fbbf24',
    tag: 'Governance',
  },
  {
    icon: TrendingUp,
    title: 'Impact Analytics',
    desc: 'SDG-aligned impact scoring, beneficiary counts, and funding mobilisation metrics — aligned to India\'s development agenda.',
    color: '#fb923c',
    tag: 'Analytics',
  },
  {
    icon: Zap,
    title: 'Predictive Alerts',
    desc: 'AI models predict problem hotspots 30 days in advance using seasonal patterns, historical data, and infrastructure stress indicators.',
    color: '#f87171',
    tag: 'Prediction',
  },
];

// ── Custom chart tooltip ───────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2.5 border border-white/10 text-xs">
      <p className="text-slate-400 mb-1.5 font-medium">{label} 2026</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-400">{p.name}:</span>
          <span className="text-white font-semibold">{p.value.toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  );
}

// ── Landing page ────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [liveTrends, setLiveTrends] = useState<any[]>(TREND_DATA);

  useEffect(() => {
    apiClient.get('/analytics/trends')
      .then((res) => {
        const d = res.data?.data || res.data;
        if (Array.isArray(d) && d.length > 0) setLiveTrends(d);
      })
      .catch(() => {});
  }, []);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <PageWrapper>
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center hero-gradient overflow-hidden">
        <ParticleBg />
        <div className="dot-pattern absolute inset-0 opacity-30" />

        {/* Glow orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-violet-600/8 blur-3xl" />
        <div className="absolute top-3/4 left-1/3 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative max-w-screen-xl mx-auto px-4 lg:px-6 py-20 grid lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            {/* Label badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 text-xs font-medium text-slate-400 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Smart India Hackathon 2026
              <span className="text-slate-600">·</span>
              <span className="text-indigo-400">AI GovTech Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight"
            >
              <span className="text-white">From Local</span>
              <br />
              <span className="gradient-text">Problems</span>
              <br />
              <span className="text-white">to Lasting</span>
              <br />
              <span className="gradient-text-saffron">Solutions.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-400 text-lg leading-relaxed mt-6 max-w-lg"
            >
              SamAdhaan bridges citizens, universities, industry, and government through an AI-powered collaboration platform — turning grassroots problems into measurable national impact.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 mt-8"
            >
              <Button size="lg" leftIcon={<MapPin size={16} />} rightIcon={<ArrowRight size={16} />}>
                <Link to="/problems/new">Report a Problem</Link>
              </Button>
              <Button size="lg" variant="secondary">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-6 mt-10"
            >
              {[
                { value: '48K+', label: 'Problems' },
                { value: '234', label: 'Universities' },
                { value: '28', label: 'States' },
                { value: `₹${PLATFORM_STATS.totalFundingMobilised}Cr`, label: 'Mobilised' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-xl font-black text-white">{s.value}</p>
                  <p className="text-xs text-slate-600">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="glass rounded-3xl p-6 border border-white/8 glow-brand">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Problem Resolution Trend</p>
                  <p className="text-lg font-bold text-white mt-0.5">2026 · All States</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-medium">Live</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={liveTrends}>
                  <defs>
                    <linearGradient id="gProblems" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="problems" name="Reported" stroke="#6366f1" fill="url(#gProblems)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#34d399" fill="url(#gResolved)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-6 mt-3">
                {[
                  { color: '#6366f1', label: 'Reported' },
                  { color: '#34d399', label: 'Resolved' },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-2.5 h-0.5 rounded-full" style={{ backgroundColor: l.color }} />
                    {l.label}
                  </div>
                ))}
                <div className="ml-auto text-xs text-emerald-400 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Telemetry</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────── */}
      <section className="border-y border-white/6 bg-white/[0.02]">
        <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {[
              { label: 'Problems Filed',     value: PLATFORM_STATS.totalProblems,         formatter: formatNumber },
              { label: 'Resolved',           value: PLATFORM_STATS.resolvedProblems,      formatter: formatNumber },
              { label: 'Citizens',           value: PLATFORM_STATS.registeredCitizens,    formatter: formatNumber },
              { label: 'Universities',       value: PLATFORM_STATS.universitiesPartnered, formatter: (n: number) => n.toString() },
              { label: 'Industry Partners',  value: PLATFORM_STATS.industryPartners,      formatter: formatNumber },
              { label: 'Cities Active',      value: PLATFORM_STATS.citiesActive,          formatter: (n: number) => n.toString() },
              { label: 'Avg Resolution',     value: PLATFORM_STATS.avgResolutionDays,     formatter: (n: number) => `${Math.round(n)}d` },
              { label: 'People Impacted',    value: PLATFORM_STATS.peopleImpacted,        formatter: formatNumber },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="text-center"
              >
                <p className="text-2xl font-black text-white">{stat.formatter(stat.value)}</p>
                <p className="text-xs text-slate-600 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="max-w-screen-xl mx-auto px-4 lg:px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">The SamAdhaan Flow</span>
          <h2 className="text-4xl font-black text-white mt-3">How Problems Become Solutions</h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg">
            A 5-stakeholder pipeline powered by AI, where every citizen report triggers a collaborative resolution journey.
          </p>
        </motion.div>
        <FlowDiagram />

        {/* Step details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            {
              step: '01',
              title: 'Citizen Reports',
              desc: 'Fill a simple form with photo, location, and description. AI instantly tags, categorises, and scores urgency. Similar problems are clustered automatically.',
              color: '#38bdf8',
              items: ['Photo & location upload', 'AI auto-tagging in <2 seconds', 'Duplicate detection', 'Real-time status tracking'],
            },
            {
              step: '02',
              title: 'AI + Expert Analysis',
              desc: 'Our AI engine analyses the problem, suggests solutions from a global database, and routes it to the most relevant universities and industry partners.',
              color: '#a78bfa',
              items: ['NLP categorisation', 'Urgency scoring 0–100', 'Solution matching', 'Stakeholder routing'],
            },
            {
              step: '03',
              title: 'Collaborative Resolution',
              desc: 'Universities contribute research, industry provides execution, government allocates resources. A transparent timeline keeps every stakeholder accountable.',
              color: '#34d399',
              items: ['Multi-stakeholder teams', 'Funding tracker', 'Progress milestones', 'Impact measurement'],
            },
          ].map((card, i) => (
            <motion.div
              key={card.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass rounded-2xl p-6 border border-white/8 hover:border-white/15 transition-colors group"
            >
              <div
                className="text-5xl font-black mb-4 tabular-nums"
                style={{ color: `${card.color}40` }}
              >
                {card.step}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">{card.desc}</p>
              <ul className="flex flex-col gap-2">
                {card.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                    <CheckCircle size={13} style={{ color: card.color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 lg:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Platform Capabilities</span>
          <h2 className="text-4xl font-black text-white mt-3">Built for India's Scale</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className="glass rounded-2xl p-6 border border-white/8 hover:border-white/15 transition-all cursor-default group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${f.color}15`, border: `1px solid ${f.color}25` }}
                >
                  <f.icon size={18} style={{ color: f.color }} />
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: `${f.color}15`, color: f.color, border: `1px solid ${f.color}25` }}
                >
                  {f.tag}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── STAKEHOLDER CTAs ─────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 lg:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black text-white">Your Role in the Ecosystem</h2>
          <p className="text-slate-500 mt-3 text-lg">Every stakeholder has a powerful place in SamAdhaan.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              emoji: '👤', role: 'Citizen', color: '#38bdf8',
              title: 'Your voice matters',
              desc: 'Report problems in your neighbourhood. Track resolution in real-time. Vote on priority. Make your city better.',
              href: '/dashboard', cta: 'Start Reporting',
              items: ['Problem reporting', 'Real-time tracking', 'Community upvoting', 'Impact score'],
            },
            {
              emoji: '🎓', role: 'University / HEI', color: '#a78bfa',
              title: 'Research meets reality',
              desc: 'Access real-world problem datasets. Deploy student projects. Publish impactful research backed by measurable outcomes.',
              href: '/universities', cta: 'Join as Researcher',
              items: ['Live problem feed', 'Student challenge board', 'Research metrics', 'Industry connect'],
            },
            {
              emoji: '🏭', role: 'Industry / MSME', color: '#34d399',
              title: 'CSR with verified impact',
              desc: 'Discover aligned CSR opportunities. Partner with universities. Track funding impact. Build brand credibility through transparent outcomes.',
              href: '/industry', cta: 'Explore CSR Hub',
              items: ['CSR matching', 'SDG alignment', 'Impact reports', 'MSME opportunities'],
            },
            {
              emoji: '🏛️', role: 'Government', color: '#fbbf24',
              title: 'Govern with intelligence',
              desc: 'Real-time ward-level analytics. AI-powered policy insights. Transparent escalation centre. Measurable governance outcomes.',
              href: '/government', cta: 'Access Gov Portal',
              items: ['Ward analytics', 'Escalation center', 'Policy AI', 'SDG dashboard'],
            },
          ].map((card, i) => (
            <motion.div
              key={card.role}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 border border-white/8 hover:border-white/15 transition-all group"
              style={{ borderLeftColor: `${card.color}40`, borderLeftWidth: 3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{card.emoji}</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: card.color }}>{card.role}</p>
                  <h3 className="text-lg font-bold text-white">{card.title}</h3>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">{card.desc}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {card.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2.5 py-1 rounded-lg"
                    style={{ backgroundColor: `${card.color}12`, color: card.color, border: `1px solid ${card.color}20` }}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <Link
                to={card.href}
                className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:gap-2.5"
                style={{ color: card.color }}
              >
                {card.cta} <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 lg:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-12 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(79,70,229,0.2) 0%, rgba(124,58,237,0.15) 50%, rgba(245,158,11,0.1) 100%)',
            border: '1px solid rgba(99,102,241,0.3)',
          }}
        >
          <div className="absolute inset-0 dot-pattern opacity-20" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 text-xs font-medium text-indigo-400 mb-6">
              <Sparkles size={12} />
              Demo Version Available Now
            </div>
            <h2 className="text-4xl font-black text-white mb-4">
              Ready to Transform Governance?
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
              Join thousands of citizens, researchers, and policymakers building a better India together.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/problems/new">
                <Button size="lg" rightIcon={<ArrowRight size={16} />}>
                  Report Your First Problem
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="secondary">
                  Explore Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </PageWrapper>
  );
}
