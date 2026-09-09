import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const language = ((i18n.language || 'ar').split('-')[0]) as 'ar' | 'en';
  const isRtl = language === 'ar';
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-brand-cream">
      <div className="odora-card p-8 sm:p-10 bg-white border border-stone-200 max-w-md w-full space-y-6 shadow-xl text-center">
        <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200 text-brand-sage flex items-center justify-center mx-auto">
          <KeyRound className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-brand-ink">
            {language === 'ar' ? 'استعادة كلمة المرور' : 'Reset Password'}
          </h1>
          <p className="text-xs text-brand-muted font-medium">
            {language === 'ar' ? 'أدخل بريدك الإلكتروني المسجل وسنرسل لك رابط إعادة تعيين كلمة المرور.' : 'Enter your registered email and we will send you a reset link.'}
          </p>
        </div>

        {sent ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs space-y-2 border border-emerald-200">
            <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-600" />
            <p className="font-bold">{language === 'ar' ? 'تم إرسال التعليمات إلى بريدك الإلكتروني بنجاح.' : 'Instructions sent to your email.'}</p>
            <p className="text-[11px] text-stone-500">{language === 'ar' ? 'يرجى فحص صندوق الوارد ورسائل البريد غير الهام (Spam).' : 'Please check your inbox and spam folder.'}</p>
            <div className="pt-2">
              <Link to="/login" className="font-bold text-brand-sage underline">{language === 'ar' ? 'العودة لتسجيل الدخول' : 'Back to Login'}</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs text-start">
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

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-brand-ink hover:bg-stone-800 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{language === 'ar' ? 'إرسال رابط الاستعادة' : 'Send Reset Link'}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}

        <div className="text-center text-xs text-brand-muted font-medium">
          <Link to="/login" className="font-bold text-brand-sage hover:underline">
            {language === 'ar' ? 'تذكرت كلمة المرور؟ تسجيل الدخول' : 'Remembered password? Login'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
