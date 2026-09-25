import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme';
import { AppBar, Card, Icon } from '../components/ui';

interface StoreScreenProps {
  navigation: any;
}

export const StoreScreen: React.FC<StoreScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors, typography, radii, spacing, isRTL } = useTheme();

  const [activeCategory, setActiveCategory] = useState('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;

  const showToast = (productName: string) => {
    setToastMessage(isRTL ? `تمت إضافة ${productName} إلى السلة` : `${productName} added to cart`);
    Animated.sequence([
      Animated.timing(toastAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.delay(2200),
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => setToastMessage(null));
  };

  const categories = [
    { id: 'all', label: isRTL ? 'الكل' : 'All' },
    { id: 'diffusers', label: isRTL ? 'الموزعات (3)' : 'Diffusers (3)' },
    { id: 'oils', label: isRTL ? 'زيوت نقية (8)' : 'Pure Oils (8)' },
    { id: 'bundles', label: isRTL ? 'باقات الملاذ (2)' : 'Sanctuary Bundles (2)' },
    { id: 'accessories', label: isRTL ? 'إكسسوارات' : 'Accessories' },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* 1. App Bar (64pt, Stitch: pulse dot + uppercase title + Cart with badge + Profile avatar) */}
      <AppBar
        leading={
          <View style={styles.appBarLeading}>
            <View style={[styles.pulseDot, { backgroundColor: colors.primarySoft }]} />
            <Text
              style={[
                typography.headlineSm,
                {
                  color: colors.text,
                  fontSize: 18,
                  lineHeight: 26,
                  fontWeight: '500',
                  textTransform: isRTL ? 'none' : 'uppercase',
                  marginStart: 8,
                },
              ]}
            >
              {isRTL ? 'أودورا — المتجر' : 'Odora — Store'}
            </Text>
          </View>
        }
        actions={[
          {
            icon: 'shopping_bag',
            onPress: () => navigation.navigate('Cart'),
            label: 'Cart',
          },
          {
            avatar: require('../../assets/photos/avatar.jpg'),
            onPress: () => navigation.navigate('Account'),
            label: 'Profile',
          },
        ]}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              backgroundColor: colors.ink,
              opacity: toastAnim,
              transform: [
                {
                  translateY: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Icon name="check_circle" size={18} color={colors.accent} />
          <Text style={[typography.labelMd, { color: colors.onInk, marginStart: 8, fontWeight: '600' }]}>
            {toastMessage}
          </Text>
        </Animated.View>
      )}

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Search & Filter Controls */}
        <View style={styles.searchSection}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.searchPill, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('Search')}
          >
            <Icon name="search" size={20} color={colors.textMuted} />
            <Text style={[typography.bodySm, { color: colors.textMuted, marginStart: 8, flex: 1, textAlign: 'left' }]}>
              {isRTL ? 'ابحث عن العطور النباتية والموزعات...' : 'Search botanical fragrances, diffusers...'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.filterButton, { backgroundColor: colors.surfaceMuted }]}
            onPress={() => navigation.navigate('Category')}
          >
            <Icon name="tune" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* 3. Category Pill Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryCarousel}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.8}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isActive ? colors.primarySoft : colors.surfaceMuted,
                  },
                ]}
                onPress={() => {
                  setActiveCategory(cat.id);
                  if (cat.id === 'diffusers' || cat.id === 'oils') {
                    navigation.navigate('Category', { categoryId: cat.id });
                  }
                }}
              >
                <Text
                  style={[
                    typography.labelMd,
                    {
                      color: isActive ? colors.surface : colors.text,
                      fontWeight: isActive ? '600' : '500',
                    },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 4. Featured Spotlight: Autumn Harvest Trio */}
        <View style={styles.spotlightSection}>
          <Card surface="low" style={styles.spotlightCard}>
            <View style={styles.spotlightImageWrapper}>
              <Image
                source={require('../../assets/photos/bundle-signature.png')}
                style={styles.spotlightImage}
                resizeMode="cover"
              />
              <View style={[styles.spotlightBadge, { backgroundColor: colors.accent }]}>
                <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
                  {isRTL ? 'مختارات خاصة' : 'LIMITED CURATION'}
                </Text>
              </View>
            </View>
            <View style={[styles.spotlightDetails, { backgroundColor: colors.surface }]}>
              <View style={styles.spotlightTitleRow}>
                <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '600' }]}>
                  {isRTL ? 'ثلاثية حصاد الخريف' : 'Autumn Harvest Trio'}
                </Text>
                <View style={styles.priceRow}>
                  <Text style={[typography.labelMd, { color: colors.primary, fontWeight: '700' }]}>$280</Text>
                  <Text style={[typography.labelMd, { color: colors.textMuted, textDecorationLine: 'line-through', marginStart: 6 }]}>$340</Text>
                </View>
              </View>
              <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 4, lineHeight: 18 }]}>
                {isRTL
                  ? 'انتشار ميكروي بدون ماء لتناغم كامل للمنزل. تشمل 3 ألوان وخلاصة الحصاد المميزة.'
                  : 'Waterless micro-diffusion for whole home harmony. Includes 3 colorways and signature harvest essence.'}
              </Text>
              <View style={styles.spotlightFooter}>
                <View style={styles.colorSwatches}>
                  <View style={[styles.swatchDot, { backgroundColor: '#919c7a' }]} />
                  <View style={[styles.swatchDot, { backgroundColor: '#f4f0ec', marginStart: -6 }]} />
                  <View style={[styles.swatchDot, { backgroundColor: '#232821', marginStart: -6 }]} />
                </View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.shopBundleBtn, { backgroundColor: colors.ink }]}
                  onPress={() => navigation.navigate('ProductDetail')}
                >
                  <Text style={[typography.labelMd, { color: colors.onInk, fontWeight: '600' }]}>
                    {isRTL ? 'شراء الباقة' : 'Shop Bundle'}
                  </Text>
                  <Icon name="arrow_forward" size={16} color={colors.onInk} style={{ marginStart: 6 }} />
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </View>

        {/* 5. Product Catalog Grid: Atmospheric Collection */}
        <View style={styles.catalogSection}>
          <View style={styles.catalogHeader}>
            <View>
              <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '600' }]}>
                {isRTL ? 'مجموعة الأجواء' : 'Atmospheric Collection'}
              </Text>
              <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2 }]}>
                {isRTL ? '5 إبداعات مصممة للمساحات المعمارية' : '5 creations tailored for architectural spaces'}
              </Text>
            </View>
            <Text style={[typography.labelSm, { color: colors.textMuted, fontWeight: '600', textTransform: 'uppercase' }]}>
              {isRTL ? 'متوفر' : 'IN STOCK'}
            </Text>
          </View>

          {/* Item 1: Odora Air 01 Diffuser (Full 2-Column Width Card) */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.featuredHeroCard, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('ProductDetail')}
          >
            <View style={styles.featuredHeroImageWrapper}>
              <Image
                source={require('../../assets/photos/diffuser_sage_hero.png')}
                style={styles.featuredHeroImage}
                resizeMode="cover"
              />
              <View style={[styles.bestsellerBadge, { backgroundColor: colors.primary }]}>
                <Text style={[typography.labelSm, { color: colors.surface, fontWeight: '700' }]}>
                  {isRTL ? 'الأكثر طلباً' : 'BEST SELLER'}
                </Text>
              </View>
            </View>
            <View style={styles.featuredHeroDetails}>
              <View style={styles.featuredHeroTitleRow}>
                <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '600' }]}>
                  Odora Air 01
                </Text>
                <Text style={[typography.labelLg, { color: colors.primary, fontWeight: '700' }]}>
                  $185
                </Text>
              </View>
              <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2 }]}>
                {isRTL ? 'موزع عطري هوائي بارد بدون ماء مع تقنية الرذاذ الصامت.' : 'Cold-air waterless nebulizer with whisper mist technology.'}
              </Text>
              <View style={styles.featuredHeroFooter}>
                <View style={styles.heroSwatches}>
                  <View style={[styles.swatchDotMd, { backgroundColor: '#919c7a' }]} />
                  <View style={[styles.swatchDotMd, { backgroundColor: '#ebe7e4', marginStart: 6 }]} />
                  <View style={[styles.swatchDotMd, { backgroundColor: '#232821', marginStart: 6 }]} />
                </View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.addBtnPill, { backgroundColor: colors.accent }]}
                  onPress={() => showToast('Odora Air 01')}
                >
                  <Icon name="add" size={16} color={colors.primary} />
                  <Text style={[typography.labelMd, { color: colors.primary, fontWeight: '700', marginStart: 4 }]}>
                    {isRTL ? 'إضافة' : 'Add'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>

          {/* 2-Column Catalog Grid */}
          <View style={styles.twoColumnGrid}>
            {/* Item 2: Forest Sage */}
            <View style={[styles.gridCard, { backgroundColor: colors.surface }]}>
              <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('ProductDetail')}>
                <View style={styles.gridImageWrapper}>
                  <Image source={require('../../assets/photos/oil-forest-sage.png')} style={styles.gridImage} resizeMode="cover" />
                </View>
                <View style={styles.gridDetails}>
                  <Text style={[typography.labelLg, { color: colors.text, fontWeight: '600' }]} numberOfLines={1}>
                    {isRTL ? 'مريمية الغابة' : 'Forest Sage'}
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.textMuted }]}>
                    {isRTL ? '30ml زيت نقي' : '30ml Pure Oil'}
                  </Text>
                  <Text style={[typography.labelSm, { color: colors.textMuted, marginTop: 2 }]} numberOfLines={1}>
                    {isRTL ? 'أوكالبتوس · أرز · صنوبر' : 'Eucalyptus · Cedar · Pine'}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.gridCardFooter}>
                <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>$42</Text>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.roundAddBtn, { backgroundColor: colors.surfaceMuted }]}
                  onPress={() => showToast('Forest Sage')}
                >
                  <Icon name="add" size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Item 3: Cotton Linen */}
            <View style={[styles.gridCard, { backgroundColor: colors.surface }]}>
              <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('ProductDetail')}>
                <View style={styles.gridImageWrapper}>
                  <Image source={require('../../assets/photos/oil-cotton-linen.png')} style={styles.gridImage} resizeMode="cover" />
                </View>
                <View style={styles.gridDetails}>
                  <Text style={[typography.labelLg, { color: colors.text, fontWeight: '600' }]} numberOfLines={1}>
                    {isRTL ? 'كتان قطني' : 'Cotton Linen'}
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.textMuted }]}>
                    {isRTL ? '30ml نباتي' : '30ml Botanical'}
                  </Text>
                  <Text style={[typography.labelSm, { color: colors.textMuted, marginTop: 2 }]} numberOfLines={1}>
                    {isRTL ? 'عنبر أبيض · برغموت' : 'White Amber · Bergamot'}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.gridCardFooter}>
                <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>$42</Text>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.roundAddBtn, { backgroundColor: colors.surfaceMuted }]}
                  onPress={() => showToast('Cotton Linen')}
                >
                  <Icon name="add" size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Item 4: Santal Mist */}
            <View style={[styles.gridCard, { backgroundColor: colors.surface }]}>
              <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('ProductDetail')}>
                <View style={styles.gridImageWrapper}>
                  <Image source={require('../../assets/photos/diffuser_sage_livingroom.png')} style={styles.gridImage} resizeMode="cover" />
                </View>
                <View style={styles.gridDetails}>
                  <Text style={[typography.labelLg, { color: colors.text, fontWeight: '600' }]} numberOfLines={1}>
                    {isRTL ? 'رذاذ الصندل' : 'Santal Mist'}
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.textMuted }]}>
                    {isRTL ? '30ml حجرة' : '30ml Chamber'}
                  </Text>
                  <Text style={[typography.labelSm, { color: colors.textMuted, marginTop: 2 }]} numberOfLines={1}>
                    {isRTL ? 'صندل · سوسن · هيل' : 'Sandalwood · Iris · Cardamom'}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.gridCardFooter}>
                <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>$46</Text>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.roundAddBtn, { backgroundColor: colors.surfaceMuted }]}
                  onPress={() => showToast('Santal Mist')}
                >
                  <Icon name="add" size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Item 5: Stone Pedestal */}
            <View style={[styles.gridCard, { backgroundColor: colors.surface }]}>
              <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('ProductDetail')}>
                <View style={styles.gridImageWrapper}>
                  <Image source={require('../../assets/photos/diffuser_black_office.png')} style={styles.gridImage} resizeMode="cover" />
                  <View style={[styles.newItemBadge, { backgroundColor: colors.surfaceMuted }]}>
                    <Text style={[typography.labelSm, { color: colors.text, fontWeight: '700', fontSize: 9 }]}>
                      {isRTL ? 'جديد' : 'NEW'}
                    </Text>
                  </View>
                </View>
                <View style={styles.gridDetails}>
                  <Text style={[typography.labelLg, { color: colors.text, fontWeight: '600' }]} numberOfLines={1}>
                    {isRTL ? 'قاعدة الحجر' : 'Stone Pedestal'}
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.textMuted }]}>
                    {isRTL ? 'قاعدة شحن' : 'Charging Base'}
                  </Text>
                  <Text style={[typography.labelSm, { color: colors.textMuted, marginTop: 2 }]} numberOfLines={1}>
                    {isRTL ? 'ترافرتين مصقول' : 'Honed Travertine'}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.gridCardFooter}>
                <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>$65</Text>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.roundAddBtn, { backgroundColor: colors.surfaceMuted }]}
                  onPress={() => showToast('Stone Pedestal')}
                >
                  <Icon name="add" size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* 6. Value Propositions & Guarantee Banner */}
        <View style={styles.guaranteeSection}>
          <Card surface="low" style={styles.guaranteeCard}>
            <View style={styles.guaranteeRow}>
              <View style={[styles.guaranteeIconWrap, { backgroundColor: colors.surface }]}>
                <Icon name="local_shipping" size={20} color={colors.primary} />
              </View>
              <View style={styles.guaranteeTextWrap}>
                <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600' }]}>
                  {isRTL ? 'توصيل سريع مجاني' : 'Complimentary Express Delivery'}
                </Text>
                <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2 }]}>
                  {isRTL ? 'شحن بيئي مخصص لكافة الطلبات فوق $100' : 'Curated ecological shipping on all orders over $100'}
                </Text>
              </View>
            </View>

            <View style={styles.guaranteeRow}>
              <View style={[styles.guaranteeIconWrap, { backgroundColor: colors.surface }]}>
                <Icon name="verified_user" size={20} color={colors.primary} />
              </View>
              <View style={styles.guaranteeTextWrap}>
                <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600' }]}>
                  {isRTL ? 'ضمان معماري لمدة عامين' : '2-Year Architectural Warranty'}
                </Text>
                <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2 }]}>
                  {isRTL ? 'تغطية شاملة لتوربينات الهواء البارد الدقيقة' : 'Complete coverage for cold-diffusion micro-turbines'}
                </Text>
              </View>
            </View>

            <View style={styles.guaranteeRow}>
              <View style={[styles.guaranteeIconWrap, { backgroundColor: colors.surface }]}>
                <Icon name="water_drop" size={20} color={colors.primary} />
              </View>
              <View style={styles.guaranteeTextWrap}>
                <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600' }]}>
                  {isRTL ? 'تقنية الهواء البارد بدون ماء' : 'Waterless Cold-Air Technology'}
                </Text>
                <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2 }]}>
                  {isRTL ? 'بدون أي تخفيف. احتفاظ تام بخصائص الزيوت النباتية' : 'Zero dilution. Pure botanical therapeutic retention'}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* 7. Editorial Brand Footer Statement */}
        <View style={styles.brandFooter}>
          <Text style={[typography.headlineSm, { color: colors.primary, letterSpacing: 4, fontWeight: '600', textTransform: 'uppercase' }]}>
            ODORA
          </Text>
          <Text style={[typography.labelSm, { color: colors.textMuted, letterSpacing: 2, marginTop: 4, textTransform: 'uppercase' }]}>
            {isRTL ? 'عطر الأجواء والسكينة' : 'SCENT OF ATMOSPHERE'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
  },
  appBarLeading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  toastContainer: {
    position: 'absolute',
    top: 72,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    zIndex: 99,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    marginTop: 8,
  },
  searchPill: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#232821',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCarousel: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotlightSection: {
    paddingHorizontal: 16,
    marginTop: 4,
  },
  spotlightCard: {
    borderRadius: 24,
    overflow: 'hidden',
    padding: 0,
  },
  spotlightImageWrapper: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  spotlightImage: {
    width: '100%',
    height: '100%',
  },
  spotlightBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  spotlightDetails: {
    padding: 20,
  },
  spotlightTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  spotlightFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 12,
  },
  colorSwatches: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swatchDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  swatchDotMd: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  shopBundleBtn: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  catalogSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  catalogHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  featuredHeroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#232821',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  featuredHeroImageWrapper: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  featuredHeroImage: {
    width: '100%',
    height: '100%',
  },
  bestsellerBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  featuredHeroDetails: {
    padding: 18,
  },
  featuredHeroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featuredHeroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 10,
  },
  heroSwatches: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addBtnPill: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  twoColumnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: '48%',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 12,
    justifyContent: 'space-between',
    shadowColor: '#232821',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  gridImageWrapper: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#ebe7e4',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  newItemBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  gridDetails: {
    marginTop: 8,
  },
  gridCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 6,
  },
  roundAddBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guaranteeSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  guaranteeCard: {
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },
  guaranteeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  guaranteeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guaranteeTextWrap: {
    flex: 1,
  },
  brandFooter: {
    alignItems: 'center',
    paddingVertical: 32,
    opacity: 0.7,
  },
});

export default StoreScreen;
