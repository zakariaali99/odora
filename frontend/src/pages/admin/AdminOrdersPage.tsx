import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { 
  Package, Search, RefreshCw, Eye, 
  Clock, Truck, XCircle, Printer, Send, User, MapPin
} from 'lucide-react';

interface OrderItem {
  id?: number;
  product_name: string;
  variant_name?: string;
  quantity: number;
  unit_price: number | string;
  total_price: number | string;
}

interface StatusLog {
  status: string;
  note?: string;
  created_at: string;
}

interface OrderDetail {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_city: string;
  shipping_address: string;
  notes?: string;
  status: string;
  payment_method: string;
  subtotal: number | string;
  shipping_cost: number | string;
  discount_amount: number | string;
  total_amount: number | string;
  created_at: string;
  items?: OrderItem[];
  status_logs?: StatusLog[];
}

interface StatusConfig {
  labelAr: string;
  labelEn: string;
  color: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  placed: { labelAr: 'جديد / بانتظار التأكيد', labelEn: 'Placed', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  confirmed: { labelAr: 'مؤكد', labelEn: 'Confirmed', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  processing: { labelAr: 'قيد التجهيز', labelEn: 'Processing', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  shipped: { labelAr: 'تم الشحن', labelEn: 'Shipped', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  delivered: { labelAr: 'تم التوصيل', labelEn: 'Delivered', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  cancelled: { labelAr: 'ملغي', labelEn: 'Cancelled', color: 'bg-rose-50 text-rose-800 border-rose-200' },
};

export const AdminOrdersPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = (i18n.language || 'ar').startsWith('ar');
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Status update state
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusNote, setStatusNote] = useState<string>('');
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string>('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (activeFilter !== 'all') params.status = activeFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      
      const res = await api.get('/orders/admin-orders/', { params });
      setOrders(res.data.results || res.data || []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleViewOrder = async (orderId: number) => {
    try {
      const res = await api.get(`/orders/admin-orders/${orderId}/`);
      setSelectedOrder(res.data);
      setNewStatus(res.data.status);
      setStatusNote('');
    } catch (err) {
      console.error('Failed to get order detail', err);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    setActionSuccess('');
    try {
      const res = await api.post(`/orders/admin-orders/${selectedOrder.id}/update_status/`, {
        status: newStatus,
        note: statusNote || undefined,
      });
      setSelectedOrder(res.data);
      setActionSuccess(isRtl ? 'تم تحديث حالة الطلب بنجاح' : 'Status updated successfully');
      fetchOrders();
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-ink-primary font-cairo">
            {isRtl ? 'إدارة الطلبات والمبيعات' : 'Orders & Sales Management'}
          </h1>
          <p className="text-xs text-ink-muted mt-0.5 font-cairo">
            {isRtl ? 'متابعة الطلبات المباشرة، معالجة حالات الشحن والتوصيل في مدن ليبيا' : 'Monitor live orders, update fulfillment and shipping across Libya'}
          </p>
        </div>
        <button 
          onClick={fetchOrders}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-xl text-xs font-bold text-ink-primary hover:bg-stone-50 transition shadow-sm bg-white"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>{isRtl ? 'تحديث البيانات' : 'Refresh'}</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {[
              { id: 'all', labelAr: 'الكل', labelEn: 'All' },
              { id: 'placed', labelAr: 'جديد', labelEn: 'Placed' },
              { id: 'confirmed', labelAr: 'مؤكد', labelEn: 'Confirmed' },
              { id: 'processing', labelAr: 'قيد التجهيز', labelEn: 'Processing' },
              { id: 'shipped', labelAr: 'تم الشحن', labelEn: 'Shipped' },
              { id: 'delivered', labelAr: 'مكتمل', labelEn: 'Delivered' },
              { id: 'cancelled', labelAr: 'ملغي', labelEn: 'Cancelled' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  activeFilter === tab.id
                    ? 'bg-brand-sage text-white shadow-sm'
                    : 'bg-canvas-subtle text-ink-muted hover:text-ink-primary hover:bg-stone-200/70'
                }`}
              >
                {isRtl ? tab.labelAr : tab.labelEn}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRtl ? 'رقم الطلب، اسم العميل، الهاتف...' : 'Order #, Name, Phone...'}
                className="w-full pl-9 pr-9 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-brand-sage bg-canvas-subtle/50 text-ink-primary"
              />
              <Search size={15} className={`absolute top-2.5 ${isRtl ? 'left-3' : 'right-3'} text-ink-muted`} />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-ink-primary text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition"
            >
              {isRtl ? 'بحث' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[780px] w-full text-start text-xs">
            <thead className="bg-canvas-subtle text-ink-muted text-[11px] uppercase font-bold border-b border-stone-200 font-cairo">
              <tr>
                <th className="px-4 py-3.5 text-start">{isRtl ? 'رقم الطلب' : 'Order #'}</th>
                <th className="px-4 py-3.5 text-start">{isRtl ? 'العميل' : 'Customer'}</th>
                <th className="px-4 py-3.5 text-start">{isRtl ? 'المدينة' : 'City'}</th>
                <th className="px-4 py-3.5 text-start">{isRtl ? 'الإجمالي' : 'Total'}</th>
                <th className="px-4 py-3.5 text-start">{isRtl ? 'طريقة الدفع' : 'Payment'}</th>
                <th className="px-4 py-3.5 text-start">{isRtl ? 'الحالة' : 'Status'}</th>
                <th className="px-4 py-3.5 text-start">{isRtl ? 'التاريخ' : 'Date'}</th>
                <th className="px-4 py-3.5 text-end">{isRtl ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-ink-primary">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-ink-muted">
                    <RefreshCw className="animate-spin inline-block mx-auto mb-2 text-brand-sage" size={20} />
                    <p>{isRtl ? 'جاري تحميل سجلات الطلبات...' : 'Loading orders...'}</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-ink-muted">
                    <Package className="inline-block mx-auto mb-2 text-stone-300" size={32} />
                    <p>{isRtl ? 'لا توجد طلبات مطابقة للبحث أو التصفية الحالية' : 'No orders found matching filters'}</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const statusConf = STATUS_MAP[order.status] || { labelAr: order.status, labelEn: order.status, color: 'bg-stone-100 text-stone-700' };
                  return (
                    <tr key={order.id} className="hover:bg-canvas-subtle/50 transition group">
                      <td className="px-4 py-3.5 font-mono font-bold text-ink-primary">
                        {order.order_number}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-ink-primary">{order.customer_name}</div>
                        <div className="text-[11px] text-ink-muted font-mono">{order.customer_phone}</div>
                      </td>
                      <td className="px-4 py-3.5 text-ink-muted">
                        {order.shipping_city || '—'}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-brand-amber font-mono">
                        {Number(order.total_amount).toFixed(2)} د.ل
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[10px] px-2 py-0.5 bg-canvas-subtle rounded-md text-ink-primary font-medium border border-stone-200">
                          {order.payment_method === 'cod' ? (isRtl ? 'عند الاستلام' : 'Cash on Delivery') : (isRtl ? 'بطاقة مصرفية' : 'Card')}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusConf.color}`}>
                          {isRtl ? statusConf.labelAr : statusConf.labelEn}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[11px] text-ink-muted">
                        {new Date(order.created_at).toLocaleDateString(isRtl ? 'ar-LY' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3.5 text-end">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-canvas-subtle hover:bg-brand-sage hover:text-white text-ink-primary rounded-lg text-xs font-semibold transition border border-stone-200"
                        >
                          <Eye size={13} />
                          <span>{isRtl ? 'معالجة' : 'Details'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal / Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 md:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold font-mono text-ink-primary">
                    #{selectedOrder.order_number}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_MAP[selectedOrder.status]?.color}`}>
                    {isRtl ? STATUS_MAP[selectedOrder.status]?.labelAr : STATUS_MAP[selectedOrder.status]?.labelEn}
                  </span>
                </div>
                <p className="text-xs text-ink-muted mt-1 font-mono">
                  {new Date(selectedOrder.created_at).toLocaleString(isRtl ? 'ar-LY' : 'en-US')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 border border-stone-200 rounded-xl hover:bg-stone-50 transition text-ink-muted"
                  title={isRtl ? 'طباعة الفاتورة' : 'Print Invoice'}
                >
                  <Printer size={16} />
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 border border-stone-200 rounded-xl hover:bg-stone-50 transition text-ink-muted"
                >
                  <XCircle size={16} />
                </button>
              </div>
            </div>

            {/* Customer & Shipping Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-canvas-subtle p-4 rounded-2xl border border-stone-200 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-ink-muted uppercase">
                  <User size={13} />
                  <span>{isRtl ? 'بيانات العميل' : 'Customer Info'}</span>
                </div>
                <div className="font-bold text-ink-primary text-sm">{selectedOrder.customer_name}</div>
                <div className="text-ink-muted font-mono">{selectedOrder.customer_phone}</div>
                {selectedOrder.customer_email && (
                  <div className="text-ink-muted">{selectedOrder.customer_email}</div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-ink-muted uppercase">
                  <MapPin size={13} />
                  <span>{isRtl ? 'عنوان التوصيل' : 'Shipping Address'}</span>
                </div>
                <div className="font-bold text-ink-primary text-sm">{selectedOrder.shipping_city}</div>
                <div className="text-ink-muted">{selectedOrder.shipping_address}</div>
                {selectedOrder.notes && (
                  <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg mt-2 border border-amber-200">
                    <span className="font-bold">{isRtl ? 'ملاحظة العميل: ' : 'Customer Note: '}</span>
                    {selectedOrder.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Ordered Items */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs text-ink-primary font-cairo">
                {isRtl ? 'المنتجات المطلوبة' : 'Order Items'}
              </h3>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between bg-white text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-canvas-subtle flex items-center justify-center text-brand-sage font-mono font-bold text-xs border border-stone-200">
                        {item.quantity}x
                      </div>
                      <div>
                        <div className="font-bold text-ink-primary">{item.product_name}</div>
                        <div className="text-[11px] text-ink-muted">
                          {item.variant_name || (isRtl ? 'النسخة القياسية' : 'Standard')}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-ink-primary text-end font-mono">
                      {Number(item.total_price).toFixed(2)} د.ل
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="bg-canvas-subtle rounded-2xl p-4 space-y-1.5 text-xs border border-stone-200">
                <div className="flex justify-between text-ink-muted">
                  <span>{isRtl ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span className="font-mono">{Number(selectedOrder.subtotal).toFixed(2)} د.ل</span>
                </div>
                <div className="flex justify-between text-ink-muted">
                  <span>{isRtl ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
                  <span className="font-mono">{Number(selectedOrder.shipping_cost) === 0 ? (isRtl ? 'مجاني' : 'Free') : `${Number(selectedOrder.shipping_cost).toFixed(2)} د.ل`}</span>
                </div>
                {Number(selectedOrder.discount_amount) > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>{isRtl ? 'خصم الكوبون' : 'Coupon Discount'}</span>
                    <span className="font-mono">-{Number(selectedOrder.discount_amount).toFixed(2)} د.ل</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-ink-primary pt-2 border-t border-stone-200">
                  <span>{isRtl ? 'الإجمالي النهائي' : 'Total'}</span>
                  <span className="font-mono text-brand-amber">{Number(selectedOrder.total_amount).toFixed(2)} د.ل</span>
                </div>
              </div>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleUpdateStatus} className="bg-canvas-subtle p-4 rounded-2xl border border-stone-200 space-y-3">
              <h3 className="font-bold text-xs text-ink-primary flex items-center gap-2 font-cairo">
                <Truck size={15} className="text-brand-sage" />
                <span>{isRtl ? 'تحديث حالة الطلب وإرسال إشعار للعميل' : 'Update Order Status'}</span>
              </h3>

              {actionSuccess && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
                  {actionSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-ink-muted mb-1">
                    {isRtl ? 'الحالة الجديدة' : 'New Status'}
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:border-brand-sage text-ink-primary"
                  >
                    {Object.entries(STATUS_MAP).map(([key, val]) => (
                      <option key={key} value={key}>
                        {isRtl ? val.labelAr : val.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink-muted mb-1">
                    {isRtl ? 'ملاحظة داخلية أو سبب التحديث' : 'Internal Note / Reason'}
                  </label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder={isRtl ? 'مثال: تم تسليم الشحنة لشركة التوصيل في طرابلس' : 'e.g. Handed to courier'}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none focus:border-brand-sage text-ink-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updatingStatus || newStatus === selectedOrder.status}
                  className="px-5 py-2 bg-brand-sage text-white rounded-xl text-xs font-bold hover:bg-brand-olive transition disabled:opacity-50 inline-flex items-center gap-2 shadow-sm"
                >
                  <Send size={13} />
                  <span>{updatingStatus ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'حفظ التحديث' : 'Save Update')}</span>
                </button>
              </div>
            </form>

            {/* Status History Timeline */}
            {selectedOrder.status_logs && selectedOrder.status_logs.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <h4 className="text-xs font-bold text-ink-muted uppercase">
                  {isRtl ? 'سجل تتبع الحالات السابقة' : 'Status History'}
                </h4>
                <div className="space-y-2">
                  {selectedOrder.status_logs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs bg-white p-2.5 rounded-xl border border-stone-200">
                      <Clock size={13} className="text-brand-sage mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-bold text-ink-primary">
                            {STATUS_MAP[log.status]?.[isRtl ? 'labelAr' : 'labelEn'] || log.status}
                          </span>
                          <span className="text-ink-muted font-mono text-[11px]">
                            {new Date(log.created_at).toLocaleString(isRtl ? 'ar-LY' : 'en-US')}
                          </span>
                        </div>
                        {log.note && <p className="text-ink-muted mt-0.5">{log.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
