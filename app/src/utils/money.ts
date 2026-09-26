import i18n from '../i18n';

export const formatPrice = (value: string | number): string => {
  const n = Number(value);
  const num = Number.isInteger(n) ? String(n) : n.toFixed(2);
  const iso = `\u2066${num}\u2069`;
  return i18n.language === 'ar' ? `${iso} د.ل` : `LYD ${iso}`;
};
