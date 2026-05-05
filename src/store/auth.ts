import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('ao_token', token);
        }
        set({ user, token });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('ao_token');
        }
        set({ user: null, token: null });
      },

      isAuthenticated: () => !!get().token,
    }),
    { name: 'ao-auth', partialize: (s) => ({ user: s.user, token: s.token }) },
  ),
);
