import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';
import { CheckCircle2 } from 'lucide-react';

export const ProfileSettingsPage: React.FC = () => {
  const { user, fetchProfile } = useAuthStore();
  const { t, i18n } = useTranslation();
  const language = ((i18n.language || 'ar').split('-')[0]) as 'ar' | 'en';
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phone, setPhone] = useState(user?.phone_number || '');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="min-h-screen pb-20 pt-8 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-6 bg-brand-cream">
      <div className="pb-4 border-b border-stone-200">
        <h1 className="text-2xl font-bold text-brand-ink">
          {language === 'ar' ? 'إعدادات الحساب والملف الشخصي' : 'Profile Settings'}
        </h1>
        <p className="text-xs text-brand-muted font-medium mt-0.5">
          {language === 'ar' ? 'تحديث بياناتك الشخصية المسجلة لدى أودورا' : 'Update your personal details registered with Odora'}
        </p>
      </div>

      <div className="odora-card p-6 sm:p-8 bg-white border border-stone-200 shadow-sm">
        {saved && (
          <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-bold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{language === 'ar' ? 'تم حفظ التعديلات بنجاح.' : 'Profile updated successfully.'}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-brand-ink mb-1">
                {language === 'ar' ? 'الاسم الأول' : 'First Name'}
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage bg-white text-brand-ink"
              />
            </div>
            <div>
              <label className="block font-bold text-brand-ink mb-1">
                {language === 'ar' ? 'اسم العائلة' : 'Last Name'}
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage bg-white text-brand-ink"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-brand-ink mb-1">
              {language === 'ar' ? 'البريد الإلكتروني (غير قابل للتعديل)' : 'Email (Read Only)'}
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-3.5 py-2.5 text-sm border border-stone-200 bg-stone-100 rounded-xl text-stone-500 font-sans cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-bold text-brand-ink mb-1">
              {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage font-sans bg-white text-brand-ink"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-brand-sage hover:bg-brand-olive text-white text-xs font-bold transition-colors shadow-xs"
            >
              {loading ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ التغييرات' : 'Save Changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
