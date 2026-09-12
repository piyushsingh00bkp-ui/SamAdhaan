import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search, Filter, MapPin, ThumbsUp, MessageSquare,
  Image, Plus, SlidersHorizontal, Grid3X3, List, RefreshCw,
  Sparkles, ArrowUpDown, Clock, CheckCircle2, AlertTriangle,
  Building2, ShieldCheck
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { StatusBadge, UrgencyBadge, Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_PROBLEMS } from '@/mock';
import { categoryLabel } from '@/utils';
import apiClient from '@/api/client';
import type { Problem, ProblemCategory, ProblemStatus } from '@/types';

const CATEGORY_COLORS: Record<string, string> = {
  infrastructure: '#059669', water: '#0284c7', sanitation: '#0d9488',
  transport: '#7c3aed', electricity: '#d97706', healthcare: '#e11d48',
  education: '#ea580c', environment: '#16a34a', agriculture: '#c2410c',
  safety: '#9333ea', digital: '#0891b2', other: '#64748b',
};

const CATEGORIES_LIST: { id: string; label: string }[] = [
  { id: 'all', label: 'All Sectors' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'water', label: 'Water' },
  { id: 'sanitation', label: 'Sanitation' },
  { id: 'transport', label: 'Transport' },
  { id: 'electricity', label: 'Electricity' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'environment', label: 'Environment' },
];

