import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
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
  const { setActiveRole, login } = useAppStore();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'citizen' },
  });

  const currentRole = watch('role');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setAuthError(null);
    try {
      // 1. Create User in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const fbUser = userCredential.user;

      // 2. Set Display Name
      await updateProfile(fbUser, { displayName: data.name });

      // 3. Obtain token
      const token = await fbUser.getIdToken();
      localStorage.setItem('samadhaan_token', token);
      localStorage.setItem('samadhaan_role', data.role);
      localStorage.setItem('samadhaan_email', fbUser.email || data.email);

      setActiveRole(data.role as Role);
      login({
        id: fbUser.uid,
        name: data.name,
        email: fbUser.email || data.email,
        role: data.role as Role,
        joinedAt: new Date().toISOString(),
        problemsReported: 0,
        solutionsContributed: 0,
        impactScore: 100,
      });

      navigate('/dashboard');
    } catch (err: any) {
      console.warn('Firebase signup attempt:', err);
      // If Firebase project credentials aren't customized yet, allow dev authentication fallback
      if (err.code === 'auth/invalid-api-key' || err.code === 'auth/configuration-not-found' || err.message?.includes('API key')) {
        localStorage.setItem('samadhaan_role', data.role);
        localStorage.setItem('samadhaan_email', data.email);
        setActiveRole(data.role as Role);
        login({
          id: `USR-${Date.now()}`,
          name: data.name,
          email: data.email,
          role: data.role as Role,
          joinedAt: new Date().toISOString(),
          problemsReported: 0,
          solutionsContributed: 0,
          impactScore: 100,
        });
        navigate('/dashboard');
        return;
      }

      if (err.code === 'auth/email-already-in-use') {
        setAuthError('An account with this email already exists. Please sign in.');
      } else if (err.code === 'auth/weak-password') {
        setAuthError('Password is too weak. Please use at least 6 characters with mixed letters and numbers.');
      } else {
        setAuthError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();

      localStorage.setItem('samadhaan_token', token);
      localStorage.setItem('samadhaan_role', currentRole);
      localStorage.setItem('samadhaan_email', user.email || '');

      setActiveRole(currentRole as Role);
      login({
        id: user.uid,
        name: user.displayName || 'Google User',
        email: user.email || '',
        role: currentRole as Role,
        joinedAt: new Date().toISOString(),
        problemsReported: 0,
        solutionsContributed: 0,
        impactScore: 120,
      });

      navigate('/dashboard');
    } catch (err: any) {
      console.warn('Google sign up attempt:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError(err.message || 'Google sign-up encountered an issue.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4 py-12">
      <div className="dot-pattern absolute inset-0 opacity-20" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-indigo-600/8 blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-violet-600/6 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-6 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-900/50">
            <span className="text-white text-lg font-black">S</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-black tracking-tight text-white">SAMADHAAN</span>
            <span className="text-[9px] text-slate-500 tracking-widest uppercase">National GovTech Platform</span>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/50">
          <h1 className="text-xl font-black text-white mb-1">Create an Account</h1>
          <p className="text-sm text-slate-400 mb-6">Choose your stakeholder role to personalize your workspace with Firebase</p>

          {authError && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 text-red-400 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/4 hover:bg-white/8 hover:border-white/20 text-sm font-semibold text-white transition-all mb-4"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            {googleLoading ? 'Connecting to Google...' : `Sign Up with Google (${ROLE_CONFIGS.find(r => r.id === currentRole)?.label || 'Citizen'})`}
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-slate-500">or sign up with email</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Picker */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ROLE_CONFIGS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setValue('role', r.id as any)}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                      currentRole === r.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-white/3 border-white/8 text-slate-400 hover:bg-white/6 hover:border-white/15'
                    }`}
                  >
                    <span className="text-xl">{r.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold leading-tight" style={{ color: currentRole === r.id ? r.color : undefined }}>
                        {r.label}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{r.description.slice(0, 30)}...</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Full Name</label>
              <input
                {...register('name')}
                placeholder="e.g. Dr. Rajesh Verma"
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
            </div>

            {currentRole !== 'citizen' && (
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                  Institution / Organization / Department Name
                </label>
                <input
                  {...register('organization')}
                  placeholder="e.g. IIT Bombay / L&T Infotech / Pune Municipal Corp"
                  className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Official Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@institution.ac.in"
                className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-10 rounded-xl glass border border-white/10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg" rightIcon={<ArrowRight size={14} />}>
              Create Account & Enter Platform
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
