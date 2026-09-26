export const loc = (obj: any, field: string, lang: string): string =>
  (lang === 'ar' ? obj?.[`${field}_ar`] : obj?.[field]) ?? '';
