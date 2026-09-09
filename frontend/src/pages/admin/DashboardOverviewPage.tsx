import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingCart, Users, AlertTriangle, Smartphone, Globe, RefreshCw } from 'lucide-react';
import api from '../../services/api';

export const DashboardOverviewPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.getDashboardStats();
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const { overview, customers_origin, low_stock_alerts, top_products, recent_orders } = data || {};

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Page Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">نظرة عامة والتحليلات البيعية</h2>
          <p className="text-xs text-slate-500 mt-0.5">مؤشرات الأداء اللحظية لمتجر وتطبيق أودورا في ليبيا</p>
        </div>
        <button
          onClick={fetchStats}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition"
        >
          <RefreshCw size={14} />
          <span>تحديث البيانات</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400">إجمالي المبيعات المؤكدة</span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 font-sans mt-1">
              {Number(overview?.total_revenue || 0).toFixed(2)} د.ل
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">مبيعات فعلية مستلمة</span>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400">إجمالي الطلبات</span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 font-sans mt-1">
              {overview?.total_orders || 0}
            </div>
            <span className="text-[11px] text-blue-600 font-medium">
              {overview?.pending_orders || 0} طلب قيد التجهيز
            </span>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400">قاعدة العملاء (CRM)</span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 font-sans mt-1">
              {overview?.total_customers || 0}
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
              <span className="flex items-center gap-0.5"><Globe className="w-3 h-3 text-brand-sage" /> {customers_origin?.web || 0}</span>
              <span>·</span>
              <span className="flex items-center gap-0.5"><Smartphone className="w-3 h-3 text-brand-olive" /> {customers_origin?.mobile || 0}</span>
            </div>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400">تنبيهات المخزون</span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 font-sans mt-1">
              {low_stock_alerts?.length || 0}
            </div>
            <span className="text-[11px] text-amber-600 font-medium">منتجات أوشكت على النفاد</span>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

      </div>

      {/* Two-Column Grid: Top Products & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Top Products */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-800">المنتجات الأكثر مبيعاً</h3>
            <Link to="/admin/products" className="text-xs text-brand-sage hover:underline font-semibold">
              إدارة الكتالوج ←
            </Link>
          </div>

          <div className="space-y-2.5">
            {top_products && top_products.length > 0 ? (
              top_products.map((p: any, i: number) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 text-xs gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-bold text-slate-800">{p.product__name_ar}</span>
                  </div>
                  <div className="text-start sm:text-left pr-9 sm:pr-0">
                    <span className="font-bold text-brand-olive font-sans">{Number(p.total_sales || 0).toFixed(2)} د.ل</span>
                    <span className="text-[11px] text-slate-400 block">({p.total_sold} قطعة مبيعة)</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">لا توجد مبيعات مسجلة حتى الآن.</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-800">أحدث الطلبات الواردة</h3>
            <Link to="/admin/orders" className="text-xs text-brand-sage hover:underline font-semibold">
              عرض كل الطلبات ←
            </Link>
          </div>

          <div className="space-y-2.5">
            {recent_orders && recent_orders.length > 0 ? (
              recent_orders.map((ord: any) => (
                <div key={ord.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 text-xs gap-2">
                  <div>
                    <span className="font-bold text-slate-800 font-sans">{ord.order_number}</span>
                    <span className="text-slate-500 mr-2">{ord.customer_name} ({ord.shipping_city})</span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className="font-bold text-brand-olive font-sans">{Number(ord.total_amount).toFixed(2)} د.ل</span>
                    <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 text-[10px] font-semibold">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">لا توجد طلبات بعد.</p>
            )}
          </div>
        </div>

      </div>

      {/* Low Stock Alerts */}
      {low_stock_alerts && low_stock_alerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>تنبيه نواقص المخزون — يرجى تزويد الكميات</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {low_stock_alerts.map((item: any) => (
              <div key={item.id} className="bg-white p-3 rounded-xl border border-amber-200 text-xs flex justify-between items-center shadow-2xs">
                <span className="font-semibold text-slate-800 truncate pl-2">{item.name_ar}</span>
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold font-sans shrink-0">
                  باقي {item.stock} فقط
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardOverviewPage;
