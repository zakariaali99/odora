import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const language = ((i18n.language || 'ar').split('-')[0]) as 'ar' | 'en';
  const isRtl = language === 'ar';
  const { login, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      if (result.user?.is_staff) {
        navigate('/admin/dashboard');
      } else {
        navigate(from);
      }
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-brand-cream">
      <div className="odora-card p-8 sm:p-10 bg-white border border-stone-200 max-w-md w-full space-y-6 shadow-xl">
        
        <div className="text-center space-y-2">
          <img src="/odora-logo.png" alt="odora" className="h-7 w-auto mx-auto object-contain" />
          <h1 className="text-2xl font-bold text-brand-ink pt-2">
            {t('nav.login', 'تسجيل الدخول')}
          </h1>
          <p className="text-xs text-brand-muted font-medium">
            {language === 'ar' ? 'أهلاً بك مجدداً في بوابة أودورا للتعطير الذكي' : 'Welcome back to Odora Scent Management'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-brand-ink mb-1">
              {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage font-sans bg-white text-brand-ink"
            />
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="font-bold text-brand-ink">
                {language === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <Link to="/forgot-password" className="text-[11px] text-brand-sage hover:underline font-semibold">
                {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
              </Link>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage font-sans bg-white text-brand-ink"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-brand-ink hover:bg-stone-800 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span>{isLoading ? (language === 'ar' ? 'جاري الدخول...' : 'Logging in...') : t('nav.login', 'تسجيل الدخول')}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Quick Demo Credentials Assistant */}
        <div className="pt-4 border-t border-stone-100 text-xs space-y-2">
          <span className="text-stone-400 block text-[11px]">
            {language === 'ar' ? 'بيانات تجريبية سريعة:' : 'Quick Demo Credentials:'}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@odora.ly', 'odora2026!')}
              className="flex-1 py-1.5 px-2 bg-brand-pale/40 hover:bg-brand-pale text-brand-sage rounded-lg text-[11px] font-bold transition-colors border border-stone-200"
            >
              {language === 'ar' ? 'حساب الإدارة (Admin)' : 'Admin Login'}
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('customer@odora.ly', 'odora2026!')}
              className="flex-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[11px] font-bold transition-colors border border-stone-200"
            >
              {language === 'ar' ? 'حساب عميل (Customer)' : 'Customer Login'}
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-brand-muted font-medium">
          <span>{language === 'ar' ? 'ليس لديك حساب بعد؟ ' : "Don't have an account? "}</span>
          <Link to="/register" className="font-bold text-brand-sage hover:underline">
            {t('nav.register', 'إنشاء حساب جديد')}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
