import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Clock, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#EFEAE4] border-t border-stone-200/80 text-brand-ink pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14 border-b border-stone-300/60">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-brand-pale text-brand-olive flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">رذاذ نقي بدون ماء</h4>
              <p className="text-xs text-brand-muted">Cold-Air Diffusion</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-brand-pale text-brand-olive flex items-center justify-center shrink-0 shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">توصيل لكافة المدن</h4>
              <p className="text-xs text-brand-muted">مجاني للطلبات فوق 300 د.ل</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-brand-pale text-brand-olive flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">ضمان شامل لمدة عام</h4>
              <p className="text-xs text-brand-muted">صيانة محلية وقطع غيار</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-brand-pale text-brand-olive flex items-center justify-center shrink-0 shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">تحكم وجدولة ذكية</h4>
              <p className="text-xs text-brand-muted">تطبيق موبايل وبلوتوث</p>
            </div>
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <img src="/odora-logo.png" alt="odora" className="h-7 w-auto object-contain" />
            <p className="text-sm text-brand-muted leading-relaxed max-w-sm">
              أجهزة تعطير إلكترونية فاخرة تجمع بين التقنية المبتكرة والتصميم الداخلي الهادئ، لتخلق أجواءً عطرية استثنائية في كل مساحة.
            </p>
            <div className="pt-2">
              <span className="inline-block text-xs font-semibold tracking-wider text-brand-olive uppercase bg-brand-pale/70 px-3 py-1 rounded-full">
                عبير الأجواء · SCENT OF ATMOSPHERE
              </span>
            </div>
          </div>

          {/* Col 1: Shop */}
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-brand-ink text-base">التسوق</h4>
            <ul className="space-y-2.5 text-brand-muted">
              <li>
                <Link to="/products?category=diffusers" className="hover:text-brand-sage transition-colors">
                  أجهزة التعطير الذكية
                </Link>
              </li>
              <li>
                <Link to="/products?category=fragrance-oils" className="hover:text-brand-sage transition-colors">
                  الزيوت العطرية النقية
                </Link>
              </li>
              <li>
                <Link to="/products?category=bundles" className="hover:text-brand-sage transition-colors">
                  الباقات والعروض الخاصة
                </Link>
              </li>
              <li>
                <Link to="/fragrances" className="hover:text-brand-sage transition-colors">
                  مكتبة الروائح العطرية
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Company */}
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-brand-ink text-base">الشركة</h4>
            <ul className="space-y-2.5 text-brand-muted">
              <li>
                <Link to="/about" className="hover:text-brand-sage transition-colors">
                  عن أودورا (Our Story)
                </Link>
              </li>
              <li>
                <Link to="/technology" className="hover:text-brand-sage transition-colors">
                  تقنية الرذاذ البارد
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-sage transition-colors">
                  الفروع ومواقعنا في ليبيا
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-sage transition-colors">
                  خدمة العملاء ومبيعات الجملة
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support & Tracking */}
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-brand-ink text-base">الدعم والمساعدة</h4>
            <ul className="space-y-2.5 text-brand-muted">
              <li>
                <Link to="/order-tracking" className="hover:text-brand-sage transition-colors font-medium text-brand-ink">
                  تتبع حالة طلبيتي 🚚
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-brand-sage transition-colors">
                  الأسئلة الشائعة (FAQ)
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-brand-sage transition-colors">
                  سياسة الضمان والاسترجاع
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-brand-sage transition-colors">
                  الشروط والأحكام والخصوصية
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-6 border-t border-stone-300/60 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-muted gap-4">
          <p>© {new Date().getFullYear()} أودورا (Odora). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            <Link to="/legal" className="hover:text-brand-ink">سياسة الخصوصية</Link>
            <Link to="/legal" className="hover:text-brand-ink">شروط الخدمة</Link>
            <span className="text-brand-olive font-medium">صُنع بفخر في ليبيا 🇱🇾</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
