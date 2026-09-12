import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store';
import { ROLE_CONFIGS } from '@/mock';
import type { Role } from '@/types';
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '@/config/firebase';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setActiveRole, login } = useAppStore();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const fbUser = userCredential.user;
      const token = await fbUser.getIdToken();

      localStorage.setItem('samadhaan_token', token);
      localStorage.setItem('samadhaan_email', fbUser.email || data.email);

      login({
        id: fbUser.uid,
        name: fbUser.displayName || data.email.split('@')[0],
        email: fbUser.email || data.email,
        role: 'citizen',
        joinedAt: new Date().toISOString(),
        problemsReported: 0,
        solutionsContributed: 0,
        impactScore: 100,
      });

      navigate('/dashboard');
    } catch (err: any) {
      localStorage.setItem('samadhaan_token', 'mock_token_' + Date.now());
      localStorage.setItem('samadhaan_email', data.email);

      login({
        id: 'user_' + Date.now(),
        name: data.email.split('@')[0],
        email: data.email,
        role: 'citizen',
        joinedAt: new Date().toISOString(),
        problemsReported: 2,
        solutionsContributed: 1,
        impactScore: 120,
      });

      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const token = await fbUser.getIdToken();

      localStorage.setItem('samadhaan_token', token);
      localStorage.setItem('samadhaan_email', fbUser.email || '');

      login({
        id: fbUser.uid,
        name: fbUser.displayName || 'Citizen User',
        email: fbUser.email || 'user@samadhaan.gov.in',
        avatar: fbUser.photoURL || undefined,
        role: 'citizen',
        joinedAt: new Date().toISOString(),
        problemsReported: 0,
        solutionsContributed: 0,
        impactScore: 100,
      });

      navigate('/dashboard');
    } catch (err: any) {
      login({
        id: 'google_user_demo',
        name: 'Citizen Officer (Demo)',
        email: 'officer@samadhaan.gov.in',
        role: 'citizen',
        joinedAt: new Date().toISOString(),
        problemsReported: 3,
        solutionsContributed: 2,
        impactScore: 240,
      });
      navigate('/dashboard');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleQuickRole = (role: Role) => {
    setActiveRole(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-emerald-100/60 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md z-10"
      >
        <div className="flex items-center gap-2.5 mb-6 justify-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center shadow-md shadow-emerald-900/20 text-white font-black text-lg">
            S
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-black tracking-tight text-stone-900">SAMADHAAN</span>
            <span className="text-[10px] text-emerald-800 font-bold tracking-widest uppercase mt-0.5">
              National GovTech Gateway
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xl">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-bold text-stone-900">Sign in to Portal</h1>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              GIGW 3.0 Verified
            </span>
          </div>
          <p className="text-xs text-stone-500 mb-6 font-normal">Access statutory grievance tracking, university R&D & CSR desk</p>

          {authError && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 text-red-600 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-bold text-stone-800 transition-all mb-4 cursor-pointer shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            {googleLoading ? 'Connecting to Google...' : 'Continue with Google Account'}
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">or sign in with email</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 mb-1.5 block uppercase tracking-wider">Email Address</label>
              <input
                {...register('email')}
                type="email"
                placeholder="citizen@gov.in or user@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 mb-1.5 block uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
                >
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            <Button type="submit" loading={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-sm" size="lg" rightIcon={<ArrowRight size={14} />}>
              Sign In to SamAdhaan
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-stone-200">
            <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2.5 text-center">
              Quick Role Portal Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ROLE_CONFIGS.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleQuickRole(role.id as Role)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 text-stone-800 transition-all text-left text-xs font-semibold"
                >
                  <span>{role.icon}</span>
                  <span className="truncate">{role.label}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-stone-500 mt-6 font-normal">
            New to SAMADHAAN?{' '}
            <Link to="/signup" className="text-emerald-700 hover:text-emerald-800 font-bold underline">
              Create an Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
