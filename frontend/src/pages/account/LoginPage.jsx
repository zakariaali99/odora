import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      if (result.user.is_staff) {
        navigate('/admin/dashboard');
      } else {
        navigate(from);
      }
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="odora-card p-8 sm:p-10 bg-white border border-stone-200/80 max-w-md w-full space-y-6 shadow-xl">
        
        <div className="text-center space-y-2">
          <img src="/odora-logo.png" alt="odora" className="h-7 w-auto mx-auto object-contain" />
          <h1 className="text-2xl font-bold text-brand-ink pt-2">تسجيل الدخول</h1>
          <p className="text-xs text-brand-muted">أهلاً بك مجدداً في بوابة أودورا للتعطير الذكي</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="font-bold text-brand-ink">كلمة المرور</label>
              <Link to="/forgot-password" className="text-[11px] text-brand-sage hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage font-poppins"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-brand-dark hover:bg-stone-800 text-white font-semibold text-sm transition-all shadow-btn-dark flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span>{isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Credentials Assistant */}
        <div className="pt-4 border-t border-stone-100 text-xs space-y-2">
          <span className="text-stone-400 block text-[11px]">بيانات تجريبية سريعة:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@odora.ly', 'odora2026!')}
              className="flex-1 py-1.5 px-2 bg-brand-pale/40 hover:bg-brand-pale text-brand-olive rounded-lg text-[11px] font-bold transition-colors"
            >
              حساب الإدارة (Admin)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('customer@odora.ly', 'odora2026!')}
              className="flex-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[11px] font-bold transition-colors"
            >
              حساب عميل (Customer)
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-brand-muted">
          <span>ليس لديك حساب بعد؟ </span>
          <Link to="/register" className="font-bold text-brand-olive hover:underline">
            إنشاء حساب جديد
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
