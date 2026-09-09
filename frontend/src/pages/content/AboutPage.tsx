import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Shield, Heart, Wind, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = (i18n.language || 'ar').startsWith('ar');

  return (
    <div className="py-12 md:py-20 space-y-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 bg-brand-cream min-h-screen">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white text-brand-sage border border-stone-200 shadow-xs">
          <Sparkles size={14} />
          <span>{isRtl ? 'قصة أودورا وهويتنا' : 'The Odora Story & Identity'}</span>
        </span>
        <h1 className="text-4xl md:text-5xl font-light text-brand-ink tracking-tight">
          {isRtl ? 'نصنع من الهواء تجربة فاخرة تأسر الحواس' : 'Crafting Sensory Atmosphere Through Air & Design'}
        </h1>
        <p className="text-base md:text-lg text-brand-muted leading-relaxed font-normal">
          {isRtl 
            ? 'انطلقت علامة أودورا في ليبيا لتعيد تعريف مفهوم التعطير الفندقي والمنزلي، عبر دمج أرقى فنون صناعة العطور الفرنسية بأحدث تقنيات التذرية الهوائية الدقيقة.'
            : 'Born in Libya to redefine luxury environmental scenting by combining French master perfumery with cutting-edge waterless cold-air micro-atomization.'}
        </p>
      </div>

      {/* Visual Editorial Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-md aspect-[21/9] bg-stone-100 flex items-center justify-center border border-stone-200">
        <img 
          src="/photos/diffuser_sage_livingroom.png" 
          alt="Odora A316 Diffuser in living room" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-8 md:p-12">
          <div className="text-white max-w-xl space-y-2">
            <span className="text-xs font-sans uppercase tracking-widest text-brand-pale font-bold">ODORA A316 ARCHITECTURE</span>
            <h2 className="text-2xl md:text-3xl font-light">
              {isRtl ? 'تصميم بسيط يندمج بانسيابية مع أدق تفاصيل ديكورك' : 'Minimalist aesthetics engineered to complement any refined interior'}
            </h2>
          </div>
        </div>
      </div>

      {/* Brand Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center text-brand-sage">
            <Wind size={24} />
          </div>
          <h3 className="font-bold text-xl text-brand-ink">
            {isRtl ? 'هندسة الهواء البارد بدون ماء' : 'Waterless Cold-Air Micro-Mist'}
          </h3>
          <p className="text-sm text-brand-muted leading-relaxed font-normal">
            {isRtl 
              ? 'تعتمد أجهزتنا تقنية الفوهة المزدوجة لتفتيت الزيوت العطرية إلى ذرات فائقة الصغر (أقل من 5 ميكرون) دون الحاجة لنقطة ماء واحدة، مما يمنع الرطوبة ويحافظ على النوتات العطرية الأصلية كاملة.'
              : 'Our twin-fluid nozzle atomizes pure essential oils into microscopic droplets under 5 microns with zero water, eliminating humidity and preserving the pure olfactory profile.'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center text-brand-sage">
            <Heart size={24} />
          </div>
          <h3 className="font-bold text-xl text-brand-ink">
            {isRtl ? 'نقاء زيوت غراس الفرنسية' : 'Pure Grasse Formulations'}
          </h3>
          <p className="text-sm text-brand-muted leading-relaxed font-normal">
            {isRtl 
              ? 'تم تطوير كافة باقاتنا العطرية بالتعاون مع دور العطور العالمية في غراس بفرنسا، مستخلصات نباتية طبيعية خالية من الكحول ومطابقة لأعلى معايير الأمان العالمية IFRA.'
              : 'Formulated in Grasse, France using sustainable botanicals. 100% alcohol-free, hypoallergenic, and certified by international IFRA safety standards.'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center text-brand-sage">
            <Shield size={24} />
          </div>
          <h3 className="font-bold text-xl text-brand-ink">
            {isRtl ? 'ضمان شامل ودعم محلي في ليبيا' : 'Local Warranty & Support in Libya'}
          </h3>
          <p className="text-sm text-brand-muted leading-relaxed font-normal">
            {isRtl 
              ? 'نضمن لك استثمارك مع ضمان شامل لمدة عام، بالإضافة إلى مركز صيانة معتمد وتوفر دائم لقطع الغيار والزيوت العطرية الأصلية في طرابلس وبنغازي ومصراتة.'
              : 'Enjoy peace of mind with our 1-year manufacturer warranty, dedicated Libyan service centers, and readily available parts and refill oils across all major cities.'}
          </p>
        </div>
      </div>

      {/* Libyan Heritage & Presence */}
      <div className="bg-brand-ink text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-2 text-xs font-sans font-bold tracking-widest text-brand-pale uppercase">
            <MapPin size={14} />
            <span>{isRtl ? 'فخر التميز والريادة في ليبيا' : 'Designed for Libyan Living'}</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-light leading-tight">
            {isRtl ? 'حضور يغطي كافة المدن الليبية من طرابلس إلى بنغازي' : 'Present Across Libya from Tripoli to Benghazi'}
          </h2>
          <p className="text-sm md:text-base text-stone-300 leading-relaxed font-normal">
            {isRtl 
              ? 'سواء كنت تؤثث فيلتك الخاصة، شقتك، مكتب شركتك، أو فندقك؛ توفر لك أودورا استشارات تعطير متخصصة تغطي المساحات الكبيرة بكفاءة تامة وتكلفة تشغيلية مدروسة.'
              : 'Whether furnishing a private residence, boutique hotel, or corporate headquarters, Odora provides bespoke scent architecture tailored for expansive Libyan spaces.'}
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link 
              to="/products" 
              className="px-6 py-3 bg-brand-sage hover:bg-brand-olive text-white rounded-full text-sm font-bold transition shadow-sm"
            >
              {isRtl ? 'اكتشف منتجاتنا' : 'Explore Products'}
            </Link>
            <Link 
              to="/technology" 
              className="px-6 py-3 border border-stone-400 hover:bg-white/10 text-white rounded-full text-sm font-bold transition"
            >
              {isRtl ? 'كيف تعمل التقنية؟' : 'Our Technology'}
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutPage;
