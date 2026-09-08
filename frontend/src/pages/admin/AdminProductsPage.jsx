import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Search, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import ProductModal from '../../components/admin/ProductModal';

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getAdminProducts(),
        api.getCategories(),
      ]);
      setProducts(prodRes.data.results || prodRes.data || []);
      setCategories(catRes.data.results || catRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج من المتجر؟')) {
      try {
        await api.deleteAdminProduct(id);
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleStockUpdate = async (id, currentStock) => {
    const newStock = prompt('أدخل كمية المخزون الجديدة:', currentStock);
    if (newStock !== null && !isNaN(newStock)) {
      try {
        await api.updateAdminStock(id, parseInt(newStock, 10));
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    (p.name_ar || p.name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">إدارة المنتجات والمخزون</h2>
          <p className="text-xs text-slate-500 mt-0.5">إضافة، تعديل الأسعار، ومتابعة توفر الأجهزة والزيوت</p>
        </div>

        <button
          onClick={handleAdd}
          className="px-5 py-2.5 bg-brand-sage hover:bg-brand-olive text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث عن منتج بالاسم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-brand-sage"
          />
        </div>

        <button
          onClick={fetchProducts}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl"
          title="تحديث البيانات"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* High Density Data Table per RULE[user_global] */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-right text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
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
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <img
                    src={p.main_image || '/brand_photo_4.png'}
                    alt=""
                    className="w-10 h-10 rounded-lg object-contain bg-slate-100 border border-slate-200"
                    onError={(e) => { e.target.src = '/brand_photo_4.png'; }}
                  />
                </td>
                <td className="py-3 px-4 font-bold text-slate-900">
                  {p.name_ar}
                  {p.subtitle_ar && <span className="block text-[10px] text-slate-400 font-normal">{p.subtitle_ar}</span>}
                </td>
                <td className="py-3 px-4">{p.category_name_ar || p.category?.name_ar || 'أجهزة'}</td>
                <td className="py-3 px-4 font-bold text-brand-olive font-poppins">{p.price} د.ل</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleStockUpdate(p.id, p.stock)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold font-poppins text-slate-800 transition-colors"
                    title="انقر لتعديل المخزون مباشرة"
                  >
                    {p.stock} قطعة ✎
                  </button>
                </td>
                <td className="py-3 px-4">
                  {p.is_featured ? (
                    <span className="px-2 py-0.5 rounded-full bg-brand-pale text-brand-olive font-bold text-[10px]">مميز</span>
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {p.is_active ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px]">نشط</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-semibold text-[10px]">معطل</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-brand-sage transition-colors"
                      title="تعديل المنتج"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="حذف المنتج"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
