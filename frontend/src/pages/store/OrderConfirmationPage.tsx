import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { CheckCircle, Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const OrderConfirmationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const language = ((i18n.language || 'ar').split('-')[0]) as 'ar' | 'en';
  const order = (location.state as any)?.order;

  return (
    <div className="min-h-[80vh] py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center space-y-8 bg-brand-cream">
      
      {/* Success Badge */}
      <div className="space-y-3">
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto shadow-md border border-emerald-200">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-muted font-sans">
          ORDER CONFIRMED
        </span>
        <h1 className="text-3xl sm:text-4xl font-light text-brand-ink">
          {t('orderConfirmation.title', 'تم تأكيد طلبك بنجاح!')}
        </h1>
        <p className="text-sm text-brand-muted font-medium max-w-md mx-auto">
          {t('orderConfirmation.subtitle', 'شكراً لاختيارك أودورا. سنقوم بتجهيز وتوصيل طلبك في أقرب وقت.')}
        </p>
      </div>

      {/* Order Info Card */}
      <div className="odora-card p-6 sm:p-8 bg-white border border-stone-200 shadow-md text-start space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
          <div>
            <span className="text-xs text-brand-muted font-medium">{t('orderConfirmation.orderNumber', 'رقم الطلب')}:</span>
            <div className="text-xl font-bold text-brand-ink font-sans mt-0.5">
              {orderNumber || order?.order_number}
            </div>
          </div>
          <div className="text-start sm:text-end">
            <span className="text-xs text-brand-muted font-medium">{language === 'ar' ? 'حالة الطلب:' : 'Order Status:'}</span>
            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mt-0.5 inline-block">
              {order?.status_display || (language === 'ar' ? 'تم استلام الطلب وتأكيده' : 'Order Placed & Confirmed')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-brand-muted font-medium">{language === 'ar' ? 'المستلم:' : 'Customer:'}</span>
            <p className="font-bold text-brand-ink mt-0.5">{order?.customer_name || (language === 'ar' ? 'العميل' : 'Customer')}</p>
          </div>
          <div>
            <span className="text-brand-muted font-medium">{language === 'ar' ? 'رقم الهاتف:' : 'Phone:'}</span>
            <p className="font-bold text-brand-ink mt-0.5 font-sans">{order?.customer_phone}</p>
          </div>
          <div>
            <span className="text-brand-muted font-medium">{language === 'ar' ? 'مدينة التوصيل:' : 'City:'}</span>
            <p className="font-bold text-brand-ink mt-0.5">{order?.shipping_city}</p>
          </div>
          <div>
            <span className="text-brand-muted font-medium">{language === 'ar' ? 'طريقة الدفع:' : 'Payment:'}</span>
            <p className="font-bold text-brand-ink mt-0.5">{order?.payment_method_display || (language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery')}</p>
          </div>
        </div>

        {order?.items && order.items.length > 0 && (
          <div className="pt-4 border-t border-stone-100 space-y-2">
            <span className="text-xs font-bold text-brand-muted">{language === 'ar' ? 'المنتجات المطلوبة:' : 'Ordered Items:'}</span>
            {order.items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-xs py-1">
                <span>{item.quantity}× {item.product_name} {item.colorway_name && `(${item.colorway_name})`}</span>
                <span className="font-bold text-brand-sage font-sans">{item.total_price} {t('common.currency', 'د.ل')}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-brand-ink">
              <span>{t('cart.total', 'المجموع الكلي')}:</span>
              <span className="text-brand-sage font-sans">{order.total_amount} {t('common.currency', 'د.ل')}</span>
            </div>
          </div>
        )}

        <div className="p-4 bg-stone-50 border border-stone-200/70 rounded-xl flex items-center gap-3 text-xs text-brand-muted font-medium">
          <Truck className="w-5 h-5 text-brand-sage shrink-0" />
          <span>{language === 'ar' ? 'مدة الشحن المتوقعة: خلال 24 إلى 48 ساعة لكافة المدن الليبية.' : 'Estimated delivery: 24 to 48 hours to all Libyan cities.'}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to={`/order-tracking?orderNumber=${orderNumber || order?.order_number}`}
          className="px-8 py-3 rounded-full bg-brand-sage hover:bg-brand-olive text-white font-bold text-xs transition-colors shadow-xs"
        >
          {t('orderConfirmation.trackOrder', 'تتبع حالة الطلب')}
        </Link>
        <Link
          to="/"
          className="px-8 py-3 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-brand-ink font-bold text-xs transition-colors shadow-2xs"
        >
          {t('orderConfirmation.backToStore', 'العودة للمتجر')}
        </Link>
      </div>

    </div>
  );
};

export default OrderConfirmationPage;
