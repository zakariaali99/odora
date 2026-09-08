import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await api.createAddress(formData);
      setModalOpen(false);
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteAddress(id);
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">عناوين التوصيل</h1>
          <p className="text-xs text-brand-muted mt-0.5">إدارة العناوين المسجلة للشحن السريع</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-full bg-brand-sage hover:bg-brand-olive text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة عنوان جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="odora-card p-6 bg-white border border-stone-200/80 space-y-3 relative">
            {addr.is_default && (
              <span className="absolute top-4 left-4 px-2.5 py-0.5 rounded-full bg-brand-pale text-brand-olive text-[11px] font-bold">
                العنوان الافتراضي
              </span>
            )}
            <h3 className="font-bold text-sm text-brand-ink">{addr.full_name}</h3>
            <p className="text-xs text-brand-muted font-poppins">{addr.phone_number}</p>
            <p className="text-xs text-brand-ink">
              {addr.city} {addr.district && `· ${addr.district}`}
            </p>
            <p className="text-xs text-brand-muted leading-relaxed">
              {addr.street_address} {addr.landmark && `(أقرب نقطة دالة: ${addr.landmark})`}
            </p>
            <div className="pt-2 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-xs text-red-600 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف العنوان</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-brand-ink">إضافة عنوان توصيل جديد</h3>
            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="الاسم الكامل للمستلم..."
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl"
              />
              <input
                type="tel"
                required
                placeholder="رقم هاتف للتوصيل..."
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl font-poppins"
              />
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-white"
              >
                <option value="طرابلس">طرابلس</option>
                <option value="مصراتة">مصراتة</option>
                <option value="بنغازي">بنغازي</option>
                <option value="الزاوية">الزاوية</option>
                <option value="زليتن">زليتن</option>
              </select>
              <input
                type="text"
                placeholder="المنطقة أو الحي..."
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl"
              />
              <textarea
                required
                placeholder="العنوان بالتفصيل..."
                value={formData.street_address}
                onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-medium"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-sage text-white rounded-xl font-semibold hover:bg-brand-olive"
                >
                  حفظ العنوان
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
