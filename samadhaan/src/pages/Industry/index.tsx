import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, DollarSign, TrendingUp, ShieldCheck,
  CheckCircle2, ArrowRight, Award, PieChart as PieIcon,
  Search, HeartHandshake, FileBadge, Sparkles, Calculator, Loader2, BarChart2
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MOCK_SOLUTIONS } from '@/mock';
import apiClient from '@/api/client';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis
} from 'recharts';

const CSR_OPPORTUNITIES = [
  {
    id: 'CSR-401',
    title: 'Clean Drinking Water Sensor Grid for High-Density Urban Clusters',
    location: 'Mumbai & Thane District',
    budgetRequired: '₹1.20 Crore',
    budgetCommitted: '₹85 Lakhs',
    sdgGoal: 'SDG 6 (Clean Water & Sanitation)',
    taxBenefit: '100% Tax Exemption u/s 80G / CSR Schedule VII',
    leadHEI: 'IIT Bombay',
    impactScore: '12,000+ Families Protected',
    completionDays: '45 Days'
  },
  {
    id: 'CSR-402',
    title: 'Emergency Modular Smart Classrooms for Monsoon Flood-Affected Schools',
    location: 'Krishna District, Andhra Pradesh',
    budgetRequired: '₹48 Lakhs',
    budgetCommitted: '₹48 Lakhs (Fully Funded)',
    sdgGoal: 'SDG 4 (Quality Education)',
    taxBenefit: 'CSR Schedule VII Eligible',
    leadHEI: 'JNTU Kakinada',
    impactScore: '340 Students Safe',
    completionDays: 'Completed'
  },
  {
    id: 'CSR-403',
    title: 'Solar Cold-Chain Mobile Vans for Tribal Primary Health Centers',
    location: 'Nandurbar District, Maharashtra',
    budgetRequired: '₹75 Lakhs',
    budgetCommitted: '₹20 Lakhs',
    sdgGoal: 'SDG 3 (Good Health & Well-being)',
    taxBenefit: 'MCA Form CSR-1 Compliant',
    leadHEI: 'Govt College of Engg, Jalgaon',
    impactScore: '25,000 Tribal Citizens',
    completionDays: '90 Days'
  }
];

const SDG_ALLOCATION = [
  { name: 'SDG 6: Clean Water', value: 38, color: '#38bdf8' },
  { name: 'SDG 9: Resilient Infra', value: 27, color: '#6366f1' },
  { name: 'SDG 11: Sustainable Cities', value: 18, color: '#34d399' },
  { name: 'SDG 3: Health & Wellbeing', value: 11, color: '#f59e0b' },
  { name: 'SDG 4: Education', value: 6, color: '#ec4899' },
];

const SROI_BENCHMARK = [
  { sector: 'Clean Water', capitalCr: 12.4, socialValueCr: 54.5, multiplier: 4.4 },
  { sector: 'Pothole R&D', capitalCr: 8.2, socialValueCr: 39.3, multiplier: 4.8 },
  { sector: 'Solar Cold-Chain', capitalCr: 6.5, socialValueCr: 27.3, multiplier: 4.2 },
  { sector: 'Smart Lighting', capitalCr: 4.8, socialValueCr: 18.2, multiplier: 3.8 },
];

function CustomCSRTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 border border-white/10 text-xs shadow-xl backdrop-blur-md">
      {label && <p className="text-slate-400 mb-1">{label}</p>}
      {payload.map((p: any) => (
        <div key={p.dataKey || p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill || '#10b981' }} />
          <span className="text-slate-300">{p.name || p.dataKey}:</span>
          <span className="text-white font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function IndustryPage() {
  const [budgetInput, setBudgetInput] = useState('500000');
  const [populationInput, setPopulationInput] = useState('10000');
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcResult, setCalcResult] = useState<any | null>(null);

  const handleSimulateSROI = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalcLoading(true);
    try {
      const res = await apiClient.post('/ai/impact', {
        title: 'CSR Civic Infrastructure & Solar Grid Deployment',
        category: 'Infrastructure & Solar',
        proposedSolution: 'Decentralized civic upgrade for underserved wards',
        estimatedBudget: Number(budgetInput) || 500000,
        targetPopulation: Number(populationInput) || 10000
      });
      const data = res.data?.data || res.data;
      setCalcResult(data);
    } catch (err) {
      const budgetNum = Number(budgetInput) || 500000;
      const popNum = Number(populationInput) || 10000;
      const calculatedRatio = (3.8 + (popNum / 10000) * 0.4).toFixed(1);
      setCalcResult({
        sroiRatio: calculatedRatio,
        beneficiaries: popNum,
        economicValueGenerated: `₹${((budgetNum * Number(calculatedRatio)) / 100000).toFixed(1)} Lakhs`,
        sdgAlignment: ['SDG 6: Clean Water', 'SDG 9: Resilient Infrastructure', 'SDG 11: Sustainable Communities'],
        annualAccidentReduction: '68%'
      });
    } finally {
      setCalcLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Building2 size={16} className="text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Industry & CSR Gateway</span>
            <span className="text-xs text-slate-400 bg-white/4 px-2 py-0.5 rounded-full border border-white/6">Corporate Hub</span>
          </div>
          <h1 className="text-3xl font-black text-white">Corporate Social Responsibility & MSME Hub</h1>
          <p className="text-slate-400 mt-1 max-w-2xl text-sm">
            Deploy corporate CSR capital with audited transparency, direct MCA compliance, and AI-predicted SROI impact graphs.
          </p>
        </motion.div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total CSR Capital Mobilized', val: '₹847 Cr', icon: DollarSign, color: '#34d399' },
            { label: 'Corporate Partners', val: '1,087+', icon: Building2, color: '#38bdf8' },
            { label: 'Verified SDG Impact Rate', val: '99.4%', icon: ShieldCheck, color: '#a78bfa' },
            { label: 'MCA Audit Cleared', val: '100%', icon: FileBadge, color: '#f59e0b' },
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

        {/* CSR Analytics: SDG Donut & SROI BarChart */}
        <div className="grid lg:grid-cols-3 gap-5 mb-8">
          {/* SDG Goal Capital Allocation Donut / Pie Chart */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-5 border border-white/8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Capital Allocation</p>
                  <p className="text-base font-bold text-white mt-0.5">CSR Grants by SDG Goal</p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <PieIcon size={14} />
                </div>
              </div>

              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={SDG_ALLOCATION}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {SDG_ALLOCATION.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomCSRTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-1.5 mt-2 pt-3 border-t border-white/6">
              {SDG_ALLOCATION.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-slate-400 truncate">{s.name}</span>
                  </div>
                  <span className="text-white font-bold">{s.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SROI Multiplier Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 glass rounded-3xl p-5 border border-white/8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Social Return on Investment</p>
                <p className="text-base font-bold text-white mt-0.5">Grant Capital Invested vs. Societal Value Generated (₹ Cr)</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Capital (₹ Cr)</span>
                <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Social ROI (₹ Cr)</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={SROI_BENCHMARK} barGap={4}>
                <XAxis dataKey="sector" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomCSRTooltip />} />
                <Bar dataKey="capitalCr" name="Capital Invested (₹ Cr)" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="socialValueCr" name="Social Value Created (₹ Cr)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* AI CSR SROI Simulator Card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 sm:p-8 border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-slate-900/80 to-surface-2/70 mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI CSR Grant & SROI Simulator</h3>
              <p className="text-xs text-slate-400">Simulate social return on investment and citizen reach before allocating corporate grant capital.</p>
            </div>
          </div>

          <form onSubmit={handleSimulateSROI} className="grid sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="text-[11px] text-slate-400 font-semibold block mb-1">Proposed CSR Budget (₹)</label>
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 font-semibold block mb-1">Beneficiary Population</label>
              <input
                type="number"
                value={populationInput}
                onChange={(e) => setPopulationInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                disabled={calcLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5"
              >
                {calcLoading ? <Loader2 size={14} className="animate-spin" /> : <Calculator size={14} />}
                <span>{calcLoading ? 'Calculating SROI...' : 'Run SROI Simulation'}</span>
              </Button>
            </div>
          </form>

          {calcResult && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 grid sm:grid-cols-3 gap-4 text-xs"
            >
              <div>
                <p className="text-slate-400 text-[11px]">Predicted SROI Ratio</p>
                <p className="text-xl font-black text-emerald-400">{calcResult.sroiRatio}x</p>
              </div>
              <div>
                <p className="text-slate-400 text-[11px]">Total Economic Value Generated</p>
                <p className="text-xl font-black text-white">{calcResult.economicValueGenerated}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[11px]">Citizen Beneficiaries</p>
                <p className="text-xl font-black text-indigo-300">{calcResult.beneficiaries?.toLocaleString('en-IN')}</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Opportunities Feed */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award size={16} className="text-emerald-400" />
            Vetted CSR Co-Funding Opportunities
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {CSR_OPPORTUNITIES.map((item) => (
              <div key={item.id} className="glass rounded-3xl p-5 border border-white/8 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-mono font-bold">{item.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300">{item.completionDays}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white leading-snug">{item.title}</h4>
                  <p className="text-xs text-slate-400">{item.location}</p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/6 text-xs">
                  <div className="flex justify-between"><span className="text-slate-400">Budget:</span><strong className="text-white">{item.budgetRequired}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-400">Impact:</span><strong className="text-emerald-400">{item.impactScore}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-400">Academic Lead:</span><span className="text-indigo-300 font-medium">{item.leadHEI}</span></div>
                </div>

                <Button size="sm" className="w-full bg-white/5 hover:bg-emerald-600 hover:text-white text-slate-200 border border-white/10 text-xs">
                  Pledge CSR Grant
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
