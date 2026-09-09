import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Clock, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const language = ((i18n.language || 'ar').split('-')[0]) as 'ar' | 'en';

  return (
    <footer className="bg-[#EFEFEA] border-t border-stone-200 text-brand-ink pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14 border-b border-stone-300/70">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-white text-brand-sage flex items-center justify-center shrink-0 shadow-xs border border-stone-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-brand-ink">{t('footer.trust1Title', 'رذاذ نقي بدون ماء')}</h4>
              <p className="text-xs text-brand-muted font-medium">{t('footer.trust1Desc', 'Cold-Air Micro-Diffusion')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-white text-brand-sage flex items-center justify-center shrink-0 shadow-xs border border-stone-200">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-brand-ink">{t('footer.trust2Title', 'توصيل لكافة المدن')}</h4>
              <p className="text-xs text-brand-muted font-medium">{t('footer.trust2Desc', 'مجاني للطلبات فوق 300 د.ل')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-white text-brand-sage flex items-center justify-center shrink-0 shadow-xs border border-stone-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-brand-ink">{t('footer.trust3Title', 'ضمان شامل لمدة عام')}</h4>
              <p className="text-xs text-brand-muted font-medium">{t('footer.trust3Desc', 'صيانة محلية وقطع غيار بليبيا')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-white text-brand-sage flex items-center justify-center shrink-0 shadow-xs border border-stone-200">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-brand-ink">{t('footer.trust4Title', 'تحكم وجدولة ذكية')}</h4>
              <p className="text-xs text-brand-muted font-medium">{t('footer.trust4Desc', 'تطبيق متطور وبلوتوث مباشر')}</p>
            </div>
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <img src="/odora-logo.png" alt="odora" className="h-7 w-auto object-contain" />
            <p className="text-sm text-brand-muted leading-relaxed max-w-sm">
              {t('footer.brandDesc', 'أجهزة تعطير إلكترونية فاخرة تجمع بين التقنية المبتكرة والتصميم الداخلي الهادئ، لتخلق أجواءً عطرية استثنائية في كل مساحة.')}
            </p>
            <div className="pt-2">
              <span className="inline-block text-xs font-semibold tracking-wider text-brand-sage uppercase bg-white border border-stone-200 px-3 py-1 rounded-full shadow-xs">
                {language === 'ar' ? 'عبير الأجواء · SCENT OF ATMOSPHERE' : 'SCENT OF ATMOSPHERE · ODORA'}
              </span>
            </div>
          </div>

          {/* Col 1: Shop */}
          <div className="space-y-3 text-sm">
            <h4 className="font-bold text-brand-ink text-base">{t('footer.shopCol', 'التسوق')}</h4>
            <ul className="space-y-2.5 text-brand-muted font-medium">
              <li>
                <Link to="/products?category=diffusers" className="hover:text-brand-sage transition-colors">
                  {language === 'ar' ? 'أجهزة التعطير الذكية' : 'Smart Diffusers'}
                </Link>
              </li>
              <li>
                <Link to="/products?category=fragrance-oils" className="hover:text-brand-sage transition-colors">
                  {language === 'ar' ? 'الزيوت العطرية النقية' : 'Pure Fragrance Oils'}
                </Link>
              </li>
              <li>
                <Link to="/products?category=bundles" className="hover:text-brand-sage transition-colors">
                  {language === 'ar' ? 'الباقات والعروض الخاصة' : 'Gift Sets & Bundles'}
                </Link>
              </li>
              <li>
                <Link to="/fragrances" className="hover:text-brand-sage transition-colors">
                  {language === 'ar' ? 'مكتبة الروائح العطرية' : 'Fragrance Library'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Company */}
          <div className="space-y-3 text-sm">
            <h4 className="font-bold text-brand-ink text-base">{t('footer.learnCol', 'التعريف والتقنية')}</h4>
            <ul className="space-y-2.5 text-brand-muted font-medium">
              <li>
                <Link to="/about" className="hover:text-brand-sage transition-colors">
                  {language === 'ar' ? 'عن أودورا (Our Story)' : 'About Odora'}
                </Link>
              </li>
              <li>
                <Link to="/technology" className="hover:text-brand-sage transition-colors">
                  {language === 'ar' ? 'تقنية الرذاذ البارد' : 'Cold-Air Diffusion'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-sage transition-colors">
                  {language === 'ar' ? 'الفروع ومواقعنا في ليبيا' : 'Locations in Libya'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-sage transition-colors">
                  {language === 'ar' ? 'مبيعات الشركات والجملة' : 'B2B & Hospitality'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support & Tracking */}
          <div className="space-y-3 text-sm">
            <h4 className="font-bold text-brand-ink text-base">{t('footer.supportCol', 'الدعم والخدمة')}</h4>
            <ul className="space-y-2.5 text-brand-muted font-medium">
              <li>
                <Link to="/order-tracking" className="hover:text-brand-sage transition-colors font-semibold text-brand-ink">
                  {language === 'ar' ? 'تتبع حالة طلبيتي 🚚' : 'Track My Order 🚚'}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-brand-sage transition-colors">
                  {language === 'ar' ? 'الأسئلة الشائعة (FAQ)' : 'Frequently Asked Questions'}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-brand-sage transition-colors">
                  {language === 'ar' ? 'سياسة الضمان والصيانة' : 'Warranty & Service'}
                </Link>
              </li>
              <li>
                <Link to="/legal" className="hover:text-brand-sage transition-colors">
                  {language === 'ar' ? 'الشروط والأحكام والخصوصية' : 'Terms & Privacy'}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-6 border-t border-stone-300/70 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-muted gap-4">
          <p>{t('footer.copyright', `© ${new Date().getFullYear()} أودورا (Odora Fragrance Systems). جميع الحقوق محفوظة.`)}</p>
          <div className="flex items-center gap-6 font-medium">
            <Link to="/legal" className="hover:text-brand-ink">{language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>
            <Link to="/legal" className="hover:text-brand-ink">{language === 'ar' ? 'شروط الخدمة' : 'Terms of Service'}</Link>
            <span className="text-brand-sage font-semibold">{language === 'ar' ? 'صُنع بفخر للمساحات الليبية 🇱🇾' : 'Crafted for Libyan Spaces 🇱🇾'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
