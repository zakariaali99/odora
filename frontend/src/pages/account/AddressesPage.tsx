import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';

export const AddressesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const language = ((i18n.language || 'ar').split('-')[0]) as 'ar' | 'en';
  const [addresses, setAddresses] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    city: 'طرابلس',
    district: '',
    street_address: '',
    landmark: '',
    is_default: true,
  });

  const fetchAddresses = async () => {
    try {
      const res = await api.getAddresses();
      setAddresses(res.data.results || res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAddress(formData);
      setModalOpen(false);
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await api.deleteAddress(id);
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 bg-brand-cream">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">
            {language === 'ar' ? 'عناوين التوصيل' : 'Delivery Addresses'}
          </h1>
          <p className="text-xs text-brand-muted font-medium mt-0.5">
            {language === 'ar' ? 'إدارة العناوين المسجلة للشحن السريع' : 'Manage your saved addresses for one-click checkout'}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-full bg-brand-sage hover:bg-brand-olive text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ar' ? 'إضافة عنوان جديد' : 'Add New Address'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="odora-card p-6 bg-white border border-stone-200 shadow-sm space-y-3 relative">
            {addr.is_default && (
              <span className="absolute top-4 end-4 px-2.5 py-0.5 rounded-full bg-brand-pale/40 text-brand-sage border border-brand-sage/30 text-[11px] font-bold">
                {language === 'ar' ? 'العنوان الافتراضي' : 'Default'}
              </span>
            )}
            <h3 className="font-bold text-sm text-brand-ink">{addr.full_name}</h3>
            <p className="text-xs text-brand-muted font-sans font-medium">{addr.phone_number}</p>
            <p className="text-xs text-brand-ink font-semibold">
              {addr.city} {addr.district && `· ${addr.district}`}
            </p>
            <p className="text-xs text-brand-muted leading-relaxed font-normal">
              {addr.street_address} {addr.landmark && `(${language === 'ar' ? 'أقرب نقطة دالة: ' : 'Landmark: '}${addr.landmark})`}
            </p>
            <div className="pt-2 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'حذف العنوان' : 'Delete'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <h3 className="font-bold text-base text-brand-ink">
              {language === 'ar' ? 'إضافة عنوان توصيل جديد' : 'Add New Delivery Address'}
            </h3>
            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder={language === 'ar' ? 'الاسم الكامل للمستلم...' : 'Full name of recipient...'}
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-white text-brand-ink"
              />
              <input
                type="tel"
                required
                placeholder={language === 'ar' ? 'رقم هاتف للتوصيل...' : 'Phone number...'}
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl font-sans bg-white text-brand-ink"
              />
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-white font-semibold text-brand-ink"
              >
                <option value="طرابلس">طرابلس (Tripoli)</option>
                <option value="مصراتة">مصراتة (Misrata)</option>
                <option value="بنغازي">بنغازي (Benghazi)</option>
                <option value="الزاوية">الزاوية (Zawiya)</option>
                <option value="زليتن">زليتن (Zliten)</option>
              </select>
              <input
                type="text"
                placeholder={language === 'ar' ? 'المنطقة أو الحي...' : 'District / Area...'}
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-white text-brand-ink"
              />
              <textarea
                required
                placeholder={language === 'ar' ? 'العنوان بالتفصيل...' : 'Detailed street address...'}
                value={formData.street_address}
                onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-white text-brand-ink"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-semibold"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-sage text-white rounded-xl font-bold hover:bg-brand-olive shadow-xs"
                >
                  {language === 'ar' ? 'حفظ العنوان' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressesPage;
