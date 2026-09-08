import React from 'react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { Link } from 'react-router-dom';
import { Compass, Home, ShoppingBag, HelpCircle } from 'lucide-react';

export default function NotFoundPage() {
  const { isRtl } = useLanguageStore();

  return (
    <div className="py-20 max-w-xl mx-auto px-4 text-center space-y-6">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-odora-canvas flex items-center justify-center text-odora-olive border border-odora-dark/10 shadow-sm">
        <Compass size={40} className="animate-spin" style={{ animationDuration: '10s' }} />
      </div>

      <div className="space-y-2">
        <span className="font-mono text-xs text-odora-olive font-bold tracking-widest uppercase">ERROR 404</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-odora-dark">
          {isRtl ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h1>
        <p className="text-sm text-odora-dark/70 max-w-md mx-auto">
          {isRtl 
            ? 'عذراً، الرابط الذي حاولت الوصول إليه قد تم نقله أو لم يعد متاحاً. يمكنك العودة للصفحة الرئيسية أو استكشاف المتجر.'
            : 'Sorry, the page you are looking for does not exist or has been moved.'}
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-odora-olive text-white rounded-xl text-xs font-semibold hover:bg-odora-olive/90 transition shadow-sm"
        >
          <Home size={14} />
          <span>{isRtl ? 'الرئيسية' : 'Back to Home'}</span>
        </Link>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-odora-dark/15 rounded-xl text-xs font-semibold text-odora-dark hover:bg-odora-canvas transition"
        >
          <ShoppingBag size={14} />
          <span>{isRtl ? 'تصفح المتجر' : 'Browse Shop'}</span>
        </Link>
        <Link
          to="/faqs"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-odora-dark/15 rounded-xl text-xs font-semibold text-odora-dark hover:bg-odora-canvas transition"
        >
          <HelpCircle size={14} />
          <span>{isRtl ? 'الأسئلة الشائعة' : 'FAQs'}</span>
        </Link>
      </div>
    </div>
  );
}
