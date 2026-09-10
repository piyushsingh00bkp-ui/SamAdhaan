import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  GraduationCap, BookOpen, Award, Sparkles,
  ArrowRight, Users, CheckCircle2, Search, Filter,
  Building, FlaskConical, Trophy
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MOCK_PROBLEMS } from '@/mock';

const UNIVERSITY_CHALLENGES = [
  {
    id: 'UC-101',
    title: 'Low-Power IoT Sensor Array for Open Drain Toxicity Detection',
    domain: 'Environmental Engineering & IoT',
    bounty: '₹4.5 Lakhs Grant',
    partner: 'IIT Bombay + BMC',
    deadline: '30 Sept 2026',
    teamsApplied: 14,
    sdg: [6, 11]
  },
  {
    id: 'UC-102',
    title: 'Recycled Plastic Polymer Mix for Rapid Pothole Patching',
    domain: 'Materials Science & Civil Engineering',
    bounty: '₹7.0 Lakhs Grant',
    partner: 'COEP Pune + NHAI',
    deadline: '15 Oct 2026',
    teamsApplied: 22,
    sdg: [9, 12]
  },
  {
    id: 'UC-103',
    title: 'Solar-Assisted Primary Healthcare Drug Cold-Chain Lockbox',
    domain: 'Renewable Energy & Biomedical',
    bounty: '₹5.5 Lakhs Grant',
    partner: 'JNTU + AP Health Dept',
    deadline: '25 Oct 2026',
    teamsApplied: 9,
    sdg: [3, 7]
  }
];

export default function UniversitiesPage() {
  const [selectedDomain, setSelectedDomain] = useState('all');

  return (
    <PageWrapper>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
              <GraduationCap size={16} className="text-violet-400" />
            </div>
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">Higher Education & Research Hub</span>
            <span className="text-xs text-slate-500 bg-white/4 px-2 py-0.5 rounded-full border border-white/6">HEI Portal</span>
          </div>
          <h1 className="text-3xl font-black text-white">University R&D & Civic Innovation</h1>
          <p className="text-slate-400 mt-1 max-w-2xl text-sm">
            Empower faculty and student researchers to turn real-world civic challenges into funded thesis projects, patents, and deployed prototypes.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Partnered Universities', val: '234+', icon: Building, color: '#a78bfa' },
            { label: 'Active Student Teams', val: '1,420', icon: Users, color: '#38bdf8' },
            { label: 'R&D Seed Grants Disbursed', val: '₹14.2 Cr', icon: Award, color: '#34d399' },
            { label: 'Published Solutions & Patents', val: '189', icon: BookOpen, color: '#f59e0b' },
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

        {/* Live Problem Feed for Universities */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main 2 Columns: Challenge Board */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trophy size={18} className="text-amber-400" />
                  Live Civic R&D Challenges
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Government & Industry funded hack challenges open for HEIs</p>
              </div>
              <span className="text-xs text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                ● 3 Open Calls
              </span>
            </div>

            <div className="space-y-4">
              {UNIVERSITY_CHALLENGES.map((challenge) => (
                <div key={challenge.id} className="glass rounded-2xl p-5 border border-white/8 hover:border-violet-500/30 transition-all space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-mono text-violet-400 font-semibold">{challenge.id} • {challenge.domain}</span>
                      <h4 className="text-base font-bold text-white mt-1 leading-snug">{challenge.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">Partners: <strong className="text-slate-200">{challenge.partner}</strong></p>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold shrink-0">
                      {challenge.bounty}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/6 text-xs text-slate-400">
                    <div className="flex items-center gap-4">
                      <span>Deadline: <strong className="text-slate-200">{challenge.deadline}</strong></span>
                      <span><strong>{challenge.teamsApplied}</strong> Student Teams Applied</span>
                    </div>
                    <Button size="sm" variant="outline" rightIcon={<ArrowRight size={13} />}>
                      Submit Proposal
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Lab Matching & AI Recommendation */}
          <div className="space-y-6">
            <div className="glass rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-indigo-400">
                <FlaskConical size={18} />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">AI Lab Resource Matcher</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your university's testing facilities (spectrometry, wind tunnels, water testing) to nearby municipal needs for paid testing contracts.
              </p>
              <div className="p-3.5 rounded-xl bg-white/3 border border-white/6 space-y-2">
                <p className="text-xs font-semibold text-white">Suggested Match:</p>
                <p className="text-xs text-slate-300">Dharavi Coliform Water Testing & Sensor Calibration (BMC Zone 2)</p>
                <div className="flex justify-end pt-1">
                  <span className="text-[11px] text-indigo-400 font-bold hover:underline cursor-pointer">Accept Work Order →</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6 border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Institutional Benefits</h4>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  NIRF Innovation Ranking accreditation credits
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  Direct CSR funding channels from top 500 Indian corporates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  Co-publishing with municipal commissioners & IAS officers
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
