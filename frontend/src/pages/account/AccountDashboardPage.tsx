import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Package, MapPin, Cpu, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';

export const AccountDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();
  const language = ((i18n.language || 'ar').split('-')[0]) as 'ar' | 'en';
  const isRtl = language === 'ar';
  const [orders, setOrders] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);

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
      }
    };
    loadAccountData();
  }, []);

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-brand-cream">
      
      {/* Welcome Header */}
      <div className="odora-card p-6 sm:p-8 bg-white border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-muted font-sans">
            MY ACCOUNT · حسابي
          </span>
          <h1 className="text-2xl sm:text-3xl font-light text-brand-ink mt-1">
            {language === 'ar' ? `أهلاً بك، ${user?.first_name || user?.email}` : `Welcome, ${user?.first_name || user?.email}`}
          </h1>
          <p className="text-xs text-brand-muted font-medium mt-0.5">
            {language === 'ar' ? 'إدارة طلباتك، عناوين الشحن، ومتابعة أجهزة التعطير المقترنة.' : 'Manage your orders, shipping addresses, and paired smart diffusers.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/products"
            className="px-5 py-2 rounded-full bg-brand-sage hover:bg-brand-olive text-white text-xs font-bold transition-colors shadow-xs"
          >
            {language === 'ar' ? 'تسوق عطور جديدة' : 'Shop Fragrances'}
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          to="/account/orders"
          className="odora-card p-6 bg-white border border-stone-200 hover:border-brand-sage transition-all block group shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
            <Package className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-brand-ink font-sans">{orders.length}</div>
          <div className="text-xs font-bold text-brand-muted mt-1 group-hover:text-brand-sage flex items-center justify-between">
            <span>{language === 'ar' ? 'الطلبات والمشتريات' : 'My Orders'}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </div>
        </Link>

        <Link
          to="/account/addresses"
          className="odora-card p-6 bg-white border border-stone-200 hover:border-brand-sage transition-all block group shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-brand-ink font-sans">{addresses.length}</div>
          <div className="text-xs font-bold text-brand-muted mt-1 group-hover:text-brand-sage flex items-center justify-between">
            <span>{language === 'ar' ? 'عناوين التوصيل المسجلة' : 'Saved Addresses'}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </div>
        </Link>

        <div className="odora-card p-6 bg-white border border-stone-200 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-brand-ink font-sans">{devices.length}</div>
          <div className="text-xs font-bold text-brand-muted mt-1">
            <span>{language === 'ar' ? 'أجهزة المعطرات المقترنة' : 'Paired Diffusers'}</span>
          </div>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="odora-card p-6 sm:p-8 bg-white border border-stone-200 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="font-bold text-base text-brand-ink">
            {language === 'ar' ? 'آخر الطلبات' : 'Recent Orders'}
          </h3>
          <Link to="/account/orders" className="text-xs text-brand-sage hover:underline font-bold">
            {language === 'ar' ? `عرض كل الطلبات (${orders.length})` : `View All (${orders.length})`}
          </Link>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.slice(0, 3).map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-xl border border-stone-200 hover:border-brand-sage transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-brand-ink font-sans text-sm">{ord.order_number}</span>
                  <span className="text-brand-muted ms-3 font-medium">
                    {new Date(ord.created_at).toLocaleDateString(language === 'ar' ? 'ar-LY' : 'en-US')}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-brand-sage font-sans">{ord.total_amount} {language === 'ar' ? 'د.ل' : 'LYD'}</span>
                  <span className="px-2.5 py-1 rounded-full bg-stone-100 font-semibold text-brand-ink">
                    {ord.status_display}
                  </span>
                  <Link
                    to={`/order-tracking?orderNumber=${ord.order_number}`}
                    className="text-brand-sage hover:underline font-bold"
                  >
                    {language === 'ar' ? 'تتبع الشحنة ←' : 'Track Order →'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-brand-muted py-6 text-center font-medium">
            {language === 'ar' ? 'لا توجد طلبات سابقة حتى الآن.' : 'No orders yet.'}
          </p>
        )}
      </div>

      {/* Paired Devices Section */}
      {devices.length > 0 && (
        <div className="odora-card p-6 sm:p-8 bg-white border border-stone-200 space-y-4 shadow-sm">
          <h3 className="font-bold text-base text-brand-ink border-b border-stone-100 pb-3">
            {language === 'ar' ? 'أجهزة التعطير الذكية في حسابك (A316)' : 'Paired Smart Diffusers'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {devices.map((dev) => (
              <div key={dev.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-brand-ink">{dev.device_name}</h4>
                  <p className="text-xs text-brand-muted mt-0.5">{dev.room_name} · {dev.model_name}</p>
                  <p className="text-xs text-brand-sage font-bold mt-1">{dev.current_scent}</p>
                </div>
                <div className="text-end space-y-1">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold block text-center">
                    {dev.oil_level}%
                  </span>
                  <span className="text-[10px] text-brand-muted block text-center font-medium">{dev.intensity}/10</span>
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
