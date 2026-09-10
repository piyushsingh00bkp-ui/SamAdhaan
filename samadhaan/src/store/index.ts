import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role, User } from '@/types';
import { MOCK_USER, ROLE_CONFIGS } from '@/mock';

interface AppState {
  // Active role (drives navigation + views)
  activeRole: Role;
  setActiveRole: (role: Role) => void;

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

      // Seed with mock user for demo
      user: MOCK_USER,
      isAuthenticated: true,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),

      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

      unreadCount: 2,
      setUnreadCount: (count) => set({ unreadCount: count }),
    }),
    {
      name: 'samadhaan-store',
      partialize: (s) => ({ activeRole: s.activeRole }),
    }
  )
);

// Convenience selectors
export const useActiveRole = () => useAppStore((s) => s.activeRole);
export const useActiveRoleConfig = () => {
  const role = useAppStore((s) => s.activeRole);
  return ROLE_CONFIGS.find((r) => r.id === role)!;
};
