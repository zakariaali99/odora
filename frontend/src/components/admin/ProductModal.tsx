import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { Product } from '../../types';

interface CategoryItem {
  id: number | string;
  name_ar: string;
  name?: string;
  slug?: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSaveSuccess: () => void;
  categories: CategoryItem[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSaveSuccess,
  categories,
}) => {
  const [formData, setFormData] = useState({
    name_ar: '',
    name: '',
    category_id: categories?.[0]?.id || '',
    product_type: 'diffuser',
    price: '',
    discount_price: '',
    stock: 50,
    coverage_area: '900 m²',
    capacity: '1000 ml',
    noise_level: '< 25 dB',
    power_spec: '12V / 2A',
    description_ar: '',
    description: '',
    subtitle_ar: '',
    is_featured: false,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name_ar: product.name_ar || '',
        name: product.name || '',
        category_id: product.category?.id || categories?.[0]?.id || '',
        product_type: product.product_type || 'diffuser',
        price: product.price ? String(product.price) : '',
        discount_price: product.discount_price ? String(product.discount_price) : '',
        stock: product.stock !== undefined ? product.stock : 50,
        coverage_area: product.coverage_area || '900 m²',
        capacity: product.capacity || '1000 ml',
        noise_level: product.noise_level || '< 25 dB',
        power_spec: product.power_spec || '12V / 2A',
        description_ar: product.description_ar || '',
        description: product.description || '',
        subtitle_ar: product.subtitle_ar || '',
        is_featured: !!product.is_featured,
        is_active: product.is_active !== undefined ? product.is_active : true,
      });
    } else {
      setFormData({
        name_ar: '',
        name: '',
        category_id: categories?.[0]?.id || '',
        product_type: 'diffuser',
        price: '',
        discount_price: '',
        stock: 50,
        coverage_area: '900 m²',
        capacity: '1000 ml',
        noise_level: '< 25 dB',
        power_spec: '12V / 2A',
        description_ar: '',
        description: '',
        subtitle_ar: '',
        is_featured: false,
        is_active: true,
      });
    }
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        name: formData.name || formData.name_ar,
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        stock: parseInt(String(formData.stock), 10),
      };

      if (product?.id) {
        await api.updateAdminProduct(product.id, payload);
      } else {
        await api.createAdminProduct(payload);
      }

      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء حفظ المنتج، يرجى مراجعة الحقول المطلوبة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-bold text-base text-slate-800">
            {product ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد للكتالوج'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                اسم المنتج بالعربية <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: جهاز أودورا A316 الذكي"
                value={formData.name_ar}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-sage focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الاسم بالإنجليزية (اختياري)
              </label>
              <input
                type="text"
                placeholder="مثال: Odora A316 Smart Diffuser"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-sage focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                التصنيف <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-sage focus:outline-none bg-white"
              >
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_ar}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                نوع المنتج <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.product_type}
                onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-sage focus:outline-none bg-white"
              >
                <option value="diffuser">جهاز تعطير ذكي (Diffuser)</option>
                <option value="oil">زيت عطري نقي (Oil)</option>
                <option value="bundle">باقة توفيرية (Bundle)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                المخزون المتوفر <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-sage focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                السعر الأساسي (د.ل) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                required
                placeholder="320.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-sage focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                السعر المخفض (د.ل - اختياري)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                placeholder="290.00"
                value={formData.discount_price}
                onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-sage focus:outline-none"
              />
            </div>
          </div>

          {/* Specs */}
          {formData.product_type === 'diffuser' && (
            <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-slate-600">المواصفات الفنية للجهاز</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">مساحة التغطية</label>
                  <input
                    type="text"
                    value={formData.coverage_area}
                    onChange={(e) => setFormData({ ...formData, coverage_area: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">سعة الزيت</label>
                  <input
                    type="text"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">مستوى الضجيج</label>
                  <input
                    type="text"
                    value={formData.noise_level}
                    onChange={(e) => setFormData({ ...formData, noise_level: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">الجهد والطاقة</label>
                  <input
                    type="text"
                    value={formData.power_spec}
                    onChange={(e) => setFormData({ ...formData, power_spec: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              الوصف التفصيلي للمنتج بالعربية
            </label>
            <textarea
              rows={3}
              value={formData.description_ar}
              onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-sage focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="rounded text-brand-sage focus:ring-brand-sage"
              />
              <span>تمييز في الصفحة الرئيسية</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded text-brand-sage focus:ring-brand-sage"
              />
              <span>متاح للشراء في المتجر</span>
            </label>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-brand-sage hover:bg-brand-olive text-white text-sm font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'جاري الحفظ...' : 'حفظ المنتج'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ProductModal;
