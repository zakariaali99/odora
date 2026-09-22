import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Star } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const { addItem } = useCartStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultColor = product.colorways?.find((c) => c.is_default) || product.colorways?.[0];
    addItem(product.id, defaultColor?.id, 1);
  };

  // Clean packshot fallbacks by product type
  const getDefaultImage = () => {
    if (product.product_type === 'oil') return '/products/oil-forest-sage.png';
    if (product.product_type === 'bundle') return '/products/bundle-signature.png';
    return '/products/diffuser-a316-sage.png';
  };

  const displayImage = product.main_image || getDefaultImage();

  return (
    <article className="group relative flex h-full flex-col justify-between">
      {/* Product Image Stage */}
      <Link to={`/products/${product.slug}`} className="block relative mb-5">
        <div className="h-72 sm:h-80 w-full rounded-[24px] bg-brand-surface flex items-center justify-center overflow-hidden relative shadow-soft-card">
          
          {/* Discount Badge */}
          {product.has_discount && (
            <span className="absolute top-4 end-4 z-10 px-3 py-1.5 rounded-full text-[10px] font-medium tracking-wide bg-brand-pale text-brand-olive">
              {isRtl ? 'عرض خاص' : 'Special Offer'}
            </span>
          )}

          {/* Product Image */}
          <img
            src={displayImage}
            alt={isRtl ? product.name_ar : product.name}
            className="h-56 sm:h-64 w-auto max-w-[82%] object-contain drop-shadow-[0_18px_24px_rgba(43,43,38,0.10)] transition-transform duration-500 ease-out group-hover:scale-[1.025]"
            onError={(e: any) => { e.target.src = getDefaultImage(); }}
          />
        </div>
      </Link>

      {/* Info Section */}
      <div className="px-1">
        <div className="flex items-center justify-between gap-2 text-[11px] text-brand-muted mb-2">
          <span className="truncate">
            {isRtl ? (product.category?.name_ar || 'أجهزة التعطير') : (product.category?.name || 'Smart Diffusers')}
          </span>
          <div className="flex items-center gap-1 text-brand-olive font-medium shrink-0">
            <Star className="w-3 h-3 fill-brand-sage text-brand-sage" />
            <span className="font-poppins">{product.rating || '5.0'}</span>
          </div>
        </div>

        <Link to={`/products/${product.slug}`}>
          <h3 className="font-medium text-lg text-brand-ink group-hover:text-brand-olive transition-colors line-clamp-1">
            {isRtl ? product.name_ar : product.name}
          </h3>
        </Link>

        {(product.subtitle_ar || product.description) && (
          <p className="text-xs text-brand-muted line-clamp-1 mt-1 leading-relaxed">
            {isRtl ? (product.subtitle_ar || product.description_ar) : (product.description || product.subtitle_ar)}
          </p>
        )}

        {/* Colorway preview swatches */}
        {product.colorways && product.colorways.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5">
            {product.colorways.map((c) => (
              <span
                key={c.id || c.name}
                className="w-3.5 h-3.5 rounded-full border border-white shadow-xs ring-1 ring-stone-200"
                style={{ backgroundColor: c.hex_code }}
                title={isRtl ? c.name_ar : c.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Price & Action Row */}
      <div className="mt-5 px-1 flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-medium text-brand-ink font-poppins tabular-nums">
            {product.final_price || product.price}
          </span>
          <span className="text-xs text-brand-muted font-medium">{t('common.currency')}</span>
          {product.has_discount && (
            <span className="text-xs text-stone-500 line-through ms-1 font-poppins">
              {product.price}
            </span>
          )}
        </div>

        <button
          onClick={handleQuickAdd}
          className="w-10 h-10 rounded-full bg-brand-dark hover:bg-brand-olive text-brand-surface flex items-center justify-center transition-all shadow-btn-dark active:scale-95"
          title={t('common.addToCart')}
          aria-label={t('common.addToCart')}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
