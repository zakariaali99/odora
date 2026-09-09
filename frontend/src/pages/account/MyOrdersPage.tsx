import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';
import api from '../../services/api';

export const MyOrdersPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const language = ((i18n.language || 'ar').split('-')[0]) as 'ar' | 'en';
  const [orders, setOrders] = useState<any[]>([]);
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
    <div className="min-h-screen pb-20 pt-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 bg-brand-cream">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">
            {language === 'ar' ? 'طلباتي ومشترياتي' : 'My Orders & Purchases'}
          </h1>
          <p className="text-xs text-brand-muted font-medium mt-0.5">
            {language === 'ar' ? 'سجل كامل بجميع طلبياتك وحالات الشحن والتوصيل' : 'Full history of your orders and fulfillment statuses'}
          </p>
        </div>
        <Link to="/account/dashboard" className="text-xs text-brand-sage font-bold hover:underline">
          {language === 'ar' ? 'العودة لبوابة الحساب' : 'Back to Dashboard'}
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 rounded-2xl bg-white border border-stone-200 animate-pulse" />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="odora-card p-6 bg-white border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-base text-brand-ink font-sans">{order.order_number}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    {order.status_display}
                  </span>
                </div>
                <p className="text-xs text-brand-muted font-medium mt-1">
                  {language === 'ar'
                    ? `تاريخ الطلب: ${new Date(order.created_at).toLocaleDateString('ar-LY')} · التوصيل إلى: ${order.shipping_city}`
                    : `Ordered on: ${new Date(order.created_at).toLocaleDateString('en-US')} · Ship to: ${order.shipping_city}`}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-stone-100">
                <div className="text-start">
                  <span className="text-xs text-brand-muted font-medium block">{language === 'ar' ? 'الإجمالي:' : 'Total:'}</span>
                  <span className="text-base font-bold text-brand-sage font-sans">{order.total_amount} {language === 'ar' ? 'د.ل' : 'LYD'}</span>
                </div>

                <Link
                  to={`/order-tracking?orderNumber=${order.order_number}`}
                  className="px-4 py-2 rounded-full bg-brand-pale/40 text-brand-sage hover:bg-brand-sage hover:text-white transition-colors text-xs font-bold flex items-center gap-1.5 border border-stone-200 shadow-2xs"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تتبع الشحنة' : 'Track Order'}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-3 bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          <p className="text-base font-bold text-brand-ink">
            {language === 'ar' ? 'لا توجد طلبات سابقة مسجلة' : 'No previous orders found'}
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-2.5 rounded-full bg-brand-sage text-white text-xs font-bold shadow-xs hover:bg-brand-olive"
          >
            {language === 'ar' ? 'تصفح المتجر واطلب الآن' : 'Shop Fragrances Now'}
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
