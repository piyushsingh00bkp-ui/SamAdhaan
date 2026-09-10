import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search, Filter, MapPin, ThumbsUp, MessageSquare,
  Image, Plus, SlidersHorizontal, Grid3X3, List, RefreshCw,
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { StatusBadge, UrgencyBadge, Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_PROBLEMS } from '@/mock';
import { categoryLabel } from '@/utils';
import apiClient from '@/api/client';
import type { Problem, ProblemCategory, ProblemStatus } from '@/types';

const CATEGORY_COLORS: Record<string, string> = {
  infrastructure: '#6366f1', water: '#38bdf8', sanitation: '#34d399',
  transport: '#a78bfa', electricity: '#fbbf24', healthcare: '#f87171',
  education: '#fb923c', environment: '#86efac', agriculture: '#fdba74',
  safety: '#c084fc', digital: '#67e8f9', other: '#94a3b8',
};

const STATUSES: { value: ProblemStatus | 'all'; label: string }[] = [
  { value: 'all',         label: 'All' },
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

function ProblemCard({ problem }: { problem: Problem }) {

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="glass rounded-2xl p-5 border border-white/8 hover:border-white/15 transition-all cursor-pointer group"
    >
      <Link to={`/problems/${problem.id}`} className="block">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-black"
            style={{
              backgroundColor: `${CATEGORY_COLORS[problem.category] ?? '#6366f1'}18`,
              color: CATEGORY_COLORS[problem.category] ?? '#6366f1',
              border: `1px solid ${CATEGORY_COLORS[problem.category] ?? '#6366f1'}25`,
            }}
          >
            {problem.aiUrgencyScore}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white leading-tight group-hover:text-indigo-300 transition-colors line-clamp-2">
              {problem.title}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={10} className="text-slate-600 shrink-0" />
              <span className="text-xs text-slate-500 truncate">{problem.locationName}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
          {problem.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge color={CATEGORY_COLORS[problem.category] ?? '#6366f1'}>
            {categoryLabel(problem.category)}
          </Badge>
          <UrgencyBadge score={problem.aiUrgencyScore} />
        </div>

        {/* AI Tags */}
        {problem.aiTags.slice(0, 3).map((tag) => (
          <span key={tag} className="inline-flex mr-1.5 mb-1.5 text-[10px] px-2 py-0.5 rounded-md bg-white/4 border border-white/8 text-slate-500">
            {tag}
          </span>
        ))}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/6">
          <StatusBadge status={problem.status} />
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1"><ThumbsUp size={10} />{problem.upvotes.toLocaleString('en-IN')}</span>
            <span className="flex items-center gap-1"><MessageSquare size={10} />{problem.commentCount}</span>
            {problem.mediaCount > 0 && <span className="flex items-center gap-1"><Image size={10} />{problem.mediaCount}</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProblemsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProblemStatus | 'all'>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [allProblems, setAllProblems] = useState<Problem[]>(MOCK_PROBLEMS);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/challenges?limit=50');
      const items = res.data?.data?.items || res.data?.data || [];
      if (Array.isArray(items) && items.length > 0) {
        const liveMapped: Problem[] = items.map((c: any) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          category: normalizeCategory(c.category),
          status: normalizeStatus(c.status),
          location: {
            lat: c.latitude ?? 18.5204,
            lng: c.longitude ?? 73.8567,
          },
          locationName: c.locationName || `${c.city || ''}, ${c.state || ''}`,
          state: c.state || 'Maharashtra',
          district: c.district || 'Pune',
          ward: c.city || 'Pune',
          aiUrgencyScore: c.aiUrgencyScore ?? (c.priority === 'CRITICAL' ? 95 : c.priority === 'HIGH' ? 85 : 70),
          aiTags: c.aiTags ?? [c.category, 'Civic Issue', 'Verified'],
          upvotes: c.upvotes ?? 1,
          reportedBy: c.author?.name ?? 'Citizen',
          reportedAt: c.createdAt ?? new Date().toISOString(),
          updatedAt: c.updatedAt ?? new Date().toISOString(),
          mediaCount: c.mediaUrls?.length ?? 0,
          commentCount: c._count?.comments ?? 0,
        }));

        // Merge live items with mock (avoiding duplicates)
        const liveIds = new Set(liveMapped.map((p) => p.id));
        const filteredMock = MOCK_PROBLEMS.filter((p) => !liveIds.has(p.id));
        setAllProblems([...liveMapped, ...filteredMock]);
      }
    } catch (err) {
      console.warn('Could not fetch challenges from backend, using mock cache:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const filtered = allProblems.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.locationName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });


  return (
    <PageWrapper>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-8">
        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Problem Explorer</h1>
            <p className="text-slate-500 mt-1">Browse, search, and filter all {MOCK_PROBLEMS.length.toLocaleString('en-IN')} reported problems</p>
          </div>
          <Link to="/problems/new">
            <Button leftIcon={<Plus size={14} />}>Report Problem</Button>
          </Link>
        </motion.div>

        {/* Search + Filters */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              type="text"
              placeholder="Search problems by title, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            />
          </div>

          {/* Status filter pills */}
          <div className="flex items-center gap-1.5">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatusFilter(s.value as ProblemStatus | 'all')}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === s.value
                    ? 'bg-indigo-600 text-white'
                    : 'glass border border-white/8 text-slate-400 hover:text-white hover:border-white/15'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 glass rounded-xl border border-white/8 p-1">
            {[{ v: 'grid', Icon: Grid3X3 }, { v: 'list', Icon: List }].map(({ v, Icon }) => (
              <button
                key={v}
                onClick={() => setView(v as 'grid' | 'list')}
                className={`p-2 rounded-lg transition-all ${view === v ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            Showing <span className="text-white font-medium">{filtered.length}</span> of {MOCK_PROBLEMS.length} problems
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            AI-ranked by urgency
          </div>
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${statusFilter}-${search}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`grid gap-5 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
          >
            {filtered.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Search size={40} className="text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No problems found</p>
            <p className="text-slate-600 text-sm mt-1">Try a different search or filter</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
