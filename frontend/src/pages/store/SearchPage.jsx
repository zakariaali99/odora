import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../../services/api';
import ProductCard from '../../components/common/ProductCard';

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-light text-brand-ink">البحث في المتجر</h1>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-brand-muted absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن أجهزة التعطير، زيوت عطرية، برغموت..."
              className="w-full pr-11 pl-4 py-3 text-sm border border-stone-200 rounded-full bg-white focus:outline-none focus:border-brand-sage shadow-sm"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-brand-dark hover:bg-stone-800 text-white rounded-full text-xs font-semibold shadow-sm transition-colors"
          >
            بحث
          </button>
        </form>
      </div>

      {initialQuery && (
        <div className="pt-4">
          <h2 className="text-sm font-semibold text-brand-muted mb-6">
            نتائج البحث عن: <span className="text-brand-ink font-bold font-poppins">"{initialQuery}"</span> ({results.length} نتيجة)
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-72 rounded-2xl bg-stone-200/60 animate-pulse" />
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {results.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center space-y-2">
              <p className="text-base font-semibold text-brand-ink">لم نجد نتائج مطابقة لبحثك</p>
              <p className="text-xs text-brand-muted">جرب كلمات بحث أخرى أو تصفح التصنيفات المباشرة في المتجر.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default SearchPage;
