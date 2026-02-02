import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginInput, RegisterInput, AuthResponse } from '@ecommerce/shared';
import { api } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,

      login: async (data: LoginInput) => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        });
      },

      register: async (data: RegisterInput) => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
        });
      },

      logout: async () => {
        const { token } = get();
        if (token) {
          try {
            await api.post('/auth/logout', {});
          } catch {
            // Ignore logout errors
          }
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) {
          set({ isLoading: false, isAuthenticated: false });
          return;
        }

        try {
          const response = await api.get<{ user: User }>('/auth/me');
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      updateUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
