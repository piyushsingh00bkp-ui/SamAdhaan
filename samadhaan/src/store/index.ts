import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role, User } from '@/types';
import { ROLE_CONFIGS } from '@/mock';
import type { SupportedLang } from '@/i18n';

interface AppState {
  // Active role
  activeRole: Role;
  setActiveRole: (role: Role) => void;

  // Language: en, hi, bn
  language: SupportedLang;
  setLanguage: (lang: SupportedLang) => void;

  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Notifications badge
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeRole: 'citizen',
      setActiveRole: (role) => set({ activeRole: role }),

      language: 'en',
      setLanguage: (lang) => set({ language: lang }),

      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        localStorage.removeItem('samadhaan_token');
        localStorage.removeItem('samadhaan_email');
        localStorage.removeItem('samadhaan_role');
        set({ user: null, isAuthenticated: false });
      },

      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      unreadCount: 0,
      setUnreadCount: (count) => set({ unreadCount: count }),
    }),
    {
      name: 'samadhaan-store',
      partialize: (s) => ({
        activeRole: s.activeRole,
        language: s.language,
        user: s.user,
        isAuthenticated: s.isAuthenticated
      }),
    }
  )
);

export const useActiveRole = () => useAppStore((s) => s.activeRole);
export const useActiveRoleConfig = () => {
  const role = useAppStore((s) => s.activeRole);
  return ROLE_CONFIGS.find((r) => r.id === role)!;
};
export const useLanguage = () => useAppStore((s) => s.language);
