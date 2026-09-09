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
    <div className="odora-card p-5 flex flex-col justify-between group border border-stone-200/60 relative overflow-hidden bg-white">
      {/* Product Image Stage */}
      <Link to={`/products/${product.slug}`} className="block relative mb-4">
        <div className="h-56 w-full rounded-xl bg-gradient-to-b from-[#F7F6F3] to-[#EAE7DF]/60 flex items-center justify-center overflow-hidden relative">
          
          {/* Discount Badge */}
          {product.has_discount && (
            <span className="absolute top-3 end-3 z-10 px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-pale text-brand-olive shadow-sm">
              {isRtl ? 'عرض خاص' : 'Special Offer'}
            </span>
          )}

          {/* Product Image */}
          <img
            src={displayImage}
            alt={isRtl ? product.name_ar : product.name}
            className="h-44 w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-105"
            onError={(e: any) => { e.target.src = getDefaultImage(); }}
          />
        </div>
      </Link>

      {/* Info Section */}
      <div>
        <div className="flex items-center justify-between gap-2 text-xs text-brand-muted mb-1">
          <span className="truncate">
            {isRtl ? (product.category?.name_ar || 'أجهزة التعطير') : (product.category?.name || 'Smart Diffusers')}
          </span>
          <div className="flex items-center gap-1 text-amber-600 font-semibold shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="font-poppins">{product.rating || '5.0'}</span>
          </div>
        </div>

        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-base text-brand-ink group-hover:text-brand-sage transition-colors line-clamp-1">
            {isRtl ? product.name_ar : product.name}
          </h3>
        </Link>

        {(product.subtitle_ar || product.description) && (
          <p className="text-xs text-brand-muted line-clamp-1 mt-0.5">
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
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold text-brand-olive font-poppins">
            {product.final_price || product.price}
          </span>
          <span className="text-xs text-brand-muted font-medium">{t('common.currency')}</span>
          {product.has_discount && (
            <span className="text-xs text-stone-400 line-through ms-1 font-poppins">
              {product.price}
            </span>
          )}
        </div>

        <button
          onClick={handleQuickAdd}
          className="w-9 h-9 rounded-full bg-brand-sage hover:bg-brand-sage-dark text-white flex items-center justify-center transition-all shadow-sm active:scale-95 group-hover:shadow-md"
          title={t('common.addToCart')}
          aria-label={t('common.addToCart')}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
