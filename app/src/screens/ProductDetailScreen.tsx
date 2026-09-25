import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme';
import { AppBar, Card, Icon } from '../components/ui';

interface ProductDetailScreenProps {
  navigation: any;
  route?: {
    params?: {
      productId?: string;
    };
  };
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { colors, typography, radii, spacing, isRTL } = useTheme();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('sage');
  const [activeThumb, setActiveThumb] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const basePrice = 185;

  const colorways = [
    {
      id: 'sage',
      name: isRTL ? 'ميرمية' : 'Sage',
      sub: isRTL ? 'ساتان حريري' : 'Matte Satin',
      label: isRTL ? 'أخضر الميرمية' : 'Sage Green',
      color: '#919c7a',
    },
    {
      id: 'white',
      name: isRTL ? 'ألاباستر' : 'Alabaster',
      sub: isRTL ? 'سيراميك' : 'Ceramic',
      label: isRTL ? 'أبيض رخامي' : 'Matte White',
      color: '#ebe7e1',
    },
    {
      id: 'black',
      name: isRTL ? 'أوبسيديان' : 'Obsidian',
      sub: isRTL ? 'معدني معتم' : 'Anodized',
      label: isRTL ? 'أسود بركاني' : 'Matte Black',
      color: '#2d2f2b',
    },
  ];

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      navigation.navigate('Cart');
    }, 1200);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* 1. Header (64pt, Back button + Title + Share + Cart with badge) */}
      <AppBar
        leading={
          <View style={styles.appBarLeading}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Icon name="arrow_back" size={20} color={colors.text} />
            </TouchableOpacity>
            <Text
              numberOfLines={1}
              style={[
                typography.headlineSm,
                {
                  color: colors.text,
                  fontSize: 16,
                  lineHeight: 22,
                  fontWeight: '600',
                  marginStart: 6,
                },
              ]}
            >
              {isRTL ? 'أودورا — تفاصيل المنتج' : 'Odora — Product Detail'}
            </Text>
          </View>
        }
        actions={[
          {
            icon: 'share',
            onPress: () => {},
            label: 'Share',
          },
          {
            icon: 'shopping_bag',
            onPress: () => navigation.navigate('Cart'),
            label: 'Cart',
          },
        ]}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 2. Hero Gallery Section (4/5 Aspect Ratio) */}
        <View style={styles.gallerySection}>
          <View style={[styles.heroFrame, { backgroundColor: colors.surfaceLow }]}>
            <Image
              source={
                selectedColor === 'black'
                  ? require('../../assets/photos/diffuser-black-clean.png')
                  : selectedColor === 'white'
                  ? require('../../assets/photos/diffuser-white-clean.png')
                  : require('../../assets/photos/diffuser_sage_closeup.png')
              }
              style={styles.heroImage}
              resizeMode="cover"
            />

            {/* Cold Diffusion Active Badge */}
            <View style={[styles.diffusionBadge, { backgroundColor: 'rgba(255,255,255,0.92)' }]}>
              <View style={[styles.pulseDot, { backgroundColor: colors.primary }]} />
              <Text style={[typography.labelSm, { color: colors.text, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }]}>
                {isRTL ? 'التفتيت البارد نشط' : 'Cold Diffusion Active'}
              </Text>
            </View>

            {/* Live Scent Wave Badge */}
            <View style={[styles.mistBadge, { backgroundColor: 'rgba(255,255,255,0.92)' }]}>
              <Icon name="air" size={15} color={colors.primary} />
              <Text style={[typography.labelSm, { color: colors.text, fontSize: 11, fontWeight: '600', marginStart: 3 }]}>
                {isRTL ? 'رذاذ نانوي' : 'Nano-Mist'}
              </Text>
            </View>

            {/* Pagination Indicators */}
            <View style={styles.paginationRow}>
              <View style={[styles.pageDotActive, { backgroundColor: colors.primary }]} />
              <View style={[styles.pageDot, { backgroundColor: colors.surfaceHigh }]} />
              <View style={[styles.pageDot, { backgroundColor: colors.surfaceHigh }]} />
              <View style={[styles.pageDot, { backgroundColor: colors.surfaceHigh }]} />
            </View>

            {/* Fullscreen Zoom Icon */}
            <View style={[styles.zoomButton, { backgroundColor: 'rgba(255,255,255,0.92)' }]}>
              <Icon name="crop_free" size={18} color={colors.text} />
            </View>
          </View>

          {/* Thumbnail Strip */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailStrip}
          >
            {[
              require('../../assets/photos/diffuser-sage-clean.png'),
              require('../../assets/photos/diffuser_sage_livingroom.png'),
              require('../../assets/photos/diffuser-white-clean.png'),
              require('../../assets/photos/bundle-signature.png'),
            ].map((imgSrc, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.8}
                onPress={() => setActiveThumb(idx)}
                style={[
                  styles.thumbBox,
                  { backgroundColor: colors.surfaceLow },
                  activeThumb === idx && { borderColor: colors.primary, borderWidth: 2 },
                ]}
              >
                <Image source={imgSrc} style={styles.thumbImage} resizeMode="cover" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 3. Title & Core Pricing Section */}
        <View style={styles.titleSection}>
          <View style={styles.seriesRatingRow}>
            <Text style={[typography.labelSm, { color: colors.primary, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: '700' }]}>
              {isRTL ? 'سلسلة الرذاذ المعماري' : 'Architectural Mist Series'}
            </Text>
            <View style={styles.ratingBadge}>
              <Icon name="star" size={14} color="#b89535" />
              <Text style={[typography.labelSm, { color: colors.text, fontWeight: '700', marginStart: 2 }]}>4.9</Text>
              <Text style={[typography.labelSm, { color: colors.textMuted, marginStart: 2 }]}> (184)</Text>
            </View>
          </View>

          <Text style={[typography.headlineLg, { color: colors.text, fontWeight: '600', marginTop: 4 }]}>
            Odora Air 01
          </Text>

          <View style={styles.priceRow}>
            <Text style={[typography.headlineMd, { color: colors.text, fontWeight: '700' }]}>
              ${basePrice}.00
            </Text>
            <View style={[styles.shippingBadge, { backgroundColor: colors.accent }]}>
              <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
                {isRTL ? 'شحن سريع مجاني' : 'Free Express Shipping'}
              </Text>
            </View>
          </View>

          <Text style={[typography.bodyMd, { color: colors.textMuted, marginTop: 10, lineHeight: 22 }]}>
            {isRTL
              ? 'تقنية التفتيت البارد الميكروي بدون ماء. تصميم معماري استثنائي مقترن بضبط ذكي للرائحة عبر البلوتوث لراحة قصوى.'
              : 'Waterless cold-air nano-nebulization technology. Uncompromising architectural form paired with intelligent Bluetooth ambient fragrance modulation.'}
          </Text>
        </View>

        {/* 4. Colorway Selector */}
        <View style={styles.colorwaySection}>
          <View style={styles.colorwayHeader}>
            <Text style={[typography.labelLg, { color: colors.text, fontWeight: '700' }]}>
              {isRTL ? 'اللون والخامة' : 'Finish'}
            </Text>
            <Text style={[typography.bodySm, { color: colors.textMuted }]}>
              {colorways.find((c) => c.id === selectedColor)?.label}
            </Text>
          </View>

          <View style={styles.colorwayGrid}>
            {colorways.map((c) => {
              const isSelected = selectedColor === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  activeOpacity={0.85}
                  onPress={() => setSelectedColor(c.id)}
                  style={[
                    styles.colorwayCard,
                    isSelected
                      ? { backgroundColor: colors.accent, borderColor: colors.primary, borderWidth: 1 }
                      : { backgroundColor: colors.surfaceLow, borderColor: 'transparent', borderWidth: 1 },
                  ]}
                >
                  <View style={[styles.colorCircle, { backgroundColor: c.color }]}>
                    {isSelected && <Icon name="check" size={14} color="#ffffff" />}
                  </View>
                  <View style={{ marginStart: 8, flex: 1 }}>
                    <Text numberOfLines={1} style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>
                      {c.name}
                    </Text>
                    <Text numberOfLines={1} style={[typography.bodySm, { color: colors.textMuted, fontSize: 10 }]}>
                      {c.sub}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 5. Scent Chamber Inclusion Pairing */}
        <View style={styles.inclusionSection}>
          <Card surface="low" style={styles.inclusionCard}>
            <View style={styles.inclusionHeader}>
              <View style={styles.inclusionLeft}>
                <View style={[styles.inclusionIconCircle, { backgroundColor: colors.accent }]}>
                  <Icon name="spa" size={16} color={colors.primary} />
                </View>
                <View style={{ marginStart: 10, flex: 1 }}>
                  <Text style={[typography.labelLg, { color: colors.text, fontWeight: '700' }]}>
                    {isRTL ? 'زيت بداية مجاني' : 'Complimentary Starter Oil'}
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 11 }]}>
                    {isRTL ? 'يشمل خرطوشة تفتيت 30 مل مجانية' : 'Includes 30ml cold-diffusion cartridge'}
                  </Text>
                </View>
              </View>
              <View style={[styles.includedPill, { backgroundColor: colors.surface }]}>
                <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
                  {isRTL ? 'مشمول' : 'INCLUDED'}
                </Text>
              </View>
            </View>

            <View style={[styles.starterSelectorPill, { backgroundColor: colors.surface }]}>
              <View style={styles.starterPillLeft}>
                <View style={[styles.greenColorDot, { backgroundColor: colors.primary }]} />
                <View style={{ marginStart: 8 }}>
                  <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600' }]}>
                    {isRTL ? 'رقم 04 ميرمية الغابة وأرز فرجينيا' : 'No. 04 Forest Sage & Virginian Cedar'}
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 10 }]}>
                    {isRTL ? 'برغموت • زعتر فرنسي • صنوبر مهروس' : 'Bergamot • French Thyme • Crushed Pine'}
                  </Text>
                </View>
              </View>
              <Icon name="expand_more" size={18} color={colors.textMuted} />
            </View>
          </Card>
        </View>

        {/* 6. Engineered Tranquility Bento */}
        <View style={styles.engineeringSection}>
          <View style={styles.engineeringHeader}>
            <Text style={[typography.headlineSm, { color: colors.text, fontSize: 17, fontWeight: '700' }]}>
              {isRTL ? 'هندسة السكون والهدوء' : 'Engineered Tranquility'}
            </Text>
            <Text style={[typography.labelSm, { color: colors.textMuted, letterSpacing: 1 }]}>SPEC 1.0</Text>
          </View>

          <View style={styles.specCardsCol}>
            {[
              {
                icon: 'waves',
                title: isRTL ? 'تفتيت نانوي بدون ماء' : 'Waterless Nano-Nebulization',
                desc: isRTL
                  ? 'يطلق رذاذاً ميكروياً بارداً بدون حرارة أو ماء، للحفاظ على مصفوفة التربينات العطرية الطبيعية.'
                  : 'Deploys pressurized cold air micro-droplets without heat or water, safeguarding delicate botanical terpene compounds.',
                iconBg: colors.accent,
                iconColor: colors.primary,
              },
              {
                icon: 'tune',
                title: isRTL ? 'معايرة دقيقة عبر البلوتوث' : 'Dual-Chamber BLE Modulation',
                desc: isRTL
                  ? 'تحكم دقيق عبر تطبيق أودورا. اضبط أوقات الرش ومستويات الكثافة ومواعيد التشغيل اليومية.'
                  : 'Precision control via the Odora mobile sanctuary app. Calibrate mist duration, density thresholds, and automated sleep schedules.',
                iconBg: colors.accent,
                iconColor: colors.primary,
              },
              {
                icon: 'volume_off',
                title: isRTL ? 'عزل صوتي فائق < 16 ديسيبل' : '< 16 dB Acoustic Dampening',
                desc: isRTL
                  ? 'متاهة موائع مدمجة تضمن صمتاً فائقاً يلائم غرف النوم وأماكن الاسترخاء الهادئة.'
                  : 'Integrated fluid labyrinth baffle guarantees near-silent operation suitable for quiet libraries, nurseries, and sleep chambers.',
                iconBg: colors.surfaceHigh,
                iconColor: colors.text,
              },
            ].map((spec, index) => (
              <View key={index} style={[styles.specCard, { backgroundColor: colors.surfaceLow }]}>
                <View style={[styles.specIconBox, { backgroundColor: spec.iconBg }]}>
                  <Icon name={spec.icon} size={20} color={spec.iconColor} />
                </View>
                <View style={{ marginStart: 12, flex: 1 }}>
                  <Text style={[typography.labelLg, { color: colors.text, fontWeight: '700' }]}>
                    {spec.title}
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 3, lineHeight: 18 }]}>
                    {spec.desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 7. Complete the Ritual: Paired Additions */}
        <View style={styles.ritualSection}>
          <View style={styles.ritualHeader}>
            <View>
              <Text style={[typography.headlineSm, { color: colors.text, fontSize: 17, fontWeight: '700' }]}>
                {isRTL ? 'أكمل الطقس المعماري' : 'Complete the Ritual'}
              </Text>
              <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 11 }]}>
                {isRTL ? 'إضافات منسجمة مع مساحتك' : 'Recommended pairings for your space'}
              </Text>
            </View>
            <Icon name="auto_awesome" size={20} color={colors.primary} />
          </View>

          <View style={styles.ritualGrid}>
            {/* Ritual Item 1 */}
            <View style={[styles.ritualCard, { backgroundColor: colors.surfaceLow }]}>
              <View style={[styles.ritualImageWrapper, { backgroundColor: colors.surface }]}>
                <Image
                  source={require('../../assets/photos/oil-forest-sage.png')}
                  style={styles.ritualImage}
                  resizeMode="contain"
                />
                <TouchableOpacity style={[styles.ritualAddPill, { backgroundColor: colors.surface }]}>
                  <Icon name="add" size={14} color={colors.text} />
                </TouchableOpacity>
              </View>
              <Text numberOfLines={1} style={[typography.labelMd, { color: colors.text, fontWeight: '700', marginTop: 8 }]}>
                {isRTL ? 'ميرمية الغابة 30 مل' : 'Forest Sage 30ml'}
              </Text>
              <Text numberOfLines={1} style={[typography.bodySm, { color: colors.textMuted, fontSize: 10 }]}>
                {isRTL ? 'خرطوشة زيت نقية' : 'Refill Chamber Cartridge'}
              </Text>
              <View style={styles.ritualBottomRow}>
                <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>$42.00</Text>
                <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>+ Add</Text>
              </View>
            </View>

            {/* Ritual Item 2 */}
            <View style={[styles.ritualCard, { backgroundColor: colors.surfaceLow }]}>
              <View style={[styles.ritualImageWrapper, { backgroundColor: colors.surface }]}>
                <Image
                  source={require('../../assets/photos/diffuser-white-clean.png')}
                  style={styles.ritualImage}
                  resizeMode="contain"
                />
                <TouchableOpacity style={[styles.ritualAddPill, { backgroundColor: colors.surface }]}>
                  <Icon name="add" size={14} color={colors.text} />
                </TouchableOpacity>
              </View>
              <Text numberOfLines={1} style={[typography.labelMd, { color: colors.text, fontWeight: '700', marginTop: 8 }]}>
                {isRTL ? 'قاعدة ترافيرتين الرخامية' : 'Honed Travertine Base'}
              </Text>
              <Text numberOfLines={1} style={[typography.bodySm, { color: colors.textMuted, fontSize: 10 }]}>
                {isRTL ? 'قاعدة حجرية منحوتة' : 'Sculptural Stone Stand'}
              </Text>
              <View style={styles.ritualBottomRow}>
                <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>$65.00</Text>
                <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>+ Add</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 8. Trust & Guarantees */}
        <View style={styles.guaranteeSection}>
          <View style={[styles.guaranteeGrid, { backgroundColor: colors.surfaceLow }]}>
            <View style={styles.guaranteeCell}>
              <Icon name="local_shipping" size={18} color={colors.primary} />
              <View style={{ marginStart: 6 }}>
                <Text style={[typography.labelSm, { color: colors.text, fontWeight: '700' }]}>
                  {isRTL ? 'شحن جوي مجاني' : 'Free 2-Day Air'}
                </Text>
                <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 10 }]}>
                  {isRTL ? 'محايد كربونياً' : 'Carbon-neutral'}
                </Text>
              </View>
            </View>
            <View style={styles.guaranteeCell}>
              <Icon name="verified" size={18} color={colors.primary} />
              <View style={{ marginStart: 6 }}>
                <Text style={[typography.labelSm, { color: colors.text, fontWeight: '700' }]}>
                  {isRTL ? 'ضمان لسنتين' : '2-Year Warranty'}
                </Text>
                <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 10 }]}>
                  {isRTL ? 'استبدال شامل' : 'Full replacement'}
                </Text>
              </View>
            </View>
            <View style={styles.guaranteeCell}>
              <Icon name="timelapse" size={18} color={colors.primary} />
              <View style={{ marginStart: 6 }}>
                <Text style={[typography.labelSm, { color: colors.text, fontWeight: '700' }]}>
                  {isRTL ? 'تجربة 30 يوماً' : '30-Day Ritual Trial'}
                </Text>
                <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 10 }]}>
                  {isRTL ? 'استرجاع سهل' : 'Easy home returns'}
                </Text>
              </View>
            </View>
            <View style={styles.guaranteeCell}>
              <Icon name="lock" size={18} color={colors.primary} />
              <View style={{ marginStart: 6 }}>
                <Text style={[typography.labelSm, { color: colors.text, fontWeight: '700' }]}>
                  {isRTL ? 'دفع آمن' : 'Secure Checkout'}
                </Text>
                <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 10 }]}>
                  {isRTL ? 'دفع عند الاستلام' : 'Cash & Cards'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 9. Sticky Bottom Purchase Bar */}
      <View style={[styles.stickyBottomBar, { backgroundColor: colors.surface, borderTopColor: colors.surfaceLow }]}>
        <View style={styles.stickyRow}>
          {/* Quantity Counter */}
          <View style={[styles.qtyCounterPill, { backgroundColor: colors.surfaceLow }]}>
            <TouchableOpacity
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              style={styles.qtyBtn}
            >
              <Icon name="remove" size={16} color={colors.text} />
            </TouchableOpacity>
            <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '700', fontSize: 16 }]}>
              {quantity}
            </Text>
            <TouchableOpacity
              onPress={() => setQuantity(Math.min(8, quantity + 1))}
              style={styles.qtyBtn}
            >
              <Icon name="add" size={16} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Primary CTA */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleAddToCart}
            style={[
              styles.purchaseCtaBtn,
              { backgroundColor: isAdded ? colors.primary : colors.ink },
            ]}
          >
            {isAdded ? (
              <View style={styles.addedStateRow}>
                <Icon name="check_circle" size={20} color="#ffffff" />
                <Text style={[typography.labelLg, { color: '#ffffff', fontWeight: '700', marginStart: 6 }]}>
                  {isRTL ? 'تمت الإضافة إلى الحقيبة' : 'Added to Bag'}
                </Text>
              </View>
            ) : (
              <>
                <Text style={[typography.labelLg, { color: colors.onInk, fontWeight: '700' }]}>
                  {isRTL ? 'إضافة إلى الحقيبة' : 'Add to Bag'}
                </Text>
                <View style={styles.ctaPriceGroup}>
                  <Text style={[typography.labelLg, { color: colors.onInk, fontWeight: '700' }]}>
                    ${basePrice * quantity}.00
                  </Text>
                  <Icon name="arrow_forward" size={18} color={colors.onInk} style={{ marginStart: 4 }} />
                </View>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  appBarLeading: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  gallerySection: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  heroFrame: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  diffusionBadge: {
    position: 'absolute',
    top: 14,
    start: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginEnd: 6,
  },
  mistBadge: {
    position: 'absolute',
    top: 14,
    end: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  paginationRow: {
    position: 'absolute',
    bottom: 14,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pageDotActive: {
    width: 22,
    height: 6,
    borderRadius: 3,
  },
  pageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  zoomButton: {
    position: 'absolute',
    bottom: 14,
    end: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailStrip: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  thumbBox: {
    width: 64,
    height: 64,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImage: {
    width: '80%',
    height: '80%',
  },
  titleSection: {
    paddingHorizontal: 20,
    marginTop: 18,
  },
  seriesRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  shippingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  colorwaySection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  colorwayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  colorwayGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  colorwayCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inclusionSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  inclusionCard: {
    borderRadius: 20,
    padding: 16,
  },
  inclusionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inclusionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inclusionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  includedPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  starterSelectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    marginTop: 12,
  },
  starterPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  greenColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  engineeringSection: {
    paddingHorizontal: 20,
    marginTop: 22,
  },
  engineeringHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  specCardsCol: {
    gap: 10,
  },
  specCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 18,
  },
  specIconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ritualSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  ritualHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ritualGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  ritualCard: {
    flex: 1,
    borderRadius: 18,
    padding: 10,
  },
  ritualImageWrapper: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ritualImage: {
    width: '80%',
    height: '80%',
  },
  ritualAddPill: {
    position: 'absolute',
    top: 6,
    end: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ritualBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 2,
  },
  guaranteeSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  guaranteeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 14,
    borderRadius: 20,
    gap: 12,
  },
  guaranteeCell: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },
  stickyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qtyCounterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 106,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 8,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseCtaBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  ctaPriceGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addedStateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
