import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { cart, isCartOpen, closeCart, updateQuantity, removeItem } = useCartStore();

  if (!isCartOpen) return null;

  const subtotalNum = parseFloat(cart.subtotal || '0');
  const freeThreshold = 300;
  const progressPercent = Math.min(100, (subtotalNum / freeThreshold) * 100);
  const remaining = Math.max(0, freeThreshold - subtotalNum);

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  const getItemImage = (item: any) => {
    if (item.product?.main_image) return item.product.main_image;
    if (item.product?.product_type === 'oil') return '/products/oil-forest-sage.png';
    if (item.product?.product_type === 'bundle') return '/products/bundle-signature.png';
    return '/products/diffuser-a316-sage.png';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className={`fixed inset-y-0 ${isRtl ? 'right-0' : 'left-0'} max-w-full flex z-50`}>
        <div className="w-screen sm:w-96 max-w-full bg-white shadow-2xl flex flex-col justify-between h-full">
          
          {/* Header */}
          <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-brand-sage" />
              <h2 className="text-lg font-bold text-brand-ink">{t('cart.title')}</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                {cart.total_items}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              aria-label={t('common.close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3.5 bg-stone-50 border-b border-stone-200/60">
            {remaining > 0 ? (
              <p className="text-xs text-brand-ink mb-2">
                {t('cart.freeDeliveryProgress', { amount: remaining.toFixed(2) })}
              </p>
            ) : (
              <p className="text-xs font-semibold text-brand-olive mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-sage" />
                <span>{t('cart.unlockedFreeDelivery')}</span>
              </p>
            )}
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-sage transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.items && cart.items.length > 0 ? (
              cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-100 items-center justify-between"
                >
                  <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shrink-0 border border-stone-100 overflow-hidden">
                    <img
                      src={getItemImage(item)}
                      alt={isRtl ? item.product?.name_ar : item.product?.name}
                      className="w-full h-full object-contain p-1"
                      onError={(e: any) => { e.target.src = getItemImage(item); }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-brand-ink truncate">
                      {isRtl ? item.product?.name_ar : item.product?.name}
                    </h4>
                    {item.colorway && (
                      <p className="text-xs text-brand-muted mt-0.5">
                        {isRtl ? item.colorway.name_ar : item.colorway.name}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-bold text-brand-olive font-poppins">
                        {item.unit_price} {t('common.currency')}
                      </span>

                      {/* Stepper */}
                      <div className="flex items-center border border-stone-200 rounded-full bg-white overflow-hidden shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-stone-100 text-stone-600"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-brand-ink font-poppins">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-stone-100 text-stone-600"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-stone-500 hover:text-red-600 transition-colors"
                    aria-label={t('common.delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-brand-ink">{t('cart.emptyTitle')}</h3>
                <p className="text-xs text-brand-muted mt-1 max-w-[200px]">
                  {t('cart.emptyDesc')}
                </p>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.items && cart.items.length > 0 && (
            <div className="p-6 border-t border-stone-100 bg-white space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-brand-muted">{t('cart.subtotal')}</span>
                <span className="text-xl font-bold text-brand-ink font-poppins">
                  {cart.subtotal} {t('common.currency')}
                </span>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-4 rounded-full bg-brand-dark hover:bg-stone-800 text-white font-semibold text-sm transition-all shadow-btn-dark active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>{t('cart.checkout')}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
