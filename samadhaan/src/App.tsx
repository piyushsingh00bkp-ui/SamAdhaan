import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import LandingPage from '@/pages/Landing';
import DashboardPage from '@/pages/Dashboard';
import ProblemsPage from '@/pages/Problems';
import NewProblemPage from '@/pages/Problems/NewProblem';
import ProblemDetailPage from '@/pages/Problems/ProblemDetail';
import SolutionsPage from '@/pages/Solutions';
import AIInsightsPage from '@/pages/AIInsights';
import ImpactPage from '@/pages/Impact';
import UniversitiesPage from '@/pages/Universities';
import IndustryPage from '@/pages/Industry';
import GovernmentPage from '@/pages/Government';
import LoginPage from '@/pages/Auth/Login';
import SignupPage from '@/pages/Auth/Signup';
import ProfilePage from '@/pages/Profile';
import CopilotWidget from '@/components/ui/CopilotWidget';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
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
        {/* Global Floating AI Copilot Widget */}
        <CopilotWidget />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
