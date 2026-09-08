import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowLeft, Truck } from 'lucide-react';
import api from '../../services/api';

export const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.getMyOrders();
        setOrders(res.data.results || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">طلباتي ومشترياتي</h1>
          <p className="text-xs text-brand-muted mt-0.5">سجل كامل بجميع طلبياتك وحالات الشحن والتوصيل</p>
        </div>
        <Link to="/account/dashboard" className="text-xs text-brand-sage font-semibold hover:underline">
          العودة لبوابة الحساب
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 rounded-2xl bg-stone-200/60 animate-pulse" />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="odora-card p-6 bg-white border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-base text-brand-ink font-poppins">{order.order_number}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold">
                    {order.status_display}
                  </span>
                </div>
                <p className="text-xs text-brand-muted mt-1">
                  تاريخ الطلب: {new Date(order.created_at).toLocaleDateString('ar-LY')} · التوصيل إلى: {order.shipping_city}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-stone-100">
                <div className="text-left">
                  <span className="text-xs text-brand-muted block">الإجمالي:</span>
                  <span className="text-base font-bold text-brand-olive font-poppins">{order.total_amount} د.ل</span>
                </div>

                <Link
                  to={`/order-tracking?orderNumber=${order.order_number}`}
                  className="px-4 py-2 rounded-full bg-brand-pale text-brand-olive hover:bg-brand-sage hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>تتبع الشحنة</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-3">
          <p className="text-base font-semibold text-brand-ink">لا توجد طلبات سابقة مسجلة</p>
          <Link
            to="/products"
            className="inline-block px-6 py-2.5 rounded-full bg-brand-sage text-white text-xs font-semibold"
          >
            تصفح المتجر واطلب الآن
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
