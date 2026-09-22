import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const language = ((i18n.language || 'ar').split('-')[0]) as 'ar' | 'en';

  const shopLinks = [
    ['/products?category=diffusers', language === 'ar' ? 'أجهزة التعطير' : 'Diffusers'],
    ['/products?category=fragrance-oils', language === 'ar' ? 'الزيوت العطرية' : 'Fragrance oils'],
    ['/products?category=bundles', language === 'ar' ? 'الباقات' : 'Bundles'],
    ['/fragrances', language === 'ar' ? 'مكتبة الروائح' : 'Fragrance library'],
  ];

  const companyLinks = [
    ['/about', language === 'ar' ? 'عن أودورا' : 'About Odora'],
    ['/technology', language === 'ar' ? 'تقنية الرذاذ البارد' : 'Cold-air technology'],
    ['/contact', language === 'ar' ? 'تواصل معنا' : 'Contact'],
    ['/faq', language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently asked questions'],
  ];

  return (
    <footer className="bg-brand-olive text-brand-surface">
      <div className="editorial-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 py-10 border-b border-brand-surface/15">
          {[
            [t('footer.trust1Title', 'رذاذ نقي بدون ماء'), t('footer.trust1Desc', 'Cold-air micro-diffusion')],
            [t('footer.trust2Title', 'توصيل لكافة المدن'), t('footer.trust2Desc', 'مجاني للطلبات فوق 300 د.ل')],
            [t('footer.trust3Title', 'ضمان شامل لمدة عام'), t('footer.trust3Desc', 'صيانة محلية وقطع غيار')],
            [t('footer.trust4Title', 'تحكم وجدولة ذكية'), t('footer.trust4Desc', 'تطبيق وبلوتوث مباشر')],
          ].map(([title, description]) => (
            <div key={title} className="space-y-1">
              <p className="text-sm font-medium text-brand-surface">{title}</p>
              <p className="text-xs leading-relaxed text-brand-surface/65">{description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 py-16 sm:py-20">
          <div className="md:col-span-6 lg:col-span-7">
            <img src="/logo-cream.png" alt="odora" className="h-8 sm:h-10 w-auto object-contain" />
            <p className="mt-7 max-w-xl text-base sm:text-lg font-light leading-8 text-brand-surface/75">
              {t('footer.brandDesc', 'أجهزة تعطير إلكترونية فاخرة تجمع بين التقنية المبتكرة والتصميم الداخلي الهادئ، لتخلق أجواءً عطرية استثنائية في كل مساحة.')}
            </p>
            <p className="mt-8 text-[10px] tracking-[0.24em] text-brand-pale uppercase">
              {language === 'ar' ? 'SCENT OF ATMOSPHERE · عبير الأجواء' : 'SCENT OF ATMOSPHERE'}
            </p>
          </div>

          <div className="md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">{t('footer.shopCol', 'التسوق')}</h3>
            <ul className="mt-5 space-y-3 text-sm text-brand-surface/65">
              {shopLinks.map(([to, label]) => (
                <li key={to}><Link to={to} className="transition-colors hover:text-brand-pale">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-medium">{t('footer.learnCol', 'أودورا')}</h3>
            <ul className="mt-5 space-y-3 text-sm text-brand-surface/65">
              {companyLinks.map(([to, label]) => (
                <li key={to}><Link to={to} className="transition-colors hover:text-brand-pale">{label}</Link></li>
              ))}
              <li><Link to="/order-tracking" className="transition-colors hover:text-brand-pale">{language === 'ar' ? 'تتبع الطلب' : 'Track an order'}</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-7 border-t border-brand-surface/15 text-xs text-brand-surface/55">
          <p>{t('footer.copyright', `© ${new Date().getFullYear()} Odora. جميع الحقوق محفوظة.`)}</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-brand-surface">{language === 'ar' ? 'الخصوصية' : 'Privacy'}</Link>
            <Link to="/terms" className="hover:text-brand-surface">{language === 'ar' ? 'الشروط' : 'Terms'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
