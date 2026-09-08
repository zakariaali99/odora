import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import { ar } from './ar';
import { en } from './en';

export const resources = {
  ar: { translation: ar },
  en: { translation: en },
} as const;

// Ensure Arabic is the primary & default language
export const DEFAULT_LANGUAGE = 'ar';

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
 * Change app language and update RTL layout direction
 */
export const changeAppLanguage = async (lng: 'ar' | 'en') => {
  await i18n.changeLanguage(lng);
  const isRtl = lng === 'ar';
  if (I18nManager.isRTL !== isRtl) {
    I18nManager.allowRTL(isRtl);
    I18nManager.forceRTL(isRtl);
  }
};

export default i18n;
