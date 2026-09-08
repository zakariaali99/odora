import { create } from 'zustand';

const translations = {
  ar: {
    nav: {
      shop: 'المتجر',
      fragrances: 'العطور والروائح',
      technology: 'التقنية المبتكرة',
      about: 'عن أودورا',
      contact: 'تواصل معنا',
      myAccount: 'حسابي',
      dashboard: 'لوحة التحكم الإدارية',
      cart: 'السلة',
      search: 'بحث عن جهاز أو عطر...',
      login: 'دخول',
      logout: 'تسجيل خروج',
    },
    common: {
      currency: 'د.ل',
      addToCart: 'إضافة للسلة',
      buyNow: 'شراء الآن',
      freeDelivery: 'توصيل مجاني للطلبات أكثر من 300 د.ل',
      inStock: 'متوفر وجاهز للشحن',
      outOfStock: 'نفد من المخزون',
      specs: 'المواصفات الفنية',
      reviews: 'آراء وتقييمات العملاء',
      scentPyramid: 'الهرم العطري',
      topNotes: 'قمة العطر',
      heartNotes: 'قلب العطر',
      baseNotes: 'قاعدة العطر',
      exploreCollection: 'استكشف المجموعة',
      viewAll: 'عرض الكل ←',
    },
  },
  en: {
    nav: {
      shop: 'Shop',
      fragrances: 'Fragrances',
      technology: 'Technology',
      about: 'About',
      contact: 'Contact',
      myAccount: 'My Account',
      dashboard: 'Admin Dashboard',
      cart: 'Cart',
      search: 'Search diffusers or scents...',
      login: 'Sign in',
      logout: 'Sign out',
    },
    common: {
      currency: 'LYD',
      addToCart: 'Add to cart',
      buyNow: 'Buy Now',
      freeDelivery: 'Free delivery on orders over 300 LYD',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      specs: 'Specifications',
      reviews: 'Reviews',
      scentPyramid: 'Scent Notes',
      topNotes: 'Top Notes',
      heartNotes: 'Heart Notes',
      baseNotes: 'Base Notes',
      exploreCollection: 'Explore Collection',
      viewAll: 'View all →',
    },
  },
};

export const useLanguageStore = create((set, get) => ({
  language: localStorage.getItem('odora_lang') || 'ar',
  dir: (localStorage.getItem('odora_lang') || 'ar') === 'ar' ? 'rtl' : 'ltr',
  isRtl: (localStorage.getItem('odora_lang') || 'ar') === 'ar',

  setLanguage: (lang) => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    const isRtl = lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem('odora_lang', lang);
    set({ language: lang, dir, isRtl });
  },

  toggleLanguage: () => {
    const newLang = get().language === 'ar' ? 'en' : 'ar';
    get().setLanguage(newLang);
  },

  t: (keyPath) => {
    const lang = get().language;
    const keys = keyPath.split('.');
    let val = translations[lang];
    for (const k of keys) {
      val = val?.[k];
      if (val === undefined) break;
    }
    return val || keyPath;
  },
}));
