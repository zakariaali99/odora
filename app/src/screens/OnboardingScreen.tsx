import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Wind, Droplets, Smartphone, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { colors, typography, spacing, radii } from '../theme';
import { useAppStore } from '../store/useAppStore';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  navigation: any;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const { language, isRTL, setHasCompletedOnboarding } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);

  const fontFam =
    language === 'ar'
      ? typography.fontFamily.ar
      : typography.fontFamily.en;

  const slides = [
    {
      id: 1,
      badgeAr: 'هندسة الهواء البارد',
      badgeEn: 'Cold-Air Engineering',
      titleAr: 'تذرية هوائية دقيقة بدون قطرة ماء واحدة',
      titleEn: 'Waterless Micro-Atomization Technology',
      descAr: 'تقنية الفوهة المزدوجة تحول الزيوت النقية إلى ذرات معلقة أقل من 5 ميكرون تملأ مساحة تصل إلى 900 م³ دون ترك أي رطوبة أو رواسب على الأثاث.',
      descEn: 'Patented twin-fluid nozzle atomizes pure fragrance oil into sub-5-micron droplets covering up to 900 m³ with zero moisture or residue.',
      image: require('../../assets/images/brand_photo_4.png'),
      icon: Wind,
    },
    {
      id: 2,
      badgeAr: 'نقاء الطبيعة',
      badgeEn: 'Pure Grasse Formulations',
      titleAr: 'روائح فرنسية فاخرة تدوم لأسابيع',
      titleEn: 'Master Perfumery Crafted in France',
      descAr: 'باقات عطرية مطورة بالتعاون مع أرقى دور العطور في غراس بفرنسا، مستخلصات نباتية طبيعية 100% خالية من الكحول وتدوم حتى 90 يوماً.',
      descEn: 'Sustainable botanical extracts formulated in Grasse, France. 100% alcohol-free and long-lasting for up to 90 days per refill.',
      image: require('../../assets/images/brand_photo_2.png'),
      icon: Droplets,
    },
    {
      id: 3,
      badgeAr: 'تحكم ذكي ومستقل',
      badgeEn: 'Smart Bluetooth Control',
      titleAr: 'تحكم كامل وجدولة دقيقة لأجوائك',
      titleEn: 'Autonomous Scheduling at Your Fingertips',
      descAr: 'اضبط مواعيد التشغيل وشدة التعطير لغرفك عبر البلوتوث المباشر. يحفظ الجهاز إعداداتك ليعمل تلقائياً بدقة دون الحاجة لاتصال إنترنت دائم.',
      descEn: 'Schedule operating hours and adjust fragrance intensity effortlessly via Bluetooth 5.0. Settings are stored locally on device memory.',
      image: require('../../assets/images/brand_photo_3.png'),
      icon: Smartphone,
    },
  ];

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setHasCompletedOnboarding(true);
    navigation.replace('Home');
  };

  const slide = slides[currentStep];
  const IconComponent = slide.icon;

  return (
    <View style={styles.container}>
      {/* Top Bar with Skip */}
      <View style={styles.topBar}>
        <View style={styles.logoBadge}>
          <Sparkles size={12} color={colors.brandOlive} />
          <Text style={[styles.logoText, { fontFamily: fontFam.bold }]}>
            ODORA
          </Text>
        </View>

        <TouchableOpacity onPress={handleComplete} style={styles.skipButton}>
          <Text style={[styles.skipText, { fontFamily: fontFam.medium }]}>
            {language === 'ar' ? 'تخطي' : 'Skip'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hero Visual Image Card */}
      <View style={styles.imageContainer}>
        <View style={styles.imageFrame}>
          <Image source={slide.image} style={styles.image} resizeMode="contain" />
        </View>
      </View>

      {/* Content Slide Section */}
      <View style={styles.contentSection}>
        <View style={styles.badgeRow}>
          <View style={styles.featureBadge}>
            <IconComponent size={14} color={colors.brandOlive} />
            <Text style={[styles.featureBadgeText, { fontFamily: fontFam.medium }]}>
              {language === 'ar' ? slide.badgeAr : slide.badgeEn}
            </Text>
          </View>
        </View>

        <Text style={[styles.title, { fontFamily: fontFam.bold }]}>
          {language === 'ar' ? slide.titleAr : slide.titleEn}
        </Text>

        <Text style={[styles.description, { fontFamily: fontFam.regular }]}>
          {language === 'ar' ? slide.descAr : slide.descEn}
        </Text>

        {/* Step Indicators (Dots) */}
        <View style={styles.pagination}>
          {slides.map((s, idx) => (
            <View
              key={s.id}
              style={[
                styles.dot,
                idx === currentStep ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Bottom Next / Start CTA Button */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleNext}
            activeOpacity={0.88}
          >
            <Text style={[styles.primaryButtonText, { fontFamily: fontFam.bold }]}>
              {currentStep === slides.length - 1
                ? (language === 'ar' ? 'ابدأ تجربة أودورا' : 'Get Started')
                : (language === 'ar' ? 'التالي' : 'Next')}
            </Text>
            {isRTL ? (
              <ArrowLeft size={18} color={colors.surface} />
            ) : (
              <ArrowRight size={18} color={colors.surface} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
    justifyContent: 'space-between',
  },
  topBar: {
    paddingTop: 56,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.brandPaleGreen,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  logoText: {
    fontSize: 11,
    color: colors.brandOlive,
    letterSpacing: 1.5,
  },
  skipButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 13,
    color: colors.inkMuted,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    maxHeight: 340,
  },
  imageFrame: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    shadowColor: colors.brandOlive,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentSection: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(145, 156, 122, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
  },
  featureBadgeText: {
    fontSize: 11,
    color: colors.brandOlive,
  },
  title: {
    fontSize: 22,
    color: colors.inkPrimary,
    lineHeight: 30,
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    color: colors.inkMuted,
    lineHeight: 20,
    marginBottom: 24,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 28,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.brandSage,
  },
  dotInactive: {
    width: 6,
    backgroundColor: colors.borderLight,
  },
  bottomBar: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: colors.brandOlive,
    paddingVertical: 16,
    borderRadius: radii.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: colors.brandOlive,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 15,
  },
});

export default OnboardingScreen;
