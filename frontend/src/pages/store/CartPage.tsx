import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '../../store/useCartStore';
import api from '../../services/api';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const language = ((i18n.language || 'ar').split('-')[0]) as 'ar' | 'en';
  const isRtl = language === 'ar';
  const { cart, updateQuantity, removeItem, clearCart } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = parseFloat(cart.subtotal || '0');
  const deliveryFee = parseFloat(cart.delivery_fee || '0');
  const finalTotal = Math.max(0, subtotal + deliveryFee - couponDiscount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
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
    } catch (err: any) {
      setCouponError(err.response?.data?.message || (language === 'ar' ? 'كوبون الخصم غير صحيح' : 'Invalid coupon code'));
      setCouponDiscount(0);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-brand-canvas">
        <ShoppingBag className="w-10 h-10 text-brand-sage mb-7" />
        <h2 className="text-3xl font-light text-brand-ink">{t('cart.emptyTitle', 'سلتك فارغة حالياً')}</h2>
        <p className="text-sm text-brand-muted mt-3 max-w-sm leading-7">
          {t('cart.emptyDesc', 'لم تقم بإضافة أي أجهزة أو زيوت عطرية إلى سلتك بعد.')}
        </p>
        <Link
          to="/products"
          className="editorial-button-primary mt-8"
        >
          {t('cart.startShopping', 'تصفح المتجر والمنتجات')}
        </Link>
      </div>
    );
  }

  return (
    <div className="editorial-container min-h-screen pb-24 pt-12 sm:pb-32 sm:pt-16 bg-brand-canvas">
      <div className="border-b border-brand-ink/10 pb-8 mb-12 flex items-baseline justify-between">
        <h1 className="text-4xl sm:text-6xl tracking-[-0.04em] font-light text-brand-ink">{t('cart.title', 'سلة المشتريات')}</h1>
        <button
          onClick={clearCart}
          className="text-xs text-brand-muted hover:text-red-700 hover:underline underline-offset-4"
        >
          {t('cart.clearCart', 'إفراغ السلة')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Items List */}
        <div className="lg:col-span-8 divide-y divide-brand-ink/10 border-y border-brand-ink/10">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="py-6 sm:py-8 flex flex-col sm:flex-row items-center gap-6 justify-between"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-24 h-28 rounded-[18px] bg-brand-surface flex items-center justify-center shrink-0 overflow-hidden shadow-soft-card">
                  <img
                    src={item.product?.main_image || '/products/diffuser-a316-sage.png'}
                    alt={item.product?.name_ar}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/products/diffuser-a316-sage.png'; }}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-base text-brand-ink">
                    {language === 'en'
                      ? item.product?.name || item.product?.name_ar
                      : item.product?.name_ar || item.product?.name}
                  </h3>
                  {item.colorway && (
                    <p className="text-xs text-brand-muted mt-1">
                      {language === 'ar' ? `اللون: ${item.colorway.name_ar}` : `Color: ${item.colorway.name}`}
                    </p>
                  )}
                  <p className="text-xs font-medium text-brand-olive mt-2 tabular-nums">
                    {item.unit_price} {t('common.currency', 'د.ل')}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-brand-ink/10">
                <div className="flex items-center border border-brand-ink/15 rounded-full overflow-hidden bg-brand-surface">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 text-stone-600 hover:bg-stone-100 transition-colors"
                    aria-label="Decrease"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-medium text-brand-ink font-sans tabular-nums">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 text-stone-600 hover:bg-stone-100 transition-colors"
                    aria-label="Increase"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-start min-w-[70px]">
                  <span className="text-base font-medium text-brand-ink font-sans tabular-nums">
                    {item.line_total} {t('common.currency', 'د.ل')}
                  </span>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-stone-500 hover:text-red-600 p-1.5 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Card */}
        <aside className="lg:col-span-4 editorial-surface p-6 sm:p-8 space-y-6 lg:sticky lg:top-32">
          <h2 className="text-xl font-medium text-brand-ink border-b border-brand-ink/10 pb-5">
            {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-brand-muted">
              <span>{t('cart.subtotal', 'المجموع الفرعي')}</span>
              <span className="font-sans text-brand-ink font-medium tabular-nums">{subtotal.toFixed(2)} {t('common.currency', 'د.ل')}</span>
            </div>

            <div className="flex justify-between text-brand-muted font-medium">
              <span>{t('cart.delivery', 'رسوم الشحن والتوصيل')}</span>
              <span>
                {deliveryFee === 0 ? (
                  <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-xs">
                    {language === 'ar' ? 'مجاناً (فوق 300 د.ل)' : 'Free (>300 LYD)'}
                  </span>
                ) : (
                  `${deliveryFee.toFixed(2)} ${t('common.currency', 'د.ل')}`
                )}
              </span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>{t('cart.couponDiscount', 'خصم الكوبون')} ({couponCode.toUpperCase()})</span>
                <span>-{couponDiscount.toFixed(2)} {t('common.currency', 'د.ل')}</span>
              </div>
            )}

            <div className="pt-4 border-t border-brand-ink/10 flex justify-between items-baseline text-base font-medium text-brand-ink">
              <span>{t('cart.total', 'المجموع الكلي')}</span>
              <span className="text-2xl text-brand-olive font-sans tabular-nums">{finalTotal.toFixed(2)} {t('common.currency', 'د.ل')}</span>
            </div>
          </div>

          {/* Coupon Input */}
          <form onSubmit={handleApplyCoupon} className="pt-2">
            <label className="block text-xs font-medium text-brand-ink mb-2">
              {t('cart.couponLabel', 'هل لديك كوبون خصم؟')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('cart.couponPlaceholder', 'كود الخصم (مثل ODORA10)')}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="editorial-input flex-1 py-2.5 text-xs uppercase font-sans"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-full border border-brand-ink/15 text-brand-ink text-xs font-medium transition-colors shrink-0 hover:bg-brand-canvas"
              >
                {t('cart.applyCoupon', 'تطبيق')}
              </button>
            </div>
            {couponMessage && (
              <p className="text-xs text-emerald-700 mt-1.5 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{couponMessage}</span>
              </p>
            )}
            {couponError && (
              <p className="text-xs text-red-600 mt-1.5 font-medium">{couponError}</p>
            )}
          </form>

          {/* Checkout Button */}
          <button
            onClick={() => navigate('/checkout', { state: { couponCode: couponDiscount > 0 ? couponCode : '' } })}
            className="editorial-button-primary w-full gap-2"
          >
            <span>{t('cart.checkout', 'إتمام الطلب')}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </aside>

      </div>
    </div>
  );
};

export default CartPage;
