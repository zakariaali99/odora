import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="odora-card p-8 sm:p-10 bg-white border border-stone-200/80 max-w-md w-full space-y-6 shadow-xl text-center">
        <div className="w-12 h-12 rounded-full bg-brand-cream text-brand-sage flex items-center justify-center mx-auto">
          <KeyRound className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-brand-ink">استعادة كلمة المرور</h1>
          <p className="text-xs text-brand-muted">أدخل بريدك الإلكتروني المسجل وسنرسل لك رابط إعادة تعيين كلمة المرور.</p>
        </div>

        {sent ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs space-y-2">
            <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-600" />
            <p className="font-semibold">تم إرسال التعليمات إلى بريدك الإلكتروني بنجاح.</p>
            <p className="text-[11px] text-stone-500">يرجى فحص صندوق الوارد ورسائل البريد غير الهام (Spam).</p>
            <div className="pt-2">
              <Link to="/login" className="font-bold text-brand-olive underline">العودة لتسجيل الدخول</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs text-right">
            <div>
              <label className="block font-bold text-brand-ink mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage font-poppins"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-brand-dark hover:bg-stone-800 text-white font-semibold text-sm transition-all shadow-btn-dark flex items-center justify-center gap-2"
            >
              <span>إرسال رابط الاستعادة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center text-xs text-brand-muted">
          <Link to="/login" className="font-bold text-brand-olive hover:underline">
            تذكرت كلمة المرور؟ تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
