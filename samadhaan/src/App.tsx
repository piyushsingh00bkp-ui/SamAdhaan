import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from '@/store';
import { ToastProvider } from '@/components/common/Toast';
import CopilotWidget from '@/components/ui/CopilotWidget';

// ── Lazy-Loaded Page Components for Lightning Fast Chunking ─────────────────
const LandingPage = lazy(() => import('@/pages/Landing'));
const DashboardPage = lazy(() => import('@/pages/Dashboard'));
const ProblemsPage = lazy(() => import('@/pages/Problems'));
const NewProblemPage = lazy(() => import('@/pages/Problems/NewProblem'));
const ProblemDetailPage = lazy(() => import('@/pages/Problems/ProblemDetail'));
const SolutionsPage = lazy(() => import('@/pages/Solutions'));
const AIInsightsPage = lazy(() => import('@/pages/AIInsights'));
const ImpactPage = lazy(() => import('@/pages/Impact'));
const UniversitiesPage = lazy(() => import('@/pages/Universities'));
const IndustryPage = lazy(() => import('@/pages/Industry'));
const GovernmentPage = lazy(() => import('@/pages/Government'));
const LoginPage = lazy(() => import('@/pages/Auth/Login'));
const SignupPage = lazy(() => import('@/pages/Auth/Signup'));
const ProfilePage = lazy(() => import('@/pages/Profile'));

// ── Elegant GovTech Page Fallback Loader ───────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-slate-900 border-2 border-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-pulse">
          <span className="text-2xl">⚡</span>
        </div>
        <div className="absolute -inset-2 rounded-3xl border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>Loading SamAdhaan...</span>
      </div>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function App() {
  const { theme } = useAppStore();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/problems" element={<ProblemsPage />} />
                <Route path="/problems/new" element={<NewProblemPage />} />
                <Route path="/problems/:id" element={<ProblemDetailPage />} />
                <Route path="/solutions" element={<SolutionsPage />} />
                <Route path="/ai-insights" element={<AIInsightsPage />} />
                <Route path="/impact" element={<ImpactPage />} />
                <Route path="/universities" element={<UniversitiesPage />} />
                <Route path="/industry" element={<IndustryPage />} />
                <Route path="/government" element={<GovernmentPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
          {/* Global Floating AI Copilot Widget */}
          <CopilotWidget />
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
}

