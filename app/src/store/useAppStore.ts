import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeAppLanguage, reloadApp, STORAGE_KEY_LANGUAGE } from '../i18n';

export type ThemeMode = 'system' | 'light' | 'dark';

interface AppState {
  language: 'ar' | 'en';
  isRTL: boolean;
  themeMode: ThemeMode;
  selectedDeviceId: string;
  hasCompletedOnboarding: boolean;
  pendingLanguage: 'ar' | 'en' | null;
  requestLanguageChange: (lang: 'ar' | 'en') => void;
  cancelLanguageChange: () => void;
  confirmLanguageChange: () => Promise<void>;
  setLanguage: (lang: 'ar' | 'en', reload?: boolean) => Promise<void>;
  setThemeMode: (mode: ThemeMode) => void;
  setSelectedDeviceId: (id: string) => void;
  setHasCompletedOnboarding: (val: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  language: 'ar',
  isRTL: true,
  themeMode: 'light', // Primary Arabic RTL light mode
  selectedDeviceId: 'mock-odora-a316-1',
  hasCompletedOnboarding: false,
  pendingLanguage: null,

  requestLanguageChange: (lang: 'ar' | 'en') => {
    if (lang === get().language) return;
    set({ pendingLanguage: lang });
  },

  cancelLanguageChange: () => {
    set({ pendingLanguage: null });
  },

  confirmLanguageChange: async () => {
    const target = get().pendingLanguage;
    if (!target) return;
    set({ pendingLanguage: null });
    try {
      await AsyncStorage.setItem(STORAGE_KEY_LANGUAGE, target);
    } catch (e) {
      console.warn('Failed to save language to AsyncStorage', e);
    }
    await changeAppLanguage(target);
    set({
      language: target,
      isRTL: target === 'ar',
    });
    await reloadApp();
  },

  setLanguage: async (lang: 'ar' | 'en', reload: boolean = false) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_LANGUAGE, lang);
    } catch (e) {
      console.warn('Failed to save language to AsyncStorage', e);
    }
    await changeAppLanguage(lang);
    set({
      language: lang,
      isRTL: lang === 'ar',
    });
    if (reload) {
      await reloadApp();
    }
  },

  setThemeMode: (mode: ThemeMode) => set({ themeMode: mode }),
  setSelectedDeviceId: (id: string) => set({ selectedDeviceId: id }),
  setHasCompletedOnboarding: (val: boolean) => set({ hasCompletedOnboarding: val }),
}));
