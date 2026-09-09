import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Compass, Home, ShoppingBag, HelpCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = (i18n.language || 'ar').startsWith('ar');

  return (
    <div className="py-20 max-w-xl mx-auto px-4 text-center space-y-6 bg-brand-cream min-h-[60vh] flex flex-col justify-center items-center">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-white flex items-center justify-center text-brand-sage border border-stone-200 shadow-sm">
        <Compass size={40} className="animate-spin" style={{ animationDuration: '10s' }} />
      </div>

      <div className="space-y-2">
        <span className="font-sans text-xs text-brand-sage font-bold tracking-widest uppercase">ERROR 404</span>
        <h1 className="text-3xl sm:text-4xl font-light text-brand-ink">
          {isRtl ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h1>
        <p className="text-sm text-brand-muted font-medium max-w-md mx-auto">
          {isRtl 
            ? 'عذراً، الرابط الذي حاولت الوصول إليه قد تم نقله أو لم يعد متاحاً. يمكنك العودة للصفحة الرئيسية أو استكشاف المتجر.'
            : 'Sorry, the page you are looking for does not exist or has been moved.'}
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-sage text-white rounded-xl text-xs font-bold hover:bg-brand-olive transition shadow-xs"
        >
          <Home size={14} />
          <span>{isRtl ? 'الرئيسية' : 'Back to Home'}</span>
        </Link>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-stone-300 rounded-xl text-xs font-bold text-brand-ink hover:bg-white transition shadow-2xs"
        >
          <ShoppingBag size={14} />
          <span>{isRtl ? 'تصفح المتجر' : 'Browse Shop'}</span>
        </Link>
        <Link
          to="/faqs"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-stone-300 rounded-xl text-xs font-bold text-brand-ink hover:bg-white transition shadow-2xs"
        >
          <HelpCircle size={14} />
          <span>{isRtl ? 'الأسئلة الشائعة' : 'FAQs'}</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
