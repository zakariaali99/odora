import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useLanguageStore } from '../../store/useLanguageStore';
import { 
  Package, Search, Filter, RefreshCw, Eye, CheckCircle, 
  Clock, Truck, AlertCircle, XCircle, Printer, Send, User, MapPin, Phone
} from 'lucide-react';

const STATUS_MAP = {
  placed: { labelAr: 'جديد / بانتظار التأكيد', labelEn: 'Placed', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  confirmed: { labelAr: 'مؤكد', labelEn: 'Confirmed', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  processing: { labelAr: 'قيد التجهيز', labelEn: 'Processing', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  shipped: { labelAr: 'تم الشحن', labelEn: 'Shipped', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  delivered: { labelAr: 'تم التوصيل', labelEn: 'Delivered', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  cancelled: { labelAr: 'ملغي', labelEn: 'Cancelled', color: 'bg-rose-100 text-rose-800 border-rose-200' },
};

export default function AdminOrdersPage() {
  const { isRtl } = useLanguageStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Status update state
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = '/orders/admin-orders/';
      const params = {};
      if (activeFilter !== 'all') params.status = activeFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      
      const res = await api.get(url, { params });
      setOrders(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleViewOrder = async (orderId) => {
    try {
      const res = await api.get(`/orders/admin-orders/${orderId}/`);
      setSelectedOrder(res.data);
      setNewStatus(res.data.status);
      setStatusNote('');
    } catch (err) {
      console.error('Failed to get order detail', err);
    }
  };

  const handleUpdateStatus = async (e) => {
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
          <h1 className="text-2xl font-bold text-odora-dark font-serif">
            {isRtl ? 'إدارة الطلبات والمبيعات' : 'Orders & Sales Management'}
          </h1>
          <p className="text-sm text-odora-dark/60 mt-1">
            {isRtl ? 'متابعة الطلبات المباشرة، معالجة حالات الشحن والتوصيل في مدن ليبيا' : 'Monitor live orders, update fulfillment and shipping across Libya'}
          </p>
        </div>
        <button 
          onClick={fetchOrders}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 border border-odora-dark/15 rounded-xl text-sm font-medium hover:bg-white transition shadow-sm"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>{isRtl ? 'تحديث البيانات' : 'Refresh'}</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-odora-dark/5 space-y-4">
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
                    ? 'bg-odora-olive text-white shadow-sm'
                    : 'bg-odora-canvas/60 text-odora-dark/70 hover:bg-odora-canvas'
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
                className="w-full pl-9 pr-9 py-2 rounded-xl border border-odora-dark/15 text-sm focus:outline-none focus:border-odora-olive bg-odora-canvas/30"
              />
              <Search size={16} className={`absolute top-2.5 ${isRtl ? 'left-3' : 'right-3'} text-odora-dark/40`} />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-odora-dark text-white rounded-xl text-sm font-medium hover:bg-odora-dark/90 transition"
            >
              {isRtl ? 'بحث' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-odora-dark/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[780px] w-full text-start text-sm">
            <thead className="bg-odora-canvas/50 text-odora-dark/70 text-xs uppercase font-semibold border-b border-odora-dark/10">
              <tr>
                <th className="px-5 py-4 text-start">{isRtl ? 'رقم الطلب' : 'Order #'}</th>
                <th className="px-5 py-4 text-start">{isRtl ? 'العميل' : 'Customer'}</th>
                <th className="px-5 py-4 text-start">{isRtl ? 'المدينة' : 'City'}</th>
                <th className="px-5 py-4 text-start">{isRtl ? 'الإجمالي' : 'Total'}</th>
                <th className="px-5 py-4 text-start">{isRtl ? 'طريقة الدفع' : 'Payment'}</th>
                <th className="px-5 py-4 text-start">{isRtl ? 'الحالة' : 'Status'}</th>
                <th className="px-5 py-4 text-start">{isRtl ? 'التاريخ' : 'Date'}</th>
                <th className="px-5 py-4 text-end">{isRtl ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-odora-dark/5">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-odora-dark/50">
                    <RefreshCw className="animate-spin inline-block mx-auto mb-2 text-odora-olive" size={24} />
                    <p>{isRtl ? 'جاري تحميل سجلات الطلبات...' : 'Loading orders...'}</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-odora-dark/50">
                    <Package className="inline-block mx-auto mb-2 text-odora-dark/30" size={32} />
                    <p>{isRtl ? 'لا توجد طلبات مطابقة للبحث أو التصفية الحالية' : 'No orders found matching filters'}</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const statusConf = STATUS_MAP[order.status] || { labelAr: order.status, labelEn: order.status, color: 'bg-gray-100 text-gray-800' };
                  return (
                    <tr key={order.id} className="hover:bg-odora-canvas/20 transition group">
                      <td className="px-5 py-4 font-mono font-semibold text-odora-dark">
                        {order.order_number}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-odora-dark">{order.customer_name}</div>
                        <div className="text-xs text-odora-dark/50 font-mono">{order.customer_phone}</div>
                      </td>
                      <td className="px-5 py-4 text-odora-dark/80">
                        {order.shipping_city || '—'}
                      </td>
                      <td className="px-5 py-4 font-semibold text-odora-dark">
                        {Number(order.total_amount).toFixed(2)} د.ل
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs px-2 py-1 bg-odora-canvas rounded-md text-odora-dark/80 border border-odora-dark/5">
                          {order.payment_method === 'cod' ? (isRtl ? 'الدفع عند الاستلام' : 'Cash on Delivery') : (isRtl ? 'بطاقة مصرفية' : 'Card')}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConf.color}`}>
                          {isRtl ? statusConf.labelAr : statusConf.labelEn}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-odora-dark/60">
                        {new Date(order.created_at).toLocaleDateString('ar-LY', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-5 py-4 text-end">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-odora-canvas hover:bg-odora-olive hover:text-white text-odora-dark rounded-lg text-xs font-medium transition"
                        >
                          <Eye size={14} />
                          <span>{isRtl ? 'تفاصيل ومعالجة' : 'Details'}</span>
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
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-odora-dark/10 p-6 md:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-odora-dark/10 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold font-mono text-odora-dark">
                    #{selectedOrder.order_number}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_MAP[selectedOrder.status]?.color}`}>
                    {isRtl ? STATUS_MAP[selectedOrder.status]?.labelAr : STATUS_MAP[selectedOrder.status]?.labelEn}
                  </span>
                </div>
                <p className="text-xs text-odora-dark/50 mt-1">
                  {new Date(selectedOrder.created_at).toLocaleString('ar-LY')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 border border-odora-dark/15 rounded-xl hover:bg-odora-canvas transition text-odora-dark/70"
                  title={isRtl ? 'طباعة الفاتورة' : 'Print Invoice'}
                >
                  <Printer size={18} />
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 border border-odora-dark/15 rounded-xl hover:bg-odora-canvas transition text-odora-dark/70"
                >
                  <XCircle size={18} />
                </button>
              </div>
            </div>

            {/* Customer & Shipping Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-odora-canvas/40 p-4 rounded-2xl border border-odora-dark/5 text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-odora-dark/60 uppercase">
                  <User size={14} />
                  <span>{isRtl ? 'بيانات العميل' : 'Customer Info'}</span>
                </div>
                <div className="font-semibold text-odora-dark">{selectedOrder.customer_name}</div>
                <div className="text-xs text-odora-dark/70 font-mono">{selectedOrder.customer_phone}</div>
                {selectedOrder.customer_email && (
                  <div className="text-xs text-odora-dark/70">{selectedOrder.customer_email}</div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-odora-dark/60 uppercase">
                  <MapPin size={14} />
                  <span>{isRtl ? 'عنوان التوصيل' : 'Shipping Address'}</span>
                </div>
                <div className="font-semibold text-odora-dark">{selectedOrder.shipping_city}</div>
                <div className="text-xs text-odora-dark/70">{selectedOrder.shipping_address}</div>
                {selectedOrder.notes && (
                  <div className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg mt-2 border border-amber-200">
                    <span className="font-bold">{isRtl ? 'ملاحظة العميل: ' : 'Customer Note: '}</span>
                    {selectedOrder.notes}
                  </div>
                )}
              </div>
            </div>

            {/* Ordered Items */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-odora-dark">
                {isRtl ? 'المنتجات المطلوبة' : 'Order Items'}
              </h3>
              <div className="divide-y divide-odora-dark/10 border border-odora-dark/10 rounded-2xl overflow-hidden">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between bg-white text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-odora-canvas flex items-center justify-center text-odora-olive font-mono text-xs">
                        {item.quantity}x
                      </div>
                      <div>
                        <div className="font-medium text-odora-dark">{item.product_name}</div>
                        <div className="text-xs text-odora-dark/50">
                          {item.variant_name || (isRtl ? 'النسخة القياسية' : 'Standard')}
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold text-odora-dark text-end">
                      {Number(item.total_price).toFixed(2)} د.ل
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="bg-odora-canvas/20 rounded-2xl p-4 space-y-1 text-sm">
                <div className="flex justify-between text-xs text-odora-dark/70">
                  <span>{isRtl ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span>{Number(selectedOrder.subtotal).toFixed(2)} د.ل</span>
                </div>
                <div className="flex justify-between text-xs text-odora-dark/70">
                  <span>{isRtl ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
                  <span>{Number(selectedOrder.shipping_cost) === 0 ? (isRtl ? 'مجاني' : 'Free') : `${Number(selectedOrder.shipping_cost).toFixed(2)} د.ل`}</span>
                </div>
                {Number(selectedOrder.discount_amount) > 0 && (
                  <div className="flex justify-between text-xs text-emerald-700">
                    <span>{isRtl ? 'خصم الكوبون' : 'Coupon Discount'}</span>
                    <span>-{Number(selectedOrder.discount_amount).toFixed(2)} د.ل</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base text-odora-dark pt-2 border-t border-odora-dark/10">
                  <span>{isRtl ? 'الإجمالي النهائي' : 'Total'}</span>
                  <span>{Number(selectedOrder.total_amount).toFixed(2)} د.ل</span>
                </div>
              </div>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleUpdateStatus} className="bg-odora-canvas/50 p-4 rounded-2xl border border-odora-dark/10 space-y-4">
              <h3 className="font-bold text-sm text-odora-dark flex items-center gap-2">
                <Truck size={16} className="text-odora-olive" />
                <span>{isRtl ? 'تحديث حالة الطلب وإرسال إشعار للعميل' : 'Update Order Status'}</span>
              </h3>

              {actionSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
                  {actionSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-odora-dark/70 mb-1">
                    {isRtl ? 'الحالة الجديدة' : 'New Status'}
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-odora-dark/15 text-sm bg-white focus:outline-none focus:border-odora-olive"
                  >
                    {Object.entries(STATUS_MAP).map(([key, val]) => (
                      <option key={key} value={key}>
                        {isRtl ? val.labelAr : val.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-odora-dark/70 mb-1">
                    {isRtl ? 'ملاحظة داخلية أو سبب التحديث' : 'Internal Note / Reason'}
                  </label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder={isRtl ? 'مثال: تم تسليم الشحنة لشركة التوصيل في طرابلس' : 'e.g. Handed to courier'}
                    className="w-full px-3 py-2 rounded-xl border border-odora-dark/15 text-sm bg-white focus:outline-none focus:border-odora-olive"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updatingStatus || newStatus === selectedOrder.status}
                  className="px-5 py-2 bg-odora-olive text-white rounded-xl text-sm font-semibold hover:bg-odora-olive/90 transition disabled:opacity-50 inline-flex items-center gap-2 shadow-sm"
                >
                  <Send size={14} />
                  <span>{updatingStatus ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'حفظ التحديث' : 'Save Update')}</span>
                </button>
              </div>
            </form>

            {/* Status History Timeline */}
            {selectedOrder.status_logs && selectedOrder.status_logs.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-odora-dark/10">
                <h4 className="text-xs font-bold text-odora-dark/60 uppercase">
                  {isRtl ? 'سجل تتبع الحالات السابقة' : 'Status History'}
                </h4>
                <div className="space-y-2">
                  {selectedOrder.status_logs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs bg-white p-2.5 rounded-xl border border-odora-dark/5">
                      <Clock size={14} className="text-odora-olive mt-0.5" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-semibold text-odora-dark">
                            {STATUS_MAP[log.status]?.[isRtl ? 'labelAr' : 'labelEn'] || log.status}
                          </span>
                          <span className="text-odora-dark/40 font-mono">
                            {new Date(log.created_at).toLocaleString('ar-LY')}
                          </span>
                        </div>
                        {log.note && <p className="text-odora-dark/60 mt-0.5">{log.note}</p>}
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
}
