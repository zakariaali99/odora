import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

export const OrderTrackingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const language = ((i18n.language || 'ar').split('-')[0]) as 'ar' | 'en';
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('orderNumber') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (num: string, ph: string) => {
    if (!num) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await api.trackOrder(num.trim(), ph.trim());
      setOrder(res.data);
    } catch {
      setError(language === 'ar' ? 'لم يتم العثور على أي شحنة مطابقة للبيانات المدخلة. تأكد من صحة رقم الطلب.' : 'No matching order found. Please verify your order number.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialOrder = searchParams.get('orderNumber');
    if (initialOrder) {
      fetchTracking(initialOrder, phone);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setSearchParams({ orderNumber: orderNumber.trim(), phone: phone.trim() });
    fetchTracking(orderNumber.trim(), phone.trim());
  };

  // Steps for visual tracking
  const steps = [
    { key: 'placed', label: language === 'ar' ? 'استلام الطلب' : 'Order Placed', icon: Clock },
    { key: 'confirmed', label: language === 'ar' ? 'تأكيد الطلب' : 'Confirmed', icon: CheckCircle2 },
    { key: 'processing', label: language === 'ar' ? 'جاري التجهيز' : 'Processing', icon: Package },
    { key: 'shipped', label: language === 'ar' ? 'مع مندوب التوصيل' : 'Out for Delivery', icon: Truck },
    { key: 'delivered', label: language === 'ar' ? 'تم التوصيل بنجاح' : 'Delivered', icon: CheckCircle2 },
  ];

  const getStepIndex = (status: string) => {
    const map: Record<string, number> = { placed: 0, new: 0, confirmed: 1, processing: 2, shipped: 3, delivered: 4, cancelled: -1 };
    return map[status] !== undefined ? map[status] : 0;
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  return (
    <div className="min-h-screen pb-20 pt-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 bg-brand-cream">
      
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-muted font-sans">
          SHIPMENT TRACKING
        </span>
        <h1 className="text-3xl font-light text-brand-ink">
          {t('tracking.title', 'تتبع حالة الطلب')}
        </h1>
        <p className="text-xs text-brand-muted font-medium max-w-md mx-auto">
          {t('tracking.subtitle', 'أدخل رقم الطلب ورقم الهاتف للاستعلام عن خط سير شحنتك')}
        </p>
      </div>

      {/* Search Input Box */}
      <div className="odora-card p-6 bg-white border border-stone-200 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              required
              placeholder={t('tracking.orderPlaceholder', 'رقم الطلب (مثال: OD-2026-0001)')}
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-xl uppercase font-sans focus:outline-none focus:border-brand-sage bg-white text-brand-ink"
            />
          </div>
          <div className="sm:w-52">
            <input
              type="tel"
              placeholder={t('tracking.phonePlaceholder', 'رقم الهاتف المسجل')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-xl font-sans focus:outline-none focus:border-brand-sage bg-white text-brand-ink"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-brand-sage hover:bg-brand-olive text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shrink-0 shadow-xs"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? (language === 'ar' ? 'جاري البحث...' : 'Searching...') : t('tracking.trackBtn', 'استعلام عن الحالة')}</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Tracking Result View */}
      {order && (
        <div className="odora-card p-6 sm:p-8 bg-white border border-stone-200 shadow-md space-y-8 animate-in fade-in duration-300">
          
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
            <div>
              <span className="text-xs text-brand-muted font-medium">{language === 'ar' ? 'رقم الشحنة:' : 'Order Number:'}</span>
              <h2 className="text-xl font-bold text-brand-ink font-sans">{order.order_number}</h2>
            </div>
            <div className="text-start sm:text-end">
              <span className="text-xs text-brand-muted font-medium">{language === 'ar' ? 'حالة الشحنة الحالية:' : 'Current Status:'}</span>
              <div className="text-xs font-bold text-brand-sage bg-brand-pale/40 border border-brand-sage/30 px-3 py-1 rounded-full mt-0.5 inline-block">
                {order.status_display}
              </div>
            </div>
          </div>

          {/* Visual Progress Steps */}
          <div className="relative py-4">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={step.key} className="flex sm:flex-col items-center gap-3 sm:text-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0 ${
                        isCurrent
                          ? 'bg-brand-ink text-white ring-4 ring-brand-pale shadow-md'
                          : isPassed
                          ? 'bg-brand-sage text-white'
                          : 'bg-stone-100 text-stone-400 border border-stone-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className={`text-xs block font-bold ${isPassed ? 'text-brand-ink' : 'text-stone-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                {language === 'ar' ? 'سجل التحديثات الزمني' : 'Activity Timeline'}
              </h4>
              <div className="space-y-3 border-s-2 border-brand-sage ps-4">
                {order.status_logs && order.status_logs.length > 0 ? (
                  order.status_logs.map((log: any) => (
                    <div key={log.id} className="relative">
                      <div className="text-xs font-bold text-brand-ink">{log.status_display}</div>
                      <div className="text-[11px] text-brand-muted">{log.note}</div>
                      <div className="text-[10px] text-stone-400 font-sans mt-0.5">
                        {new Date(log.created_at).toLocaleString(language === 'ar' ? 'ar-LY' : 'en-US')}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-brand-muted">{language === 'ar' ? 'لا توجد سجلات بعد' : 'No logs recorded yet'}</p>
                )}
              </div>
            </div>

            <div className="space-y-3 p-4 bg-stone-50 border border-stone-200/70 rounded-2xl text-xs">
              <h4 className="text-xs font-bold text-brand-ink">{language === 'ar' ? 'تفاصيل عنوان الاستلام' : 'Delivery Address'}</h4>
              <p className="font-bold text-brand-ink">{order.customer_name}</p>
              <p className="text-brand-muted font-sans">{order.customer_phone}</p>
              <div className="flex items-start gap-1.5 text-brand-muted font-medium">
                <MapPin className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
                <span>{order.shipping_city} — {order.shipping_address}</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default OrderTrackingPage;
