import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Banknote, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const language = ((i18n.language || 'ar').split('-')[0]) as 'ar' | 'en';
  const isRtl = language === 'ar';
  const { cart, fetchCart } = useCartStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    customer_name: user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : '',
    customer_email: user?.email || '',
    customer_phone: user?.phone_number || '',
    shipping_city: 'طرابلس',
    shipping_district: '',
    shipping_address: '',
    shipping_notes: '',
    payment_method: 'cod',
    coupon_code: (location.state as any)?.couponCode || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = parseFloat(cart.subtotal || '0');
  const deliveryFee = parseFloat(cart.delivery_fee || '0');

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.customer_name || !formData.customer_phone || !formData.shipping_address) {
      setError(language === 'ar' ? 'يرجى تعبئة كافة حقول التوصيل الإلزامية' : 'Please fill all required delivery fields');
      return;
    }

    setLoading(true);
    try {
      const res = await api.checkout(formData);
      const order = res.data;
      fetchCart();
      navigate(`/order-confirmation/${order.order_number}`, { state: { order } });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || (language === 'ar' ? 'حدث خطأ أثناء تنفيذ الطلب، يرجى المحاولة ثانية' : 'Error placing order, please try again'));
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-brand-cream">
        <h2 className="text-xl font-bold text-brand-ink">
          {language === 'ar' ? 'لا توجد منتجات في السلة لإتمام الشراء' : 'Your cart is empty'}
        </h2>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 px-6 py-2 rounded-full bg-brand-sage text-white text-xs font-bold shadow-xs hover:bg-brand-olive"
        >
          {t('cart.startShopping', 'تصفح المتجر')}
        </button>
      </div>
    );
  }

  return (
    <div className="editorial-container min-h-screen pb-24 pt-12 sm:pb-32 sm:pt-16 bg-brand-canvas">
      <div className="border-b border-brand-ink/10 pb-8 mb-12">
        <h1 className="text-4xl sm:text-6xl tracking-[-0.04em] font-light text-brand-ink">{t('checkout.title', 'إتمام الطلب')}</h1>
        <p className="text-sm text-brand-muted mt-3">
          {language === 'ar' ? 'يرجى إدخال بيانات التوصيل بدقة لتأكيد إرسال الشحنة' : 'Please enter accurate delivery details to ensure prompt fulfillment'}
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Customer & Address Form */}
        <div className="lg:col-span-8 space-y-6">
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Contact Details */}
          <div className="editorial-surface p-6 sm:p-8 space-y-5">
            <h3 className="font-medium text-lg text-brand-ink border-b border-brand-ink/10 pb-4 flex items-center gap-2">
              <span>{language === 'ar' ? '1. بيانات الاتصال والتواصل' : '1. Contact Details'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-ink mb-1">
                  {t('checkout.fullName', 'الاسم الكامل')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'ar' ? 'محمد أحمد...' : 'Full Name...'}
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage bg-white text-brand-ink"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-ink mb-1">
                  {t('checkout.phone', 'رقم الهاتف (للتوصيل)')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="091XXXXXXX / 092XXXXXXX"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage font-sans bg-white text-brand-ink"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-ink mb-1">
                {t('checkout.email', 'البريد الإلكتروني (اختياري)')}
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage bg-white text-brand-ink"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="editorial-surface p-6 sm:p-8 space-y-5">
            <h3 className="font-medium text-lg text-brand-ink border-b border-brand-ink/10 pb-4 flex items-center gap-2">
              <span>{language === 'ar' ? '2. عنوان التوصيل داخل ليبيا' : '2. Shipping Address in Libya'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-ink mb-1">
                  {t('checkout.city', 'المدينة')} <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.shipping_city}
                  onChange={(e) => setFormData({ ...formData, shipping_city: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage bg-white text-brand-ink font-semibold"
                >
                  <option value="طرابلس">طرابلس (Tripoli)</option>
                  <option value="مصراتة">مصراتة (Misrata)</option>
                  <option value="بنغازي">بنغازي (Benghazi)</option>
                  <option value="الزاوية">الزاوية (Zawiya)</option>
                  <option value="زليتن">زليتن (Zliten)</option>
                  <option value="الخمس">الخمس (Khoms)</option>
                  <option value="البيضاء">البيضاء (Bayda)</option>
                  <option value="طبرق">طبرق (Tobruk)</option>
                  <option value="سبها">سبها (Sabha)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-ink mb-1">
                  {t('checkout.district', 'المنطقة / الحي')}
                </label>
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'مثال: حي الأندلس / بن عاشور / سيدي المصري' : 'District or area...'}
                  value={formData.shipping_district}
                  onChange={(e) => setFormData({ ...formData, shipping_district: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage bg-white text-brand-ink"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-ink mb-1">
                {t('checkout.address', 'العنوان التفصيلي (الشارع، أقرب نقطة دالة)')} <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                placeholder={language === 'ar' ? 'الشارع، رقم العمارة أو الفيلا، أو بجوار معلم معروف...' : 'Street name, villa/apartment, landmark...'}
                value={formData.shipping_address}
                onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage bg-white text-brand-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-ink mb-1">
                {t('checkout.notes', 'ملاحظات إضافية للتوصيل')}
              </label>
              <input
                type="text"
                placeholder={language === 'ar' ? 'مثال: الاتصال قبل الوصول بنصف ساعة...' : 'e.g. Call 30 minutes before arrival...'}
                value={formData.shipping_notes}
                onChange={(e) => setFormData({ ...formData, shipping_notes: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage bg-white text-brand-ink"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="editorial-surface p-6 sm:p-8 space-y-5">
            <h3 className="font-medium text-lg text-brand-ink border-b border-brand-ink/10 pb-4 flex items-center gap-2">
              <span>{language === 'ar' ? '3. طريقة الدفع' : '3. Payment Method'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-5 rounded-[20px] border flex items-center gap-4 cursor-pointer transition-all ${
                  formData.payment_method === 'cod'
                    ? 'border-brand-olive bg-brand-pale/30 text-brand-ink'
                    : 'border-brand-ink/10 hover:border-brand-ink/25 bg-brand-surface'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="cod"
                  checked={formData.payment_method === 'cod'}
                  onChange={() => setFormData({ ...formData, payment_method: 'cod' })}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-brand-sage shadow-2xs">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-sm text-brand-ink">{t('common.cod', 'الدفع عند الاستلام (COD)')}</div>
                  <div className="text-[11px] text-brand-muted font-medium mt-0.5">{t('checkout.codDesc', 'ادفع نقداً عند استلام ومعاينة طلبك في منزلك أو مقرك.')}</div>
                </div>
              </label>

              <label
                className={`p-5 rounded-[20px] border flex items-center gap-4 cursor-pointer transition-all ${
                  formData.payment_method === 'card'
                    ? 'border-brand-olive bg-brand-pale/30 text-brand-ink'
                    : 'border-brand-ink/10 hover:border-brand-ink/25 bg-brand-surface'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="card"
                  checked={formData.payment_method === 'card'}
                  onChange={() => setFormData({ ...formData, payment_method: 'card' })}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-brand-sage shadow-2xs">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium text-sm text-brand-ink">{t('common.visaMastercard', 'البطاقات المصرفية')}</div>
                  <div className="text-[11px] text-brand-muted font-medium mt-0.5">{language === 'ar' ? 'سداد / تداول / الدفع الإلكتروني الآمن' : 'Local cards / Sadad / Electronic pay'}</div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 editorial-surface p-6 sm:p-8 space-y-5 lg:sticky lg:top-32">
          <h3 className="font-medium text-lg text-brand-ink border-b border-brand-ink/10 pb-4">
            {t('checkout.orderSummary', 'ملخص الفاتورة')} ({cart.total_items} {t('common.unit', 'قطعة')})
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pe-1">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-[10px]">
                    {item.quantity}×
                  </span>
                  <div>
                    <span className="font-bold text-brand-ink line-clamp-1">
                      {language === 'en' ? item.product?.name || item.product?.name_ar : item.product?.name_ar}
                    </span>
                    {item.colorway && <span className="text-[10px] text-brand-muted font-medium block">{language === 'en' ? item.colorway.name : item.colorway.name_ar}</span>}
                  </div>
                </div>
                <span className="font-bold text-brand-sage font-sans">{item.line_total} {t('common.currency', 'د.ل')}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-200 pt-3 space-y-2 text-xs">
            <div className="flex justify-between text-brand-muted font-medium">
              <span>{t('cart.subtotal', 'المجموع الفرعي')}</span>
              <span className="font-sans font-bold text-brand-ink">{subtotal.toFixed(2)} {t('common.currency', 'د.ل')}</span>
            </div>
            <div className="flex justify-between text-brand-muted font-medium">
              <span>{t('cart.delivery', 'الشحن والتوصيل')}</span>
              <span>
                {deliveryFee === 0 ? (
                  <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-xs">
                    {language === 'ar' ? 'توصيل مجاني' : 'Free Delivery'}
                  </span>
                ) : (
                  `${deliveryFee.toFixed(2)} ${t('common.currency', 'د.ل')}`
                )}
              </span>
            </div>
            <div className="pt-4 border-t border-brand-ink/10 flex justify-between items-baseline font-medium text-base text-brand-ink">
              <span>{t('cart.total', 'المجموع الكلي')}</span>
              <span className="text-2xl text-brand-olive font-sans tabular-nums">{cart.total} {t('common.currency', 'د.ل')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="editorial-button-primary w-full mt-4 gap-2"
          >
            <span>{loading ? t('checkout.processing', 'جاري تسجيل الطلب...') : t('checkout.placeOrder', 'تأكيد الطلب الآن')}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CheckoutPage;
