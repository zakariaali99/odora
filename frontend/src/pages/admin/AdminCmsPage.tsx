import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { 
  Sliders, HelpCircle, Tag, Plus, RefreshCw, Trash2, 
  Edit3, X, Image as ImageIcon
} from 'lucide-react';

interface Banner {
  id: number;
  title_ar: string;
  title_en?: string;
  subtitle_ar?: string;
  subtitle_en?: string;
  image?: string;
  link?: string;
  order: number;
  is_active: boolean;
}

interface Faq {
  id: number;
  category: string;
  question_ar: string;
  question_en?: string;
  answer_ar: string;
  answer_en?: string;
  order: number;
  is_active: boolean;
}

interface Coupon {
  id: number;
  code: string;
  discount_type: 'percent' | 'fixed' | string;
  value: number;
  min_order_amount: number;
  max_uses: number;
  used_count: number;
  is_active: boolean;
}

export const AdminCmsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = (i18n.language || 'ar').startsWith('ar');
  const [activeTab, setActiveTab] = useState<'banners' | 'faqs' | 'coupons'>('banners');
  const [loading, setLoading] = useState<boolean>(true);

  // Data lists
  const [banners, setBanners] = useState<Banner[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Form states for modals
  const [showFaqModal, setShowFaqModal] = useState<boolean>(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [faqForm, setFaqForm] = useState({
    category: 'diffuser',
    question_ar: '',
    question_en: '',
    answer_ar: '',
    answer_en: '',
    order: 0,
    is_active: true
  });

  const [showCouponModal, setShowCouponModal] = useState<boolean>(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discount_type: 'percent',
    value: 10,
    min_order_amount: 0,
    max_uses: 100,
    is_active: true
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'banners') {
        const res = await api.get('/cms/banners/');
        setBanners(res.data.results || res.data || []);
      } else if (activeTab === 'faqs') {
        const res = await api.get('/cms/faqs/');
        setFaqs(res.data.results || res.data || []);
      } else if (activeTab === 'coupons') {
        const res = await api.get('/marketing/admin-coupons/');
        setCoupons(res.data.results || res.data || []);
      }
    } catch (err) {
      console.error('Failed to load CMS data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Handle FAQ Submit
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await api.patch(`/cms/faqs/${editingFaq.id}/`, faqForm);
      } else {
        await api.post('/cms/faqs/', faqForm);
      }
      setShowFaqModal(false);
      setEditingFaq(null);
      fetchData();
    } catch (err) {
      console.error('Failed to save FAQ', err);
    }
  };

  const handleDeleteFaq = async (id: number) => {
    if (!window.confirm(isRtl ? 'هل أنت متأكد من حذف هذا السؤال؟' : 'Delete this FAQ?')) return;
    try {
      await api.delete(`/cms/faqs/${id}/`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete FAQ', err);
    }
  };

  // Handle Coupon Submit
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/marketing/admin-coupons/', couponForm);
      setShowCouponModal(false);
      setCouponForm({
        code: '',
        discount_type: 'percent',
        value: 10,
        min_order_amount: 0,
        max_uses: 100,
        is_active: true
      });
      fetchData();
    } catch (err) {
      console.error('Failed to save coupon', err);
    }
  };

  const handleDeleteCoupon = async (id: number) => {
    if (!window.confirm(isRtl ? 'هل أنت متأكد من حذف هذا الكوبون؟' : 'Delete this coupon?')) return;
    try {
      await api.delete(`/marketing/admin-coupons/${id}/`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete coupon', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink-primary font-cairo">
            {isRtl ? 'إدارة المحتوى والعروض (CMS)' : 'Content & Promotions Management'}
          </h1>
          <p className="text-xs text-ink-muted mt-0.5 font-cairo">
            {isRtl ? 'تعديل اللافتات، الأسئلة الشائعة، وكوبونات الخصم الترويجية' : 'Manage hero banners, FAQs, and marketing discount coupons'}
          </p>
        </div>
        <button 
          onClick={fetchData}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-ink-primary hover:bg-stone-50 transition shadow-sm bg-white"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>{isRtl ? 'تحديث البيانات' : 'Refresh'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto scrollbar-none whitespace-nowrap">
        <button
          onClick={() => setActiveTab('banners')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'banners' ? 'bg-brand-sage text-white shadow-sm' : 'hover:bg-canvas-subtle text-ink-muted'
          }`}
        >
          <Sliders size={14} />
          <span>{isRtl ? 'اللافتات الرئيسية (Banners)' : 'Hero Banners'}</span>
        </button>
        <button
          onClick={() => setActiveTab('faqs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'faqs' ? 'bg-brand-sage text-white shadow-sm' : 'hover:bg-canvas-subtle text-ink-muted'
          }`}
        >
          <HelpCircle size={14} />
          <span>{isRtl ? 'الأسئلة الشائعة (FAQ)' : 'FAQs'}</span>
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'coupons' ? 'bg-brand-sage text-white shadow-sm' : 'hover:bg-canvas-subtle text-ink-muted'
          }`}
        >
          <Tag size={14} />
          <span>{isRtl ? 'كوبونات الخصم (Coupons)' : 'Coupons'}</span>
        </button>
      </div>

      {/* TAB 1: BANNERS */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 group">
                <div className="h-44 bg-canvas-subtle relative flex items-center justify-center overflow-hidden">
                  {banner.image ? (
                    <img src={banner.image} alt={banner.title_ar} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <ImageIcon className="text-stone-300" size={44} />
                  )}
                  <span className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    banner.is_active ? 'bg-emerald-600 text-white' : 'bg-stone-400 text-white'
                  }`}>
                    {banner.is_active ? (isRtl ? 'نشط' : 'Active') : (isRtl ? 'معطل' : 'Inactive')}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-ink-primary text-base font-cairo">
                    {isRtl ? banner.title_ar : (banner.title_en || banner.title_ar)}
                  </h3>
                  <p className="text-xs text-ink-muted">
                    {isRtl ? banner.subtitle_ar : (banner.subtitle_en || banner.subtitle_ar)}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-ink-muted border-t border-stone-100">
                    <span>{isRtl ? 'الرابط: ' : 'Link: '}<code className="font-mono">{banner.link || '/shop'}</code></span>
                    <span>{isRtl ? 'الترتيب: ' : 'Order: '}{banner.order}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FAQS */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-ink-muted font-cairo">
              {isRtl ? `إجمالي الأسئلة المتاحة: ${faqs.length}` : `Total FAQs: ${faqs.length}`}
            </p>
            <button
              onClick={() => {
                setEditingFaq(null);
                setFaqForm({
                  category: 'diffuser',
                  question_ar: '',
                  question_en: '',
                  answer_ar: '',
                  answer_en: '',
                  order: faqs.length + 1,
                  is_active: true
                });
                setShowFaqModal(true);
              }}
              className="px-4 py-2 bg-brand-sage text-white rounded-xl text-xs font-bold hover:bg-brand-olive transition inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={14} />
              <span>{isRtl ? 'إضافة سؤال جديد' : 'Add FAQ'}</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 divide-y divide-stone-100 overflow-hidden">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-canvas-subtle/40 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-canvas-subtle rounded text-ink-muted uppercase border border-stone-200">
                      {faq.category}
                    </span>
                    <h4 className="font-bold text-ink-primary text-xs font-cairo">
                      {isRtl ? faq.question_ar : (faq.question_en || faq.question_ar)}
                    </h4>
                  </div>
                  <p className="text-xs text-ink-muted line-clamp-2 max-w-2xl font-cairo">
                    {isRtl ? faq.answer_ar : (faq.answer_en || faq.answer_ar)}
                  </p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      setEditingFaq(faq);
                      setFaqForm({
                        category: faq.category,
                        question_ar: faq.question_ar,
                        question_en: faq.question_en || '',
                        answer_ar: faq.answer_ar,
                        answer_en: faq.answer_en || '',
                        order: faq.order,
                        is_active: faq.is_active
                      });
                      setShowFaqModal(true);
                    }}
                    className="p-1.5 hover:bg-canvas-subtle rounded-lg text-ink-muted hover:text-brand-sage transition"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-500 hover:text-rose-700 transition"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-ink-muted font-cairo">
              {isRtl ? 'كوبونات الخصم النشطة في سلة الشراء والدفع' : 'Active promo codes available in checkout'}
            </p>
            <button
              onClick={() => setShowCouponModal(true)}
              className="px-4 py-2 bg-brand-sage text-white rounded-xl text-xs font-bold hover:bg-brand-olive transition inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={14} />
              <span>{isRtl ? 'إنشاء كود خصم' : 'New Coupon'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="font-mono font-bold text-sm text-ink-primary tracking-wider px-3 py-1 bg-canvas-subtle rounded-xl border border-dashed border-stone-300">
                    {coupon.code}
                  </div>
                  <button
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="text-ink-muted hover:text-rose-600 transition"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="space-y-1 text-xs text-ink-muted">
                  <div className="flex justify-between font-bold text-brand-amber">
                    <span>{isRtl ? 'قيمة الخصم:' : 'Discount:'}</span>
                    <span className="font-mono">{coupon.discount_type === 'percent' ? `${coupon.value}%` : `${coupon.value} د.ل`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRtl ? 'الحد الأدنى للطلب:' : 'Min Order:'}</span>
                    <span className="font-mono">{coupon.min_order_amount} د.ل</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRtl ? 'الاستخدام:' : 'Usage:'}</span>
                    <span className="font-mono">{coupon.used_count} / {coupon.max_uses}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h3 className="font-bold text-ink-primary text-sm font-cairo">
                {editingFaq ? (isRtl ? 'تعديل السؤال' : 'Edit FAQ') : (isRtl ? 'إضافة سؤال جديد' : 'New FAQ')}
              </h3>
              <button onClick={() => setShowFaqModal(false)} className="text-ink-muted hover:text-ink-primary">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveFaq} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1 text-ink-muted">{isRtl ? 'التصنيف' : 'Category'}</label>
                <select
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white text-ink-primary focus:outline-none focus:border-brand-sage"
                >
                  <option value="diffuser">{isRtl ? 'جهاز التعطير A316' : 'A316 Diffuser'}</option>
                  <option value="oils">{isRtl ? 'الزيوت العطرية والروائح' : 'Fragrance Oils'}</option>
                  <option value="shipping">{isRtl ? 'الشحن والتوصيل في ليبيا' : 'Shipping in Libya'}</option>
                  <option value="app">{isRtl ? 'تطبيق الهاتف والبلوتوث' : 'App & Bluetooth'}</option>
                  <option value="warranty">{isRtl ? 'الضمان وخدمة ما بعد البيع' : 'Warranty & Support'}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1 text-ink-muted">{isRtl ? 'السؤال (بالعربية)' : 'Question (Arabic)'}</label>
                <input
                  type="text"
                  required
                  value={faqForm.question_ar}
                  onChange={(e) => setFaqForm({ ...faqForm, question_ar: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-ink-primary focus:outline-none focus:border-brand-sage"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-ink-muted">{isRtl ? 'الإجابة (بالعربية)' : 'Answer (Arabic)'}</label>
                <textarea
                  required
                  rows={3}
                  value={faqForm.answer_ar}
                  onChange={(e) => setFaqForm({ ...faqForm, answer_ar: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-ink-primary focus:outline-none focus:border-brand-sage"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFaqModal(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-ink-muted hover:bg-stone-50 transition"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-sage text-white rounded-xl text-xs font-bold hover:bg-brand-olive transition shadow-sm"
                >
                  {isRtl ? 'حفظ السؤال' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h3 className="font-bold text-ink-primary text-sm font-cairo">
                {isRtl ? 'إنشاء كود خصم جديد' : 'New Promo Coupon'}
              </h3>
              <button onClick={() => setShowCouponModal(false)} className="text-ink-muted hover:text-ink-primary">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1 text-ink-muted">{isRtl ? 'رمز الكود (بالإنجليزية)' : 'Coupon Code'}</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. VIP20"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 font-mono text-xs uppercase text-ink-primary focus:outline-none focus:border-brand-sage"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-ink-muted">{isRtl ? 'نوع الخصم' : 'Discount Type'}</label>
                  <select
                    value={couponForm.discount_type}
                    onChange={(e) => setCouponForm({ ...couponForm, discount_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white text-ink-primary focus:outline-none focus:border-brand-sage"
                  >
                    <option value="percent">{isRtl ? 'نسبة مئوية (%)' : 'Percentage (%)'}</option>
                    <option value="fixed">{isRtl ? 'مبلغ ثابت (د.ل)' : 'Fixed Amount (LYD)'}</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1 text-ink-muted">{isRtl ? 'القيمة' : 'Value'}</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={couponForm.value}
                    onChange={(e) => setCouponForm({ ...couponForm, value: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs text-ink-primary focus:outline-none focus:border-brand-sage font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-ink-muted hover:bg-stone-50 transition"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-sage text-white rounded-xl text-xs font-bold hover:bg-brand-olive transition shadow-sm"
                >
                  {isRtl ? 'إنشاء الكوبون' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCmsPage;
