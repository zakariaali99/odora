import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle, MapPin } from 'lucide-react';
import api from '../../services/api';

export const OrderTrackingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('orderNumber') || '');
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (num, ph) => {
    if (!num) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await api.trackOrder(num.trim(), ph.trim());
      setOrder(res.data);
    } catch (err) {
      setError('لم يتم العثور على أي شحنة مطابقة للبيانات المدخلة. تأكد من صحة رقم الطلب.');
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setSearchParams({ orderNumber: orderNumber.trim(), phone: phone.trim() });
    fetchTracking(orderNumber.trim(), phone.trim());
  };

  // Steps for visual tracking
  const steps = [
    { key: 'placed', label: 'استلام الطلب', icon: Clock },
    { key: 'confirmed', label: 'تأكيد الطلب', icon: CheckCircle2 },
    { key: 'processing', label: 'جاري التجهيز والتعبئة', icon: Package },
    { key: 'shipped', label: 'مع مندوب التوصيل', icon: Truck },
    { key: 'delivered', label: 'تم التوصيل بنجاح', icon: CheckCircle2 },
  ];

  const getStepIndex = (status) => {
    const map = { placed: 0, confirmed: 1, processing: 2, shipped: 3, delivered: 4, cancelled: -1 };
    return map[status] !== undefined ? map[status] : 0;
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  return (
    <div className="min-h-screen pb-20 pt-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-muted font-poppins">
          SHIPMENT TRACKING
        </span>
        <h1 className="text-3xl font-light text-brand-ink">
          تتبع حالة شحنتك
        </h1>
        <p className="text-xs text-brand-muted max-w-md mx-auto">
          أدخل رقم طلبك (مثل OD-2026-XXXX) لمتابعة مسار شحنتك لحظة بلحظة حتى وصولها إلى بابك.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="odora-card p-6 bg-white border border-stone-200/80">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              required
              placeholder="رقم الطلب (مثال: OD-2026-1001)..."
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-xl uppercase font-poppins focus:outline-none focus:border-brand-sage"
            />
          </div>
          <div className="sm:w-52">
            <input
              type="tel"
              placeholder="رقم الهاتف (اختياري)..."
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-stone-200 rounded-xl font-poppins focus:outline-none focus:border-brand-sage"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-brand-sage hover:bg-brand-olive text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'جاري البحث...' : 'تتبع الشحنة'}</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tracking Result View */}
      {order && (
        <div className="odora-card p-6 sm:p-8 bg-white border border-stone-200/80 space-y-8 animate-in fade-in duration-300">
          
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
            <div>
              <span className="text-xs text-brand-muted">رقم الشحنة:</span>
              <h2 className="text-xl font-bold text-brand-ink font-poppins">{order.order_number}</h2>
            </div>
            <div className="text-left">
              <span className="text-xs text-brand-muted">حالة الشحنة الحالية:</span>
              <div className="text-xs font-bold text-brand-olive bg-brand-pale px-3 py-1 rounded-full mt-0.5 inline-block">
                {order.status_display}
              </div>
            </div>
          </div>

          {/* Visual Progress Steps */}
          <div className="relative py-4">
            <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-stone-100 -translate-y-1/2 z-0" />
            <div
              className="hidden sm:block absolute top-1/2 right-0 h-1 bg-brand-sage -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
            />

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
                          ? 'bg-brand-dark text-white ring-4 ring-brand-pale shadow-md'
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
                سجل التحديثات الزمني
              </h4>
              <div className="space-y-3 border-r-2 border-brand-sage pr-4">
                {order.status_logs && order.status_logs.length > 0 ? (
                  order.status_logs.map((log) => (
                    <div key={log.id} className="relative">
                      <span className="absolute -right-[21px] top-1.5 w-2 h-2 rounded-full bg-brand-sage" />
                      <div className="text-xs font-bold text-brand-ink">{log.status_display}</div>
                      <div className="text-[11px] text-brand-muted">{log.note}</div>
                      <div className="text-[10px] text-stone-400 font-poppins mt-0.5">
                        {new Date(log.created_at).toLocaleString('ar-LY')}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-brand-muted">لا توجد سجلات بعد</p>
                )}
              </div>
            </div>

            <div className="space-y-3 p-4 bg-[#FAF7F2] rounded-2xl text-xs">
              <h4 className="text-xs font-bold text-brand-olive">تفاصيل عنوان الاستلام</h4>
              <p className="font-semibold text-brand-ink">{order.customer_name}</p>
              <p className="text-brand-muted font-poppins">{order.customer_phone}</p>
              <div className="flex items-start gap-1.5 text-brand-muted">
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
