import React, { useState } from 'react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useCartStore } from '../../store/useCartStore';
import { Sparkles, ShoppingBag, Heart, Check, Droplets } from 'lucide-react';
import ScentPyramid from '../../components/common/ScentPyramid';

const FRAGRANCES = [
  {
    id: 'forest-sage',
    nameAr: 'فورست سيج (Forest Sage)',
    nameEn: 'Forest Sage',
    familyAr: 'خشبية عشبية نقية',
    familyEn: 'Aromatic Woody',
    intensity: 4,
    moodAr: 'هدوء، استرخاء، سكينة طبيعية كغابات الجبل الأخضر',
    moodEn: 'Calm, grounding, restorative forest air',
    settingAr: 'غرف المعيشة، غرف النوم، ومراكز الاسترخاء',
    settingEn: 'Living rooms, bedrooms, wellness suites',
    price: 95.00,
    pyramid: {
      topAr: 'إبر الصنوبر البري، المريمية الإيطالية',
      topEn: 'Pine Needles, Clary Sage',
      heartAr: 'الخزامى النقية (لافندر)، الأوكالبتوس',
      heartEn: 'French Lavender, Eucalyptus',
      baseAr: 'خشب الأرز الأطلسي، المسك الأبيض',
      baseEn: 'Atlas Cedarwood, White Musk'
    },
    image: '/photos/diffuser_white_bedroom.png'
  },
  {
    id: 'cotton-linen',
    nameAr: 'كوتون لينين (Cotton Linen)',
    nameEn: 'Cotton Linen',
    familyAr: 'منعشة زهرية ناعمة',
    familyEn: 'Clean Floral Musk',
    intensity: 3,
    moodAr: 'انتعاش نقي، إحساس النظافة الفندقية الفاخرة بعد المطر',
    moodEn: 'Airy, crisp, luxury 5-star hotel linen freshness',
    settingAr: 'الممرات، الفلل المفتوحة، صالونات الاستقبال',
    settingEn: 'Lobbies, bright hallways, reception lounges',
    price: 95.00,
    pyramid: {
      topAr: 'الكتان المغسول، ندى الصباح، نسيم البحر',
      topEn: 'Fresh Linen, Morning Dew, Sea Breeze',
      heartAr: 'زهور القطن الأبيض، الياسمين البري',
      heartEn: 'Cotton Blossom, Star Jasmine',
      baseAr: 'المسك الخفيف، خشب الصندل الشفاف',
      baseEn: 'Soft Cashmere Musk, Sheer Sandalwood'
    },
    image: '/photos/diffuser_sage_livingroom.png'
  },
  {
    id: 'royal-amber',
    nameAr: 'رويال عنبر (Royal Amber)',
    nameEn: 'Royal Amber',
    familyAr: 'شرقية دافئة غنية',
    familyEn: 'Oriental Amber & Oud',
    intensity: 5,
    moodAr: 'فخامة أصيلة، دفء ملكي يليق بالمناسبات والضيافة الرفيعة',
    moodEn: 'Opulent, warm, regal hospitality',
    settingAr: 'مجالس الضيافة الكبيرة، المكاتب التنفيذية، صالات المناسبات',
    settingEn: 'Majlis, executive boardrooms, grand ballrooms',
    price: 110.00,
    pyramid: {
      topAr: 'الهيل الفاخر، الزعفران، قشور الحمضيات',
      topEn: 'Cardamom, Saffron, Spiced Citrus',
      heartAr: 'العنبر الذهبي، العود الكمبودي الخفيف',
      heartEn: 'Golden Amber, Gentle Oud, Rose',
      baseAr: 'الفانيليا المدخنة، الباتشولي، أخشاب دافئة',
      baseEn: 'Smoked Vanilla, Patchouli, Rich Woods'
    },
    image: '/photos/diffuser_black_office.png'
  },
  {
    id: 'citrus-breeze',
    nameAr: 'سيتروس بريز (Citrus Breeze)',
    nameEn: 'Citrus Breeze',
    familyAr: 'حمضية منعشة وحيوية',
    familyEn: 'Zesty Citrus & Green Tea',
    intensity: 4,
    moodAr: 'طاقة، يقظة وتركيز، انتعاش شمس البحر الأبيض المتوسط',
    moodEn: 'Energizing, vibrant, focus and morning vitality',
    settingAr: 'المكاتب، المساحات الرياضية، المطابخ المفتوحة',
    settingEn: 'Creative studios, executive desks, open kitchens',
    price: 95.00,
    pyramid: {
      topAr: 'البرغموت الإيطالي، اليوسفي الصقلي',
      topEn: 'Calabrian Bergamot, Sicilian Mandarin',
      heartAr: 'أوراق الشاي الأخضر، زهر البرتقال (نيرولي)',
      heartEn: 'Green Tea Leaves, Neroli',
      baseAr: 'خشب الأرز الفاتح، العنبر الأبيض',
      baseEn: 'Blonde Cedar, Clean Amber'
    },
    image: '/photos/diffuser_sage_closeup.png'
  }
];

