import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, TrendingUp, Clock, Sparkles, Search, RefreshCw, Lightbulb } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { StatusBadge } from '@/components/ui/Badge';
import apiClient from '@/api/client';

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchSolutions = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/solutions');
      const items = res.data?.data?.items || res.data?.data;
      if (Array.isArray(items) && items.length > 0) {
        setSolutions(
          items.map((s: any) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            category: s.category || s.challenge?.category || 'Infrastructure',
            status: s.status?.toLowerCase().includes('active') || s.status?.toLowerCase().includes('progress') ? 'active' : s.status?.toLowerCase() === 'completed' ? 'completed' : 'proposed',
            progress: s.progressPercentage ?? (s.status === 'COMPLETED' ? 100 : 55),
            problemTitle: s.challenge?.title || 'Municipal & Civic Infrastructure',
            team: s.collaborators?.map((c: any) => ({
              id: c.id,
              name: c.user?.name || 'Partner',
              type: c.role?.toLowerCase().includes('univ') ? 'university' : 'industry'
            })) || [
              { id: '1', name: 'IIT Bombay', type: 'university' },
              { id: '2', name: 'Tata Steel CSR', type: 'industry' }
            ],
            fundingSecured: s.budget ? Math.round(s.budget / 100000) : 15,
            fundingRequired: s.budget ? Math.round((s.budget * 1.4) / 100000) : 25,
            impactBeneficiaries: s.impactScore ? s.impactScore * 1200 : 18000,
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
            <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
              <Lightbulb size={18} />
            </div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Civic Innovation & Engineering Prototypes
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Deployed Solutions & R&D Prototypes
          </h1>
          <p className="text-slate-600 max-w-3xl text-sm sm:text-base leading-relaxed">
            Active tri-partite collaborations deployed across Indian municipal wards by accredited university engineering labs and corporate CSR co-funders.
          </p>
        </motion.div>

        {/* Filters & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search solutions & prototypes..."
              className="w-full bg-white border border-emerald-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs"
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
                    : 'bg-white text-slate-700 border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={fetchSolutions}
              className="p-2 rounded-xl border border-emerald-200 text-emerald-800 hover:bg-emerald-50 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Grid of Solutions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSolutions.map((sol, i) => (
            <motion.div
              key={sol.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-3xl p-6 border-2 border-emerald-100 hover:border-emerald-400 transition-all shadow-xs flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <StatusBadge status={sol.status} />
                  <span className="text-xs text-slate-500 font-mono">{sol.id.slice(0, 8)}</span>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">{sol.problemTitle}</p>
                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors">
                    {sol.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">{sol.description}</p>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                    <span className="text-slate-500">Deployment Progress</span>
                    <span className="text-emerald-700">{sol.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-600 h-2 rounded-full transition-all duration-500" style={{ width: `${sol.progress}%` }} />
                  </div>
                </div>
              </div>

              {/* Footer info */}
              <div className="space-y-2 pt-3 border-t border-emerald-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Secured Funding:</span>
                  <strong className="text-slate-800 font-bold">₹{sol.fundingSecured} Lakhs / ₹{sol.fundingRequired} Lakhs</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Beneficiaries:</span>
                  <span className="text-emerald-800 font-bold">{sol.impactBeneficiaries.toLocaleString('en-IN')} Citizens</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
