import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, Truck, Sparkles, Plus, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { useCartStore } from '../../store/useCartStore';
import SpecsGrid from '../../components/common/SpecsGrid';
import ScentPyramid from '../../components/common/ScentPyramid';
import ColorwaySelector from '../../components/common/ColorwaySelector';
import ProductCard from '../../components/common/ProductCard';
import { Product, Colorway } from '../../types';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const language = ((i18n.language || 'ar').split('-')[0]) as 'ar' | 'en';
  const { addItem } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColorway, setSelectedColorway] = useState<Colorway | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.getProductDetail(slug);
        setProduct(res.data);
        if (res.data.colorways && res.data.colorways.length > 0) {
          const defaultColor = res.data.colorways.find((c: Colorway) => c.is_default) || res.data.colorways[0];
          setSelectedColorway(defaultColor);
        }

        // fetch related
        const relRes = await api.getProducts({ category__slug: res.data.category?.slug });
        setRelatedProducts((relRes.data.results || relRes.data).filter((p: Product) => p.slug !== slug).slice(0, 4));
      } catch (err) {
        console.error('Failed to load product detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 bg-brand-cream min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-96 rounded-3xl bg-white border border-stone-200 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 bg-white border border-stone-200 rounded animate-pulse" />
            <div className="h-4 w-1/3 bg-white border border-stone-200 rounded animate-pulse" />
            <div className="h-32 bg-white border border-stone-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-24 text-center space-y-4 bg-brand-cream">
        <h2 className="text-xl font-bold text-brand-ink">
          {language === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}
        </h2>
        <Link to="/products" className="px-6 py-2 rounded-full bg-brand-sage text-white text-xs font-bold shadow-xs hover:bg-brand-olive">
          {t('common.exploreCollection', 'العودة للمتجر')}
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product.id, selectedColorway?.id, quantity);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    try {
      await api.addProductReview(product.slug, {
        reviewer_name: reviewName,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewSuccess(true);
      setReviewName('');
      setReviewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const getColorwayImage = (color?: Colorway) => {
    if (color?.image) return color.image;
    if (color?.name?.toLowerCase().includes('white') || color?.name_ar?.includes('أبيض')) {
      return '/products/diffuser-white-clean.png';
    }
    if (color?.name?.toLowerCase().includes('black') || color?.name_ar?.includes('أسود')) {
      return '/products/diffuser-black-clean.png';
    }
    if (color?.name?.toLowerCase().includes('sage') || color?.name_ar?.includes('مريمي')) {
      return '/products/diffuser-sage-clean.png';
    }
    if (product?.main_image) return product.main_image;
    if (product?.product_type === 'oil') return '/products/oil-forest-sage.png';
    if (product?.product_type === 'bundle') return '/products/bundle-signature.png';
    return '/products/diffuser-a316-sage.png';
  };

  return (
    <div className="min-h-screen pb-20 bg-brand-cream">
      
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 text-xs text-brand-muted flex items-center gap-2 font-medium">
        <Link to="/" className="hover:text-brand-sage">{t('product.breadcrumbsHome', 'الرئيسية')}</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-brand-sage">{t('product.breadcrumbsShop', 'المتجر')}</Link>
        <span>/</span>
        <span className="text-brand-ink font-bold">
          {language === 'en' ? product.name || product.name_ar : product.name_ar}
        </span>
      </div>

      {/* Hero Showcase Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Gallery Showcase */}
          <div className="space-y-4">
            <div className="odora-card h-[460px] sm:h-[540px] flex items-center justify-center p-8 bg-gradient-to-b from-white to-stone-50 relative overflow-hidden border border-stone-200 shadow-md">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(113,126,87,0.1),transparent_60%)] pointer-events-none" />
              
              <img
                src={getColorwayImage(selectedColorway || undefined)}
                alt={product.name_ar}
                className="max-h-[380px] w-auto object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)] transition-all duration-300"
                onError={(e) => { (e.target as HTMLImageElement).src = '/products/diffuser-a316-sage.png'; }}
              />
            </div>

            {/* Thumbnail preview list */}
            {product.colorways && product.colorways.length > 1 && (
              <div className="flex gap-3">
                {product.colorways.map((c) => (
                  <button
                    key={c.id || c.name}
                    onClick={() => setSelectedColorway(c)}
                    className={`flex-1 p-2 rounded-xl border transition-all text-xs font-bold flex items-center justify-center gap-2 ${
                      selectedColorway?.id === c.id
                        ? 'border-brand-sage bg-white text-brand-sage ring-2 ring-brand-sage shadow-xs'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full border border-stone-300 shadow-2xs" style={{ backgroundColor: c.hex_code }} />
                    <span>{language === 'en' ? c.name : c.name_ar}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Actions */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold tracking-[0.16em] uppercase text-brand-muted font-sans">
                {language === 'en'
                  ? product.category?.name || product.category?.name_ar || 'Smart Diffusers'
                  : product.category?.name_ar || 'أجهزة التعطير الذكية'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-light text-brand-ink mt-1">
                {language === 'en' ? product.name || product.name_ar : product.name_ar}
              </h1>
              {product.subtitle_ar && (
                <p className="text-sm text-brand-muted font-medium mt-1">{product.subtitle_ar}</p>
              )}

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <span className="text-xs text-brand-muted font-medium">
                  {product.rating} · ({product.reviews_count} {t('common.reviews', 'مراجعة مؤكدة')})
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-brand-ink font-sans">
                {product.final_price} {t('common.currency', 'د.ل')}
              </span>
              {product.has_discount && (
                <span className="text-lg text-stone-500 line-through font-sans">
                  {product.price} {t('common.currency', 'د.ل')}
                </span>
              )}
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                {t('common.taxIncluded', 'شامل الضريبة')}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-brand-muted leading-relaxed font-normal">
              {language === 'en'
                ? product.description || product.description_ar
                : product.description_ar || product.description}
            </p>

            {/* Colorway Selector if diffusers */}
            {product.colorways && product.colorways.length > 0 && (
              <div className="pt-2">
                <ColorwaySelector
                  colorways={product.colorways}
                  selectedColorway={selectedColorway}
                  onSelect={setSelectedColorway}
                />
              </div>
            )}

            {/* Scent Pyramid if fragrance oil */}
            {product.scent_notes && (
              <div className="pt-2">
                <ScentPyramid notes={product.scent_notes} />
              </div>
            )}

            {/* Quantity Stepper & Add to Cart */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center justify-between sm:justify-center border border-stone-300 rounded-full bg-white px-3 py-1.5 shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-stone-600 hover:text-brand-ink transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-brand-ink font-sans">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-stone-600 hover:text-brand-ink transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 sm:py-4 px-6 rounded-full bg-brand-ink hover:bg-stone-800 text-white font-bold text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>{t('common.addToCart', 'إضافة إلى السلة')} · {(parseFloat(product.final_price) * quantity).toFixed(2)} {t('common.currency', 'د.ل')}</span>
              </button>
            </div>

            {/* Trust highlights */}
            <div className="pt-6 border-t border-stone-200 grid grid-cols-3 gap-2 text-xs text-brand-muted text-center font-medium">
              <div className="space-y-1">
                <Truck className="w-4 h-4 mx-auto text-brand-sage" />
                <span>{t('product.trust1', 'توصيل مجاني فوق 300 د.ل')}</span>
              </div>
              <div className="space-y-1">
                <ShieldCheck className="w-4 h-4 mx-auto text-brand-sage" />
                <span>{t('product.trust2', 'ضمان شامل لمدة عام')}</span>
              </div>
              <div className="space-y-1">
                <Sparkles className="w-4 h-4 mx-auto text-brand-sage" />
                <span>{t('product.trust3', 'قطع غيار وصيانة بليبيا')}</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Specifications Grid */}
      {product.product_type === 'diffuser' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl font-light text-brand-ink mb-6">
            {t('product.specsTitle', 'المواصفات الفنية المعتمدة')}
          </h2>
          <SpecsGrid specs={product} />
        </section>
      )}

      {/* Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-stone-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-light text-brand-ink">
              {t('product.reviewsTitle', 'تقييمات ومراجعات الزبائن')}
            </h2>
            <p className="text-xs text-brand-muted font-medium mt-1">
              {t('product.reviewsSubtitle', 'تجارب حقيقية لعملاء اقتنوا هذا المنتج')}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full text-amber-900 text-xs font-bold">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{product.rating} / 5</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div key={rev.id} className="odora-card p-6 bg-white border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-brand-ink">{rev.reviewer_name}</span>
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-brand-muted leading-relaxed font-normal">"{rev.comment}"</p>
                <div className="text-[11px] text-emerald-700 font-semibold">✓ {t('common.verifiedBuyer', 'شراء مؤكد')}</div>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-sm text-brand-muted font-medium">
              {t('product.noReviews', 'لا توجد مراجعات بعد. كن أول من يقيّم هذا المنتج!')}
            </p>
          )}
        </div>

        {/* Add Review Form */}
        <div className="mt-10 p-6 bg-white rounded-2xl border border-stone-200 shadow-sm max-w-xl">
          <h4 className="text-sm font-bold text-brand-ink mb-3">
            {t('product.addReviewTitle', 'أضف تقييمك للمنتج')}
          </h4>
          {reviewSuccess ? (
            <p className="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
              {t('product.reviewSuccess', 'شكراً لمشاركتك! تم تسجيل تقييمك بنجاح.')}
            </p>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
              <div className="flex gap-3">
                <input
                  type="text"
                  required
                  placeholder={t('product.yourName', 'اسمك الكريم...')}
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage bg-white text-brand-ink"
                />
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage bg-white text-brand-ink font-bold"
                >
                  <option value={5}>5 ★★★★★</option>
                  <option value={4}>4 ★★★★☆</option>
                  <option value={3}>3 ★★★☆☆</option>
                </select>
              </div>
              <textarea
                required
                rows={2}
                placeholder={t('product.yourComment', 'اكتب انطباعك وتجربتك هنا...')}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage bg-white text-brand-ink"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-brand-sage text-white font-bold hover:bg-brand-olive transition-colors shadow-xs"
              >
                {t('product.submitReview', 'إرسال التقييم')}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-stone-200">
          <h2 className="text-2xl font-light text-brand-ink mb-6">
            {language === 'ar' ? 'قد يعجبك أيضاً' : 'You May Also Like'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetailPage;