const STATUSES: { value: ProblemStatus | 'all'; label: string }[] = [
  { value: 'all',         label: 'All Statuses' },
  { value: 'submitted',   label: 'Submitted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'assigned',    label: 'Assigned' },
  { value: 'resolved',    label: 'Resolved' },
];

function normalizeCategory(cat?: string): ProblemCategory {
  if (!cat) return 'infrastructure';
  const c = cat.toLowerCase();
  if (c.includes('water')) return 'water';
  if (c.includes('sanit')) return 'sanitation';
  if (c.includes('elec') || c.includes('power')) return 'electricity';
  if (c.includes('health')) return 'healthcare';
  if (c.includes('edu')) return 'education';
  if (c.includes('env') || c.includes('green')) return 'environment';
  if (c.includes('trans') || c.includes('road')) return 'transport';
  if (c.includes('safe') || c.includes('crime')) return 'safety';
  if (c.includes('agri') || c.includes('farm')) return 'agriculture';
  if (c.includes('digit') || c.includes('tech')) return 'digital';
  return 'infrastructure';
}

function normalizeStatus(st?: string): ProblemStatus {
  if (!st) return 'submitted';
  const s = st.toLowerCase();
  if (s.includes('resolv')) return 'resolved';
  if (s.includes('progress') || s.includes('pilot') || s.includes('r_and_d')) return 'in_progress';
  if (s.includes('assign') || s.includes('routed')) return 'assigned';
  return 'submitted';
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>(MOCK_PROBLEMS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<ProblemStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'urgency' | 'newest' | 'upvotes'>('urgency');

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/challenges');
      const items = res.data?.data?.items || res.data?.data || [];
      if (Array.isArray(items) && items.length > 0) {
        const mapped: Problem[] = items.map((c: any) => ({
          id: c.id,
          title: c.title || 'Municipal Challenge',
          description: c.description || '',
          category: normalizeCategory(c.category),
          status: normalizeStatus(c.status),
          location: {
            lat: typeof c.location === 'object' && c.location?.lat ? c.location.lat : 18.5204,
            lng: typeof c.location === 'object' && c.location?.lng ? c.location.lng : 73.8567,
          },
          locationName: c.locationName || c.district || 'Pune, Maharashtra',
          state: c.state || 'Maharashtra',
          district: c.district || 'Pune',
          ward: c.ward || 'Ward 47',
          aiUrgencyScore: c.aiUrgencyScore || Math.floor(65 + Math.random() * 30),
          aiTags: Array.isArray(c.aiTags) ? c.aiTags : ['Verified', 'Civic'],
          upvotes: c.upvotes || 0,
          reportedBy: c.reportedBy || 'Citizen',
          reportedAt: c.createdAt || c.reportedAt || new Date().toISOString(),
          updatedAt: c.updatedAt || new Date().toISOString(),
          mediaCount: c.mediaCount || 0,
          commentCount: c.commentCount || 0
        }));
        setProblems(mapped);
      } else {
        setProblems(MOCK_PROBLEMS);
      }
    } catch {
      setProblems(MOCK_PROBLEMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  // Filter & Sort Pipeline
  const filteredProblems = useMemo(() => {
    return problems
      .filter((p) => {
        const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
        const matchStatus = selectedStatus === 'all' || p.status === selectedStatus;
        const q = search.toLowerCase().trim();
        const matchSearch =
          !q ||
          p.id.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.locationName.toLowerCase().includes(q);
        return matchCat && matchStatus && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'urgency') return b.aiUrgencyScore - a.aiUrgencyScore;
        if (sortBy === 'upvotes') return b.upvotes - a.upvotes;
        return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
      });
  }, [problems, selectedCategory, selectedStatus, search, sortBy]);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold tracking-widest text-emerald-800 uppercase bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                National Grievance Database
              </span>
              <span className="text-[11px] font-semibold text-stone-500">Live SLA Tracking</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900">Civic Challenges & Grievances</h1>
            <p className="text-xs text-stone-500 mt-0.5">Explore, search by token (`GRV-XXXX`), and track verified civic issues.</p>
          </div>

          <Link
            to="/problems/new"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 self-start sm:self-auto transition-all"
          >
            <Plus className="w-4 h-4" /> Report New Problem
          </Link>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 mb-6 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Grievance Token (e.g. GRV-1001), Location, or Keyword..."
                className="w-full pl-10 pr-4 py-2.5 text-xs text-stone-900 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            {/* Status Selector */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-stone-50 border border-stone-300 text-xs font-semibold text-stone-700 rounded-xl px-3 py-2.5 outline-none focus:border-emerald-500 w-full md:w-auto"
            >
              {STATUSES.map((st) => (
                <option key={st.value} value={st.value}>{st.label}</option>
              ))}
            </select>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 w-full md:w-auto">
              <ArrowUpDown className="w-4 h-4 text-stone-400 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-stone-50 border border-stone-300 text-xs font-semibold text-stone-700 rounded-xl px-3 py-2.5 outline-none focus:border-emerald-500 w-full md:w-auto"
              >
                <option value="urgency">Sort by Highest AI Urgency</option>
                <option value="newest">Sort by Newest First</option>
                <option value="upvotes">Sort by Most Upvotes</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-stone-100">
            {CATEGORIES_LIST.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const count = cat.id === 'all' ? problems.length : problems.filter((p) => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Problems List / Cards */}
        {filteredProblems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-stone-800">No grievances matching your criteria</h3>
            <p className="text-xs text-stone-500 mt-1">Try resetting the filter pills or modifying your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProblems.map((p) => (
              <motion.div
                key={p.id}
                layout
                whileHover={{ y: -3 }}
                className="bg-white rounded-2xl border border-stone-200 hover:border-emerald-400 hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center font-black text-xs text-emerald-800">
                        {p.aiUrgencyScore}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-stone-500">{p.id}</span>
                        <div className="text-[11px] font-semibold text-emerald-800">{categoryLabel(p.category)}</div>
                      </div>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>

                  {/* Card Title & Desc */}
                  <Link to={`/problems/${p.id}`} className="block group">
                    <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-1.5">
                      {p.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-stone-600 line-clamp-2 mb-4 leading-relaxed font-normal">
                    {p.description}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-1 truncate max-w-[180px]">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate text-[11px]">{p.locationName}</span>
                  </div>

                  <Link
                    to={`/problems/${p.id}`}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    View Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
