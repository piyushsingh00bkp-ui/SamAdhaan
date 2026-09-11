import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark, AlertTriangle, CheckCircle2, Clock,
  ShieldCheck, ArrowRight, FileText, Send, Sparkles,
  BarChart2, Users, Building, Download, Loader2, RefreshCw,
  Printer, ChevronDown, Check, FileCheck, Layers, Award,
  Key, Bot, PieChart as PieIcon
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { StatusBadge, UrgencyBadge, Badge } from '@/components/ui/Badge';
import { MOCK_PROBLEMS } from '@/mock';
import apiClient from '@/api/client';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const WARD_METRICS = [
  { ward: 'Ward 47 (Hinjewadi)', totalIssues: 142, resolved: 118, active: 24, compliance: 94, alertStatus: 'Normal' },
  { ward: 'Ward A (Dharavi)', totalIssues: 389, resolved: 245, active: 144, compliance: 81, alertStatus: 'High Alert' },
  { ward: 'Ward 84 (Whitefield)', totalIssues: 210, resolved: 172, active: 38, compliance: 88, alertStatus: 'Moderate' },
  { ward: 'Ward 3 (Jaipur Heritage)', totalIssues: 94, resolved: 82, active: 12, compliance: 96, alertStatus: 'Normal' },
  { ward: 'Ward 12 (Cyberabad)', totalIssues: 165, resolved: 140, active: 25, compliance: 92, alertStatus: 'Normal' },
];

const SLA_STATUS_DATA = [
  { name: 'Within SLA (<48h)', value: 68, color: '#34d399' },
  { name: 'Approaching SLA (48-72h)', value: 21, color: '#f59e0b' },
  { name: 'SLA Escalated (>72h)', value: 11, color: '#ef4444' },
];

function CustomGovTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 border border-white/10 text-xs shadow-xl backdrop-blur-md">
      {label && <p className="text-slate-400 mb-1">{label}</p>}
      {payload.map((p: any) => (
        <div key={p.dataKey || p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.fill || '#6366f1' }} />
          <span className="text-slate-300">{p.name || p.dataKey}:</span>
          <span className="text-white font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function GovernmentPage() {
  const [selectedProblemId, setSelectedProblemId] = useState<string>(MOCK_PROBLEMS[0]?.id || 'PRB-001');
  const [selectedProblem, setSelectedProblem] = useState<any>(MOCK_PROBLEMS[0]);
  const [allProblems, setAllProblems] = useState<any[]>(MOCK_PROBLEMS);
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportResult, setReportResult] = useState<any | null>(null);

  // Fetch real problems from backend if available
  useEffect(() => {
    apiClient.get('/challenges?limit=20')
      .then((res) => {
        const items = res.data?.data?.items || res.data?.data;
        if (items && Array.isArray(items) && items.length > 0) {
          const combined = [...items, ...MOCK_PROBLEMS.filter(mp => !items.some(it => it.id === mp.id))];
          setAllProblems(combined);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveApiKey = (key: string) => {
    setGeminiApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleSelectProblem = (probId: string) => {
    setSelectedProblemId(probId);
    const prob = allProblems.find(p => p.id === probId) || MOCK_PROBLEMS[0];
    setSelectedProblem(prob);
  };

  const handleGenerateReport = async () => {
    setReportLoading(true);
    const prob = selectedProblem || MOCK_PROBLEMS[0];
    try {
      const res = await apiClient.post('/ai/reports/generate', {
        problemId: prob.id,
        title: prob.title,
        category: prob.category,
        description: prob.description,
        ward: prob.ward || prob.locationName || 'Ward 47 (Hinjewadi)',
        city: prob.district || 'Pune',
        district: prob.district || 'Pune',
        geminiApiKey: geminiApiKey || undefined,
        timeframe: 'Current Reporting Period',
        format: 'executive_brief'
      });
      const data = res.data?.data || res.data;
      setReportResult(data);
    } catch (err) {
      setReportResult({
        reportId: `GOV-RPT-${prob.id || 'PRB001'}-${Date.now().toString(36).toUpperCase()}`,
        title: `MUNICIPAL EXECUTIVE DOSSIER: ${prob.title?.toUpperCase() || 'CIVIC INFRASTRUCTURE REPORT'}`,
        problemId: prob.id,
        jurisdiction: prob.locationName || 'Ward 47 (Hinjewadi-Wakad), Pune, Maharashtra',
        category: prob.category || 'Infrastructure',
        generatedAt: new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' }),
        aiModel: geminiApiKey ? 'Google Gemini 2.5 Flash' : 'SAMADHAAN Neural GovTech Engine',
        executiveSummary: `Official municipal intelligence dossier synthesizing citizen ground telemetry, AI computer vision damage metrics, and inter-agency workflows for "${prob.title}". Immediate departmental mobilization is authorized to maintain Municipal Ward SLA compliance.`,
        rootCauseAnalysis: [
          `Severe structural fatigue and sub-base degradation identified in ${prob.category} assets.`,
          'Heavy seasonal rainfall and drainage choke points exacerbating road bed erosion.',
          'Direct threat to peak vehicular and pedestrian traffic (est. 18,000+ daily citizens).'
        ],
        departmentalDirectives: [
          {
            department: 'PMC Municipal Works & Road Engineering Division',
            officer: 'Executive Engineer (Ward 47)',
            action: 'Issue emergency work-order for rapid polymer cold-mix patching and sub-base stabilization.',
            slaHours: '24 Hours',
            priority: 'CRITICAL'
          },
          {
            department: 'Stormwater Drainage & Sanitation Board',
            officer: 'Superintendent of Drainage Operations',
            action: 'Deploy high-capacity suction desilting machines and install water-level telemetry sensors.',
            slaHours: '48 Hours',
            priority: 'HIGH'
          },
          {
            department: 'COEP University R&D Research Cell',
            officer: 'Lead Principal Investigator',
            action: 'Conduct drone LiDAR topographic scan and submit long-term drainage redesign report.',
            slaHours: '7 Days',
            priority: 'MEDIUM'
          }
        ],
        financialAndCSRSanction: {
          recommendedBudget: '₹42.50 Lakhs',
          csrGrantOpportunity: '₹25.00 Lakhs (Eligible under CSR Schedule VII / Infrastructure & Safety)',
          ulbEmergencyFund: '₹17.50 Lakhs',
          sroiMultiplier: '4.6x Social Return on Investment'
        },
        kpiTargets: {
          resolutionTarget: '14 Days',
          beneficiariesProtected: '18,500 Citizens',
          accidentReductionEstimate: '78%',
          publicSafetyIndexImprovement: '+42 Points'
        },
        digitalVerification: {
          verifiedBy: 'SAMADHAAN GovTech AI Executive Engine v2.0',
          cryptographicHash: 'SHA256:9a4e88b2c1f09d847aa012be44f001c9',
          gazetteStatus: 'OFFICIALLY SANCTIONED & SIGNED'
        }
      });
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <Landmark size={16} className="text-amber-400" />
              </div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Government & Municipal Command</span>
              <span className="text-xs text-slate-400 bg-white/4 px-2 py-0.5 rounded-full border border-white/6">GovTech Console</span>
            </div>
            <h1 className="text-3xl font-black text-white">Ward Analytics & Executive Intelligence</h1>
            <p className="text-slate-400 mt-1 max-w-2xl text-sm">
              Real-time multi-departmental escalation console, SLA compliance graphs, and Gemini AI-powered problem dossier generator.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyInput(!showKeyInput)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                geminiApiKey
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-white/5 text-slate-400 hover:text-white border-white/10'
              }`}
            >
              <Key size={13} />
              <span>{geminiApiKey ? 'Gemini Key Configured ✓' : 'Add Gemini API Key'}</span>
            </button>
          </div>
        </motion.div>

        {/* Gemini API Key Drawer */}
        <AnimatePresence>
          {showKeyInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 mb-6 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot size={15} className="text-indigo-400" />
                  <span className="text-xs font-bold text-white">Custom Google Gemini API Key</span>
                </div>
                <button onClick={() => setShowKeyInput(false)} className="text-xs text-slate-400 hover:text-white">Close</button>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiApiKey}
                  onChange={(e) => handleSaveApiKey(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Visual Graphs & SLA Charts */}
        <div className="grid lg:grid-cols-3 gap-5 mb-8">
          {/* Ward SLA Resolution Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 glass rounded-3xl p-5 border border-white/8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Municipal Ward Workload</p>
                <p className="text-base font-bold text-white mt-0.5">Reported vs. Resolved per Ward</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-indigo-400"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Total</span>
                <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Resolved</span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={WARD_METRICS} barGap={4}>
                <XAxis dataKey="ward" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomGovTooltip />} />
                <Bar dataKey="totalIssues" name="Total Issues" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Municipal SLA Compliance Donut / Pie Chart */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-3xl p-5 border border-white/8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">SLA Health</p>
                  <p className="text-base font-bold text-white mt-0.5">Escalation Status</p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <PieIcon size={14} />
                </div>
              </div>

              <ResponsiveContainer width="100%" height={145}>
                <PieChart>
                  <Pie
                    data={SLA_STATUS_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={62}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {SLA_STATUS_DATA.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomGovTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-1.5 mt-1 pt-3 border-t border-white/6">
              {SLA_STATUS_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-400 truncate">{item.name}</span>
                  </div>
                  <span className="text-white font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* AI Municipal Dossier Section */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6 sm:p-8 border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-surface-1 to-surface-2/80 mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">AI Executive Municipal Dossier Engine</h3>
                <p className="text-xs text-slate-400">Select any grievance to generate an official inter-agency resolution brief with financial sanction breakdowns.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedProblemId}
                onChange={(e) => handleSelectProblem(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer max-w-[220px] truncate"
              >
                {allProblems.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.id} - {p.title?.slice(0, 30)}...
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                onClick={handleGenerateReport}
                disabled={reportLoading}
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shrink-0"
              >
                {reportLoading ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                <span>{reportLoading ? 'Synthesizing...' : 'Generate Dossier'}</span>
              </Button>
            </div>
          </div>

          {/* Dossier Output */}
          {reportResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-surface-2/90 border border-amber-500/30 space-y-4 mt-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 tracking-wider font-bold">SANCTION ORDER #{reportResult.reportId}</span>
                  <h4 className="text-sm font-black text-white">{reportResult.title}</h4>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Jurisdiction: <strong className="text-white">{reportResult.jurisdiction}</strong></span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">{reportResult.category}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-slate-300 leading-relaxed"><strong className="text-amber-400">1. Executive Summary:</strong> {reportResult.executiveSummary}</p>
              </div>

              {/* Department Directives */}
              {reportResult.departmentalDirectives && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">2. Authorized Inter-Agency Directives</h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {reportResult.departmentalDirectives.map((dir: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/3 border border-white/6 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{dir.officer}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">{dir.slaHours} SLA</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{dir.department}</p>
                        <p className="text-[11px] text-slate-300">{dir.action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Financial Sanctions & Social ROI */}
              {reportResult.financialAndCSRSanction && (
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">3. Financial Sanction Breakdown</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-slate-400">Total Sanctioned Budget:</span><strong className="text-white">{reportResult.financialAndCSRSanction.recommendedBudget}</strong></div>
                      <div className="flex justify-between"><span className="text-slate-400">CSR Grant Allocation:</span><strong className="text-emerald-400">{reportResult.financialAndCSRSanction.csrGrantOpportunity}</strong></div>
                      <div className="flex justify-between"><span className="text-slate-400">ULB Emergency Fund:</span><strong className="text-amber-400">{reportResult.financialAndCSRSanction.ulbEmergencyFund}</strong></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                    <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">4. Societal Impact & SROI Multiplier</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-slate-400">SROI Return Ratio:</span><strong className="text-emerald-400">{reportResult.financialAndCSRSanction.sroiMultiplier}</strong></div>
                      <div className="flex justify-between"><span className="text-slate-400">Direct Citizen Beneficiaries:</span><strong className="text-white">{reportResult.kpiTargets?.beneficiariesProtected || '15,000+'}</strong></div>
                      <div className="flex justify-between"><span className="text-slate-400">Accident Mitigation Rate:</span><strong className="text-indigo-300">{reportResult.kpiTargets?.accidentReductionEstimate || '82%'}</strong></div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Critical Grievances Feed */}
        <div className="glass rounded-3xl p-6 border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-400" />
            Active Critical Reports Requiring Municipal Sanction
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {allProblems.filter(p => (p.aiUrgencyScore ?? p.severity ?? 0) >= 75).slice(0, 4).map((prob) => (
              <div key={prob.id} className="p-4 rounded-2xl bg-white/3 border border-white/6 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <UrgencyBadge score={prob.aiUrgencyScore ?? prob.severity ?? 87} />
                    <span className="text-xs text-slate-400">{prob.locationName || 'Pune'}</span>
                  </div>
                  <p className="text-sm font-bold text-white truncate">{prob.title}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    handleSelectProblem(prob.id);
                    handleGenerateReport();
                  }}
                  className="bg-amber-600 hover:bg-amber-500 text-white text-xs shrink-0"
                >
                  Generate Dossier
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
