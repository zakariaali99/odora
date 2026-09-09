import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import { Product, Category } from '../../types';

export const ShopPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const language = ((i18n.language || 'ar').split('-')[0]) as 'ar' | 'en';
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const currentCategory = searchParams.get('category') || '';
  const currentType = searchParams.get('product_type') || '';
  const currentOrdering = searchParams.get('ordering') || '-is_featured';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.getCategories();
        setCategories(res.data.results || res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (currentCategory) params['category__slug'] = currentCategory;
        if (currentType) params['product_type'] = currentType;
        if (currentOrdering) params['ordering'] = currentOrdering;
        if (searchQuery) params['search'] = searchQuery;

        const res = await api.getProducts(params);
        setProducts(res.data.results || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentCategory, currentType, currentOrdering, searchQuery]);

  const handleCategorySelect = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('ordering', e.target.value);
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen pb-20 bg-brand-cream">
      {/* Header Banner */}
      <div className="bg-[#EFEFEA] border-b border-stone-200 py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-muted font-sans">
            THE COLLECTION
          </span>
          <h1 className="text-3xl sm:text-4xl font-light text-brand-ink">
            {t('shop.title', 'متجر أودورا')}
          </h1>
          <p className="text-sm text-brand-muted font-medium">
            {t('shop.subtitle', 'أجهزة تعطير ذكية وزيوت فرنسية نقية 100% مستخلصة من غراس')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Category Filter Chips Bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-stone-200">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => handleCategorySelect('')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                !currentCategory
                  ? 'bg-brand-ink text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {t('shop.allProducts', 'كافة المنتجات')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                  currentCategory === cat.slug
                    ? 'bg-brand-ink text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {language === 'en' ? cat.name || cat.name_ar : cat.name_ar}
              </button>
            ))}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-xs">
            <SlidersHorizontal className="w-4 h-4 text-brand-muted" />
            <span className="text-brand-muted font-medium">{t('shop.sortBy', 'الترتيب حسب:')}</span>
            <select
              value={currentOrdering}
              onChange={handleSortChange}
              className="bg-white border border-stone-200 rounded-full px-3 py-1.5 text-xs font-bold text-brand-ink focus:outline-none focus:border-brand-sage shadow-xs"
            >
              <option value="-is_featured">{t('shop.sortFeatured', 'المميزة أولاً')}</option>
              <option value="price">{t('shop.sortPriceAsc', 'السعر: من الأقل للأعلى')}</option>
              <option value="-price">{t('shop.sortPriceDesc', 'السعر: من الأعلى للأقل')}</option>
              <option value="-rating">{t('shop.sortRating', 'الأعلى تقييماً')}</option>
              <option value="-created_at">{language === 'ar' ? 'الأحدث وصولاً' : 'Newest'}</option>
            </select>
          </div>

        </div>

        {/* Product Grid Area */}
        <div className="pt-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-white border border-stone-200 animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-3 bg-white rounded-2xl border border-stone-200 p-8 max-w-md mx-auto">
              <p className="text-base text-brand-ink font-bold">{t('shop.emptyProducts', 'لا توجد منتجات مطابقة لهذا التصنيف حالياً.')}</p>
              <p className="text-xs text-brand-muted font-medium">
                {language === 'ar' ? 'جرب اختيار تصنيف آخر أو مسح فلاتر البحث.' : 'Try choosing another category or clearing search filters.'}
              </p>
              <button
                onClick={() => setSearchParams({})}
                className="px-5 py-2 rounded-full bg-brand-sage text-white text-xs font-bold hover:bg-brand-olive shadow-xs flex items-center gap-1.5 mx-auto"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ShopPage;
