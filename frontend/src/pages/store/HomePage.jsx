import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Star, Droplets, VolumeX, Maximize2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import ProductCard from '../../components/common/ProductCard';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
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

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await api.subscribeNewsletter(newsletterEmail);
      setNewsletterDone(true);
    } catch (err) {
      setNewsletterDone(true);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="grain-overlay" />

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-pale/70 border border-stone-300/40 text-brand-olive text-xs font-semibold uppercase tracking-widest font-poppins">
              <Sparkles className="w-3.5 h-3.5 text-brand-sage" />
              <span>SCENT OF ATMOSPHERE · عبير الأجواء</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-brand-ink leading-[1.12] tracking-tight">
              أجواء استثنائية، <br />
              <span className="font-medium text-brand-olive">في كل مساحة.</span>
            </h1>

            <p className="text-base sm:text-lg text-brand-muted leading-relaxed max-w-xl">
              أجهزة تعطير إلكترونية فاخرة تجمع بين التقنية الدقيقة والتصميم الإيطالي الهادئ — تقنية الرذاذ البارد بدون ماء، فائقة الهدوء، مع تحكم وجدولة ذكية عبر التطبيق.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/products?category=diffusers"
                className="px-8 py-3.5 rounded-full bg-brand-dark hover:bg-stone-800 text-white font-semibold text-sm transition-all shadow-btn-dark hover:shadow-lg active:scale-95"
              >
                تسوق أجهزة التعطير
              </Link>
              <Link
                to="/products?category=fragrance-oils"
                className="px-8 py-3.5 rounded-full bg-brand-sage hover:bg-brand-olive text-white font-semibold text-sm transition-all shadow-btn-sage hover:shadow-md active:scale-95"
              >
                استكشف الزيوت النقية
              </Link>
            </div>

            {/* Micro Stats */}
            <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-6 max-w-md">
              <div>
                <div className="text-2xl font-bold text-brand-ink font-poppins">4.8★</div>
                <div className="text-xs text-brand-muted mt-0.5">+2,400 تقييم مؤكد</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-ink font-poppins">900 م²</div>
                <div className="text-xs text-brand-muted mt-0.5">تغطية متجانسة</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-brand-ink font-poppins">&lt;25 dB</div>
                <div className="text-xs text-brand-muted mt-0.5">همس فائق الهدوء</div>
              </div>
            </div>
          </div>

          {/* Hero Device Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-[36px] bg-gradient-to-br from-[#A7B191] via-[#8C9772] to-[#7C8863] shadow-2xl p-8 flex flex-col items-center justify-center overflow-hidden border border-white/20">
              
              {/* Radial Light Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.3),transparent_55%)] pointer-events-none" />

              {/* Animated Vapor Mist Wisps */}
              <div className="absolute top-12 z-20 flex flex-col items-center pointer-events-none">
                <div className="w-2.5 h-16 rounded-full bg-gradient-to-t from-white/70 to-transparent blur-[2px] animate-mist" />
              </div>

              {/* Real Extracted Device Image */}
              <div className="relative z-10 w-64 h-80 flex items-center justify-center drop-shadow-2xl">
                <img
                  src="/brand_photo_4.png"
                  alt="Odora A316 Smart Diffuser"
                  className="w-full h-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)]"
                  onError={(e) => { e.target.src = '/brand_photo_0.png'; }}
                />
              </div>

              {/* Floating Device Badge */}
              <div className="absolute bottom-6 inset-x-6 z-20 bg-white/90 backdrop-blur-md rounded-2xl p-3.5 shadow-lg flex items-center justify-between border border-white/60">
                <div>
                  <div className="text-xs font-bold text-brand-ink">جهاز أودورا A316 الذكي</div>
                  <div className="text-[11px] text-brand-muted">الأخضر المريمي · تشغيل مستمر</div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-brand-olive bg-brand-pale px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-brand-sage animate-pulse" />
                  <span>متصل</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Values Strip */}
      <section className="border-y border-stone-200/80 bg-white/70 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-right">
          <div className="p-2">
            <h4 className="font-bold text-sm sm:text-base text-brand-ink">رذاذ بارد بدون ماء</h4>
            <p className="text-xs text-brand-muted mt-1">Waterless cold-air، عبير نقي 100% بدون حرارة.</p>
          </div>
          <div className="p-2">
            <h4 className="font-bold text-sm sm:text-base text-brand-ink">تغطية حتى 900 م²</h4>
            <p className="text-xs text-brand-muted mt-1">انتشار متوازن ومثالي للمنازل الفسيحة والشركات.</p>
          </div>
          <div className="p-2">
            <h4 className="font-bold text-sm sm:text-base text-brand-ink">تحكم وجدولة ذكية</h4>
            <p className="text-xs text-brand-muted mt-1">برمجة أوقات الرش والشدة من التطبيق بسهولة.</p>
          </div>
          <div className="p-2">
            <h4 className="font-bold text-sm sm:text-base text-brand-ink">توصيل مجاني لكافة المدن</h4>
            <p className="text-xs text-brand-muted mt-1">توصيل فوري مجاناً للطلبات فوق 300 د.ل.</p>
          </div>
        </div>
      </section>

      {/* Featured Products Collection */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-muted font-poppins">
              CURATED SELECTION
            </span>
            <h2 className="text-3xl font-light text-brand-ink mt-1">
              مجموعتنا المميزة
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-brand-olive hover:text-brand-sage flex items-center gap-1.5 transition-colors"
          >
            <span>استعراض كافة المنتجات</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-stone-200/60 animate-pulse" />
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

      {/* How It Works (3 Steps) */}
      <section className="py-16 bg-[#EDE8E1]/50 border-t border-b border-stone-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-muted font-poppins">
            EFFORTLESS LUXURY
          </span>
          <h2 className="text-3xl font-light text-brand-ink">
            عبير مستمر بثلاث خطوات بسيطة
          </h2>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="odora-card p-8 text-right bg-white space-y-4">
            <div className="w-12 h-12 rounded-full bg-brand-pale text-brand-olive font-poppins font-bold text-lg flex items-center justify-center">
              1
            </div>
            <h3 className="text-lg font-bold text-brand-ink">أضف الزيت النقي</h3>
            <p className="text-sm text-brand-muted leading-relaxed">
              ضع زجاجة الزيت العطري النقي مباشرة في الجهاز دون الحاجة لخلطه بالماء أو تسخينه.
            </p>
          </div>

          <div className="odora-card p-8 text-right bg-white space-y-4">
            <div className="w-12 h-12 rounded-full bg-brand-pale text-brand-olive font-poppins font-bold text-lg flex items-center justify-center">
              2
            </div>
            <h3 className="text-lg font-bold text-brand-ink">اضبط الجدول والشدة</h3>
            <p className="text-sm text-brand-muted leading-relaxed">
              اختر شدة التعطير من 1 إلى 10 وحدد مواعيد عمل الجهاز عبر البلوتوث لتحفظ في ذاكرته.
            </p>
          </div>

          <div className="odora-card p-8 text-right bg-white space-y-4">
            <div className="w-12 h-12 rounded-full bg-brand-pale text-brand-olive font-poppins font-bold text-lg flex items-center justify-center">
              3
            </div>
            <h3 className="text-lg font-bold text-brand-ink">استمتع بالأجواء</h3>
            <p className="text-sm text-brand-muted leading-relaxed">
              ينتشر الرذاذ الميكروني البارد بانتظام في كامل الغرفة ليمنحك هدوءاً وانتعاشاً يدوم.
            </p>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-3xl font-light text-brand-ink">
            ماذا يقول عملاؤنا في ليبيا
          </h2>
          <p className="text-sm text-brand-muted">تجارب حقيقية لعملاء اعتمدوا أودورا في منازلهم ومشاريعهم</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="odora-card p-7 bg-white space-y-4 border border-stone-200/70">
            <div className="flex gap-1 text-brand-sage">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-brand-sage" />
              ))}
            </div>
            <p className="text-sm text-brand-ink leading-relaxed">
              "غيّر تماماً من أجواء معرضنا. الزبائن يلاحظون الرائحة الراقية فور دخولهم ويثنون عليها باستمرار."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-brand-muted">
              <span className="font-bold text-brand-olive">ليلى السويحلي</span>
              <span>استوديو تصميم · مصراتة</span>
            </div>
          </div>

          <div className="odora-card p-7 bg-white space-y-4 border border-stone-200/70">
            <div className="flex gap-1 text-brand-sage">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-brand-sage" />
              ))}
            </div>
            <p className="text-sm text-brand-ink leading-relaxed">
              "قطعة ديكور فاخرة، هادئ جداً بدون أي صوت، وميزة الجدولة الأسبوعية تعمل بدقة واحترافية عالية."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-brand-muted">
              <span className="font-bold text-brand-olive">عمر الشريف</span>
              <span>منزل خاص · طرابلس</span>
            </div>
          </div>

          <div className="odora-card p-7 bg-white space-y-4 border border-stone-200/70">
            <div className="flex gap-1 text-brand-sage">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-brand-sage" />
              ))}
            </div>
            <p className="text-sm text-brand-ink leading-relaxed">
              "نستخدم 6 أجهزة عبر مرافق الفندق ونتحكم بها جميعاً بسهولة. الزيوت العطرية أصلية وتدوم طويلاً."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-brand-muted">
              <span className="font-bold text-brand-olive">سارة القرقني</span>
              <span>قطاع الضيافة · بنغازي</span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Band Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <div className="relative rounded-[30px] bg-gradient-to-r from-[#4E5740] to-[#3C4432] p-8 sm:p-14 text-white overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-radial from-brand-pale/20 to-transparent pointer-events-none" />
          
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-pale font-poppins">
              SCENT MEETS DESIGN
            </span>
            <h2 className="text-3xl sm:text-4xl font-light leading-snug">
              صُنعت لتُرى وتُحس.. <br />
              عبير يلتقي بالأناقة والهدوء.
            </h2>
            <p className="text-sm text-white/80 leading-relaxed">
              كل تفصيلة في أجهزة أودورا مصممة لتستقر بأناقة في منزلك أو مكتبك — نقية، هادئة، وفخامة صامتة تملأ المكان.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-block px-7 py-3 rounded-full bg-brand-pale hover:bg-white text-brand-olive font-bold text-sm transition-all shadow-md active:scale-95"
              >
                استكشف التشكيلة الكاملة
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-white border-t border-stone-200/80 py-12 px-4 text-center">
        <div className="max-w-md mx-auto space-y-3">
          <h3 className="text-xl font-semibold text-brand-ink">ابقَ على تواصل مع أودورا</h3>
          <p className="text-xs text-brand-muted">انضم لنشرتنا البريدية لتصلك العروض الحصرية وإصدارات العطور الجديدة أولاً بأول.</p>
          
          {newsletterDone ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-full text-xs font-medium flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>شكراً لاشتراكك! سنتواصل معك بأحدث العطور والعروض.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                required
                placeholder="أدخل بريدك الإلكتروني..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-2 text-xs border border-stone-300 rounded-full focus:outline-none focus:border-brand-sage"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-brand-dark hover:bg-stone-800 text-white rounded-full text-xs font-semibold transition-colors shrink-0"
              >
                اشتراك
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};

export default HomePage;
