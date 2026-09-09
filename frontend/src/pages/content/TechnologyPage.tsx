import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu } from 'lucide-react';
import SpecsGrid from '../../components/common/SpecsGrid';
import { Link } from 'react-router-dom';

export const TechnologyPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = (i18n.language || 'ar').startsWith('ar');

  const comparisonData = [
    {
      feature: isRtl ? 'استخدام الماء والرطوبة' : 'Water & Moisture',
      odora: isRtl ? 'بدون ماء نهائياً (0% رطوبة)' : '100% Waterless (0% Humidity)',
      traditional: isRtl ? 'يتطلب ماء يومياً (يسبب العفن والرطوبة)' : 'Requires daily water (causes mold & humidity)',
      aerosol: isRtl ? 'رذاذ سائل يبلل الأسطح' : 'Liquid droplets that wet surfaces',
      candle: isRtl ? 'بدون ماء ولكن ينتج دخان وكربون' : 'No water, but produces smoke & soot'
    },
    {
      feature: isRtl ? 'حجم الجزيئات والانتشار' : 'Particle Size & Diffusion',
      odora: isRtl ? 'ميكرو-رذاذ أقل من 5 ميكرون معلق لساعات' : '< 5 micron nano-droplets suspended for hours',
      traditional: isRtl ? 'قطرات ثقيلة (> 20 ميكرون) تسقط فوراً' : 'Heavy droplets (>20 microns) fall to floor',
      aerosol: isRtl ? 'قطرات كيميائية تترسب وتسبب لزوجة' : 'Sticky chemical fallout',
      candle: isRtl ? 'انتشار محدود جداً حول الشعلة فقط' : 'Very localized around the flame'
    },
    {
      feature: isRtl ? 'المساحة والتغطية' : 'Coverage Capacity',
      odora: isRtl ? 'حتى 900 م³ (300 متر مربع)' : 'Up to 900 m³ (300 m²)',
      traditional: isRtl ? 'غرفة صغيرة (20-30 م²)' : 'Small room (20-30 m²)',
      aerosol: isRtl ? 'تأثير لحظي يزول في دقائق' : 'Momentary flash (fades in minutes)',
      candle: isRtl ? 'محيط الطاولة فقط' : 'Table vicinity only'
    },
    {
      feature: isRtl ? 'نقاء المكونات العطرية' : 'Olfactory Integrity',
      odora: isRtl ? 'تذرية هوائية باردة تحافظ على النوتات 100%' : 'Cold-air preserves 100% of delicate notes',
      traditional: isRtl ? 'تخفيف مائي يضعف الرائحة ويغير جودتها' : 'Diluted by water, alters fragrance profile',
      aerosol: isRtl ? 'مخفف بغازات البروبان والمواد الكيميائية' : 'Loaded with chemical propellants & VOCs',
      candle: isRtl ? 'الحرارة تحرق الجزيئات وتغير الطابع' : 'Heat oxidizes and burns fragile notes'
    },
    {
      feature: isRtl ? 'سعة الخزان والصيانة' : 'Refill Frequency',
      odora: isRtl ? 'خزان 1000 مل يستمر حتى 90 يوماً' : '1000 ml reservoir lasts up to 90 days',
      traditional: isRtl ? 'تعبئة يومية مع تنظيف مستمر للكلس' : 'Daily refill & cleaning limescale',
      aerosol: isRtl ? 'عبوة تنفد بسرعة كل أسبوعين' : 'Runs out every few weeks',
      candle: isRtl ? 'تحترق وتنتهي في ساعات قليلة' : 'Burns down in a few hours'
    }
  ];

  return (
    <div className="py-12 md:py-20 space-y-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 bg-brand-cream min-h-screen">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-white text-brand-sage border border-stone-200 shadow-xs">
          <Cpu size={14} />
          <span>{isRtl ? 'هندسة الهواء البارد' : 'Cold-Air Engineering'}</span>
        </span>
        <h1 className="text-4xl md:text-5xl font-light text-brand-ink tracking-tight">
          {isRtl ? 'علم التذرية الهوائية الدقيقة بدون ماء' : 'The Science of Waterless Micro-Atomization'}
        </h1>
        <p className="text-base md:text-lg text-brand-muted leading-relaxed font-normal">
          {isRtl 
            ? 'كيف تمكنا من توزيع الروائح العطرية الفاخرة على مساحة تصل إلى 900 متر مكعب دون قطرة ماء واحدة أو حرارة تؤثر على نقاء الزيت.'
            : 'How Odora projects pure, uncompromised fragrance across 900 cubic meters without water, heat, or residue.'}
        </p>
      </div>

      {/* 4-Step Technical Anatomy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-light text-brand-ink">
              {isRtl ? 'الفوهة المزدوجة Twin-Fluid Nozzle' : 'High-Velocity Twin-Fluid Nozzle'}
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed font-normal">
              {isRtl 
                ? 'قلب جهاز Odora A316 هو مضخة الضغط العالي المقترنة بفوهة مزدوجة حاصلة على براءة اختراع. يمر الهواء المضغوط بسرعة فائقة فوق فتحة الزيت ليسحب جزيئاته ويفتتها ميكانيكياً.'
                : 'At the heart of the A316 is a precision micro-pump paired with an aerospace-grade twin-fluid nozzle. Compressed air shears pure fragrance oil into nano-droplets.'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-pale/50 text-brand-sage flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-stone-200">
                1
              </div>
              <div>
                <h3 className="font-bold text-sm text-brand-ink">
                  {isRtl ? 'ضغط هواء فائق السرعة' : 'High-Velocity Air Jet'}
                </h3>
                <p className="text-xs text-brand-muted font-normal">
                  {isRtl ? 'يدخل تيار هواء نقي عبر مرشح ميكرو إلى غرفة التذرية.' : 'Filtered intake air is compressed into an ultra-fine chamber.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-pale/50 text-brand-sage flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-stone-200">
                2
              </div>
              <div>
                <h3 className="font-bold text-sm text-brand-ink">
                  {isRtl ? 'تفتيت الزيت إلى أقل من 5 ميكرون' : 'Atomization Under 5 Microns'}
                </h3>
                <p className="text-xs text-brand-muted font-normal">
                  {isRtl ? 'تتحول قطرات الزيت إلى ذرات دقيقة جداً تطفو في الهواء كالدخان العطري الشفاف.' : 'Oil particles are sheared into sub-5-micron micro-droplets that defy gravity.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-pale/50 text-brand-sage flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-stone-200">
                3
              </div>
              <div>
                <h3 className="font-bold text-sm text-brand-ink">
                  {isRtl ? 'انتشار متوازن وثابت' : 'Ambient Equilibrium Diffusion'}
                </h3>
                <p className="text-xs text-brand-muted font-normal">
                  {isRtl ? 'تتحرك الذرات مع تيارات الهواء الطبيعية في الغرفة لتغطي الزوايا والأبعاد الثلاثية.' : 'Micro-droplets drift on natural thermal currents, filling large rooms evenly.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-pale/50 text-brand-sage flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-stone-200">
                4
              </div>
              <div>
                <h3 className="font-bold text-sm text-brand-ink">
                  {isRtl ? 'نظافة تامة بدون أي ترسبات' : 'Zero Residue Surface Safe'}
                </h3>
                <p className="text-xs text-brand-muted font-normal">
                  {isRtl ? 'لأن الذرات تتبخر بالكامل في الهواء، لا تترك أي أثر لزج على الرخام، الخشب، أو الأقمشة.' : 'Because the mist remains suspended, zero oil accumulates on fine furniture or fabrics.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-md bg-white border border-stone-200 aspect-square flex items-center justify-center relative">
          <img 
            src="/photos/diffuser_sage_closeup.png" 
            alt="Odora A316 Nozzle & Body" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent flex items-end p-6">
            <div className="text-white">
              <div className="font-sans text-xs text-brand-pale">SPECIFICATION HIGHLIGHT</div>
              <div className="font-bold text-lg">{isRtl ? 'فوهة مزدوجة مقاومة للتآكل' : 'Aerospace Aluminum Dual Nozzle'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Grid Component */}
      <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-light text-brand-ink">
            {isRtl ? 'المواصفات الفنية المعتمدة لجهاز Odora A316' : 'A316 Technical Specifications'}
          </h2>
          <p className="text-xs text-brand-muted font-medium">
            {isRtl ? 'تمت معايرة جميع المواصفات في ظروف اختبار قياسية معتمدة' : 'Tested and certified for residential and commercial continuous duty'}
          </p>
        </div>
        <SpecsGrid />
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-light text-brand-ink">
            {isRtl ? 'مقارنة أودورا بالحلول التقليدية' : 'Odora vs Conventional Diffusers'}
          </h2>
          <p className="text-xs text-brand-muted font-medium">
            {isRtl ? 'لماذا تختار الفنادق والمنازل الفاخرة تقنية الهواء البارد بدون ماء؟' : 'Why leading luxury spaces choose waterless cold-air diffusion'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase font-bold text-brand-muted">
                <th className="py-3 px-4 text-start">{isRtl ? 'المعيار' : 'Feature'}</th>
                <th className="py-3 px-4 text-start bg-brand-pale/40 text-brand-sage font-bold rounded-t-xl">{isRtl ? 'أودورا A316' : 'Odora A316'}</th>
                <th className="py-3 px-4 text-start">{isRtl ? 'فواحات الماء المائية' : 'Ultrasonic Water'}</th>
                <th className="py-3 px-4 text-start">{isRtl ? 'بخاخات الرذاذ الجوي' : 'Aerosol Sprays'}</th>
                <th className="py-3 px-4 text-start">{isRtl ? 'الشموع المعطرة' : 'Scented Candles'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50 transition">
                  <td className="py-4 px-4 font-bold text-brand-ink">{row.feature}</td>
                  <td className="py-4 px-4 bg-brand-pale/20 font-bold text-brand-sage">{row.odora}</td>
                  <td className="py-4 px-4 text-brand-muted">{row.traditional}</td>
                  <td className="py-4 px-4 text-brand-muted">{row.aerosol}</td>
                  <td className="py-4 px-4 text-brand-muted">{row.candle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-brand-ink text-white rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-xl">
        <h2 className="text-3xl font-light">
          {isRtl ? 'جرّب بنفسك نقاء الهواء العطري الذكي' : 'Experience Pure Ambient Scenting'}
        </h2>
        <p className="text-sm md:text-base text-stone-300 max-w-2xl mx-auto font-normal">
          {isRtl 
            ? 'اطلب جهازك الآن واستفد من التوصيل المجاني إلى باب بيتك في أي مكان في ليبيا مع ضمان ذهبي لمدة عام.'
            : 'Order your Odora A316 today with free delivery across Libya and a full 1-year warranty.'}
        </p>
        <div>
          <Link 
            to="/shop" 
            className="inline-block px-8 py-3.5 bg-brand-sage text-white font-bold rounded-full text-sm hover:bg-brand-olive transition shadow-md"
          >
            {isRtl ? 'تسوق جهاز Odora A316 الآن' : 'Shop Odora A316'}
          </Link>
        </div>
      </div>

    </div>
  );
};

export default TechnologyPage;
