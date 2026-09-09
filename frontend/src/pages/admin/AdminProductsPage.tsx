import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import ProductModal from '../../components/admin/ProductModal';
import { Product, Category } from '../../types';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getAdminProducts(),
        api.getCategories(),
      ]);
      const prodData = prodRes.data;
      setProducts(prodData.results || prodData || []);
      const catData = catRes.data;
      setCategories(catData.results || catData || []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج من المتجر؟')) {
      try {
        await api.deleteAdminProduct(id);
        fetchProducts();
      } catch (err) {
        console.error('Failed to delete product', err);
      }
    }
  };

  const handleStockUpdate = async (id: string | number, currentStock: number) => {
    const newStock = prompt('أدخل كمية المخزون الجديدة:', currentStock.toString());
    if (newStock !== null && !isNaN(Number(newStock))) {
      try {
        await api.updateAdminStock(id, parseInt(newStock, 10));
        fetchProducts();
      } catch (err) {
        console.error('Failed to update stock', err);
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    ((p.name_ar || p.name || '')).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-ink-primary font-cairo">إدارة المنتجات والمخزون</h2>
          <p className="text-xs text-ink-muted mt-0.5 font-cairo">إضافة، تعديل الأسعار، ومتابعة توفر الأجهزة والزيوت العطرية</p>
        </div>

        <button
          onClick={handleAdd}
          className="px-5 py-2.5 bg-brand-sage hover:bg-brand-olive text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-ink-muted absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث عن منتج بالاسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-brand-sage bg-canvas/30 text-ink-primary"
          />
        </div>

        <button
          onClick={fetchProducts}
          className="p-2 text-ink-muted hover:text-ink-primary hover:bg-stone-100 rounded-xl transition"
          title="تحديث البيانات"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* High Density Data Table per RULE[user_global] */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-right text-xs">
            <thead className="bg-canvas-subtle border-b border-stone-200 text-ink-muted font-bold font-cairo">
              <tr>
                <th className="py-3.5 px-4">الصورة</th>
                <th className="py-3.5 px-4">اسم المنتج</th>
                <th className="py-3.5 px-4">التصنيف</th>
                <th className="py-3.5 px-4">السعر الأساسي</th>
                <th className="py-3.5 px-4">المخزون المتوفر</th>
                <th className="py-3.5 px-4">مميز</th>
                <th className="py-3.5 px-4">الحالة</th>
                <th className="py-3.5 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-ink-primary">
              {loading && products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-ink-muted">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-brand-sage" />
                    <p>جاري تحميل المنتجات...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-ink-muted">
                    لا توجد منتجات مطابقة لعملية البحث
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-canvas-subtle/50 transition-colors">
                    <td className="py-3 px-4">
                      <img
                        src={p.main_image || '/photos/packshot_diffuser_wood.png'}
                        alt=""
                        className="w-10 h-10 rounded-lg object-contain bg-canvas-subtle border border-stone-200 p-1"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/photos/packshot_diffuser_wood.png'; }}
                      />
                    </td>
                    <td className="py-3 px-4 font-bold text-ink-primary">
                      {p.name_ar || p.name}
                      {p.subtitle_ar && <span className="block text-[10px] text-ink-muted font-normal">{p.subtitle_ar}</span>}
                    </td>
                    <td className="py-3 px-4">{p.category_name_ar || (typeof p.category === 'object' && p.category?.name_ar) || 'أجهزة التعطير'}</td>
                    <td className="py-3 px-4 font-bold text-brand-amber font-mono">{p.price} د.ل</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleStockUpdate(p.id, p.stock)}
                        className="px-2.5 py-1 rounded-lg bg-canvas-subtle hover:bg-stone-200 font-bold font-mono text-ink-primary transition-colors"
                        title="انقر لتعديل المخزون مباشرة"
                      >
                        {p.stock} قطعة ✎
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      {p.is_featured ? (
                        <span className="px-2 py-0.5 rounded-full bg-brand-sage/10 text-brand-sage font-bold text-[10px]">مميز</span>
                      ) : (
                        <span className="text-stone-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {p.is_active !== false ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px]">نشط</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold text-[10px]">معطل</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleEdit(p)}
                          className="p-1.5 rounded-lg text-ink-muted hover:bg-canvas-subtle hover:text-brand-sage transition-colors"
                          title="تعديل المنتج"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg text-ink-muted hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="حذف المنتج"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={editingProduct}
        onSaveSuccess={fetchProducts}
        categories={categories}
      />
    </div>
  );
};

export default AdminProductsPage;
