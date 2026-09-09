import { create } from 'zustand';
import api from '../services/api';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isStaff: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: JSON.parse(localStorage.getItem('odora_user') || 'null'),
  token: localStorage.getItem('odora_access_token') || null,
  isAuthenticated: !!localStorage.getItem('odora_access_token'),
  isStaff: JSON.parse(localStorage.getItem('odora_user') || '{}')?.is_staff || false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.login(email, password);
      const { access, refresh, user } = res.data;
      localStorage.setItem('odora_access_token', access);
      localStorage.setItem('odora_refresh_token', refresh);
      localStorage.setItem('odora_user', JSON.stringify(user));
      set({
        user,
        token: access,
        isAuthenticated: true,
        isStaff: !!user.is_staff,
        isLoading: false,
      });
      return { success: true, user };
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'فشل تسجيل الدخول، تأكد من البيانات المدخلة';
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  register: async (userData: any) => {
    set({ isLoading: true, error: null });
    try {
      await api.register(userData);
      return await get().login(userData.email, userData.password);
    } catch (err: any) {
      const errorMsg = err.response?.data?.email?.[0] || 'فشل إنشاء الحساب، يرجى المحاولة لاحقاً';
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  logout: () => {
    localStorage.removeItem('odora_access_token');
    localStorage.removeItem('odora_refresh_token');
    localStorage.removeItem('odora_user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isStaff: false,
    });
  },

  fetchProfile: async () => {
    if (!get().isAuthenticated) return;
    try {
      const res = await api.getProfile();
      const updatedUser = res.data;
      localStorage.setItem('odora_user', JSON.stringify(updatedUser));
      set({ user: updatedUser, isStaff: !!updatedUser.is_staff });
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  },
}));
