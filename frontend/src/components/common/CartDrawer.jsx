import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useLanguageStore } from '../../store/useLanguageStore';

export const CartDrawer = () => {
  const navigate = useNavigate();
  const { cart, isCartOpen, closeCart, updateQuantity, removeItem } = useCartStore();
  const { dir } = useLanguageStore();

  if (!isCartOpen) return null;

  const subtotalNum = parseFloat(cart.subtotal || 0);
  const freeThreshold = 300;
  const progressPercent = Math.min(100, (subtotalNum / freeThreshold) * 100);
  const remaining = Math.max(0, freeThreshold - subtotalNum);

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className={`fixed inset-y-0 ${dir === 'rtl' ? 'right-0' : 'left-0'} max-w-full flex z-50`}>
        <div className="w-screen sm:w-96 max-w-full bg-white shadow-2xl flex flex-col justify-between h-full">
          
          {/* Header */}
          <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-brand-cream/40">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-brand-sage" />
              <h2 className="text-lg font-bold text-brand-ink">سلة المشتريات</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                {cart.total_items}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3.5 bg-[#FAF7F2] border-b border-stone-200/60">
            {remaining > 0 ? (
              <p className="text-xs text-brand-ink mb-2">
                أضف منتجات بقيمة <span className="font-bold text-brand-olive">{remaining.toFixed(2)} د.ل</span> للحصول على <span className="font-bold text-brand-sage">توصيل مجاني</span> 🚚
              </p>
            ) : (
              <p className="text-xs font-semibold text-brand-olive mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-sage" />
                مبارك! لقد حصلت على توصيل مجاني لكافة المدن 🎁
              </p>
            )}
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-sage transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.items && cart.items.length > 0 ? (
              cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 rounded-2xl border border-stone-100 bg-white hover:border-stone-200 transition-colors shadow-sm"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-brand-cream/60 flex items-center justify-center shrink-0 overflow-hidden border border-stone-100">
                    <img
                      src={item.product?.main_image || '/brand_photo_4.png'}
                      alt={item.product?.name_ar}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/brand_photo_4.png'; }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm text-brand-ink line-clamp-1">
                          {item.product?.name_ar || item.product?.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.colorway && (
                        <p className="text-xs text-brand-muted mt-0.5">
                          اللون: {item.colorway.name_ar}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-brand-olive mt-1">
                        {item.unit_price} د.ل
                      </p>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-stone-200 rounded-full overflow-hidden bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-brand-ink">
                        {item.line_total} د.ل
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center text-brand-muted">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-brand-ink">السلة فارغة حالياً</h3>
                  <p className="text-xs text-brand-muted mt-1 max-w-xs">
                    استكشف أجهزة التعطير الذكية ومجموعات الزيوت العطرية النقية وأضفها إلى سلتك.
                  </p>
                </div>
                <button
                  onClick={() => { closeCart(); navigate('/products'); }}
                  className="px-6 py-2.5 rounded-full bg-brand-sage text-white text-xs font-semibold hover:bg-brand-olive transition-colors shadow-sm"
                >
                  تصفح المنتجات الآن
                </button>
              </div>
            )}
          </div>

          {/* Footer & Checkout CTA */}
          {cart.items && cart.items.length > 0 && (
            <div className="p-6 border-t border-stone-200/80 bg-stone-50/70 space-y-3">
              <div className="flex justify-between text-xs text-brand-muted">
                <span>المجموع الفرعي</span>
                <span>{cart.subtotal} د.ل</span>
              </div>
              <div className="flex justify-between text-xs text-brand-muted">
                <span>رسوم التوصيل والشحن</span>
                <span>
                  {parseFloat(cart.delivery_fee) === 0 ? (
                    <span className="text-emerald-700 font-semibold">مجاناً</span>
                  ) : (
                    `${cart.delivery_fee} د.ل`
                  )}
                </span>
              </div>
              <div className="border-t border-stone-200 pt-3 flex justify-between items-baseline font-bold text-base text-brand-ink">
                <span>الإجمالي النهائي</span>
                <span className="text-xl text-brand-olive font-poppins">{cart.total_price} د.ل</span>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full mt-4 py-3.5 px-6 rounded-full bg-brand-dark text-white font-semibold text-sm hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-btn-dark active:scale-[0.99]"
              >
                <span>متابعة إتمام الطلب</span>
                {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
