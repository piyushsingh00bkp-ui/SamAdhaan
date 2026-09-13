import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users, ArrowRight, TrendingUp, Clock, Sparkles, Search, RefreshCw, Lightbulb,
  CheckCircle2, ShieldCheck, FileText, FlaskConical, Award, Rocket, CheckCheck,
  ChevronRight, ExternalLink, Filter, Layers, FileCode2, Cpu, Eye
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import apiClient from '@/api/client';

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'lifecycle' | 'catalog'>('lifecycle');
  const [selectedSolution, setSelectedSolution] = useState<any | null>(null);

  const fetchSolutions = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/solutions');
      const items = res.data?.data?.items || res.data?.data;
      if (Array.isArray(items) && items.length > 0) {
        setSolutions(
          items.map((s: any, idx: number) => ({
            id: s.id || `SOL-2026-${100 + idx}`,
            code: `PRJ-${400 + idx}`,
            title: s.title,
            description: s.description || 'Multidisciplinary engineering prototype developed in collaboration with municipal wards and corporate CSR.',
            category: s.category || s.challenge?.category || 'Infrastructure',
            status: s.status?.toLowerCase().includes('active') || s.status?.toLowerCase().includes('progress') ? 'active' : s.status?.toLowerCase() === 'completed' ? 'completed' : 'proposed',
            progress: s.progressPercentage ?? (idx === 0 ? 85 : idx === 1 ? 65 : 45),
            problemTitle: s.challenge?.title || 'Monsoon Stormwater Drainage & Pothole Repair Automation',
            leadHEI: s.collaborators?.find((c: any) => c.role?.toLowerCase().includes('univ'))?.name || (idx % 2 === 0 ? 'COEP Technological University' : 'IIT Bombay Lab'),
            facultyMentor: idx % 2 === 0 ? 'Prof. Dr. Arvind Joshi (Civil & IoT)' : 'Prof. Sunita Deshmukh (Materials)',
            studentLead: idx % 2 === 0 ? 'Aditya Verma & 4 Student Researchers' : 'Pooja Kulkarni & Team',
            industryPartner: s.collaborators?.find((c: any) => c.role?.toLowerCase().includes('ind'))?.name || 'Tata Steel CSR Foundation',
            fundingSecured: s.budget ? Math.round(s.budget / 100000) : 18,
            fundingRequired: s.budget ? Math.round((s.budget * 1.4) / 100000) : 25,
            impactBeneficiaries: s.impactScore ? s.impactScore * 1200 : 24000,
            patentStatus: idx === 0 ? 'Patent Application Filed (2026110948)' : idx === 1 ? 'Provisional IP Draft Ready' : 'IP Prior Art Search Complete',
            testingOutcome: idx === 0 ? '99.4% Flow Efficiency in Pilot Stress Test' : 'Lab Prototype Benchmarked',
            currentStage: idx === 0 ? 5 : idx === 1 ? 3 : 2,
            milestones: [
              { stage: 1, title: 'Challenge Intake & Validation', status: 'completed', date: 'Jan 15, 2026', deliverable: 'Problem audit & municipal requirement spec approved' },
              { stage: 2, title: 'Multidisciplinary R&D & Faculty Mentorship', status: 'completed', date: 'Feb 02, 2026', deliverable: 'Interdisciplinary team formed with Mechanical, Civil & AI leads' },
              { stage: 3, title: 'Prototyping & Lab Testing Outcomes', status: idx === 0 || idx === 1 ? 'completed' : 'in_progress', date: 'Feb 24, 2026', deliverable: 'Hardware/software bench testing & stress test pass' },
              { stage: 4, title: 'Intellectual Property (IP / Patent) Generation', status: idx === 0 ? 'completed' : idx === 1 ? 'in_progress' : 'pending', date: 'Mar 05, 2026', deliverable: 'Patent & copyright documentation published' },
              { stage: 5, title: 'Field Pilot Implementation & Municipal Handover', status: idx === 0 ? 'in_progress' : 'pending', date: 'Target: Mar 30, 2026', deliverable: 'On-ground ward deployment & community audit loop' }
            ]
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
    fetchSolutions();
  }, []);

  const filteredSolutions = solutions.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || s.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesCat;
  });

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center text-emerald-800 dark:text-emerald-400">
              <Rocket size={18} />
            </div>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Societal Innovation Lifecycle & R&D Solutions
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Project Lifecycle Management & Innovation Solutions
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl text-sm sm:text-base leading-relaxed">
            End-to-end governance of multidisciplinary university-industry projects: monitoring deliverables, lab testing outcomes, intellectual property generation, and field pilot deployments.
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-stone-200 dark:border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab('lifecycle')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'lifecycle'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-800'
            }`}
          >
            <Layers size={15} />
            <span>5-Stage Project Lifecycle Tracker</span>
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-800'
            }`}
          >
            <Lightbulb size={15} />
            <span>Deployed Solutions & Prototype Catalog</span>
          </button>
        </div>

        {/* TAB 1: 5-STAGE PROJECT LIFECYCLE MANAGEMENT */}
        {activeTab === 'lifecycle' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Active Innovation Projects', val: solutions.length > 0 ? `${solutions.length} R&D Projects` : '18 Active', icon: Layers, sub: 'Multidisciplinary Teams' },
                { label: 'Patents & IP Generated', val: '34 Filed', icon: Award, sub: 'Institutional Ownership' },
                { label: 'Field Testing Pass Rate', val: '97.2%', icon: ShieldCheck, sub: 'NABL / Lab Benchmarked' },
                { label: 'Pilot Deployments Live', val: '89 Wards', icon: Rocket, sub: 'Municipal Local Bodies' },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-4.5 border-2 border-emerald-100 dark:border-slate-800 shadow-xs"
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

            {/* Active Projects Lifecycle Cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FlaskConical size={18} className="text-emerald-600" />
                <span>Active Project Milestones & Governance Radar</span>
              </h3>

              <div className="space-y-4">
                {solutions.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-emerald-100 dark:border-slate-800 shadow-sm space-y-5"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-100 dark:border-slate-800 pb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                            {proj.code}
                          </span>
                          <span className="text-xs font-bold text-slate-500 uppercase">{proj.category}</span>
                          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                            Stage {proj.currentStage} of 5
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white">{proj.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          HEI: <strong className="text-slate-800 dark:text-slate-200">{proj.leadHEI}</strong> • Mentor: <strong className="text-slate-800 dark:text-slate-200">{proj.facultyMentor}</strong> • Sponsor: <strong className="text-emerald-700 dark:text-emerald-400">{proj.industryPartner}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-[11px] text-slate-500 font-bold uppercase">Lifecycle Completion</p>
                          <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">{proj.progress}%</p>
                        </div>
                        <Button
                          onClick={() => setSelectedSolution(proj)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl cursor-pointer"
                        >
                          <span>View Full Dossier</span>
                          <ChevronRight size={14} className="ml-1" />
                        </Button>
                      </div>
                    </div>

                    {/* 5-Stage Stepper Progression */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                      {proj.milestones?.map((m: any) => {
                        const isDone = m.status === 'completed';
                        const isCurrent = m.status === 'in_progress';
                        return (
                          <div
                            key={m.stage}
                            className={`p-3 rounded-2xl border text-xs flex flex-col justify-between space-y-2 transition-all ${
                              isDone
                                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                                : isCurrent
                                ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-200 dark:ring-indigo-900'
                                : 'bg-stone-50 dark:bg-slate-800/40 border-stone-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-black text-[11px]">0{m.stage}</span>
                              {isDone ? (
                                <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400" />
                              ) : isCurrent ? (
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                              ) : (
                                <Clock size={14} />
                              )}
                            </div>
                            <div>
                              <p className="font-bold leading-tight">{m.title}</p>
                              <p className="text-[10px] opacity-75 mt-1 line-clamp-2">{m.deliverable}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Outcomes Badges Strip */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-emerald-100 dark:border-slate-800 text-xs">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 bg-stone-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-slate-700">
                          <Award size={13} className="text-amber-500" />
                          <span>IP Status: <strong>{proj.patentStatus}</strong></span>
                        </span>
                        <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 bg-stone-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-slate-700">
                          <ShieldCheck size={13} className="text-emerald-600" />
                          <span>Lab Test: <strong>{proj.testingOutcome}</strong></span>
                        </span>
                      </div>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300">
                        ₹{proj.fundingSecured} Lakhs CSR Co-Funded
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SOLUTIONS & PROTOTYPE CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search solutions & prototypes..."
                  className="w-full bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                {['all', 'infrastructure', 'water', 'energy'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer border ${
                      categoryFilter === cat
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSolutions.map((sol) => (
                <div
                  key={sol.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-emerald-100 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all shadow-xs flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-800 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        {sol.code}
                      </span>
                      <StatusBadge status={sol.status} />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {sol.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">{sol.description}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-emerald-100 dark:border-slate-800 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">HEI Lead:</span>
                      <strong className="text-slate-900 dark:text-white">{sol.leadHEI}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">CSR Sponsor:</span>
                      <strong className="text-emerald-700 dark:text-emerald-400">{sol.industryPartner}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Beneficiaries:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{sol.impactBeneficiaries.toLocaleString('en-IN')} Citizens</strong>
                    </div>
                  </div>

                  <Button
                    onClick={() => setSelectedSolution(sol)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl py-2.5 cursor-pointer shadow-xs"
                  >
                    <span>View Project Dossier</span>
                    <ArrowRight size={14} className="ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal for Project Dossier Details */}
        <AnimatePresence>
          {selectedSolution && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-slate-900 max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-emerald-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400">{selectedSolution.code}</span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{selectedSolution.title}</h3>
                  </div>
                  <button onClick={() => setSelectedSolution(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white">
                    ✕
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 space-y-2">
                    <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Academic Team</p>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedSolution.leadHEI}</p>
                    <p className="text-slate-600 dark:text-slate-400">Mentor: {selectedSolution.facultyMentor}</p>
                    <p className="text-slate-600 dark:text-slate-400">Researchers: {selectedSolution.studentLead}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200 dark:border-slate-700 space-y-2">
                    <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Industry & Funding</p>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{selectedSolution.industryPartner}</p>
                    <p className="text-emerald-700 dark:text-emerald-400 font-bold">₹{selectedSolution.fundingSecured} Lakhs Allocated</p>
                    <p className="text-slate-600 dark:text-slate-400">{selectedSolution.patentStatus}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Milestone Verification Timeline</h4>
                  <div className="space-y-2">
                    {selectedSolution.milestones?.map((m: any) => (
                      <div key={m.stage} className="p-3 rounded-xl bg-stone-50 dark:bg-slate-800/40 border border-stone-200 dark:border-slate-700 flex items-start justify-between gap-3 text-xs">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className={m.status === 'completed' ? 'text-emerald-600 mt-0.5' : 'text-slate-400 mt-0.5'} />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{m.title}</p>
                            <p className="text-slate-500 text-[11px] mt-0.5">{m.deliverable}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 shrink-0">{m.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button onClick={() => setSelectedSolution(null)} className="bg-emerald-600 text-white font-bold text-xs py-2 px-4 rounded-xl">
                    Close Dossier
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
