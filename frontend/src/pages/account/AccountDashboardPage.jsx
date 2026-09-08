import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, Cpu, User, ArrowLeft, Clock } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';

export const AccountDashboardPage = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [devices, setDevices] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccountData = async () => {
      try {
        const [ordRes, devRes, addrRes] = await Promise.all([
          api.getMyOrders(),
          api.getCustomerDevices(),
          api.getAddresses(),
        ]);
        setOrders(ordRes.data.results || ordRes.data || []);
        setDevices(devRes.data.results || devRes.data || []);
        setAddresses(addrRes.data.results || addrRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadAccountData();
  }, []);

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Welcome Header */}
      <div className="odora-card p-6 sm:p-8 bg-white border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-muted font-poppins">
            MY ACCOUNT · حسابي
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-brand-ink mt-1">
            أهلاً بك، {user?.first_name || user?.email}
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">
            إدارة طلباتك، عناوين الشحن، ومتابعة أجهزة التعطير المقترنة.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/products"
            className="px-5 py-2 rounded-full bg-brand-sage hover:bg-brand-olive text-white text-xs font-semibold transition-colors"
          >
            تسوق عطور جديدة
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          to="/account/orders"
          className="odora-card p-6 bg-white border border-stone-200/80 hover:border-brand-sage transition-all block group"
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
            <Package className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-brand-ink font-poppins">{orders.length}</div>
          <div className="text-xs font-semibold text-brand-muted mt-1 group-hover:text-brand-sage flex items-center justify-between">
            <span>الطلبات والمشتريات</span>
            <ArrowLeft className="w-4 h-4" />
          </div>
        </Link>

        <Link
          to="/account/addresses"
          className="odora-card p-6 bg-white border border-stone-200/80 hover:border-brand-sage transition-all block group"
        >
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-brand-ink font-poppins">{addresses.length}</div>
          <div className="text-xs font-semibold text-brand-muted mt-1 group-hover:text-brand-sage flex items-center justify-between">
            <span>عناوين التوصيل المسجلة</span>
            <ArrowLeft className="w-4 h-4" />
          </div>
        </Link>

        <div className="odora-card p-6 bg-white border border-stone-200/80">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-brand-ink font-poppins">{devices.length}</div>
          <div className="text-xs font-semibold text-brand-muted mt-1">
            <span>أجهزة المعطرات المقترنة بالتطبيق</span>
          </div>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="odora-card p-6 sm:p-8 bg-white border border-stone-200/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="font-bold text-base text-brand-ink">آخر الطلبات</h3>
          <Link to="/account/orders" className="text-xs text-brand-sage hover:underline font-semibold">
            عرض كل الطلبات ({orders.length})
          </Link>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.slice(0, 3).map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-xl border border-stone-100 hover:border-stone-200 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-brand-ink font-poppins text-sm">{ord.order_number}</span>
                  <span className="text-brand-muted mr-3">
                    {new Date(ord.created_at).toLocaleDateString('ar-LY')}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-brand-olive font-poppins">{ord.total_amount} د.ل</span>
                  <span className="px-2.5 py-1 rounded-full bg-stone-100 font-medium text-stone-700">
                    {ord.status_display}
                  </span>
                  <Link
                    to={`/order-tracking?orderNumber=${ord.order_number}`}
                    className="text-brand-sage hover:underline font-semibold"
                  >
                    تتبع الشحنة ←
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-brand-muted py-6 text-center">لا توجد طلبات سابقة حتى الآن.</p>
        )}
      </div>

      {/* Paired Devices Section */}
      {devices.length > 0 && (
        <div className="odora-card p-6 sm:p-8 bg-white border border-stone-200/80 space-y-4">
          <h3 className="font-bold text-base text-brand-ink border-b border-stone-100 pb-3">
            أجهزة التعطير الذكية في حسابك (A316)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {devices.map((dev) => (
              <div key={dev.id} className="p-4 rounded-2xl bg-brand-cream/50 border border-stone-200/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-brand-ink">{dev.device_name}</h4>
                  <p className="text-xs text-brand-muted mt-0.5">{dev.room_name} · الموديل: {dev.model_name}</p>
                  <p className="text-xs text-brand-olive font-semibold mt-1">العطر: {dev.current_scent}</p>
                </div>
                <div className="text-left space-y-1">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold block text-center">
                    نسبة الزيت {dev.oil_level}%
                  </span>
                  <span className="text-[10px] text-brand-muted block text-center">شدة الرش: {dev.intensity}/10</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AccountDashboardPage;
