import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, TrendingUp, Clock, Sparkles } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { StatusBadge } from '@/components/ui/Badge';
import { MOCK_SOLUTIONS } from '@/mock';
import apiClient from '@/api/client';

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState<any[]>(MOCK_SOLUTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/solutions')
      .then((res) => {
        const items = res.data?.data?.items || res.data?.data;
        if (Array.isArray(items) && items.length > 0) {
          setSolutions(items.map((s: any) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            status: s.status?.toLowerCase().includes('active') || s.status?.toLowerCase().includes('progress') ? 'active' : s.status?.toLowerCase() === 'completed' ? 'completed' : 'proposed',
            progress: s.progressPercentage ?? (s.status === 'COMPLETED' ? 100 : 45),
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
            fundingRequired: s.budget ? Math.round((s.budget * 1.5) / 100000) : 25,
            impactBeneficiaries: s.impactScore ? s.impactScore * 1200 : 18000,
            sdgGoals: [6, 11]
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-black text-white">Solutions Hub</h1>
          <p className="text-slate-500 mt-1">Active collaborations between universities, industry, and government</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {solutions.map((sol, i) => (
            <motion.div
              key={sol.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -3 }}
              className="glass rounded-2xl p-5 border border-white/8 hover:border-white/15 transition-all flex flex-col gap-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <StatusBadge status={sol.status} />
                <span className="text-xs text-slate-600 font-mono">{sol.id}</span>
              </div>

              <div>
                <p className="text-xs text-slate-600 mb-1">{sol.problemTitle}</p>
                <h3 className="text-sm font-bold text-white leading-snug">{sol.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">{sol.description}</p>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-semibold text-white">{sol.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/6">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${sol.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className={`h-full rounded-full ${sol.progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`}
                  />
                </div>
              </div>

              {/* Team */}
              <div>
                <p className="text-xs text-slate-600 mb-2">Team ({sol.team?.length || 0})</p>
                <div className="flex flex-wrap gap-1.5">
                  {sol.team?.map((member: any) => (
                    <span
                      key={member.id}
                      className="text-xs px-2 py-0.5 rounded-lg bg-white/4 border border-white/8 text-slate-400"
                    >
                      {member.type === 'university' ? '🎓' : member.type === 'industry' ? '🏭' : '🏛️'} {member.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Funding */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/6 text-xs">
                <div>
                  <p className="text-slate-600">Funding</p>
                  <p className="text-white font-semibold">₹{sol.fundingSecured}L / ₹{sol.fundingRequired}L</p>
                </div>
                <div>
                  <p className="text-slate-600">Beneficiaries</p>
                  <p className="text-white font-semibold">{sol.impactBeneficiaries?.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* SDG tags */}
              <div className="flex flex-wrap gap-1.5">
                {sol.sdgGoals?.map((goal: any) => (
                  <span key={goal} className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium">
                    SDG {goal}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
