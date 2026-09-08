import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useLanguageStore } from '../../store/useLanguageStore';
import { HelpCircle, ChevronDown, MessageSquare, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEFAULT_FAQS = [
  {
    id: 1,
    category: 'diffuser',
    question_ar: 'كيف يعمل جهاز أودورا A316 بدون ماء نهائياً؟',
    question_en: 'How does Odora A316 work completely waterless?',
    answer_ar: 'يعتمد الجهاز على تقنية التذرية الهوائية الباردة (Cold-Air Micro-Atomization). يمر تيار هواء مضغوط عالي السرعة فوق الفوهة المزدوجة ليفتت الزيت النقي إلى ذرات مجهرية بحجم أقل من 5 ميكرون تطفو كالسحاب العطري، دون أي حرارة أو ماء قد يسبب الرطوبة أو العفن.',
    answer_en: 'The device uses cold-air micro-atomization where high-velocity filtered air shears pure oil into sub-5-micron airborne particles, preserving 100% of fragrance integrity without water or heat.'
  },
  {
    id: 2,
    category: 'diffuser',
    question_ar: 'ما هي المساحة الحقيقية التي يغطيها جهاز A316؟',
    question_en: 'What is the actual coverage area of A316?',
    answer_ar: 'يغطي الجهاز حجم هواء يصل إلى 900 متر مكعب، وهو ما يعادل تقريباً مساحة أرضية مفتوحة تصل إلى 300 متر مربع بارتفاع سقف قياسي. يمكنك ضبط شدة التذرية حسب حجم غرفتك بسهولة عبر التطبيق أو الأزرار.',
    answer_en: 'It covers up to 900 cubic meters (approximately 300 square meters of floor space with standard ceiling height). Intensity is fully customizable.'
  },
  {
    id: 3,
    category: 'oils',
    question_ar: 'كم تدوم عبوة الزيت العطري في الجهاز؟',
    question_en: 'How long does a fragrance oil refill last?',
    answer_ar: 'خزان الجهاز الداخلي بسعة 1000 مل. عند تشغيل الجهاز بمعدل 8 ساعات يومياً على كثافة معتدلة، تدوم العبوة من شهرين إلى ثلاثة أشهر كاملة (60 - 90 يوماً) دون الحاجة لإعادة التعبئة.',
    answer_en: 'The 1000ml reservoir lasts between 60 to 90 days when operating 8 hours daily at standard intensity settings.'
  },
  {
    id: 4,
    category: 'oils',
    question_ar: 'هل الزيوت العطرية آمنة للأطفال والحيوانات الأليفة؟',
    question_en: 'Are Odora fragrance oils safe for children and pets?',
    answer_ar: 'نعم، جميع تركيباتنا العطرية مصنعة في غراس بفرنسا وفق معايير الاتحاد الدولي للعطور (IFRA)، وهي خالية 100% من الكحول، الفثالات، والمواد السامة، ولا تسبب أي حساسية عند الاستنشاق الطبيعي.',
    answer_en: 'Yes. All oils are IFRA-certified, alcohol-free, non-toxic, and hypoallergenic for everyday household environments.'
  },
  {
    id: 5,
    category: 'shipping',
    question_ar: 'ما هي مدة وتكلفة التوصيل داخل ليبيا؟',
    question_en: 'What are the delivery times and shipping fees across Libya?',
    answer_ar: 'التوصيل مجاني بالكامل لأي طلب بقيمة 300 د.ل أو أكثر. للطلبات الأقل، تبلغ تكلفة الشحن 15 د.ل فقط. يستغرق التوصيل داخل طرابلس 24 إلى 48 ساعة، و 2 إلى 4 أيام لبنغازي، مصراتة، الزاوية، وكافة المدن الليبية الأخرى.',
    answer_en: 'Delivery is free on all orders over 300 LYD (15 LYD for smaller orders). Takes 24-48 hours in Tripoli, and 2-4 days for other Libyan cities.'
  },
  {
    id: 6,
    category: 'shipping',
    question_ar: 'ما هي طرق الدفع المتاحة عند الشراء؟',
    question_en: 'What payment methods do you accept?',
    answer_ar: 'نوفر خدمة الدفع نقداً عند الاستلام (Cash on Delivery) لجميع المدن الليبية بعد معاينة طلبك، بالإضافة إلى إمكانية الدفع عبر البطاقات المصرفية والمحافظ الإلكترونية.',
    answer_en: 'We offer Cash on Delivery (COD) across all Libyan cities upon receiving your order, as well as local bank cards.'
  },
  {
    id: 7,
    category: 'app',
    question_ar: 'هل يتطلب الجهاز اتصال واي-فاي دائم للعمل؟',
    question_en: 'Does the device require continuous Wi-Fi?',
    answer_ar: 'كلا، يتصل الجهاز بهاتفك عبر تقنية البلوتوث المباشر (Bluetooth 5.0). بمجرد ضبط جدول التشغيل وأوقات التعطير، يحفظ الجهاز الإعدادات في ذاكرته الداخلية ويعمل تلقائياً بدقة حتى لو أغلقت هاتفك أو ابتعدت عنه.',
    answer_en: 'No Wi-Fi is needed. It connects via direct Bluetooth 5.0 to sync your schedule, which is saved locally onto the device chip to run autonomously.'
  },
  {
    id: 8,
    category: 'warranty',
    question_ar: 'ما هي تفاصيل الضمان وخدمات الصيانة؟',
    question_en: 'What does the 2-year warranty cover?',
    answer_ar: 'يشمل الجهاز ضماناً شاملاً لمدة عامين ضد أي عيوب تصنيع في المحرك الداخلي أو لوحة التحكم أو الفوهة، مع توفر قطع الغيار وخدمة الصيانة الفورية في مراكزنا بطرابلس ومصراتة.',
    answer_en: 'Our 2-year warranty covers all internal pumps, nozzles, and electronic motherboards with local servicing hubs in Tripoli and Misrata.'
  }
];

export default function FaqPage() {
  const { isRtl } = useLanguageStore();
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.get('/cms/faqs/');
        if (res.data && (res.data.results?.length > 0 || res.data.length > 0)) {
          setFaqs(res.data.results || res.data);
        }
      } catch (err) {
        // Fallback to default faqs
      }
    };
    fetchFaqs();
  }, []);

  const categories = [
    { id: 'all', labelAr: 'كافة الأسئلة', labelEn: 'All FAQs' },
    { id: 'diffuser', labelAr: 'جهاز A316 والتقنية', labelEn: 'A316 Device' },
    { id: 'oils', labelAr: 'الزيوت العطرية', labelEn: 'Fragrance Oils' },
    { id: 'shipping', labelAr: 'الشحن والتوصيل والدفع', labelEn: 'Shipping & Payment' },
    { id: 'app', labelAr: 'تطبيق الهاتف والبلوتوث', labelEn: 'Mobile App' },
    { id: 'warranty', labelAr: 'الضمان والصيانة', labelEn: 'Warranty & Support' },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCat = activeCategory === 'all' || faq.category === activeCategory;
    const q = (isRtl ? faq.question_ar : (faq.question_en || faq.question_ar)).toLowerCase();
    const a = (isRtl ? faq.answer_ar : (faq.answer_en || faq.answer_ar)).toLowerCase();
    const matchesSearch = !searchQuery.trim() || q.includes(searchQuery.toLowerCase()) || a.includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-odora-sage/15 text-odora-olive border border-odora-sage/30">
          <HelpCircle size={14} />
          <span>{isRtl ? 'مركز المساعدة والإجابات' : 'Help & Answers'}</span>
        </span>
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-odora-dark tracking-tight">
          {isRtl ? 'الأسئلة الأكثر شيوعاً' : 'Frequently Asked Questions'}
        </h1>
        <p className="text-base text-odora-dark/70 max-w-xl mx-auto">
          {isRtl 
            ? 'كل ما تود معرفته عن جهاز أودورا A316، الزيوت الفرنسية، الشحن لمدن ليبيا، والضمان الذهبي.'
            : 'Everything you need to know about Odora A316, our oils, shipping across Libya, and warranty.'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isRtl ? 'ابحث عن سؤالك هنا...' : 'Search questions...'}
          className="w-full pl-10 pr-10 py-3 rounded-2xl border border-odora-dark/15 text-sm bg-white focus:outline-none focus:border-odora-olive shadow-sm"
        />
        <Search size={18} className={`absolute top-3.5 ${isRtl ? 'left-3.5' : 'right-3.5'} text-odora-dark/40`} />
      </div>

      {/* Categories Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeCategory === cat.id
                ? 'bg-odora-olive text-white shadow-sm'
                : 'bg-white text-odora-dark/70 hover:bg-odora-canvas border border-odora-dark/5'
            }`}
          >
            {isRtl ? cat.labelAr : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Accordion FAQ Items */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center text-odora-dark/50 bg-white rounded-2xl border border-odora-dark/5">
            {isRtl ? 'لم نجد أي أسئلة مطابقة لبحثك' : 'No matching questions found'}
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div 
                key={faq.id}
                className="bg-white rounded-2xl border border-odora-dark/5 shadow-sm overflow-hidden transition"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full p-5 text-start flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-odora-dark hover:bg-odora-canvas/20 transition"
                >
                  <span>{isRtl ? faq.question_ar : (faq.question_en || faq.question_ar)}</span>
                  <ChevronDown 
                    size={18} 
                    className={`text-odora-olive shrink-0 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-odora-dark/70 leading-relaxed border-t border-odora-dark/5">
                    {isRtl ? faq.answer_ar : (faq.answer_en || faq.answer_ar)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still have questions banner */}
      <div className="p-8 bg-odora-canvas/50 rounded-3xl border border-odora-dark/10 text-center space-y-4">
        <h3 className="font-serif font-bold text-lg text-odora-dark">
          {isRtl ? 'هل لديك استفسار آخر لم تجد إجابته هنا؟' : 'Still have questions?'}
        </h3>
        <p className="text-xs text-odora-dark/70 max-w-md mx-auto">
          {isRtl 
            ? 'فريق خدمة عملاء أودورا متاح دائماً للإجابة على استفساراتك وتقديم استشارة مجانية لمساحتك.'
            : 'Our scent consultants are available 6 days a week to help find the right solution for your space.'}
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-odora-olive text-white rounded-xl text-xs font-semibold hover:bg-odora-olive/90 transition shadow-sm"
        >
          <MessageSquare size={14} />
          <span>{isRtl ? 'تواصل مع فريق الدعم' : 'Contact Support'}</span>
        </Link>
      </div>

    </div>
  );
}
