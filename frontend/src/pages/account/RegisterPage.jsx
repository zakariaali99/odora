import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="odora-card p-8 sm:p-10 bg-white border border-stone-200/80 max-w-md w-full space-y-6 shadow-xl">
        
        <div className="text-center space-y-2">
          <img src="/odora-logo.png" alt="odora" className="h-7 w-auto mx-auto object-contain" />
          <h1 className="text-2xl font-bold text-brand-ink pt-2">إنشاء حساب جديد</h1>
          <p className="text-xs text-brand-muted">انضم إلى أودورا لمتابعة طلباتك وإدارة أجهزة التعطير الذكية</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-brand-ink mb-1">الاسم الأول</label>
              <input
                type="text"
                required
                placeholder="أحمد..."
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage"
              />
            </div>
            <div>
              <label className="block font-bold text-brand-ink mb-1">اسم العائلة</label>
              <input
                type="text"
                placeholder="الزواري..."
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-brand-ink mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage font-poppins"
            />
          </div>

          <div>
            <label className="block font-bold text-brand-ink mb-1">رقم الهاتف</label>
            <input
              type="tel"
              placeholder="091XXXXXXX"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage font-poppins"
            />
          </div>

          <div>
            <label className="block font-bold text-brand-ink mb-1">كلمة المرور</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="6 خانات على الأقل..."
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage font-poppins"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-brand-sage hover:bg-brand-olive text-white font-semibold text-sm transition-all shadow-btn-sage flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span>{isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-brand-muted">
          <span>لديك حساب بالفعل؟ </span>
          <Link to="/login" className="font-bold text-brand-olive hover:underline">
            تسجيل الدخول
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
