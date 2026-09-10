import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Award, Shield, FileText,
  ThumbsUp, CheckCircle, Flame, Sparkles, Edit3, Save, RefreshCw
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/api/client';

export default function ProfilePage() {
  const { user, login } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [myProblems, setMyProblems] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || user?.citizenProfile?.bio || '',
    city: user?.citizenProfile?.city || 'Pune',
    state: user?.citizenProfile?.state || 'Maharashtra',
  });

  const fetchLiveProfile = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<any>('/users/me');
      if (res.data) {
        const u = res.data;
        login({
          id: u.id,
          name: u.name,
          email: u.email,
          role: (u.role || 'citizen').toLowerCase() as any,
          avatar: u.avatarUrl,
          joinedAt: u.createdAt || new Date().toISOString(),
          problemsReported: u.problemsReported ?? 0,
          solutionsContributed: u.solutionsContributed ?? 0,
          evidenceUploaded: u.evidenceUploaded ?? 0,
          totalUpvotes: u.totalUpvotes ?? 0,
          resolvedProblems: u.resolvedProblems ?? 0,
          impactScore: u.impactScore ?? 10,
          bio: u.citizenProfile?.bio,
          phone: u.phone,
          citizenProfile: u.citizenProfile,
        });
        setFormData({
          name: u.name || '',
          phone: u.phone || '',
          bio: u.citizenProfile?.bio || '',
          city: u.citizenProfile?.city || 'Pune',
          state: u.citizenProfile?.state || 'Maharashtra',
        });
      }
    } catch (err) {
      console.warn('Could not refresh live profile from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProblems = async () => {
    try {
      const res = await apiClient.get<any>('/challenges');
      const all: any[] = res.data?.items || res.data || [];
      const mine = all.filter((c: any) => c.createdById === user?.id || c.reporter?.name === user?.name);
      setMyProblems(mine.length > 0 ? mine : all.slice(0, 3));
    } catch (err) {
      console.warn('Failed to fetch user problems:', err);
    }
  };

  useEffect(() => {
    fetchLiveProfile();
    fetchMyProblems();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.patch('/users/me', {
        name: formData.name,
        phone: formData.phone,
        citizenProfile: {
          bio: formData.bio,
          city: formData.city,
          state: formData.state,
        },
      });
      await fetchLiveProfile();
      setEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const score = user?.impactScore ?? 10;
  const rankTier =
    score >= 500 ? { name: 'Platinum Architect', color: '#38bdf8', icon: <Sparkles size={16} /> } :
    score >= 250 ? { name: 'Gold Champion', color: '#fbbf24', icon: <Award size={16} /> } :
    score >= 100 ? { name: 'Silver Solver', color: '#94a3b8', icon: <Shield size={16} /> } :
    { name: 'Bronze Pioneer', color: '#f97316', icon: <Flame size={16} /> };

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Profile Card */}
        <div className="glass rounded-3xl p-6 md:p-8 border border-white/10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-900/40">
                {user?.name?.slice(0, 2).toUpperCase() || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-white">{user?.name}</h1>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{ backgroundColor: `${rankTier.color}20`, color: rankTier.color }}
                  >
                    {rankTier.icon}
                    {rankTier.name}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-1 flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1.5"><Mail size={14} /> {user?.email}</span>
                  {user?.citizenProfile?.city && (
                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {user.citizenProfile.city}, {user.citizenProfile.state || 'India'}</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchLiveProfile}
                disabled={loading}
                leftIcon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />}
              >
                Refresh Score
              </Button>
              <Button
                size="sm"
                variant={editing ? 'ghost' : 'primary'}
                onClick={() => setEditing(!editing)}
                leftIcon={editing ? undefined : <Edit3 size={14} />}
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Real Score Breakdown & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Real Impact Score Board */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-6 md:p-8 border border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Award className="text-amber-400" size={20} />
                    Live Civic Impact Score
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Calculated dynamically from your verified platform actions</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-amber-400">{score}</p>
                  <p className="text-xs text-slate-500">Points</p>
                </div>
              </div>

              {/* Progress Bar towards next tier */}
              <div className="space-y-2 mb-8">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Current Tier: <strong style={{ color: rankTier.color }}>{rankTier.name}</strong></span>
                  <span>Next: {score >= 500 ? 'Max Tier' : `${500 - score} pts to Platinum`}</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(10, (score / 500) * 100))}%` }}
                  />
                </div>
              </div>

              {/* Breakdown Grid */}
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
                Score Formula Breakdown
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="glass rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <FileText size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Problems Reported</p>
                      <p className="text-xs text-slate-500">{user?.problemsReported ?? 0} reported (+50 ea)</p>
                    </div>
                  </div>
                  <span className="font-bold text-indigo-400 text-sm">+{((user?.problemsReported ?? 0) * 50)}</span>
                </div>

                <div className="glass rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <ThumbsUp size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Upvotes Earned</p>
                      <p className="text-xs text-slate-500">{user?.totalUpvotes ?? 0} upvotes (+10 ea)</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-400 text-sm">+{((user?.totalUpvotes ?? 0) * 10)}</span>
                </div>

                <div className="glass rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Solutions & R&D</p>
                      <p className="text-xs text-slate-500">{user?.solutionsContributed ?? 0} contributed (+150 ea)</p>
                    </div>
                  </div>
                  <span className="font-bold text-sky-400 text-sm">+{((user?.solutionsContributed ?? 0) * 150)}</span>
                </div>

                <div className="glass rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                      <CheckCircle size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Resolved Issues</p>
                      <p className="text-xs text-slate-500">{user?.resolvedProblems ?? 0} resolved (+300 ea)</p>
                    </div>
                  </div>
                  <span className="font-bold text-amber-400 text-sm">+{((user?.resolvedProblems ?? 0) * 300)}</span>
                </div>
              </div>
            </motion.div>

            {/* User Submitted Problems */}
            <div className="glass rounded-3xl p-6 border border-white/10">
              <h2 className="text-lg font-bold text-white mb-4">Recent Activity & Submissions</h2>
              {myProblems.length === 0 ? (
                <p className="text-sm text-slate-500 py-6 text-center">No challenges posted yet. Post your first issue to earn +50 points!</p>
              ) : (
                <div className="space-y-3">
                  {myProblems.map((prob) => (
                    <div key={prob.id} className="p-4 rounded-2xl bg-white/4 border border-white/6 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{prob.title}</p>
                        <p className="text-xs text-slate-400 mt-1">{prob.category} • {prob.city || 'Pune'} • {prob.status || 'SUBMITTED'}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                        +{prob.upvotes ? prob.upvotes * 10 + 50 : 50} pts
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Profile Form / Edit */}
          <div className="space-y-6">
            <div className="glass rounded-3xl p-6 border border-white/10">
              <h3 className="text-base font-bold text-white mb-4">
                {editing ? 'Edit Profile Details' : 'Account Information'}
              </h3>

              {editing ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Phone</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">City</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Bio</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Share a short bio..."
                    />
                  </div>
                  <Button type="submit" disabled={saving} leftIcon={<Save size={14} />} className="w-full">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              ) : (
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-xl bg-white/4 border border-white/6">
                    <p className="text-xs text-slate-500">Role</p>
                    <p className="font-semibold text-white capitalize">{user?.role || 'Citizen'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/4 border border-white/6">
                    <p className="text-xs text-slate-500">Email Address</p>
                    <p className="font-semibold text-white truncate">{user?.email}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/4 border border-white/6">
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="font-semibold text-white">{formData.city}, {formData.state}</p>
                  </div>
                  {formData.bio && (
                    <div className="p-3 rounded-xl bg-white/4 border border-white/6">
                      <p className="text-xs text-slate-500">Bio</p>
                      <p className="text-slate-300 text-xs mt-1">{formData.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
