import React, { useState } from 'react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { Shield, FileText, RotateCcw } from 'lucide-react';

export default function LegalPage() {
  const { isRtl } = useLanguageStore();
  const [activeTab, setActiveTab] = useState('terms');

  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-odora-dark">
          {isRtl ? 'السياسات القانونية وحقوق العميل' : 'Legal Policies & Customer Rights'}
        </h1>
        <p className="text-sm text-odora-dark/60">
          {isRtl ? 'آخر تحديث: سبتمبر 2026 — شركة أودورا للأنظمة العطرية الذكية، ليبيا' : 'Last updated: September 2026 — Odora Fragrance Systems Libya'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 border-b border-odora-dark/10 pb-3">
        <button
          onClick={() => setActiveTab('terms')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'terms' ? 'bg-odora-olive text-white shadow-sm' : 'text-odora-dark/70 hover:bg-white'
          }`}
        >
          <FileText size={16} />
          <span>{isRtl ? 'الشروط والأحكام' : 'Terms of Service'}</span>
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'privacy' ? 'bg-odora-olive text-white shadow-sm' : 'text-odora-dark/70 hover:bg-white'
          }`}
        >
          <Shield size={16} />
          <span>{isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
        </button>

        <button
          onClick={() => setActiveTab('warranty')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'warranty' ? 'bg-odora-olive text-white shadow-sm' : 'text-odora-dark/70 hover:bg-white'
          }`}
        >
          <RotateCcw size={16} />
          <span>{isRtl ? 'الضمان والاسترجاع' : 'Warranty & Returns'}</span>
        </button>
      </div>

      {/* Content Body */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-odora-dark/5 shadow-sm prose prose-neutral max-w-none text-odora-dark/80 text-sm leading-relaxed space-y-6">
        
        {activeTab === 'terms' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-serif text-odora-dark">
              {isRtl ? 'اتفاقية استخدام متجر أودورا الإلكتروني' : 'Terms and Conditions'}
            </h2>
            <p>
              {isRtl 
                ? 'أهلاً بك في متجر أودورا الإلكتروني (odora.ly). بدخولك إلى هذا الموقع أو إتمام أي عملية شراء، فإنك توافق على الالتزام بالشروط والأحكام الواردة أدناه.'
                : 'Welcome to Odora (odora.ly). By accessing our web store or placing an order, you agree to the following terms and conditions.'}
            </p>

            <h3 className="font-bold text-base text-odora-dark">{isRtl ? '1. الطلبات وتأكيد الشراء' : '1. Orders & Confirmation'}</h3>
            <p>
              {isRtl
                ? 'عند إتمامك للطلب عبر المتجر، سيصلك إشعار تأكيد تلقائي برقم الطلب وتفاصيله. يحق لإدارة المتجر التحقق هاتفياً من صحة بيانات العنوان ورقم الهاتف قبل شحن الطلبية لتفادي المرتجعات.'
                : 'Upon completing your order, an automated confirmation with your order number will be issued. We reserve the right to verify phone and address details prior to dispatch.'}
            </p>

            <h3 className="font-bold text-base text-odora-dark">{isRtl ? '2. الأسعار والدفع في ليبيا' : '2. Pricing & Currency'}</h3>
            <p>
              {isRtl
                ? 'جميع الأسعار المعروضة في المتجر هي بالدينار الليبي (LYD) وتشمل الضرائب المعمول بها. تتوفر خدمة الدفع نقداً عند الاستلام (COD) لكافة المدن والمناطق المغطاة بشبكة الشحن.'
                : 'All prices are listed in Libyan Dinar (LYD). We offer Cash on Delivery across all covered Libyan regions.'}
            </p>

            <h3 className="font-bold text-base text-odora-dark">{isRtl ? '3. سياسة الاستخدام السليم للأجهزة' : '3. Proper Device Operation'}</h3>
            <p>
              {isRtl
                ? 'جهاز Odora A316 مصمم حصرياً للعمل مع الزيوت العطرية النقية بدون ماء. لا يجوز إضافة الماء أو أي مذيبات كحولية أو زيوت غير معتمدة داخل خزان الجهاز، حيث يؤدي ذلك إلى تلف الفوهة التذريرية وإلغاء الضمان.'
                : 'Odora A316 is engineered exclusively for waterless pure fragrance oils. Adding water or unauthorized alcohol solutions will damage the micro-nozzle and void the manufacturer warranty.'}
            </p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-serif text-odora-dark">
              {isRtl ? 'سياسة الخصوصية وحماية بيانات العملاء' : 'Privacy & Data Protection'}
            </h2>
            <p>
              {isRtl 
                ? 'نحن في أودورا نلتزم التزاماً تاماً بحماية خصوصية عملائنا في ليبيا. نوضح هنا كيفية جمع واستخدام وحماية معلوماتك الشخصية.'
                : 'Odora is committed to protecting the privacy of our customers. This policy details how your personal data is collected and managed securely.'}
            </p>

            <h3 className="font-bold text-base text-odora-dark">{isRtl ? '1. البيانات التي نجمعها' : '1. Collected Data'}</h3>
            <p>
              {isRtl 
                ? 'نجمع فقط المعلومات الضرورية لإتمام طلباتك وتوصيلها، وتشمل: الاسم، رقم الهاتف، العنوان الدقيق للتوصيل، والبريد الإلكتروني للإشعارات. لا نقوم بتخزين أي أرقام بطاقات بنكية على خوادمنا.'
                : 'We collect essential delivery information including customer name, phone number, shipping address, and email for notifications. We do not store sensitive payment card credentials.'}
            </p>

            <h3 className="font-bold text-base text-odora-dark">{isRtl ? '2. سرية المعلومات وعدم مشاركتها' : '2. Non-Disclosure'}</h3>
            <p>
              {isRtl 
                ? 'لن نقوم تحت أي ظرف ببيع أو تأجير بيانات عملائنا لأي جهة خارجية أو تسويقية. يتم تزويد مندوب شركة التوصيل بالاسم ورقم الهاتف والعنوان فقط لغرض إيصال الشحنة بأمان.'
                : 'We never sell or rent customer details to third parties. Delivery couriers receive only relevant shipping contact information.'}
            </p>
          </div>
        )}

        {activeTab === 'warranty' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-serif text-odora-dark">
              {isRtl ? 'سياسة الضمان الذهبي والاسترجاع في ليبيا' : 'Warranty & Return Policy'}
            </h2>
            <p>
              {isRtl 
                ? 'لأننا واثقون من جودة تصنيع أجهزة أودورا ومطابقتها للمواصفات الفندقية العالمية، نقدم لعملائنا في ليبيا ضماناً حصرياً ومريحاً.'
                : 'We offer an industry-leading 2-year warranty and straightforward return policy across Libya.'}
            </p>

            <h3 className="font-bold text-base text-odora-dark">{isRtl ? '1. الضمان الذهبي لمدة عامين كاملين' : '1. 2-Year Comprehensive Warranty'}</h3>
            <p>
              {isRtl 
                ? 'يغطي الضمان محرك التذرية، الفوهة المزدوجة، اللوحة الإلكترونية، ووحدة البلوتوث ضد أي عيب تصنيعي لمدة 24 شهراً من تاريخ الشراء. في حالة حدوث أي عيب، يتم استبدال القطعة أو الجهاز فوراً عبر مركز الصيانة في طرابلس.'
                : 'Covers the atomization pump, dual nozzle, motherboard, and Bluetooth module against manufacturing defects for 24 months.'}
            </p>

            <h3 className="font-bold text-base text-odora-dark">{isRtl ? '2. حق المعاينة والاسترجاع (14 يوماً)' : '2. 14-Day Return Window'}</h3>
            <p>
              {isRtl 
                ? 'يحق للعميل فحص المنتج عند الاستلام. في حالة رغبة العميل في إرجاع الجهاز غير المستخدم في علبته الأصلية مع كافة الملحقات، يمكنه طلب الاسترجاع خلال 14 يوماً من استلام الطلب.'
                : 'Customers may return unused devices in their original packaging and accessories within 14 days of delivery.'}
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
