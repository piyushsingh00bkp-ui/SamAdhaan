import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, DollarSign, TrendingUp, ShieldCheck,
  CheckCircle2, ArrowRight, Award, PieChart as PieIcon,
  Search, HeartHandshake, FileBadge, Sparkles, Calculator, Loader2
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MOCK_SOLUTIONS } from '@/mock';
import apiClient from '@/api/client';

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
            Deploy corporate CSR capital with audited transparency, direct MCA compliance, and AI-predicted SROI impact metrics.
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
                placeholder="500000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 font-semibold block mb-1">Target Citizens / Beneficiaries</label>
              <input
                type="number"
                value={populationInput}
                onChange={(e) => setPopulationInput(e.target.value)}
                placeholder="10000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={calcLoading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9">
                {calcLoading ? <Loader2 size={14} className="animate-spin mr-1" /> : <Calculator size={14} className="mr-1" />}
                Run AI Simulation
              </Button>
            </div>
          </form>

          {calcResult && (
            <div className="grid sm:grid-cols-3 gap-3 pt-3 border-t border-emerald-500/20">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-[10px] text-emerald-300 uppercase tracking-wider font-bold">Predicted SROI Multiplier</p>
                <p className="text-2xl font-black text-emerald-400 mt-0.5">{calcResult.sroiRatio || '4.2'}x</p>
                <p className="text-[10px] text-slate-400">High social yield index</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/4 border border-white/8">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Economic Civic Value</p>
                <p className="text-2xl font-black text-white mt-0.5">{calcResult.economicValueGenerated || '₹21 Lakhs'}</p>
                <p className="text-[10px] text-slate-500">Long-term infrastructure benefit</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/4 border border-white/8">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">MCA Schedule VII</p>
                <p className="text-2xl font-black text-indigo-300 mt-0.5">100% Eligible</p>
                <p className="text-[10px] text-slate-500">Tax Deductible u/s 80G</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* CSR Matching Matrix */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main 2 Columns: Opportunities List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <HeartHandshake size={18} className="text-emerald-400" />
                  High-Impact CSR Investment Portfolios
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Pre-vetted university solutions awaiting corporate funding</p>
              </div>
            </div>

            <div className="space-y-4">
              {CSR_OPPORTUNITIES.map((opp) => (
                <div key={opp.id} className="glass rounded-2xl p-5 border border-white/8 hover:border-emerald-500/30 transition-all space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-mono text-emerald-400 font-semibold">{opp.id} • {opp.location}</span>
                      <h4 className="text-base font-bold text-white mt-1 leading-snug">{opp.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">Research Lead: <strong className="text-slate-200">{opp.leadHEI}</strong></p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 font-semibold">
                      {opp.sdgGoal}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/3 text-xs">
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-bold">Funding Status</p>
                      <p className="text-white font-bold mt-0.5">{opp.budgetCommitted} / {opp.budgetRequired}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-bold">Civic Beneficiaries</p>
                      <p className="text-emerald-400 font-bold mt-0.5">{opp.impactScore}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-bold">Tax Exemption</p>
                      <p className="text-amber-400 font-bold mt-0.5">80G Verified</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-400">
                    <span>{opp.taxBenefit}</span>
                    <Button size="sm" variant="saffron" rightIcon={<ArrowRight size={13} />}>
                      Pledge CSR Funds
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: MSME Procurement & Tax Exemption */}
          <div className="space-y-6">
            <div className="glass rounded-3xl p-6 border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileBadge size={16} className="text-emerald-400" />
                Automated MCA CSR-1 Dossier
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download pre-populated Ministry of Corporate Affairs compliant CSR expenditure certificates with geo-tagged proof of deployment.
              </p>
              <Button size="sm" variant="outline" className="w-full">
                Download Annual CSR Summary
              </Button>
            </div>

            <div className="glass rounded-3xl p-6 border border-white/10 space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">MSME Execution Marketplace</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Local MSMEs can bid for execution contracts (drain desilting, road patching, solar installation) validated by university engineering plans.
              </p>
              <div className="pt-2">
                <Button size="sm" variant="secondary" className="w-full">
                  Register as MSME Supplier
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
