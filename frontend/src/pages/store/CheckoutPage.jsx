import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Banknote, AlertCircle, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, fetchCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [formData, setFormData] = useState({
    customer_name: user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : '',
    customer_email: user?.email || '',
    customer_phone: user?.phone_number || '',
    shipping_city: 'طرابلس',
    shipping_district: '',
    shipping_address: '',
    shipping_notes: '',
    payment_method: 'cod',
    coupon_code: location.state?.couponCode || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = parseFloat(cart.subtotal || 0);
  const deliveryFee = parseFloat(cart.delivery_fee || 0);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.customer_name || !formData.customer_phone || !formData.shipping_address) {
      setError('يرجى تعبئة كافة حقول التوصيل الإلزامية');
      return;
    }

    setLoading(true);
    try {
      const res = await api.checkout(formData);
      const order = res.data;
      // Refresh cart to empty state
      fetchCart();
      navigate(`/order-confirmation/${order.order_number}`, { state: { order } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'حدث خطأ أثناء تنفيذ الطلب، يرجى المحاولة ثانية');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-xl font-bold">لا توجد منتجات في السلة لإتمام الشراء</h2>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2 rounded-full bg-brand-sage text-white text-xs font-semibold"
        >
          تصفح المتجر
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="border-b border-stone-200/80 pb-4 mb-8">
        <h1 className="text-3xl font-light text-brand-ink">إتمام عملية الشراء</h1>
        <p className="text-xs text-brand-muted mt-1">يرجى إدخال بيانات التوصيل بدقة لتأكيد إرسال الشحنة</p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Customer & Address Form */}
        <div className="lg:col-span-8 space-y-6">
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Contact Details */}
          <div className="odora-card p-6 bg-white border border-stone-200/80 space-y-4">
            <h3 className="font-bold text-base text-brand-ink border-b border-stone-100 pb-3 flex items-center gap-2">
              <span>1. بيانات الاتصال والتواصل</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-ink mb-1">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="محمد أحمد..."
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-ink mb-1">
                  رقم هاتف المستلم <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="091XXXXXXX أو 092XXXXXXX"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage font-poppins"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-ink mb-1">
                البريد الإلكتروني (لتصلك الفاتورة وتفاصيل التتبع)
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.customer_email}
                onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="odora-card p-6 bg-white border border-stone-200/80 space-y-4">
            <h3 className="font-bold text-base text-brand-ink border-b border-stone-100 pb-3 flex items-center gap-2">
              <span>2. عنوان التوصيل داخل ليبيا</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-ink mb-1">
                  المدينة <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.shipping_city}
                  onChange={(e) => setFormData({ ...formData, shipping_city: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage bg-white"
                >
                  <option value="طرابلس">طرابلس (Tripoli)</option>
                  <option value="مصراتة">مصراتة (Misrata)</option>
                  <option value="بنغازي">بنغازي (Benghazi)</option>
                  <option value="الزاوية">الزاوية</option>
                  <option value="زليتن">زليتن</option>
                  <option value="الخمس">الخمس</option>
                  <option value="البيضاء">البيضاء</option>
                  <option value="طبرق">طبرق</option>
                  <option value="سبها">سبها</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-ink mb-1">
                  المنطقة أو الحي
                </label>
                <input
                  type="text"
                  placeholder="مثال: حي الأندلس / بن عاشور / سوق الجمعة"
                  value={formData.shipping_district}
                  onChange={(e) => setFormData({ ...formData, shipping_district: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-ink mb-1">
                العنوان بالتفصيل وأقرب نقطة دالة <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                placeholder="الشارع، رقم العمارة أو الفيلا، أو بجوار معلم معروف..."
                value={formData.shipping_address}
                onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-ink mb-1">
                ملاحظات لمندوب التوصيل (اختياري)
              </label>
              <input
                type="text"
                placeholder="مثال: الاتصال قبل الوصول بنصف ساعة..."
                value={formData.shipping_notes}
                onChange={(e) => setFormData({ ...formData, shipping_notes: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="odora-card p-6 bg-white border border-stone-200/80 space-y-4">
            <h3 className="font-bold text-base text-brand-ink border-b border-stone-100 pb-3 flex items-center gap-2">
              <span>3. طريقة الدفع</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-2xl border-2 flex items-center gap-4 cursor-pointer transition-all ${
                  formData.payment_method === 'cod'
                    ? 'border-brand-sage bg-brand-pale/15 text-brand-olive'
                    : 'border-stone-200 hover:border-stone-300'
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
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-brand-olive">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">الدفع عند الاستلام (COD)</div>
                  <div className="text-[11px] text-brand-muted mt-0.5">ادفع نقداً لمندوب الشحن عند وصول طلبيتك</div>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border-2 flex items-center gap-4 cursor-pointer transition-all ${
                  formData.payment_method === 'card'
                    ? 'border-brand-sage bg-brand-pale/15 text-brand-olive'
                    : 'border-stone-200 hover:border-stone-300'
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
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-brand-olive">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">بطاقة مصرفية محلية (سداد / تداول)</div>
                  <div className="text-[11px] text-brand-muted mt-0.5">الدفع الآمن عبر الشبكة المصرفية الليبية</div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 odora-card p-6 bg-white border border-stone-200/80 space-y-4">
          <h3 className="font-bold text-base text-brand-ink border-b border-stone-100 pb-3">
            محتويات الشحنة ({cart.total_items} عنصر)
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center font-bold text-[10px]">
                    {item.quantity}×
                  </span>
                  <div>
                    <span className="font-semibold text-brand-ink line-clamp-1">{item.product?.name_ar}</span>
                    {item.colorway && <span className="text-[10px] text-brand-muted block">{item.colorway.name_ar}</span>}
                  </div>
                </div>
                <span className="font-bold text-brand-olive font-poppins">{item.line_total} د.ل</span>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-200 pt-3 space-y-2 text-xs">
            <div className="flex justify-between text-brand-muted">
              <span>المجموع الفرعي</span>
              <span className="font-poppins font-semibold text-brand-ink">{subtotal.toFixed(2)} د.ل</span>
            </div>
            <div className="flex justify-between text-brand-muted">
              <span>الشحن والتوصيل</span>
              <span>
                {deliveryFee === 0 ? (
                  <span className="text-emerald-700 font-semibold">توصيل مجاني</span>
                ) : (
                  `${deliveryFee.toFixed(2)} د.ل`
                )}
              </span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline font-bold text-base text-brand-ink">
              <span>الإجمالي المستحق</span>
              <span className="text-2xl text-brand-olive font-poppins">{cart.total_price} د.ل</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 rounded-full bg-brand-dark hover:bg-stone-800 text-white font-semibold text-sm transition-all shadow-btn-dark active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>{loading ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب والشحن الآن'}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
};

export default CheckoutPage;
