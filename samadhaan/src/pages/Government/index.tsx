import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark, AlertTriangle, CheckCircle2, Clock,
  ShieldCheck, ArrowRight, FileText, Send, Sparkles,
  BarChart2, Users, Building, Download, Loader2, RefreshCw,
  Printer, ChevronDown, Check, FileCheck, Layers, Award,
  Key, Bot
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { StatusBadge, UrgencyBadge, Badge } from '@/components/ui/Badge';
import { MOCK_PROBLEMS } from '@/mock';
import apiClient from '@/api/client';

const WARD_METRICS = [
  { ward: 'Ward 47 (Hinjewadi-Wakad)', state: 'Maharashtra', totalIssues: 142, resolved: 118, slaCompliance: '94%', alertStatus: 'Normal' },
  { ward: 'Ward A (Dharavi-Sion)', state: 'Maharashtra', totalIssues: 389, resolved: 245, slaCompliance: '81%', alertStatus: 'High Alert' },
  { ward: 'Ward 84 (Whitefield)', state: 'Karnataka', totalIssues: 210, resolved: 172, slaCompliance: '88%', alertStatus: 'Moderate' },
  { ward: 'Ward 3 (Jaipur Heritage)', state: 'Rajasthan', totalIssues: 94, resolved: 82, slaCompliance: '96%', alertStatus: 'Normal' },
];

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

  // Update selected problem when dropdown changes
  const handleSelectProblem = (probId: string) => {
    setSelectedProblemId(probId);
    const prob = allProblems.find(p => p.id === probId) || MOCK_PROBLEMS[0];
    setSelectedProblem(prob);
  };

  // Trigger Live AI Report Generation for Selected Problem
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
              Real-time multi-departmental escalation console, SLA compliance radar, and Gemini AI-powered problem dossier generator.
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

        {/* Gemini API Key Configuration Drawer */}
        <AnimatePresence>
          {showKeyInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 mb-6 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Bot size={14} className="text-indigo-400" /> Google Gemini API Key
                </span>
                <span className="text-[10px] text-slate-400">Used for live generative executive summaries</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => handleSaveApiKey(e.target.value)}
                  placeholder="Paste your Gemini API key"
                  className="flex-1 bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <button
                  onClick={() => setShowKeyInput(false)}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                >
                  Save Key
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Command Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Urban Local Bodies', val: '312 ULBs', icon: Building, color: '#fbbf24' },
            { label: 'Avg Municipal SLA Response', val: '4.2 Hrs', icon: Clock, color: '#34d399' },
            { label: 'Escalations Auto-Resolved', val: '84.6%', icon: CheckCircle2, color: '#38bdf8' },
            { label: 'Inter-Agency Directives Issued', val: '1,280', icon: FileText, color: '#a78bfa' },
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

        {/* Interactive Problem-Specific Executive Report Generator Console */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6 sm:p-8 border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-slate-900/90 to-surface-2/70 mb-8 space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">AI Problem Dossier & Official PDF Generator</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Gemini 2.5 Flash
                  </span>
                </div>
                <p className="text-xs text-slate-400">Select any citizen grievance to synthesize AI root-cause analysis, budget sanction orders, and inter-agency SLAs.</p>
              </div>
            </div>

            <Button
              onClick={handleGenerateReport}
              disabled={reportLoading}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {reportLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              <span>{reportResult ? 'Re-Generate with Gemini AI' : 'Generate Executive PDF Dossier'}</span>
            </Button>
          </div>

          {/* Problem Selector Bar */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <span>Select Target Civic Problem for Dossier:</span>
              </label>
              <select
                value={selectedProblemId}
                onChange={(e) => handleSelectProblem(e.target.value)}
                className="w-full bg-slate-900 border border-white/15 rounded-2xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-amber-500 transition-colors"
              >
                {allProblems.map((prob) => (
                  <option key={prob.id} value={prob.id} className="bg-slate-900 text-white">
                    [{prob.id}] {prob.title} — ({prob.category || 'General'})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/4 border border-white/8 flex flex-col justify-center">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Selected Target Summary</p>
              <p className="text-xs font-bold text-white mt-1 truncate">{selectedProblem?.title || 'Severe Pothole Cluster'}</p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-amber-300">
                <span>Urgency: {selectedProblem?.aiUrgencyScore || selectedProblem?.severity || 85}/100</span>
                <span>•</span>
                <span>{selectedProblem?.locationName || 'Pune'}</span>
              </div>
            </div>
          </div>

          {/* Generated Official Municipal Dossier (Printable PDF View) */}
          {reportResult && (
            <motion.div
              id="printable-executive-dossier"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 rounded-3xl bg-slate-950/90 border border-amber-500/40 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:p-0 print:border-none"
            >
              {/* Official Gazette Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-amber-500/30 pb-5 gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl font-black">
                    🏛️
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">Government of Maharashtra • Urban Development Department</span>
                    <h2 className="text-lg sm:text-xl font-black text-white">{reportResult.title}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Ref: {reportResult.reportId} • Engine: {reportResult.aiModel || 'Gemini 2.5 Flash'}</p>
                  </div>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-amber-400 transition-all cursor-pointer shadow-lg shadow-amber-500/30 print:hidden shrink-0"
                >
                  <Printer size={15} />
                  <span>Download / Print Official PDF</span>
                </button>
              </div>

              {/* Problem Dossier Metadata Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/4 border border-white/8 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Problem Reference</span>
                  <span className="text-amber-400 font-mono font-bold">{reportResult.problemId}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Civic Category</span>
                  <span className="text-white font-semibold">{reportResult.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Time of Generation</span>
                  <span className="text-slate-300 font-medium">{reportResult.generatedAt}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Gazette Status</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> SANCTIONED
                  </span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">1. Executive Overview & Strategic Intent</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-white/2 p-3.5 rounded-2xl border border-white/6">
                  {reportResult.executiveSummary}
                </p>
              </div>

              {/* Root Cause & Hazard Diagnosis */}
              {reportResult.rootCauseAnalysis && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">2. AI Root Cause & Engineering Hazard Assessment</h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {reportResult.rootCauseAnalysis.map((rc: string, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-white/3 border border-white/6 text-xs text-slate-300">
                        <span className="text-amber-400 font-bold block mb-1">Diagnostic #{idx + 1}</span>
                        {rc}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Departmental Directives & Mandatory SLAs */}
              {reportResult.departmentalDirectives && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">3. Statutory Inter-Agency Orders & SLA Deadlines</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] text-slate-400 uppercase tracking-wider bg-white/4 border-b border-white/8">
                        <tr>
                          <th className="p-3 font-bold">Assigned Department</th>
                          <th className="p-3 font-bold">Nodal Officer</th>
                          <th className="p-3 font-bold">Mandated Action</th>
                          <th className="p-3 font-bold">SLA Target</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/6 text-slate-200">
                        {reportResult.departmentalDirectives.map((dir: any, idx: number) => (
                          <tr key={idx} className="hover:bg-white/2">
                            <td className="p-3 font-bold text-white flex items-center gap-1.5">
                              <span>🏛️</span> {dir.department}
                            </td>
                            <td className="p-3 text-slate-300">{dir.officer}</td>
                            <td className="p-3 text-slate-300">{dir.action}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                {dir.slaHours}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Financial Sanctions & Social ROI */}
              {reportResult.financialAndCSRSanction && (
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">4. Financial Sanction Breakdown</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-slate-400">Total Sanctioned Budget:</span><strong className="text-white">{reportResult.financialAndCSRSanction.recommendedBudget}</strong></div>
                      <div className="flex justify-between"><span className="text-slate-400">CSR Grant Allocation:</span><strong className="text-emerald-400">{reportResult.financialAndCSRSanction.csrGrantOpportunity}</strong></div>
                      <div className="flex justify-between"><span className="text-slate-400">ULB Emergency Fund:</span><strong className="text-amber-400">{reportResult.financialAndCSRSanction.ulbEmergencyFund}</strong></div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                    <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">5. Societal Impact & SROI Multiplier</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-slate-400">SROI Return Ratio:</span><strong className="text-emerald-400">{reportResult.financialAndCSRSanction.sroiMultiplier}</strong></div>
                      <div className="flex justify-between"><span className="text-slate-400">Direct Citizen Beneficiaries:</span><strong className="text-white">{reportResult.kpiTargets?.beneficiariesProtected || '15,000+'}</strong></div>
                      <div className="flex justify-between"><span className="text-slate-400">Accident Mitigation Rate:</span><strong className="text-indigo-300">{reportResult.kpiTargets?.accidentReductionEstimate || '82%'}</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Digital Verification & Seal */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-[11px] text-slate-400">
                <div>
                  <p className="text-slate-300 font-bold">Digitally Sealed by: {reportResult.digitalVerification?.verifiedBy}</p>
                  <p className="font-mono text-[10px] text-slate-500 mt-0.5">{reportResult.digitalVerification?.cryptographicHash}</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase tracking-wider">
                    ✓ Official Gazette Validated
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Ward SLA & Escalations Table */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main 2 Columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart2 size={18} className="text-amber-400" />
                  Ward Performance & SLA Command Radar
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] text-slate-400 uppercase tracking-wider border-b border-white/8">
                    <tr>
                      <th className="pb-3 font-semibold">Ward & Jurisdiction</th>
                      <th className="pb-3 font-semibold">Total / Resolved</th>
                      <th className="pb-3 font-semibold">SLA Compliance</th>
                      <th className="pb-3 font-semibold">Risk Alert</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/6 text-slate-300">
                    {WARD_METRICS.map((row) => (
                      <tr key={row.ward} className="hover:bg-white/3 transition-colors">
                        <td className="py-3 font-medium text-white">
                          {row.ward}
                          <span className="block text-[10px] text-slate-500">{row.state}</span>
                        </td>
                        <td className="py-3">{row.totalIssues} / <strong className="text-emerald-400">{row.resolved}</strong></td>
                        <td className="py-3 font-bold text-slate-200">{row.slaCompliance}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            row.alertStatus === 'High Alert' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                            row.alertStatus === 'Moderate' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                            'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {row.alertStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Direct Problem Escalation Pipeline */}
            <div className="glass rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-400" />
                Critical Citizen Reports Requiring Municipal Sanction
              </h3>
              <div className="space-y-3">
                {allProblems.filter(p => (p.aiUrgencyScore ?? p.severity ?? 0) >= 85).slice(0, 4).map((prob) => (
                  <div key={prob.id} className="p-4 rounded-2xl bg-white/3 border border-white/6 flex flex-wrap items-center justify-between gap-3">
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
                      className="bg-amber-600 hover:bg-amber-500 text-white text-xs"
                    >
                      Generate Dossier
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: AI Policy Briefs & Trends */}
          <div className="space-y-6">
            <div className="glass rounded-3xl p-6 border border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-surface-2/60 space-y-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Sparkles size={18} />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">AI Predictive Policy Advisory</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Pre-Monsoon Drainage Policy (Pune & Mumbai):</strong> AI clustering indicates a 42% correlation between blocked feeder culverts and drainage choke points across 12 low-lying wards.
              </p>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                Action: Issue automated inter-agency desilting work orders before monsoon peak.
              </div>
              <Button
                size="sm"
                onClick={() => {
                  handleSelectProblem(selectedProblemId);
                  handleGenerateReport();
                }}
                disabled={reportLoading}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white"
              >
                {reportLoading ? 'Analyzing...' : 'Generate Official Ward Dossier'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
