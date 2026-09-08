import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Star } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export const ProductCard = ({ product }) => {
  const { addItem } = useCartStore();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultColor = product.colorways?.find((c) => c.is_default) || product.colorways?.[0];
    addItem(product.id, defaultColor?.id, 1);
  };

  return (
    <div className="odora-card p-5 flex flex-col justify-between group border border-stone-200/60 relative overflow-hidden bg-white">
      {/* Product Image Stage */}
      <Link to={`/products/${product.slug}`} className="block relative mb-4">
        <div className="h-56 w-full rounded-xl bg-gradient-to-b from-[#F7F5F0] to-[#EAE6DF]/60 flex items-center justify-center overflow-hidden relative">
          
          {/* Discount Badge */}
          {product.has_discount && (
            <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-pale text-brand-olive shadow-sm">
              عرض خاص
            </span>
          )}

          {/* Product Image */}
          <img
            src={product.main_image || '/brand_photo_4.png'}
            alt={product.name_ar}
            className="h-44 w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-108"
            onError={(e) => { e.target.src = '/brand_photo_4.png'; }}
          />
        </div>
      </Link>

      {/* Info Section */}
      <div>
        <div className="flex items-center justify-between gap-2 text-xs text-brand-muted mb-1">
          <span className="truncate">{product.category_name_ar || 'أجهزة التعطير'}</span>
          <div className="flex items-center gap-1 text-amber-500 font-semibold shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span>{product.rating || '5.0'}</span>
          </div>
        </div>

        <Link to={`/products/${product.slug}`}>
          <h3 className="font-semibold text-base text-brand-ink group-hover:text-brand-sage transition-colors line-clamp-1">
            {product.name_ar}
          </h3>
        </Link>

        {product.subtitle_ar && (
          <p className="text-xs text-brand-muted line-clamp-1 mt-0.5">
            {product.subtitle_ar}
          </p>
        )}

        {/* Colorway preview swatches */}
        {product.colorways && product.colorways.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5">
            {product.colorways.map((c) => (
              <span
                key={c.id || c.name}
                className="w-3.5 h-3.5 rounded-full border border-white shadow-sm ring-1 ring-stone-200"
                style={{ backgroundColor: c.hex_code }}
                title={c.name_ar}
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
          <span className="text-xs text-brand-muted">د.ل</span>
          {product.has_discount && (
            <span className="text-xs text-stone-400 line-through mr-1 font-poppins">
              {product.price}
            </span>
          )}
        </div>

        <button
          onClick={handleQuickAdd}
          className="w-9 h-9 rounded-full bg-brand-sage hover:bg-brand-olive text-white flex items-center justify-center transition-all shadow-sm active:scale-95 group-hover:shadow-md"
          title="إضافة سريعة للسلة"
          aria-label="Add to cart"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
