import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, Truck, Sparkles, Check, Heart, Plus, Minus } from 'lucide-react';
import api from '../../services/api';
import { useCartStore } from '../../store/useCartStore';
import SpecsGrid from '../../components/common/SpecsGrid';
import ScentPyramid from '../../components/common/ScentPyramid';
import ColorwaySelector from '../../components/common/ColorwaySelector';
import ProductCard from '../../components/common/ProductCard';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState(null);
  const [selectedColorway, setSelectedColorway] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await api.getProductDetail(slug);
        setProduct(res.data);
        if (res.data.colorways && res.data.colorways.length > 0) {
          const defaultColor = res.data.colorways.find((c) => c.is_default) || res.data.colorways[0];
          setSelectedColorway(defaultColor);
        }

        // fetch related
        const relRes = await api.getProducts({ category__slug: res.data.category?.slug });
        setRelatedProducts((relRes.data.results || relRes.data).filter((p) => p.slug !== slug).slice(0, 4));
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
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-96 rounded-3xl bg-stone-200/60 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 bg-stone-200/60 rounded animate-pulse" />
            <div className="h-4 w-1/3 bg-stone-200/60 rounded animate-pulse" />
            <div className="h-32 bg-stone-200/60 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-xl font-bold">المنتج غير موجود</h2>
        <Link to="/products" className="px-6 py-2 rounded-full bg-brand-sage text-white text-xs font-semibold">
          العودة للمتجر
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product.id, selectedColorway?.id, quantity);
  };

  const handleReviewSubmit = async (e) => {
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

  return (
    <div className="min-h-screen pb-20">
      
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 text-xs text-brand-muted flex items-center gap-2">
        <Link to="/" className="hover:text-brand-sage">الرئيسية</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-brand-sage">المتجر</Link>
        <span>/</span>
        <span className="text-brand-ink font-semibold">{product.name_ar}</span>
      </div>

      {/* Hero Showcase Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Gallery Showcase */}
          <div className="space-y-4">
            <div className="odora-card h-[460px] sm:h-[540px] flex items-center justify-center p-8 bg-gradient-to-b from-[#FAF8F5] to-[#EEEAE3]/70 relative overflow-hidden border border-stone-200/80">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(145,156,122,0.15),transparent_60%)] pointer-events-none" />
              
              <img
                src={selectedColorway?.image || product.main_image || '/brand_photo_4.png'}
                alt={product.name_ar}
                className="max-h-[380px] w-auto object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.18)] transition-all duration-300"
                onError={(e) => { e.target.src = '/brand_photo_4.png'; }}
              />
            </div>

            {/* Thumbnail preview list */}
            {product.colorways && product.colorways.length > 1 && (
              <div className="flex gap-3">
                {product.colorways.map((c) => (
                  <button
                    key={c.id || c.name}
                    onClick={() => setSelectedColorway(c)}
                    className={`flex-1 p-2 rounded-xl border transition-all text-xs font-semibold flex items-center justify-center gap-2 ${
                      selectedColorway?.id === c.id
                        ? 'border-brand-sage bg-brand-pale/20 text-brand-olive ring-1 ring-brand-sage'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex_code }} />
                    <span>{c.name_ar}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Actions */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold tracking-[0.16em] uppercase text-brand-muted font-poppins">
                {product.category?.name_ar || 'أجهزة التعطير الذكية'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-light text-brand-ink mt-1">
                {product.name_ar}
              </h1>
              {product.subtitle_ar && (
                <p className="text-sm text-brand-muted mt-1">{product.subtitle_ar}</p>
              )}

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <span className="text-xs text-brand-muted">
                  {product.rating} · ({product.reviews_count} مراجعة مؤكدة)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-brand-olive font-poppins">
                {product.final_price} د.ل
              </span>
              {product.has_discount && (
                <span className="text-lg text-stone-400 line-through font-poppins">
                  {product.price} د.ل
                </span>
              )}
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold">
                شامل الضريبة
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-brand-muted leading-relaxed">
              {product.description_ar || product.description}
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
              <div className="flex items-center justify-between sm:justify-center border border-stone-200 rounded-full bg-white px-3 py-1.5 shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-stone-500 hover:text-stone-800 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-brand-ink font-poppins">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-stone-500 hover:text-stone-800 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 sm:py-4 px-6 rounded-full bg-brand-dark hover:bg-stone-800 text-white font-semibold text-sm transition-all shadow-btn-dark active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>إضافة إلى السلة · {(parseFloat(product.final_price) * quantity).toFixed(2)} د.ل</span>
              </button>
            </div>

            {/* Trust highlights */}
            <div className="pt-6 border-t border-stone-200 grid grid-cols-3 gap-2 text-xs text-brand-muted text-center">
              <div className="space-y-1">
                <Truck className="w-4 h-4 mx-auto text-brand-sage" />
                <span>توصيل مجاني فوق 300 د.ل</span>
              </div>
              <div className="space-y-1">
                <ShieldCheck className="w-4 h-4 mx-auto text-brand-sage" />
                <span>ضمان شامل لمدة عام</span>
              </div>
              <div className="space-y-1">
                <Sparkles className="w-4 h-4 mx-auto text-brand-sage" />
                <span>قطع غيار متوفرة بليبيا</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Specifications Grid */}
      {product.product_type === 'diffuser' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl font-light text-brand-ink mb-6">المواصفات الفنية المعتمدة</h2>
          <SpecsGrid specs={product} />
        </section>
      )}

      {/* Customer Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-stone-200/80">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-light text-brand-ink">تقييمات ومراجعات الزبائن</h2>
            <p className="text-xs text-brand-muted mt-1">تجارب حقيقية لعملاء اقتنوا هذا المنتج</p>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full text-amber-800 text-xs font-bold">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{product.rating} من 5 نجوم</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div key={rev.id} className="odora-card p-6 bg-white border border-stone-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-brand-ink">{rev.reviewer_name}</span>
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-brand-muted leading-relaxed">"{rev.comment}"</p>
                <div className="text-[11px] text-emerald-700 font-medium">✓ شراء مؤكد</div>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-sm text-brand-muted">لا توجد مراجعات بعد. كن أول من يقيّم هذا المنتج!</p>
          )}
        </div>

        {/* Add Review Form */}
        <div className="mt-10 p-6 bg-white rounded-2xl border border-stone-200/80 max-w-xl">
          <h4 className="text-sm font-bold text-brand-ink mb-3">أضف تقييمك للمنتج</h4>
          {reviewSuccess ? (
            <p className="text-xs text-emerald-700 font-medium bg-emerald-50 p-3 rounded-xl">
              شكراً لمشاركتك! تم تسجيل تقييمك بنجاح.
            </p>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
              <div className="flex gap-3">
                <input
                  type="text"
                  required
                  placeholder="اسمك الكريم..."
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage"
                />
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage"
                >
                  <option value={5}>5 نجوم ★★★★★</option>
                  <option value={4}>4 نجوم ★★★★☆</option>
                  <option value={3}>3 نجوم ★★★☆☆</option>
                </select>
              </div>
              <textarea
                required
                rows={2}
                placeholder="اكتب انطباعك عن جودة العطر وتجربة الاستخدام..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-brand-sage text-white font-semibold hover:bg-brand-olive transition-colors"
              >
                إرسال التقييم
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-stone-200/80">
          <h2 className="text-2xl font-light text-brand-ink mb-6">قد يعجبك أيضاً</h2>
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
