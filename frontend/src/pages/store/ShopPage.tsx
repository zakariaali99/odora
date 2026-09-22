import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import { Category, Product } from '../../types';

export const ShopPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const language = ((i18n.language || 'ar').split('-')[0]) as 'ar' | 'en';
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const currentCategory = searchParams.get('category') || '';
  const currentType = searchParams.get('product_type') || '';
  const currentOrdering = searchParams.get('ordering') || '-is_featured';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    api.getCategories()
      .then((res) => setCategories(res.data.results || res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (currentCategory) params['category__slug'] = currentCategory;
        if (currentType) params.product_type = currentType;
        if (currentOrdering) params.ordering = currentOrdering;
        if (searchQuery) params.search = searchQuery;
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
    const next = new URLSearchParams(searchParams);
    if (slug) next.set('category', slug);
    else next.delete('category');
    setSearchParams(next);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const next = new URLSearchParams(searchParams);
    next.set('ordering', event.target.value);
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen bg-brand-canvas pb-24 sm:pb-32">
      <section className="editorial-container py-14 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 items-end gap-10 border-b border-brand-ink/10 pb-12 lg:grid-cols-12 lg:pb-16">
          <div className="lg:col-span-7">
            <h1 className="text-5xl font-light tracking-[-0.04em] text-brand-ink sm:text-7xl">
              {t('shop.title', 'متجر أودورا')}
            </h1>
            <p className="mt-6 max-w-2xl text-base font-light leading-8 text-brand-muted sm:text-lg">
              {t('shop.subtitle', 'أجهزة تعطير ذكية وزيوت فرنسية نقية، مختارة لتنسجم مع المكان وتمنحه هويته العطرية.')}
            </p>
          </div>
          <div className="lg:col-span-5 lg:text-end">
            <p className="text-sm leading-7 text-brand-muted">
              {language === 'ar'
                ? 'ألوان مطفية، رذاذ بارد، وتحكم هادئ في تجربة صُممت للمنازل ومساحات الضيافة.'
                : 'Matte finishes, cold-air diffusion, and quiet control for homes and hospitality spaces.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6 overflow-x-auto pb-2 text-sm scrollbar-none sm:pb-0">
            <button
              onClick={() => handleCategorySelect('')}
              className={`shrink-0 border-b pb-1.5 transition-colors ${!currentCategory ? 'border-brand-ink text-brand-ink' : 'border-transparent text-brand-muted hover:text-brand-ink'}`}
            >
              {t('shop.allProducts', 'كافة المنتجات')}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.slug)}
                className={`shrink-0 border-b pb-1.5 transition-colors ${currentCategory === category.slug ? 'border-brand-ink text-brand-ink' : 'border-transparent text-brand-muted hover:text-brand-ink'}`}
              >
                {language === 'en' ? category.name || category.name_ar : category.name_ar}
              </button>
            ))}
          </div>

          <label className="flex shrink-0 items-center gap-3 text-xs text-brand-muted">
            <span>{t('shop.sortBy', 'الترتيب')}</span>
            <select
              value={currentOrdering}
              onChange={handleSortChange}
              className="rounded-full border border-brand-ink/15 bg-brand-surface px-4 py-2.5 text-xs font-medium text-brand-ink focus:border-brand-olive focus:outline-none"
            >
              <option value="-is_featured">{t('shop.sortFeatured', 'المميزة أولاً')}</option>
              <option value="price">{t('shop.sortPriceAsc', 'السعر: من الأقل')}</option>
              <option value="-price">{t('shop.sortPriceDesc', 'السعر: من الأعلى')}</option>
              <option value="-rating">{t('shop.sortRating', 'الأعلى تقييماً')}</option>
              <option value="-created_at">{language === 'ar' ? 'الأحدث وصولاً' : 'Newest'}</option>
            </select>
          </label>
        </div>

        <div className="pt-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => <div key={item} className="h-[460px] animate-pulse rounded-[24px] bg-brand-surface" />)}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="mx-auto max-w-xl border-y border-brand-ink/10 py-20 text-center">
              <h2 className="text-2xl font-light text-brand-ink">{t('shop.emptyProducts', 'لا توجد منتجات مطابقة لهذا التصنيف حالياً.')}</h2>
              <p className="mt-3 text-sm text-brand-muted">
                {language === 'ar' ? 'اختر مجموعة أخرى أو ابدأ من التشكيلة كاملة.' : 'Choose another collection or return to the complete edit.'}
              </p>
              <button onClick={() => setSearchParams({})} className="editorial-button-secondary mx-auto mt-8 gap-2">
                <RefreshCcw className="h-4 w-4" />
                {language === 'ar' ? 'عرض المجموعة كاملة' : 'View the full collection'}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ShopPage;

