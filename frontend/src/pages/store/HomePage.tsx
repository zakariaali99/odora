import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, ArrowRight, Star, CheckCircle2, Wind, Volume2, Droplets, Wifi } from 'lucide-react';
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
  const [heroColorway, setHeroColorway] = useState<'sage' | 'white' | 'black'>('sage');

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
    if (!newsletterEmail) return;
    try {
      await api.subscribeNewsletter(newsletterEmail);
      setNewsletterDone(true);
    } catch {
      setNewsletterDone(true);
    }
  };

  const getHeroImage = () => {
    if (heroColorway === 'white') return '/products/diffuser-white-clean.png';
    if (heroColorway === 'black') return '/products/diffuser-black-clean.png';
    return '/products/diffuser-a316-sage.png';
  };

  return (
    <div className="relative min-h-screen bg-[#F7F7F5]">
      {/* Hero Section */}
      <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-brand-ink text-xs font-bold tracking-wide shadow-xs">
              <span className="w-2 h-2 rounded-full bg-brand-sage animate-pulse" />
              <span className="text-brand-sage font-mono text-[11px] uppercase tracking-wider">
                {t('home.eyebrow', 'SCENT OF ATMOSPHERE · عبير الأجواء')}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-brand-ink leading-[1.15] tracking-tight">
              {t('home.heroTitle1', 'أجواء استثنائية،')} <br />
              <span className="font-semibold text-brand-sage">{t('home.heroTitle2', 'في كل مساحة.')}</span>
            </h1>

            <p className="text-base sm:text-lg text-brand-muted leading-relaxed max-w-xl font-normal">
              {t('home.heroDesc', 'أجهزة تعطير إلكترونية فاخرة تجمع بين التقنية الدقيقة والتصميم الإيطالي الهادئ — تقنية الرذاذ البارد بدون ماء، فائقة الهدوء، مع تحكم وجدولة ذكية عبر التطبيق.')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/products?category=diffusers"
                className="px-8 py-3.5 rounded-full bg-brand-ink hover:bg-stone-800 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                {t('home.shopDiffusers', 'تسوق أجهزة التعطير')}
              </Link>
              <Link
                to="/products?category=fragrance-oils"
                className="px-8 py-3.5 rounded-full bg-white border border-stone-300 hover:border-brand-sage hover:bg-stone-50 text-brand-ink font-bold text-sm transition-all shadow-xs active:scale-95"
              >
                {t('home.exploreOils', 'استكشف الزيوت النقية')}
              </Link>
            </div>

            {/* Micro Stats */}
            <div className="pt-6 border-t border-stone-200/90 grid grid-cols-3 gap-6 max-w-md">
              <div>
                <div className="text-2xl font-bold text-brand-ink font-sans flex items-center gap-1">
                  <span>4.8</span>
                  <Star className="w-4 h-4 fill-brand-amber text-brand-amber" />
                </div>
                <div className="text-xs text-brand-muted font-medium mt-0.5">{t('home.stat1Label', '+2,400 تقييم مؤكد')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-ink font-sans">{t('home.stat2Value', '900 م²')}</div>
                <div className="text-xs text-brand-muted font-medium mt-0.5">{t('home.stat2Label', 'تغطية متجانسة')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-ink font-sans">{t('home.stat3Value', '< 25 dB')}</div>
                <div className="text-xs text-brand-muted font-medium mt-0.5">{t('home.stat3Label', 'همس فائق الهدوء')}</div>
              </div>
            </div>
          </div>

          {/* Hero Device Showcase: Layered Architectural Surface */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md rounded-3xl bg-white p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-stone-200/90 overflow-hidden">
              
              {/* Product Stage Ground */}
              <div className="relative w-full aspect-[4/5] rounded-2xl bg-gradient-to-b from-[#F9F9F8] via-[#F2F1EC] to-[#EAE8E0] overflow-hidden flex flex-col items-center justify-center p-6 border border-stone-100">
                
                {/* Specs pill at top */}
                <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-bold text-brand-ink shadow-xs border border-stone-200/60">
                    A316 Series
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-bold text-brand-sage shadow-xs border border-stone-200/60 flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-brand-sage" />
                    Waterless Cold-Air
                  </span>
                </div>

                {/* Animated Vapor Mist Wisps */}
                <div className="absolute top-16 z-10 flex flex-col items-center pointer-events-none">
                  <div className="w-2 h-14 rounded-full bg-gradient-to-t from-white/90 via-white/50 to-transparent blur-[1.5px] animate-pulse" />
                </div>

                {/* Real Packshot Photography */}
                <div className="relative z-10 w-full h-72 sm:h-80 flex items-center justify-center">
                  <img
                    src={getHeroImage()}
                    alt="Odora A316 Smart Diffuser"
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_16px_28px_rgba(0,0,0,0.18)] transition-all duration-500 ease-out"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/products/diffuser-a316-sage.png'; }}
                  />
                </div>

                {/* Colorway Switcher Preview */}
                <div className="absolute bottom-20 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-full border border-stone-200 shadow-xs">
                  <button
                    onClick={() => setHeroColorway('sage')}
                    className={`w-4 h-4 rounded-full bg-[#919C7A] transition-transform ${heroColorway === 'sage' ? 'ring-2 ring-brand-ink scale-110' : 'opacity-70 hover:opacity-100'}`}
                    title={isRtl ? 'أخضر مريمي' : 'Sage Green'}
                  />
                  <button
                    onClick={() => setHeroColorway('white')}
                    className={`w-4 h-4 rounded-full bg-[#E8E3DA] border border-stone-300 transition-transform ${heroColorway === 'white' ? 'ring-2 ring-brand-ink scale-110' : 'opacity-70 hover:opacity-100'}`}
                    title={isRtl ? 'أبيض مطفي' : 'Matte White'}
                  />
                  <button
                    onClick={() => setHeroColorway('black')}
                    className={`w-4 h-4 rounded-full bg-[#1C1C1A] transition-transform ${heroColorway === 'black' ? 'ring-2 ring-brand-ink scale-110' : 'opacity-70 hover:opacity-100'}`}
                    title={isRtl ? 'أسود فاحم' : 'Matte Black'}
                  />
                </div>

                {/* Floating Device Badge */}
                <div className="absolute bottom-3 inset-x-3 z-20 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-md flex items-center justify-between border border-stone-200/80">
                  <div>
                    <div className="text-xs font-bold text-brand-ink">{t('home.deviceBadgeName', 'جهاز أودورا A316 الذكي')}</div>
                    <div className="text-[11px] text-brand-muted font-medium">
                      {heroColorway === 'sage' ? (isRtl ? 'الأخضر المريمي' : 'Sage Green') : heroColorway === 'white' ? (isRtl ? 'الأبيض المطفي' : 'Matte White') : (isRtl ? 'الأسود الفاحم' : 'Matte Black')} · 900 m²
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>{t('home.deviceBadgeConnected', 'متصل')}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Values Strip: Crisp White Layered Surface */}
      <section className="border-y border-stone-200/80 bg-white py-10 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-start">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-brand-canvas border border-stone-200 text-brand-sage flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-brand-ink">{t('home.value1Title', 'رذاذ بارد بدون ماء')}</h4>
              <p className="text-xs text-brand-muted font-medium mt-1 leading-relaxed">{t('home.value1Desc', 'Waterless cold-air، عبير نقي 100% بدون حرارة.')}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-brand-canvas border border-stone-200 text-brand-sage flex items-center justify-center shrink-0">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-brand-ink">{t('home.value2Title', 'تغطية حتى 900 م²')}</h4>
              <p className="text-xs text-brand-muted font-medium mt-1 leading-relaxed">{t('home.value2Desc', 'انتشار متوازن ومثالي للمنازل الفسيحة والشركات.')}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-brand-canvas border border-stone-200 text-brand-sage flex items-center justify-center shrink-0">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-brand-ink">{t('home.value3Title', 'تحكم وجدولة ذكية')}</h4>
              <p className="text-xs text-brand-muted font-medium mt-1 leading-relaxed">{t('home.value3Desc', 'برمجة أوقات الرش والشدة من التطبيق بسهولة.')}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-brand-canvas border border-stone-200 text-brand-sage flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-brand-ink">{t('home.value4Title', 'همس هادئ < 25 dB')}</h4>
              <p className="text-xs text-brand-muted font-medium mt-1 leading-relaxed">{t('home.value4Desc', 'هدوء فائق لا يُشعر به أثناء النوم والعمل.')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Collection: Layered White Cards on Calm Ground */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-amber font-mono">
              CURATED SELECTION · تشكيلة مختارة
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-brand-ink mt-1.5">
              {t('home.featuredTitle', 'المجموعة المميزة')}
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-brand-sage hover:text-brand-sage-dark flex items-center gap-1.5 transition-colors"
          >
            <span>{t('common.viewAll', 'عرض الكل')}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-white border border-stone-200/90 shadow-sm animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works: Section Rhythm on Subtle Warm Surface */}
      <section className="py-18 bg-[#EFEFEA] border-t border-b border-stone-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-amber font-mono">
            {t('home.howItWorksEyebrow', 'طريقة العمل')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-brand-ink">
            {t('home.howItWorksTitle', 'بساطة فائقة في ثلاث خطوات')}
          </h2>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 text-start space-y-4 shadow-sm border border-stone-200/90 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-brand-amber-light border border-brand-amber/20 text-brand-amber font-sans font-bold text-lg flex items-center justify-center">
              1
            </div>
            <h3 className="text-lg font-bold text-brand-ink">{t('home.step1Title', 'أضف الزيت العطري')}</h3>
            <p className="text-sm text-brand-muted leading-relaxed font-normal">
              {t('home.step1Desc', 'ضع الزيت العطري النقي مباشرة في الخزان دون إضافة قطرة ماء واحدة.')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 text-start space-y-4 shadow-sm border border-stone-200/90 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-brand-amber-light border border-brand-amber/20 text-brand-amber font-sans font-bold text-lg flex items-center justify-center">
              2
            </div>
            <h3 className="text-lg font-bold text-brand-ink">{t('home.step2Title', 'اضبط التوقيت والشدة')}</h3>
            <p className="text-sm text-brand-muted leading-relaxed font-normal">
              {t('home.step2Desc', 'حدد جدول العمل المناسب لمساحتك ومستوى الكثافة عبر التطبيق أو الأزرار.')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 text-start space-y-4 shadow-sm border border-stone-200/90 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-brand-amber-light border border-brand-amber/20 text-brand-amber font-sans font-bold text-lg flex items-center justify-center">
              3
            </div>
            <h3 className="text-lg font-bold text-brand-ink">{t('home.step3Title', 'تنفس النقاء والهدوء')}</h3>
            <p className="text-sm text-brand-muted leading-relaxed font-normal">
              {t('home.step3Desc', 'جزيئات معلقة مجهرية تنشر العبير بهدوء تام دون أي رطوبة على الأثاث.')}
            </p>
          </div>
        </div>
      </section>

      {/* Customer Testimonials: Elevated White Cards with Amber Star Rating */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-amber font-mono">
            VERIFIED EXPERIENCES · تجارب حقيقية
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-brand-ink">
            {t('home.testimonialsTitle', 'ما يقوله عملاؤنا في ليبيا')}
          </h2>
          <p className="text-sm text-brand-muted font-medium">{t('home.testimonialsSubtitle', 'تجارب حقيقية من منازل ومكاتب وفنادق استثنائية')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-7 space-y-4 border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-1 text-brand-amber">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-brand-amber text-brand-amber" />
              ))}
            </div>
            <p className="text-sm text-brand-ink leading-relaxed font-normal">
              {t('home.test1Text', '"غيّر الجهاز من انطباع زوار المعرض تماماً، يلاحظ الجميع الرائحة النقية والراقية بمجرد الدخول."')}
            </p>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-brand-muted font-medium">
              <span className="font-bold text-brand-ink">{t('home.test1Author', 'ليلى · استوديو تصميم داخلي (طرابلس)')}</span>
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-emerald-200/60">{t('common.verifiedBuyer', 'شراء مؤكد')}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 space-y-4 border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-1 text-brand-amber">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-brand-amber text-brand-amber" />
              ))}
            </div>
            <p className="text-sm text-brand-ink leading-relaxed font-normal">
              {t('home.test2Text', '"تحفة فنية حقيقية، صامت تماماً والجدولة الذكية تجعل المنزل معطراً قبل عودتي من العمل."')}
            </p>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-brand-muted font-medium">
              <span className="font-bold text-brand-ink">{t('home.test2Author', 'عمر · فيلا خاصة (بنغازي)')}</span>
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-emerald-200/60">{t('common.verifiedBuyer', 'شراء مؤكد')}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-7 space-y-4 border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-1 text-brand-amber">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-brand-amber text-brand-amber" />
              ))}
            </div>
            <p className="text-sm text-brand-ink leading-relaxed font-normal">
              {t('home.test3Text', '"نشغل 6 أجهزة في صالات الاستقبال والغرف التنفيذية بسهولة تامة من تطبيق واحد."')}
            </p>
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-brand-muted font-medium">
              <span className="font-bold text-brand-ink">{t('home.test3Author', 'سارة · إدارة ضيافة (مصراتة)')}</span>
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-emerald-200/60">{t('common.verifiedBuyer', 'شراء مؤكد')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Band Banner: Deep Warm Architectural Editorial Moment */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="relative rounded-[32px] bg-gradient-to-r from-[#1C2018] via-[#242B1D] to-[#1E2319] p-8 sm:p-14 text-white overflow-hidden shadow-2xl border border-stone-800">
          <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-radial from-[#717E57]/20 to-transparent pointer-events-none" />
          
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-amber font-mono">
              {t('home.brandBandEyebrow', 'تناغم العطر مع التصميم')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-light leading-snug text-white">
              {t('home.brandBandTitle', 'صُنعت لتُرى، وتُشعر.')}
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed font-normal">
              {t('home.brandBandDesc', 'كل قطعة من أودورا مصممة لتستقر بأناقة في مساحتك الداخلية — بساطة هادئة، وفخامة صامتة تليق بذوقك الرفيع.')}
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-block px-8 py-3.5 rounded-full bg-white hover:bg-stone-100 text-brand-ink font-bold text-sm transition-all shadow-md active:scale-95"
              >
                {t('home.brandBandCta', 'اكتشف المجموعة الكاملة')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup: Clean Layered Card */}
      <section className="border-t border-stone-200/80 bg-white py-14 px-4 text-center">
        <div className="max-w-md mx-auto space-y-3">
          <h3 className="text-2xl font-light text-brand-ink">
            {isRtl ? 'ابقَ على تواصل مع أودورا' : 'Stay Connected with Odora'}
          </h3>
          <p className="text-xs text-brand-muted font-medium leading-relaxed">
            {isRtl
              ? 'انضم لنشرتنا البريدية لتصلك العروض الحصرية وإصدارات العطور الجديدة أولاً بأول.'
              : 'Subscribe to receive private updates, new fragrance releases, and seasonal offers.'}
          </p>
          
          {newsletterDone ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-full text-xs font-medium flex items-center justify-center gap-2 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isRtl ? 'شكراً لاشتراكك! سنتواصل معك بأحدث العطور والعروض.' : 'Thank you for subscribing!'}</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm mx-auto pt-2">
              <input
                type="email"
                required
                placeholder={isRtl ? 'أدخل بريدك الإلكتروني...' : 'Enter your email...'}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs border border-stone-300 rounded-full focus:outline-none focus:border-brand-sage bg-white text-brand-ink shadow-xs"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-brand-ink hover:bg-stone-800 text-white rounded-full text-xs font-bold transition-colors shrink-0 shadow-sm active:scale-95"
              >
                {isRtl ? 'اشتراك' : 'Subscribe'}
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};

export default HomePage;