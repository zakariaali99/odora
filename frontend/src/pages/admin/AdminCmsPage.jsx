import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useLanguageStore } from '../../store/useLanguageStore';
import { 
  Sliders, HelpCircle, Tag, Plus, RefreshCw, Trash2, 
  Edit3, Check, X, Eye, Image as ImageIcon, Calendar, Percent
} from 'lucide-react';

export default function AdminCmsPage() {
  const { isRtl } = useLanguageStore();
  const [activeTab, setActiveTab] = useState('banners');
  const [loading, setLoading] = useState(true);

  // Data lists
  const [banners, setBanners] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [coupons, setCoupons] = useState([]);

  // Form states for modals
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({
    category: 'diffuser',
    question_ar: '',
    question_en: '',
    answer_ar: '',
    answer_en: '',
    order: 0,
    is_active: true
  });

  const [showCouponModal, setShowCouponModal] = useState(false);
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
        setBanners(res.data.results || res.data);
      } else if (activeTab === 'faqs') {
        const res = await api.get('/cms/faqs/');
        setFaqs(res.data.results || res.data);
      } else if (activeTab === 'coupons') {
        const res = await api.get('/marketing/admin-coupons/');
        setCoupons(res.data.results || res.data);
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
  const handleSaveFaq = async (e) => {
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

  const handleDeleteFaq = async (id) => {
    if (!window.confirm(isRtl ? 'هل أنت متأكد من حذف هذا السؤال؟' : 'Delete this FAQ?')) return;
    try {
      await api.delete(`/cms/faqs/${id}/`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete FAQ', err);
    }
  };

  // Handle Coupon Submit
  const handleSaveCoupon = async (e) => {
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

  const handleDeleteCoupon = async (id) => {
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
          <h1 className="text-2xl font-bold text-odora-dark font-serif">
            {isRtl ? 'إدارة المحتوى والعروض (CMS)' : 'Content & Promotions Management'}
          </h1>
          <p className="text-sm text-odora-dark/60 mt-1">
            {isRtl ? 'تعديل اللافتات، الأسئلة الشائعة، وكوبونات الخصم الترويجية' : 'Manage hero banners, FAQs, and marketing discount coupons'}
          </p>
        </div>
        <button 
          onClick={fetchData}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 border border-odora-dark/15 rounded-xl text-sm font-medium hover:bg-white transition shadow-sm"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>{isRtl ? 'تحديث البيانات' : 'Refresh'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-odora-dark/10 pb-2 overflow-x-auto scrollbar-none whitespace-nowrap">
        <button
          onClick={() => setActiveTab('banners')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === 'banners' ? 'bg-odora-olive text-white shadow-sm' : 'hover:bg-odora-canvas/60 text-odora-dark/70'
          }`}
        >
          <Sliders size={16} />
          <span>{isRtl ? 'اللافتات الرئيسية (Banners)' : 'Hero Banners'}</span>
        </button>
        <button
          onClick={() => setActiveTab('faqs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === 'faqs' ? 'bg-odora-olive text-white shadow-sm' : 'hover:bg-odora-canvas/60 text-odora-dark/70'
          }`}
        >
          <HelpCircle size={16} />
          <span>{isRtl ? 'الأسئلة الشائعة (FAQ)' : 'FAQs'}</span>
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeTab === 'coupons' ? 'bg-odora-olive text-white shadow-sm' : 'hover:bg-odora-canvas/60 text-odora-dark/70'
          }`}
        >
          <Tag size={16} />
          <span>{isRtl ? 'كوبونات الخصم (Coupons)' : 'Coupons'}</span>
        </button>
      </div>

      {/* TAB 1: BANNERS */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-odora-dark/10 group">
                <div className="h-44 bg-odora-canvas relative flex items-center justify-center overflow-hidden">
                  {banner.image ? (
                    <img src={banner.image} alt={banner.title_ar} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <ImageIcon className="text-odora-dark/20" size={48} />
                  )}
                  <span className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    banner.is_active ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'
                  }`}>
                    {banner.is_active ? (isRtl ? 'نشط' : 'Active') : (isRtl ? 'معطل' : 'Inactive')}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-odora-dark font-serif text-lg">
                    {isRtl ? banner.title_ar : (banner.title_en || banner.title_ar)}
                  </h3>
                  <p className="text-xs text-odora-dark/70">
                    {isRtl ? banner.subtitle_ar : (banner.subtitle_en || banner.subtitle_ar)}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs text-odora-dark/50 border-t border-odora-dark/5">
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
            <p className="text-xs text-odora-dark/60">
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
              className="px-4 py-2 bg-odora-olive text-white rounded-xl text-xs font-semibold hover:bg-odora-olive/90 transition inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={14} />
              <span>{isRtl ? 'إضافة سؤال جديد' : 'Add FAQ'}</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-odora-dark/5 divide-y divide-odora-dark/10 overflow-hidden">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-odora-canvas/10 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 bg-odora-canvas rounded text-odora-dark/70 uppercase">
                      {faq.category}
                    </span>
                    <h4 className="font-bold text-odora-dark text-sm">
                      {isRtl ? faq.question_ar : (faq.question_en || faq.question_ar)}
                    </h4>
                  </div>
                  <p className="text-xs text-odora-dark/70 line-clamp-2 max-w-2xl">
                    {isRtl ? faq.answer_ar : (faq.answer_en || faq.answer_ar)}
                  </p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
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
                    className="p-2 hover:bg-odora-canvas rounded-lg text-odora-dark/70 hover:text-odora-dark transition"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 hover:text-rose-700 transition"
                  >
                    <Trash2 size={16} />
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
            <p className="text-xs text-odora-dark/60">
              {isRtl ? 'كوبونات الخصم النشطة في سلة الشراء والدفع' : 'Active promo codes available in checkout'}
            </p>
            <button
              onClick={() => setShowCouponModal(true)}
              className="px-4 py-2 bg-odora-olive text-white rounded-xl text-xs font-semibold hover:bg-odora-olive/90 transition inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={14} />
              <span>{isRtl ? 'إنشاء كود خصم' : 'New Coupon'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="bg-white rounded-2xl p-5 shadow-sm border border-odora-dark/10 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="font-mono font-bold text-lg text-odora-dark tracking-wider px-3 py-1 bg-odora-canvas/60 rounded-xl border border-dashed border-odora-dark/30">
                    {coupon.code}
                  </div>
                  <button
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="text-odora-dark/30 hover:text-rose-600 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="space-y-1 text-xs text-odora-dark/70">
                  <div className="flex justify-between font-semibold text-odora-olive">
                    <span>{isRtl ? 'قيمة الخصم:' : 'Discount:'}</span>
                    <span>{coupon.discount_type === 'percent' ? `${coupon.value}%` : `${coupon.value} د.ل`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRtl ? 'الحد الأدنى للطلب:' : 'Min Order:'}</span>
                    <span>{coupon.min_order_amount} د.ل</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isRtl ? 'الاستخدام:' : 'Usage:'}</span>
                    <span>{coupon.used_count} / {coupon.max_uses}</span>
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
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-odora-dark/10 pb-3">
              <h3 className="font-bold text-odora-dark">
                {editingFaq ? (isRtl ? 'تعديل السؤال' : 'Edit FAQ') : (isRtl ? 'إضافة سؤال جديد' : 'New FAQ')}
              </h3>
              <button onClick={() => setShowFaqModal(false)} className="text-odora-dark/50 hover:text-odora-dark">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveFaq} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold mb-1 text-odora-dark/70">{isRtl ? 'التصنيف' : 'Category'}</label>
                <select
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-odora-dark/15 text-xs bg-white"
                >
                  <option value="diffuser">{isRtl ? 'جهاز التعطير A316' : 'A316 Diffuser'}</option>
                  <option value="oils">{isRtl ? 'الزيوت العطرية والروائح' : 'Fragrance Oils'}</option>
                  <option value="shipping">{isRtl ? 'الشحن والتوصيل في ليبيا' : 'Shipping in Libya'}</option>
                  <option value="app">{isRtl ? 'تطبيق الهاتف والبلوتوث' : 'App & Bluetooth'}</option>
                  <option value="warranty">{isRtl ? 'الضمان وخدمة ما بعد البيع' : 'Warranty & Support'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-odora-dark/70">{isRtl ? 'السؤال (بالعربية)' : 'Question (Arabic)'}</label>
                <input
                  type="text"
                  required
                  value={faqForm.question_ar}
                  onChange={(e) => setFaqForm({ ...faqForm, question_ar: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-odora-dark/15 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-odora-dark/70">{isRtl ? 'الإجابة (بالعربية)' : 'Answer (Arabic)'}</label>
                <textarea
                  required
                  rows={3}
                  value={faqForm.answer_ar}
                  onChange={(e) => setFaqForm({ ...faqForm, answer_ar: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-odora-dark/15 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFaqModal(false)}
                  className="px-4 py-2 border border-odora-dark/15 rounded-xl text-xs font-semibold hover:bg-odora-canvas transition"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-odora-olive text-white rounded-xl text-xs font-semibold hover:bg-odora-olive/90 transition"
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
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-odora-dark/10 pb-3">
              <h3 className="font-bold text-odora-dark">
                {isRtl ? 'إنشاء كود خصم جديد' : 'New Promo Coupon'}
              </h3>
              <button onClick={() => setShowCouponModal(false)} className="text-odora-dark/50 hover:text-odora-dark">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveCoupon} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold mb-1 text-odora-dark/70">{isRtl ? 'رمز الكود (بالإنجليزية)' : 'Coupon Code'}</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. VIP20"
                  className="w-full px-3 py-2 rounded-xl border border-odora-dark/15 font-mono text-sm uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-odora-dark/70">{isRtl ? 'نوع الخصم' : 'Discount Type'}</label>
                  <select
                    value={couponForm.discount_type}
                    onChange={(e) => setCouponForm({ ...couponForm, discount_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-odora-dark/15 text-xs bg-white"
                  >
                    <option value="percent">{isRtl ? 'نسبة مئوية (%)' : 'Percentage (%)'}</option>
                    <option value="fixed">{isRtl ? 'مبلغ ثابت (د.ل)' : 'Fixed Amount (LYD)'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-odora-dark/70">{isRtl ? 'القيمة' : 'Value'}</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={couponForm.value}
                    onChange={(e) => setCouponForm({ ...couponForm, value: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-odora-dark/15 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 border border-odora-dark/15 rounded-xl text-xs font-semibold hover:bg-odora-canvas transition"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-odora-olive text-white rounded-xl text-xs font-semibold hover:bg-odora-olive/90 transition"
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
}
