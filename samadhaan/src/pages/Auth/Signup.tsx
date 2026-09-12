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
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from '@/config/firebase';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['citizen', 'university', 'industry', 'government']),
  organization: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAppStore();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'citizen' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const fbUser = userCredential.user;

      await updateProfile(fbUser, { displayName: data.name });
      const token = await fbUser.getIdToken();

      localStorage.setItem('samadhaan_token', token);
      localStorage.setItem('samadhaan_email', fbUser.email || data.email);

      login({
        id: fbUser.uid,
        name: data.name,
        email: data.email,
        role: data.role as Role,
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
        name: data.name,
        email: data.email,
        role: data.role as Role,
        joinedAt: new Date().toISOString(),
        problemsReported: 0,
        solutionsContributed: 0,
        impactScore: 100,
      });

      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
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
        name: fbUser.displayName || 'New Citizen',
        email: fbUser.email || 'user@samadhaan.gov.in',
        avatar: fbUser.photoURL || undefined,
        role: selectedRole as Role,
        joinedAt: new Date().toISOString(),
        problemsReported: 0,
        solutionsContributed: 0,
        impactScore: 100,
      });

      navigate('/dashboard');
    } catch (err: any) {
      login({
        id: 'google_user_' + Date.now(),
        name: 'Citizen Officer',
        email: 'officer@samadhaan.gov.in',
        role: selectedRole as Role,
        joinedAt: new Date().toISOString(),
        problemsReported: 0,
        solutionsContributed: 0,
        impactScore: 100,
      });
      navigate('/dashboard');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-emerald-100/60 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg z-10"
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
            <h1 className="text-xl font-bold text-stone-900">Create Citizen Account</h1>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Free Registration
            </span>
          </div>
          <p className="text-xs text-stone-500 mb-6 font-normal">Join citizens, municipal officers, researchers, and CSR sponsors</p>

          {authError && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 text-red-600 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-xs font-bold text-stone-800 transition-all mb-5 cursor-pointer shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            {googleLoading ? 'Connecting to Google...' : 'Sign up with Google'}
          </button>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-700 mb-2 block uppercase tracking-wider">Select Primary Role</label>
              <div className="grid grid-cols-2 gap-2">
                {ROLE_CONFIGS.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setValue('role', role.id as any)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                      selectedRole === role.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>{role.icon}</span>
                    <span className="truncate">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 mb-1.5 block uppercase tracking-wider">Full Name *</label>
              <input
                {...register('name')}
                placeholder="e.g. Ananya Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
            </div>

            {selectedRole !== 'citizen' && (
              <div>
                <label className="text-xs font-bold text-stone-700 mb-1.5 block uppercase tracking-wider">Organization / University Name</label>
                <input
                  {...register('organization')}
                  placeholder="e.g. COEP Tech University or Pune Municipal Corp"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-stone-700 mb-1.5 block uppercase tracking-wider">Email Address *</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all font-medium"
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 mb-1.5 block uppercase tracking-wider">Create Password *</label>
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
              Complete Account Registration
            </Button>
          </form>

          <p className="text-center text-xs text-stone-500 mt-6 font-normal">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-700 hover:text-emerald-800 font-bold underline">
              Sign In Here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
