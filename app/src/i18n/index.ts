import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager, Platform, DevSettings } from 'react-native';
import * as Updates from 'expo-updates';
import { ar } from './ar';
import { en } from './en';

export const STORAGE_KEY_LANGUAGE = '@odora_language';

export const resources = {
  ar: { translation: ar },
  en: { translation: en },
} as const;

import { previewConfig } from '../previewTarget';

// Ensure Arabic is the primary & default language, or use previewConfig if set
export const DEFAULT_LANGUAGE = previewConfig?.lang || 'ar';

/**
 * Formats numbers as standard Western digits (0-9) per Libyan design norm
 */
export const toArabicNumerals = (n: number | string): string => {
  return String(n);
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

/**
 * Reloads the app cleanly across Web and Native platforms
 */
export const reloadApp = async () => {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  } else {
    try {
      await Updates.reloadAsync();
    } catch {
      if (DevSettings && DevSettings.reload) {
        DevSettings.reload();
      }
    }
  }
};

/**
 * Change app language and update RTL layout direction
 */
export const changeAppLanguage = async (lng: 'ar' | 'en') => {
  await i18n.changeLanguage(lng);
  const isRtl = lng === 'ar';

  if (Platform.OS === 'web') {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('lang', lng);
    }
  } else {
    if (I18nManager.isRTL !== isRtl) {
      I18nManager.allowRTL(isRtl);
      I18nManager.forceRTL(isRtl);
    }
  }
};

export default i18n;
