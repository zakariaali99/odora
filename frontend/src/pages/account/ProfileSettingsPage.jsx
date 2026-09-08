import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';
import { User, CheckCircle2 } from 'lucide-react';

export const ProfileSettingsPage = () => {
  const { user, fetchProfile } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phone, setPhone] = useState(user?.phone_number || '');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    try {
      await api.updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
      });
      await fetchProfile();
      setSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-6">
      <div className="pb-4 border-b border-stone-200">
        <h1 className="text-2xl font-bold text-brand-ink">إعدادات الحساب والملف الشخصي</h1>
        <p className="text-xs text-brand-muted mt-0.5">تحديث بياناتك الشخصية المسجلة لدى أودورا</p>
      </div>

      <div className="odora-card p-6 sm:p-8 bg-white border border-stone-200/80">
        {saved && (
          <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>تم حفظ التعديلات بنجاح.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-brand-ink mb-1">الاسم الأول</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage"
              />
            </div>
            <div>
              <label className="block font-bold text-brand-ink mb-1">اسم العائلة</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-brand-ink mb-1">البريد الإلكتروني (غير قابل للتعديل)</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-3.5 py-2.5 text-sm border border-stone-100 bg-stone-50 rounded-xl text-stone-500 font-poppins"
            />
          </div>

          <div>
            <label className="block font-bold text-brand-ink mb-1">رقم الهاتف</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage font-poppins"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-brand-sage hover:bg-brand-olive text-white text-xs font-semibold transition-colors"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
