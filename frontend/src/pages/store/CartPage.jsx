import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Tag, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import api from '../../services/api';

export const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeItem, clearCart } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = parseFloat(cart.subtotal || 0);
  const deliveryFee = parseFloat(cart.delivery_fee || 0);
  const finalTotal = Math.max(0, subtotal + deliveryFee - couponDiscount);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError('');
    setCouponMessage('');

    try {
      const res = await api.validateCoupon(couponCode.trim(), subtotal);
      if (res.data.valid) {
        setCouponDiscount(parseFloat(res.data.discount_amount));
        setCouponMessage(res.data.message);
      }
    } catch (err) {
      setCouponError(err.response?.data?.message || 'كوبون الخصم غير صحيح');
      setCouponDiscount(0);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 rounded-full bg-brand-cream flex items-center justify-center text-brand-muted mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-brand-ink">سلة المشتريات فارغة</h2>
        <p className="text-sm text-brand-muted mt-2 max-w-sm">
          لم تقم بإضافة أي أجهزة أو زيوت عطرية إلى سلتك بعد.
        </p>
        <Link
          to="/products"
          className="mt-6 px-8 py-3 rounded-full bg-brand-sage hover:bg-brand-olive text-white font-semibold text-sm transition-colors shadow-sm"
        >
          تصفح المتجر والمنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="border-b border-stone-200/80 pb-4 mb-8 flex items-baseline justify-between">
        <h1 className="text-3xl font-light text-brand-ink">سلة المشتريات</h1>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:underline"
        >
          إفراغ السلة
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="odora-card p-4 sm:p-6 bg-white border border-stone-200/70 flex flex-col sm:flex-row items-center gap-6 justify-between"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-20 h-20 rounded-xl bg-brand-cream/60 flex items-center justify-center shrink-0 border border-stone-100 overflow-hidden">
                  <img
                    src={item.product?.main_image || '/brand_photo_4.png'}
                    alt={item.product?.name_ar}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/brand_photo_4.png'; }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-brand-ink">
                    {item.product?.name_ar || item.product?.name}
                  </h3>
                  {item.colorway && (
                    <p className="text-xs text-brand-muted mt-0.5">اللون: {item.colorway.name_ar}</p>
                  )}
                  <p className="text-xs font-semibold text-brand-olive mt-1">
                    {item.unit_price} د.ل للقطعة
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-stone-100">
                <div className="flex items-center border border-stone-200 rounded-full overflow-hidden bg-stone-50">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 text-stone-600 hover:bg-stone-200"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-brand-ink font-poppins">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 text-stone-600 hover:bg-stone-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-left">
                  <span className="text-base font-bold text-brand-ink font-poppins">
                    {item.line_total} د.ل
                  </span>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-stone-400 hover:text-red-600 p-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-4 odora-card p-6 bg-white border border-stone-200/80 space-y-5">
          <h2 className="text-lg font-bold text-brand-ink border-b border-stone-100 pb-3">
            ملخص الطلب
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-brand-muted">
              <span>المجموع الفرعي</span>
              <span className="font-poppins text-brand-ink font-semibold">{subtotal.toFixed(2)} د.ل</span>
            </div>

            <div className="flex justify-between text-brand-muted">
              <span>رسوم الشحن والتوصيل</span>
              <span>
                {deliveryFee === 0 ? (
                  <span className="text-emerald-700 font-semibold">مجاناً (فوق 300 د.ل)</span>
                ) : (
                  `${deliveryFee.toFixed(2)} د.ل`
                )}
              </span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>خصم الكوبون ({couponCode.toUpperCase()})</span>
                <span>-{couponDiscount.toFixed(2)} د.ل</span>
              </div>
            )}

            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-base font-bold text-brand-ink">
              <span>المجموع الكلي</span>
              <span className="text-2xl text-brand-olive font-poppins">{finalTotal.toFixed(2)} د.ل</span>
            </div>
          </div>

          {/* Coupon Input */}
          <form onSubmit={handleApplyCoupon} className="pt-2">
            <label className="block text-xs font-semibold text-brand-muted mb-1.5">
              هل لديك كوبون خصم؟
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="كود الخصم (مثل ODORA10)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-stone-200 rounded-xl uppercase focus:outline-none focus:border-brand-sage"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-brand-ink text-xs font-bold rounded-xl transition-colors shrink-0"
              >
                تطبيق
              </button>
            </div>
            {couponMessage && (
              <p className="text-xs text-emerald-700 mt-1.5 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{couponMessage}</span>
              </p>
            )}
            {couponError && (
              <p className="text-xs text-red-600 mt-1.5">{couponError}</p>
            )}
          </form>

          {/* Checkout Button */}
          <button
            onClick={() => navigate('/checkout', { state: { couponCode: couponDiscount > 0 ? couponCode : '' } })}
            className="w-full py-4 rounded-full bg-brand-dark hover:bg-stone-800 text-white font-semibold text-sm transition-all shadow-btn-dark flex items-center justify-center gap-2"
          >
            <span>متابعة الشراء (Checkout)</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
