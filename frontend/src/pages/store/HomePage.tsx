import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import ProductCard from '../../components/common/ProductCard';
import { Product } from '../../types';

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = (i18n.language || 'ar').startsWith('ar');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.getFeaturedProducts();
        setFeaturedProducts(res.data);
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    try {
      await api.subscribeNewsletter(newsletterEmail);
    } finally {
      setNewsletterDone(true);
    }
  };

  const DirectionArrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="relative overflow-hidden bg-brand-canvas">
      <section className="editorial-container pt-8 pb-16 sm:pt-12 sm:pb-24 lg:pt-16 lg:pb-32">
        <div className="grid min-h-[660px] grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col justify-center lg:col-span-5">
            <p className="mb-10 text-[10px] font-medium tracking-[0.24em] text-brand-muted uppercase">
              {t('home.eyebrow', 'SCENT OF ATMOSPHERE · عبير الأجواء')}
            </p>
            <h1 className="max-w-xl text-[clamp(3.25rem,6.4vw,6rem)] font-light leading-[0.98] tracking-[-0.04em] text-brand-ink">
              {t('home.heroTitle1', 'أجواء استثنائية،')}
              <span className="mt-2 block text-brand-olive">{t('home.heroTitle2', 'في كل مساحة.')}</span>
            </h1>
            <p className="mt-8 max-w-lg text-base font-light leading-8 text-brand-muted sm:text-lg">
              {t('home.heroDesc', 'أجهزة تعطير إلكترونية فاخرة تجمع بين التقنية الدقيقة والتصميم الإيطالي الهادئ — تقنية الرذاذ البارد بدون ماء، فائقة الهدوء، مع تحكم وجدولة ذكية عبر التطبيق.')}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link to="/products?category=diffusers" className="editorial-button-primary">
                {t('home.shopDiffusers', 'تسوق أجهزة التعطير')}
              </Link>
              <Link to="/fragrances" className="editorial-link">
                {t('home.exploreOils', 'استكشف الروائح')}
                <DirectionArrow className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="image-stage relative min-h-[520px] lg:col-span-7 lg:min-h-full">
            <img
              src="/brand_photo_0.png"
              alt={t('home.heroImageAlt', 'جهاز أودورا مع زيت فورست سيج في مساحة هادئة')}
              className="absolute inset-0 h-full w-full object-cover object-[72%_center] sm:object-[68%_center]"
            />
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between rounded-[20px] bg-brand-surface/92 p-5 backdrop-blur-sm sm:inset-x-7 sm:bottom-7 sm:p-6">
              <div>
                <p className="text-sm font-medium text-brand-ink">{t('home.deviceBadgeName', 'جهاز أودورا A316 الذكي')}</p>
                <p className="mt-1 text-xs text-brand-muted">{isRtl ? 'تصميم هادئ · رذاذ بارد بدون ماء' : 'Quiet design · Waterless cold-air diffusion'}</p>
              </div>
              <p className="text-sm font-medium tabular-nums text-brand-olive">900 m²</p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-7 border-y border-brand-ink/10 py-7 sm:grid-cols-3 sm:gap-0">
          {[
            [t('home.stat1Value', '4.8'), t('home.stat1Label', 'تقييم العملاء')],
            [t('home.stat2Value', '900 م²'), t('home.stat2Label', 'تغطية متوازنة')],
            [t('home.stat3Value', '< 25 dB'), t('home.stat3Label', 'هدوء شبه تام')],
          ].map(([value, label], index) => (
            <div key={value} className={`flex items-baseline gap-3 sm:px-8 ${index > 0 ? 'sm:border-s sm:border-brand-ink/10' : ''}`}>
              <span className="text-2xl font-light tabular-nums text-brand-ink">{value}</span>
              <span className="text-xs text-brand-muted">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="editorial-container pb-20 sm:pb-28 lg:pb-36">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-light tracking-[-0.03em] text-brand-ink sm:text-5xl">
              {t('home.featuredTitle', 'المجموعة المميزة')}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-muted sm:text-base">
              {isRtl ? 'أجهزة وروائح مختارة لتصبح جزءاً هادئاً من تفاصيل مساحتك.' : 'Diffusers and scents selected to become a quiet part of your space.'}
            </p>
          </div>
          <Link to="/products" className="editorial-link shrink-0">
            {t('common.viewAll', 'عرض الكل')}
            <DirectionArrow className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-[430px] animate-pulse rounded-[24px] bg-brand-surface" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </section>

      <section className="editorial-container pb-20 sm:pb-28 lg:pb-36">
        <div className="relative overflow-hidden rounded-[30px] bg-brand-olive text-brand-surface">
          <div className="grid min-h-[620px] grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col justify-center p-8 sm:p-14 lg:p-20">
              <h2 className="max-w-lg text-4xl font-light leading-[1.06] tracking-[-0.035em] sm:text-6xl">
                {isRtl ? 'صُمّم ليُرى، ويُشعَر به.' : 'Designed to be seen, and felt.'}
              </h2>
              <p className="mt-7 max-w-md text-base font-light leading-8 text-brand-surface/70">
                {isRtl
                  ? 'من ملمس السطح المطفي إلى الرذاذ الصامت، صُممت كل تفصيلة لتنسجم مع المكان قبل أن تغيّر أجواءه.'
                  : 'From the matte surface to the near-silent mist, every detail is made to belong in the room before it transforms its atmosphere.'}
              </p>
              <Link to="/about" className="mt-10 inline-flex w-fit items-center gap-2 border-b border-brand-pale/60 pb-1 text-sm text-brand-pale hover:border-brand-pale">
                {isRtl ? 'اكتشف قصة التصميم' : 'Discover the design story'}
                <DirectionArrow className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative min-h-[430px] bg-[#D9D2C8]">
              <img
                src="/brand_photo_3.png"
                alt={isRtl ? 'مجموعة ألوان أجهزة أودورا' : 'Odora diffuser colour collection'}
                className="absolute inset-0 h-full w-full object-cover object-center mix-blend-multiply"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-brand-ink/10 bg-brand-surface-subtle">
        <div className="editorial-container editorial-section">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="text-4xl font-light tracking-[-0.03em] text-brand-ink sm:text-5xl">
                {t('home.howItWorksTitle', 'بساطة فائقة في ثلاث خطوات')}
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-brand-muted">
                {isRtl ? 'تجربة واضحة من أول قطرة زيت إلى الأجواء التي تريدها.' : 'A clear ritual, from the first drop of oil to the atmosphere you want.'}
              </p>
            </div>
            <ol className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:col-span-8">
              {[
                [t('home.step1Title', 'أضف الزيت العطري'), t('home.step1Desc', 'ضع الزيت العطري النقي مباشرة في الخزان دون إضافة الماء.')],
                [t('home.step2Title', 'اضبط التوقيت والشدة'), t('home.step2Desc', 'اختر جدول التشغيل ومستوى الكثافة المناسب للمساحة.')],
                [t('home.step3Title', 'دع العبير ينتشر'), t('home.step3Desc', 'رذاذ دقيق ومتوازن يملأ المكان دون حرارة أو رطوبة.')],
              ].map(([title, description], index) => (
                <li key={title} className="border-t border-brand-ink/15 pt-5">
                  <span className="text-xs tabular-nums text-brand-sage">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="mt-7 text-lg font-medium text-brand-ink">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-brand-muted">{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="editorial-container editorial-section">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-4xl font-light tracking-[-0.03em] text-brand-ink sm:text-5xl">
              {t('home.testimonialsTitle', 'ما يقوله عملاؤنا في ليبيا')}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:col-span-8">
            {[
              [t('home.test1Text', '“غيّر الجهاز من انطباع زوار المعرض. يلاحظ الجميع الرائحة الراقية بمجرد الدخول.”'), t('home.test1Author', 'ليلى · استوديو تصميم داخلي')],
              [t('home.test2Text', '“تحفة فنية هادئة، والجدولة الذكية تجعل المنزل معطراً قبل عودتي.”'), t('home.test2Author', 'عمر · منزل خاص')],
              [t('home.test3Text', '“ندير أجهزة صالات الاستقبال بسهولة من تطبيق واحد.”'), t('home.test3Author', 'سارة · إدارة ضيافة')],
            ].map(([quote, author]) => (
              <figure key={author} className="border-t border-brand-ink/15 pt-6">
                <div className="flex gap-1 text-brand-sage" aria-label="5 stars">
                  {[0, 1, 2, 3, 4].map((star) => <Star key={star} className="h-3.5 w-3.5 fill-current" />)}
                </div>
                <blockquote className="mt-6 text-base font-light leading-8 text-brand-ink">{quote}</blockquote>
                <figcaption className="mt-6 text-xs text-brand-muted">{author}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-brand-ink/10 bg-brand-surface">
        <div className="editorial-container py-16 sm:py-20">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-light tracking-[-0.03em] text-brand-ink sm:text-4xl">
                {isRtl ? 'رسائل قليلة، وروائح تستحق الاكتشاف.' : 'Fewer emails. Scents worth discovering.'}
              </h2>
              <p className="mt-3 text-sm text-brand-muted">
                {isRtl ? 'إطلاقات جديدة ونصائح للعناية بالمساحة، دون ضجيج.' : 'New releases and thoughtful space notes, without the noise.'}
              </p>
            </div>
            {newsletterDone ? (
              <p className="text-sm font-medium text-brand-olive lg:text-end" role="status">
                {isRtl ? 'شكراً، أصبحت ضمن عالم أودورا.' : 'Thank you. You are now part of Odora.'}
              </p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <label htmlFor="newsletter-email" className="sr-only">{isRtl ? 'البريد الإلكتروني' : 'Email address'}</label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  placeholder={isRtl ? 'البريد الإلكتروني' : 'Email address'}
                  className="editorial-input sm:max-w-sm"
                />
                <button type="submit" className="editorial-button-primary shrink-0">
                  {isRtl ? 'انضم إلينا' : 'Join Odora'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

