import { create } from 'zustand';
import { changeAppLanguage } from '../i18n';

interface AppState {
  language: 'ar' | 'en';
  isRTL: boolean;
  selectedDeviceId: string;
  hasCompletedOnboarding: boolean;
  setLanguage: (lang: 'ar' | 'en') => Promise<void>;
  setSelectedDeviceId: (id: string) => void;
  setHasCompletedOnboarding: (val: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'ar',
  isRTL: true,
  selectedDeviceId: 'mock-odora-a316-1',
  hasCompletedOnboarding: false,
  setLanguage: async (lang: 'ar' | 'en') => {
    await changeAppLanguage(lang);
    set({
      language: lang,
      isRTL: lang === 'ar',
    });
  },
  setSelectedDeviceId: (id: string) => set({ selectedDeviceId: id }),
  setHasCompletedOnboarding: (val: boolean) => set({ hasCompletedOnboarding: val }),
}));