export default function FragranceLibraryPage() {
  const { isRtl } = useLanguageStore();
  const { addItem } = useCartStore();
  const [apiProducts, setApiProducts] = useState({});

  useEffect(() => {
    api.getProducts().then((res) => {
      const prods = res.data.results || res.data;
      const map = {};
      prods.forEach(p => { map[p.slug] = p; });
      setApiProducts(map);
    }).catch(console.error);
  }, []);

  const handleQuickAdd = async (scent) => {
    try {
      // Find matching product in backend
      const matched = Object.values(apiProducts).find(p => 
        p.slug.includes(scent.id) || p.name_ar.includes(scent.nameAr.split(' ')[0])
      ) || Object.values(apiProducts)[0];

      if (matched) {
        await addItem(matched.id, null, 1);
        setAddedMap((prev) => ({ ...prev, [scent.id]: true }));
        setTimeout(() => {
          setAddedMap((prev) => ({ ...prev, [scent.id]: false }));
        }, 2000);
      }
    } catch (err) {
      console.error('Error adding fragrance oil to cart', err);
    }
  };

  return (
    <div className="py-12 md:py-20 space-y-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-odora-sage/15 text-odora-olive border border-odora-sage/30">
          <Droplets size={14} />
          <span>{isRtl ? 'مكتبة العطور الفرنسية النقية' : 'The Olfactory Fragrance Library'}</span>
        </span>
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-odora-dark tracking-tight">
          {isRtl ? 'باقات عطرية صممت في غراس لتأسر المكان' : 'Master Perfumery Crafted in Grasse, France'}
        </h1>
        <p className="text-base md:text-lg text-odora-dark/70 leading-relaxed">
          {isRtl 
            ? 'زيوت نقية 100% بدون كحول أو تخفيف مائي، مطورة خصيصاً لأنظمة التذرية الهوائية الباردة لتضمن انتشاراً متوازناً ونقاءً مستمراً لأسابيع.'
            : 'Pure essential and fine fragrance oils with zero alcohol or water dilution. Tailored for cold-air micro-atomization.'}
        </p>
      </div>

      {/* Fragrance Profiles List */}
      <div className="space-y-12">
        {FRAGRANCES.map((scent, idx) => (
          <div 
            key={scent.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-odora-dark/5 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Visual Thumbnail */}
            <div className="lg:col-span-4 aspect-square rounded-2xl overflow-hidden bg-odora-canvas relative">
              <img 
                src={scent.image} 
                alt={scent.nameAr} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-odora-olive border border-odora-dark/5 shadow-sm">
                {isRtl ? scent.familyAr : scent.familyEn}
              </div>
            </div>

            {/* Content & Details */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-odora-dark">
                  {isRtl ? scent.nameAr : scent.nameEn}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-odora-dark/60">{isRtl ? 'مستوى الكثافة:' : 'Intensity:'}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <span 
                        key={level} 
                        className={`w-2 h-2 rounded-full ${
                          level <= scent.intensity ? 'bg-odora-olive' : 'bg-odora-dark/15'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-odora-dark">{isRtl ? 'المزاج والشعور: ' : 'Atmosphere: '}</span>
                  <span className="text-odora-dark/70">{isRtl ? scent.moodAr : scent.moodEn}</span>
                </div>
                <div>
                  <span className="font-bold text-odora-dark">{isRtl ? 'المساحة المقترحة: ' : 'Best Setting: '}</span>
                  <span className="text-odora-dark/70">{isRtl ? scent.settingAr : scent.settingEn}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-odora-dark/5">
                <div>
                  <span className="text-xs text-odora-dark/50 block">{isRtl ? 'سعر العبوة (500 مل)' : '500ml Refill Price'}</span>
                  <span className="font-mono font-bold text-xl text-odora-dark">{scent.price.toFixed(2)} د.ل</span>
                </div>

                <button
                  onClick={() => handleQuickAdd(scent)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 transition shadow-sm ${
                    addedMap[scent.id]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-odora-olive hover:bg-odora-olive/90 text-white'
                  }`}
                >
                  {addedMap[scent.id] ? <Check size={14} /> : <ShoppingBag size={14} />}
                  <span>
                    {addedMap[scent.id] 
                      ? (isRtl ? 'تمت الإضافة للسلة' : 'Added!') 
                      : (isRtl ? 'أضف للسلة' : 'Add to Cart')}
                  </span>
                </button>
              </div>
            </div>

            {/* Scent Pyramid Graphic */}
            <div className="lg:col-span-3 bg-odora-canvas/30 p-4 rounded-2xl border border-odora-dark/5">
              <div className="text-center font-bold text-xs text-odora-dark mb-2 uppercase tracking-wider">
                {isRtl ? 'الهرم العطري' : 'Scent Pyramid'}
              </div>
              <ScentPyramid pyramid={scent.pyramid} />
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
