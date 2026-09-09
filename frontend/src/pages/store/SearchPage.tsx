import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import { Product } from '../../types';

export const SearchPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const language = ((i18n.language || 'ar').split('-')[0]) as 'ar' | 'en';
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const doSearch = async () => {
      if (!initialQuery.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await api.getProducts({ search: initialQuery.trim() });
        setResults(res.data.results || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    doSearch();
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-brand-cream">
      
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-light text-brand-ink">
          {language === 'ar' ? 'البحث في المتجر' : 'Search Store'}
        </h1>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-brand-muted absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('nav.search', 'ابحث عن أجهزة التعطير، زيوت عطرية، موديلات...')}
              className="w-full ps-11 pe-4 py-3 text-sm border border-stone-200 rounded-full bg-white focus:outline-none focus:border-brand-sage shadow-xs text-brand-ink"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-brand-ink hover:bg-stone-800 text-white rounded-full text-xs font-bold shadow-xs transition-colors shrink-0"
          >
            {t('common.search', 'بحث')}
          </button>
        </form>
      </div>

      {initialQuery && (
        <div className="pt-4">
          <h2 className="text-sm font-semibold text-brand-muted mb-6">
            {language === 'ar' ? 'نتائج البحث عن: ' : 'Results for: '}
            <span className="text-brand-ink font-bold font-sans">"{initialQuery}"</span> ({results.length} {t('common.unit', 'نتيجة')})
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-72 rounded-2xl bg-white border border-stone-200 animate-pulse" />
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-2 bg-white rounded-2xl border border-stone-200 p-8 max-w-md mx-auto shadow-xs">
              <p className="text-base font-bold text-brand-ink">
                {language === 'ar' ? 'لم نجد نتائج مطابقة لبحثك' : 'No matching results found'}
              </p>
              <p className="text-xs text-brand-muted font-medium">
                {language === 'ar' ? 'جرب كلمات بحث أخرى أو تصفح التصنيفات المباشرة في المتجر.' : 'Try different keywords or browse categories.'}
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default SearchPage;
