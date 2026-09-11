import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  GraduationCap, BookOpen, Award, Sparkles,
  ArrowRight, Users, CheckCircle2, Search, Filter,
  Building, FlaskConical, Trophy, PieChart as PieIcon
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MOCK_PROBLEMS } from '@/mock';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis
} from 'recharts';

const UNIVERSITY_CHALLENGES = [
  {
    id: 'UC-101',
    title: 'Low-Power IoT Sensor Array for Open Drain Toxicity Detection',
    domain: 'Environmental Engineering & IoT',
    bounty: '₹4.5 Lakhs Grant',
    partner: 'IIT Bombay + BMC',
    deadline: '30 Sept 2026',
    teamsApplied: 14,
    sdg: [6, 11]
  },
  {
    id: 'UC-102',
    title: 'Recycled Plastic Polymer Mix for Rapid Pothole Patching',
    domain: 'Materials Science & Civil Engineering',
    bounty: '₹7.0 Lakhs Grant',
    partner: 'COEP Pune + NHAI',
    deadline: '15 Oct 2026',
    teamsApplied: 22,
    sdg: [9, 12]
  },
  {
    id: 'UC-103',
    title: 'Solar-Assisted Primary Healthcare Drug Cold-Chain Lockbox',
    domain: 'Renewable Energy & Biomedical',
    bounty: '₹5.5 Lakhs Grant',
    partner: 'JNTU + AP Health Dept',
    deadline: '25 Oct 2026',
    teamsApplied: 9,
    sdg: [3, 7]
  }
];

const DOMAIN_DISTRIBUTION = [
  { name: 'IoT & Sensors', value: 32, color: '#8b5cf6' },
  { name: 'Civil & Materials', value: 28, color: '#38bdf8' },
  { name: 'Clean Energy', value: 22, color: '#34d399' },
  { name: 'AI & Vision Models', value: 18, color: '#f59e0b' },
];

const UNIVERSITY_GRANTS_DATA = [
  { name: 'IIT Bombay', teams: 42, grantsLakhs: 85 },
  { name: 'COEP Pune', teams: 36, grantsLakhs: 68 },
  { name: 'JNTU Kakinada', teams: 28, grantsLakhs: 52 },
  { name: 'Anna University', teams: 31, grantsLakhs: 60 },
  { name: 'BITS Pilani', teams: 25, grantsLakhs: 48 },
];

function CustomUnivTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 border border-white/10 text-xs shadow-xl backdrop-blur-md">
      {label && <p className="text-slate-400 mb-1">{label}</p>}
      {payload.map((p: any) => (
        <div key={p.dataKey || p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill || '#8b5cf6' }} />
          <span className="text-slate-300">{p.name || p.dataKey}:</span>
          <span className="text-white font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function UniversitiesPage() {
  const [selectedDomain, setSelectedDomain] = useState('all');

  return (
    <PageWrapper>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
              <GraduationCap size={16} className="text-violet-400" />
            </div>
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Higher Education & Research Hub</span>
            <span className="text-xs text-slate-500 bg-white/4 px-2 py-0.5 rounded-full border border-white/6">HEI Portal</span>
          </div>
          <h1 className="text-3xl font-black text-white">University R&D & Civic Innovation</h1>
          <p className="text-slate-400 mt-1 max-w-2xl text-sm">
            Empower faculty and student researchers to turn real-world civic challenges into funded thesis projects, patents, and deployed prototypes.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Partnered Universities', val: '234+', icon: Building, color: '#a78bfa' },
            { label: 'Active Student Teams', val: '1,420', icon: Users, color: '#38bdf8' },
            { label: 'R&D Seed Grants Disbursed', val: '₹14.2 Cr', icon: Award, color: '#34d399' },
            { label: 'Published Solutions & Patents', val: '189', icon: BookOpen, color: '#f59e0b' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-4 border border-white/8"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-400">{item.label}</p>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                  <item.icon size={15} />
                </div>
              </div>
              <p className="text-2xl font-black text-white">{item.val}</p>
            </motion.div>
          ))}
        </div>

        {/* Visual Charts: Domain Donut & HEI Grants BarChart */}
        <div className="grid lg:grid-cols-3 gap-5 mb-8">
          {/* Research Domains Pie Chart */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-5 border border-white/8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Research Disciplines</p>
                  <p className="text-base font-bold text-white mt-0.5">Prototype Domains</p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-violet-500/15 text-violet-400 flex items-center justify-center">
                  <PieIcon size={14} />
                </div>
              </div>

              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={DOMAIN_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {DOMAIN_DISTRIBUTION.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomUnivTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-1.5 mt-2 pt-3 border-t border-white/6">
              {DOMAIN_DISTRIBUTION.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-400 truncate">{d.name}</span>
                  </div>
                  <span className="text-white font-bold">{d.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Academic Grants Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 glass rounded-3xl p-5 border border-white/8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Academic Performance</p>
                <p className="text-base font-bold text-white mt-0.5">Active Student Teams & Seed Grants (₹ Lakhs)</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-violet-400"><span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Teams</span>
                <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Grants (₹ L)</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={UNIVERSITY_GRANTS_DATA} barGap={4}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomUnivTooltip />} />
                <Bar dataKey="teams" name="Student Teams" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="grantsLakhs" name="Grants (₹ Lakhs)" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Live Problem Feed for Universities */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FlaskConical size={16} className="text-violet-400" />
            Active University R&D Grand Challenges
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {UNIVERSITY_CHALLENGES.map((uc) => (
              <div key={uc.id} className="glass rounded-3xl p-5 border border-white/8 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-violet-400 font-mono font-bold">{uc.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-bold">{uc.bounty}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">{uc.title}</h4>
                  <p className="text-xs text-slate-400">{uc.domain}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/6 text-xs">
                  <div className="flex justify-between"><span className="text-slate-400">Collaborator:</span><strong className="text-white">{uc.partner}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-400">Applications:</span><strong className="text-indigo-300">{uc.teamsApplied} Teams</strong></div>
                  <div className="flex justify-between"><span className="text-slate-400">Submission Due:</span><span className="text-amber-400 font-medium">{uc.deadline}</span></div>
                </div>

                <Button size="sm" className="w-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold">
                  Submit Research Proposal
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
