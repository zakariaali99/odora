import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const language = ((i18n.language || 'ar').split('-')[0]) as 'ar' | 'en';
  const isRtl = language === 'ar';
  const { register, isLoading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await register(formData);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-brand-cream">
      <div className="odora-card p-8 sm:p-10 bg-white border border-stone-200 max-w-md w-full space-y-6 shadow-xl">
        
        <div className="text-center space-y-2">
          <img src="/odora-logo.png" alt="odora" className="h-7 w-auto mx-auto object-contain" />
          <h1 className="text-2xl font-bold text-brand-ink pt-2">
            {t('nav.register', 'إنشاء حساب جديد')}
          </h1>
          <p className="text-xs text-brand-muted font-medium">
            {language === 'ar' ? 'انضم إلى أودورا لمتابعة طلباتك وإدارة أجهزة التعطير الذكية' : 'Join Odora to track orders and manage smart diffusers'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-brand-ink mb-1">
                {language === 'ar' ? 'الاسم الأول' : 'First Name'}
              </label>
              <input
                type="text"
                required
                placeholder={language === 'ar' ? 'أحمد...' : 'John...'}
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage bg-white text-brand-ink"
              />
            </div>
            <div>
              <label className="block font-bold text-brand-ink mb-1">
                {language === 'ar' ? 'اسم العائلة' : 'Last Name'}
              </label>
              <input
                type="text"
                placeholder={language === 'ar' ? 'الزواري...' : 'Doe...'}
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage bg-white text-brand-ink"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-brand-ink mb-1">
              {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage font-sans bg-white text-brand-ink"
            />
          </div>

          <div>
            <label className="block font-bold text-brand-ink mb-1">
              {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
            </label>
            <input
              type="tel"
              placeholder="091XXXXXXX"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage font-sans bg-white text-brand-ink"
            />
          </div>

          <div>
            <label className="block font-bold text-brand-ink mb-1">
              {language === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
            <input
              type="password"
              required
              minLength={6}
              placeholder={language === 'ar' ? '6 خانات على الأقل...' : 'At least 6 characters...'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage font-sans bg-white text-brand-ink"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-brand-sage hover:bg-brand-olive text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span>{isLoading ? (language === 'ar' ? 'جاري إنشاء الحساب...' : 'Creating...') : t('nav.register', 'إنشاء الحساب')}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center text-xs text-brand-muted font-medium">
          <span>{language === 'ar' ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}</span>
          <Link to="/login" className="font-bold text-brand-sage hover:underline">
            {t('nav.login', 'تسجيل الدخول')}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
