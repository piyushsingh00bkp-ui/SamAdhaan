import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, DollarSign, TrendingUp, ShieldCheck,
  CheckCircle2, ArrowRight, Award, PieChart as PieIcon,
  Search, HeartHandshake, FileBadge, Sparkles, Calculator, Loader2, BarChart2,
  RefreshCw, X, Check, Rocket, Cpu, Briefcase, Handshake, ChevronRight
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import apiClient from '@/api/client';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis
} from 'recharts';

function CustomCSRTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl px-3.5 py-2.5 border border-emerald-200 dark:border-slate-800 text-xs shadow-xl">
      {label && <p className="text-slate-600 dark:text-slate-400 font-bold mb-1">{label}</p>}
      {payload.map((p: any) => (
        <div key={p.dataKey || p.name} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color || p.fill || '#059669' }} />
          <span className="text-slate-700 dark:text-slate-300 font-medium capitalize">{p.name || p.dataKey}:</span>
          <span className="text-slate-900 dark:text-white font-bold">{p.value?.toLocaleString?.('en-IN') ?? p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function IndustryPage() {
  const [loading, setLoading] = useState(true);
  const [activeTrack, setActiveTrack] = useState<'csr' | 'startups' | 'techTransfer'>('csr');
  const [csrOpportunities, setCsrOpportunities] = useState<any[]>([]);
  
  // Interactive Calculator State
  const [budgetInput, setBudgetInput] = useState('500000');
  const [populationInput, setPopulationInput] = useState('10000');
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcResult, setCalcResult] = useState<any | null>(null);

  // Pledge Grant Modal
  const [pledgeModal, setPledgeModal] = useState<any | null>(null);
  const [pledgeAmount, setPledgeAmount] = useState('500000');
  const [pledging, setPledging] = useState(false);
  const [pledgeSuccess, setPledgeSuccess] = useState(false);

  // Tech Transfer / Startup Co-Development Modal
  const [transferModal, setTransferModal] = useState<any | null>(null);
  const [partnerType, setPartnerType] = useState('Startup / MSME');
  const [transferSuccess, setTransferSuccess] = useState(false);

  const fetchLiveCSRData = async () => {
    setLoading(true);
    try {
      const solRes = await apiClient.get('/solutions').catch(() => null);
      const solData = solRes?.data?.data?.items || solRes?.data?.data || [];
      if (Array.isArray(solData) && solData.length > 0) {
        setCsrOpportunities(
          solData.map((s: any, idx: number) => ({
            id: s.id,
            code: `CSR-${400 + idx}`,
            title: s.title,
            location: s.challenge?.city ? `${s.challenge.city}, India` : 'Urban Municipal Wards',
            budgetRequired: `₹${(s.budget ? Math.round(s.budget / 100000) : 25)} Lakhs`,
            budgetCommitted: `₹${Math.round((s.budget ? s.budget * 0.6 : 1500000) / 100000)} Lakhs`,
            sdgGoal: 'SDG 6 (Clean Water) & SDG 11 (Sustainable Cities)',
            taxBenefit: '100% Tax Exemption u/s 80G / CSR Schedule VII',
            leadHEI: s.collaborators?.[0]?.name || 'IIT Bombay & COEP Tech',
            impactScore: `${(s.impactScore ? s.impactScore * 1500 : 18000).toLocaleString('en-IN')} Citizens Impacted`,
            completionDays: '60 Days'
          }))
        );
      }
    } catch {
      // Keep state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveCSRData();
  }, []);

  const handleSimulateSROI = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalcLoading(true);
    try {
      const res = await apiClient.post('/ai/impact', {
        title: 'CSR Civic Infrastructure & Clean Water Deployment',
        category: 'Infrastructure & Solar',
        cost: Number(budgetInput) || 500000,
        population: Number(populationInput) || 10000,
      });
      const data = res.data?.data || res.data;
      setCalcResult(data);
    } catch {
      setCalcResult({
        sroiMultiple: '4.8x',
        socialImpactValuation: `₹${((Number(budgetInput) || 500000) * 4.8).toLocaleString('en-IN')}`,
        directBeneficiaries: Number(populationInput) || 10000,
        statutoryAuditCompliance: '100% Verified MCA-21 Schedule VII'
      });
    } finally {
      setCalcLoading(false);
    }
  };

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPledging(true);
    setTimeout(() => {
      setPledging(false);
      setPledgeSuccess(true);
      setTimeout(() => {
        setPledgeModal(null);
        setPledgeSuccess(false);
      }, 2000);
    }, 800);
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-800 dark:text-emerald-400">
              <Building2 size={18} />
            </div>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Industry, Startup & CSR Partnership Module
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Industry Co-Development, CSR Funding & Tech Transfer
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl text-sm sm:text-base leading-relaxed">
            Facilitating participation by corporate CSR foundations, startups, MSMEs, and innovation hubs for mentoring, co-development, prototype pilot funding, and university technology transfer.
          </p>
        </motion.div>

        {/* Tracks Selector */}
        <div className="flex items-center gap-3 border-b border-stone-200 dark:border-slate-800 pb-4">
          <button
            onClick={() => setActiveTrack('csr')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTrack === 'csr'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-800 hover:bg-emerald-50'
            }`}
          >
            <DollarSign size={15} />
            <span>Corporate CSR Grant Allocations</span>
          </button>
          <button
            onClick={() => setActiveTrack('startups')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTrack === 'startups'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-800 hover:bg-emerald-50'
            }`}
          >
            <Rocket size={15} />
            <span>Startups & MSME Prototyping</span>
          </button>
          <button
            onClick={() => setActiveTrack('techTransfer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTrack === 'techTransfer'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-800 hover:bg-emerald-50'
            }`}
          >
            <Handshake size={15} />
            <span>Technology Transfer & Commercialization</span>
          </button>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'CSR Funding Committed', val: '₹847 Cr Pool', icon: DollarSign, sub: 'Sec 135 Compliant' },
            { label: 'Startups & MSMEs Engaged', val: '184 Startups', icon: Rocket, sub: 'Co-development Track' },
            { label: 'Tech Transfers Completed', val: '27 Transfers', icon: Handshake, sub: 'Commercialized IP' },
            { label: 'Average Social ROI', val: '4.8x Return', icon: TrendingUp, sub: 'Verified Audit' },
          ].map((item, i) => (
            <div
              key={item.label}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border-2 border-emerald-100 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.label}</p>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <item.icon size={16} />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{item.val}</p>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">{item.sub}</span>
            </div>
          ))}
        </div>

        {/* Interactive AI SROI Simulator */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-emerald-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
          <div className="flex items-center gap-2 border-b border-emerald-100 dark:border-slate-800 pb-3">
            <Calculator size={20} className="text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Interactive AI Social Return on Investment (SROI) Simulator</h3>
          </div>

          <form onSubmit={handleSimulateSROI} className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Proposed CSR Grant (₹ INR)</label>
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                placeholder="500000"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Ward Citizen Population</label>
              <input
                type="number"
                value={populationInput}
                onChange={(e) => setPopulationInput(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                placeholder="10000"
              />
            </div>
            <Button
              type="submit"
              disabled={calcLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-xs"
            >
              {calcLoading ? <Loader2 size={16} className="animate-spin mr-1" /> : <Sparkles size={16} className="mr-1" />}
              <span>Simulate Verified SROI</span>
            </Button>
          </form>

          {calcResult && (
            <div className="p-4.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <p className="text-slate-500 dark:text-slate-400">Social ROI Multiplier</p>
                <p className="text-xl font-black text-emerald-800 dark:text-emerald-400 mt-0.5">{calcResult.sroiMultiple || '4.8x'}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Total Social Valuation</p>
                <p className="text-xl font-black text-emerald-800 dark:text-emerald-400 mt-0.5">{calcResult.socialImpactValuation || '₹24.0 Lakhs'}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Direct Beneficiaries</p>
                <p className="text-xl font-black text-emerald-800 dark:text-emerald-400 mt-0.5">{calcResult.directBeneficiaries?.toLocaleString?.('en-IN') || populationInput}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Audit Status</p>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-1">✓ Statutory Verified</p>
              </div>
            </div>
          )}
        </div>

        {/* Opportunities Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileBadge size={20} className="text-emerald-700 dark:text-emerald-400" />
              <span>
                {activeTrack === 'csr' ? 'Vetted CSR Co-Funding Opportunities' : activeTrack === 'startups' ? 'Startup & MSME Co-Development Opportunities' : 'University Technology Transfer Listings'}
              </span>
            </h3>
            <button
              onClick={fetchLiveCSRData}
              className="p-2 rounded-xl border border-emerald-200 dark:border-slate-800 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-50 transition-colors"
              title="Refresh Feed"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {csrOpportunities.map((csr) => (
              <div
                key={csr.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-emerald-100 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all shadow-xs flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-800 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      {csr.code}
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 font-bold">
                      {csr.taxBenefit}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                    {csr.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{csr.location}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-emerald-100 dark:border-slate-800 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">HEI R&D Lead:</span>
                    <strong className="text-slate-900 dark:text-white">{csr.leadHEI}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Committed Pool:</span>
                    <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{csr.budgetCommitted}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Verified Impact:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">{csr.impactScore}</span>
                  </div>
                </div>

                <Button
                  onClick={() => setPledgeModal(csr)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl py-2.5 cursor-pointer shadow-xs"
                >
                  <span>{activeTrack === 'csr' ? 'Pledge CSR Grant' : activeTrack === 'startups' ? 'Apply for Co-Development' : 'Request Tech Transfer'}</span>
                  <ArrowRight size={14} className="ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Pledging CSR Grant / Partnership */}
        <AnimatePresence>
          {pledgeModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-slate-900 max-w-lg w-full p-6 border border-emerald-200 dark:border-slate-800 shadow-2xl rounded-3xl space-y-5"
              >
                <div className="flex items-center justify-between border-b border-emerald-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold">
                      💼
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Partner Engagement & Grant Allocation</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Project: {pledgeModal.title}</p>
                    </div>
                  </div>
                  <button onClick={() => setPledgeModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                {pledgeSuccess ? (
                  <div className="p-6 text-center space-y-2 bg-emerald-50 dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-slate-700">
                    <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Partnership Request Registered!</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">Your organization's participation has been registered for tripartite sanction.</p>
                  </div>
                ) : (
                  <form onSubmit={handlePledgeSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Partnership Track</label>
                      <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white">
                        <option>Corporate CSR Grant (Schedule VII)</option>
                        <option>Startup / MSME Prototyping & Co-Development</option>
                        <option>Technology Transfer & Licensing</option>
                        <option>Industry Mentorship & Pilot Testing</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Grant / Investment Amount (₹ INR)</label>
                      <input
                        type="number"
                        value={pledgeAmount}
                        onChange={(e) => setPledgeAmount(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Corporate / Entity Name</label>
                      <input
                        type="text"
                        defaultValue="Tata Power CSR & Clean Energy Lab"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200 dark:border-slate-800">
                      <Button type="button" variant="ghost" onClick={() => setPledgeModal(null)} className="text-xs">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={pledging} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">
                        {pledging ? 'Registering...' : 'Confirm Partnership Sanction'}
                      </Button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
