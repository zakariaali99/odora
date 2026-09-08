import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { CheckCircle, Truck, Package, ArrowLeft, Home } from 'lucide-react';

export const OrderConfirmationPage = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="min-h-[80vh] py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center space-y-8">
      
      {/* Success Badge */}
      <div className="space-y-3">
        <div className="w-20 h-20 rounded-full bg-brand-pale text-brand-olive flex items-center justify-center mx-auto shadow-md">
          <CheckCircle className="w-10 h-10 text-brand-sage" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-muted font-poppins">
          ORDER CONFIRMED
        </span>
        <h1 className="text-3xl sm:text-4xl font-light text-brand-ink">
          شكراً لتسوقك من أودورا!
        </h1>
        <p className="text-sm text-brand-muted max-w-md mx-auto">
          تم استلام طلبك بنجاح وسيبدأ فريقنا في تجهيز شحنتك بعناية فائقة لتصلك في أسرع وقت.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="odora-card p-6 sm:p-8 bg-white border border-stone-200/80 text-right space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
          <div>
            <span className="text-xs text-brand-muted">رقم الطلب المرجعي:</span>
            <div className="text-xl font-bold text-brand-ink font-poppins mt-0.5">
              {orderNumber || order?.order_number}
            </div>
          </div>
          <div className="text-left">
            <span className="text-xs text-brand-muted">حالة الطلب:</span>
            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mt-0.5 inline-block">
              {order?.status_display || 'تم استلام الطلب وتأكيده'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-brand-muted">المستلم:</span>
            <p className="font-semibold text-brand-ink mt-0.5">{order?.customer_name || 'العميل'}</p>
          </div>
          <div>
            <span className="text-brand-muted">رقم الهاتف:</span>
            <p className="font-semibold text-brand-ink mt-0.5 font-poppins">{order?.customer_phone}</p>
          </div>
          <div>
            <span className="text-brand-muted">مدينة التوصيل:</span>
            <p className="font-semibold text-brand-ink mt-0.5">{order?.shipping_city}</p>
          </div>
          <div>
            <span className="text-brand-muted">طريقة الدفع:</span>
            <p className="font-semibold text-brand-ink mt-0.5">{order?.payment_method_display || 'الدفع عند الاستلام'}</p>
          </div>
        </div>

        {order?.items && order.items.length > 0 && (
          <div className="pt-4 border-t border-stone-100 space-y-2">
            <span className="text-xs font-bold text-brand-muted">المنتجات المطلوبة:</span>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-xs py-1">
                <span>{item.quantity}× {item.product_name} {item.colorway_name && `(${item.colorway_name})`}</span>
                <span className="font-bold text-brand-olive font-poppins">{item.total_price} د.ل</span>
              </div>
            ))}
            <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-brand-ink">
              <span>المجموع الكلي:</span>
              <span className="text-brand-olive font-poppins">{order.total_amount} د.ل</span>
            </div>
          </div>
        )}

        <div className="p-4 bg-[#FAF8F5] rounded-xl flex items-center gap-3 text-xs text-brand-muted">
          <Truck className="w-5 h-5 text-brand-sage shrink-0" />
          <span>مدة الشحن المتوقعة: خلال 24 إلى 48 ساعة لكافة المدن الليبية.</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to={`/order-tracking?orderNumber=${orderNumber || order?.order_number}`}
          className="px-8 py-3 rounded-full bg-brand-sage hover:bg-brand-olive text-white font-semibold text-xs transition-colors shadow-sm"
        >
          تتبع حالة الشحنة
        </Link>
        <Link
          to="/"
          className="px-8 py-3 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-brand-ink font-semibold text-xs transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>

    </div>
  );
};

export default OrderConfirmationPage;
