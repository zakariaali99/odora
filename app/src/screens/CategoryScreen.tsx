import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme';
import { AppBar, Card, Icon } from '../components/ui';

interface CategoryScreenProps {
  navigation: any;
  route?: {
    params?: {
      categoryId?: string;
      title?: string;
    };
  };
}

export const CategoryScreen: React.FC<CategoryScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { colors, typography, radii, spacing, isRTL } = useTheme();

  const [activeChip, setActiveChip] = useState('woody');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>(['woody', 'herbal']);
  const [selectedDensity, setSelectedDensity] = useState('balanced');
  const [maxPrice, setMaxPrice] = useState(65);

  const products = [
    {
      id: 'forest-sage',
      name: isRTL ? 'الميرمية البرية والأرز' : 'Forest Sage & Cedar',
      notes: isRTL ? 'ميرمية، أرز أطلسي، طحلب رطب' : 'Wild Clary, Atlas Cedar, Wet Moss',
      size: '50ml · Nebulizer',
      rating: '4.9',
      price: '$45',
      tag: isRTL ? 'مسائي' : 'Evening',
      badge: isRTL ? 'الأكثر طلباً' : 'Best Seller',
      image: require('../../assets/photos/oil-forest-sage.png'),
    },
    {
      id: 'kyoto-hinoki',
      name: isRTL ? 'هينوكي كيوتو ونجيل الهند' : 'Kyoto Hinoki & Vetiver',
      notes: isRTL ? 'سرو ياباني، تربة ندية، عنبر' : 'Japanese Cypress, Earth, Amber',
      size: '50ml · Nebulizer',
      rating: '5.0',
      price: '$48',
      tag: isRTL ? 'تأريض' : 'Grounded',
      badge: null,
      image: require('../../assets/photos/oil-cotton-linen.png'),
    },
    {
      id: 'white-santal',
      name: isRTL ? 'صندل أبيض وزهرة السوسن' : 'White Santal & Iris',
      notes: isRTL ? 'سوسن توسكاني، خشب صندل حريري' : 'Tuscan Orris, Creamy Sandalwood',
      size: '50ml · Flacon',
      rating: '4.9',
      price: '$52',
      tag: isRTL ? 'أجواء' : 'Atmospheric',
      badge: isRTL ? 'إصدار محدود' : 'Limited Reserve',
      image: require('../../assets/photos/oil-cotton-clean.png'),
    },
    {
      id: 'smoky-hinoki',
      name: isRTL ? 'هينوكي مدخن وشاي أبيض' : 'Smoky Hinoki & White Tea',
      notes: isRTL ? 'أوراق مدخنة، شاي مقطر، أرز' : 'Smoked Leaves, Steamed Tea, Cedar',
      size: '50ml · Nebulizer',
      rating: '4.8',
      price: '$48',
      tag: isRTL ? 'قمة' : 'Zenith',
      badge: null,
      image: require('../../assets/photos/oil-forest-sage.png'),
    },
    {
      id: 'bergamot-neroli',
      name: isRTL ? 'برغموت ونيرولي الفجر' : 'Bergamot & Dawn Neroli',
      notes: isRTL ? 'حمضيات كالابرية، زهر برتقال' : 'Calabrian Citrus, Orange Blossom',
      size: '50ml · Nebulizer',
      rating: '4.7',
      price: '$42',
      tag: isRTL ? 'فجر' : 'Dawn',
      badge: null,
      image: require('../../assets/photos/oil-cotton-linen.png'),
    },
    {
      id: 'nordic-pine',
      name: isRTL ? 'صنوبر شمالي وعرعر' : 'Nordic Pine & Juniper',
      notes: isRTL ? 'إبر جليدية، توت مهروس، طحلب' : 'Glacial Needles, Crushed Berry, Moss',
      size: '50ml · Nebulizer',
      rating: '4.9',
      price: '$45',
      tag: isRTL ? 'منعش' : 'Crisp',
      badge: null,
      image: require('../../assets/photos/oil-cotton-clean.png'),
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* 1. Header (64pt, Back arrow + Odora Atelier subtitle + screen title + avatar) */}
      <AppBar
        leading={
          <View style={styles.appBarLeading}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Icon name={isRTL ? 'arrow_forward' : 'arrow_back'} size={20} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.titleColumn}>
              <Text
                style={[
                  typography.labelSm,
                  {
                    color: colors.primary,
                    textTransform: 'uppercase',
                    letterSpacing: 1.5,
                    fontWeight: '600',
                  },
                ]}
              >
                {isRTL ? 'أتيليه أودورا' : 'Odora Atelier'}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  typography.headlineSm,
                  {
                    color: colors.text,
                    fontSize: 16,
                    lineHeight: 22,
                    fontWeight: '600',
                  },
                ]}
              >
                {isRTL ? 'أودورا — قسم: الخراطيش النباتية' : 'Odora — Category: Botanical Cartridges'}
              </Text>
            </View>
          </View>
        }
        actions={[
          {
            avatar: require('../../assets/photos/avatar.jpg'),
            onPress: () => navigation.navigate('Account'),
            label: 'Profile',
          },
        ]}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Category Hero Introduction */}
        <View style={styles.heroIntroSection}>
          <View style={styles.badgeRow}>
            <View style={[styles.statusBadge, { backgroundColor: colors.accent }]}>
              <View style={[styles.pulseDot, { backgroundColor: colors.primary }]} />
              <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700', textTransform: 'uppercase' }]}>
                {isRTL ? '24 تركيبة متوفرة' : '24 Formulations Available'}
              </Text>
            </View>
            <Text style={[typography.labelMd, { color: colors.textMuted }]}>
              {isRTL ? 'حصاد استثنائي رقم 4' : 'Reserve Harvest № 4'}
            </Text>
          </View>

          <Text style={[typography.headlineLg, { color: colors.text, fontWeight: '500', marginTop: 10 }]}>
            {isRTL ? 'الخراطيش النباتية' : 'Botanical Cartridges'}
          </Text>
          <Text style={[typography.bodyMd, { color: colors.textMuted, marginTop: 6, lineHeight: 22 }]}>
            {isRTL
              ? 'خلاصات نباتية نقية 100% معصورة على البارد. مصممة لتقنية التفتيت البارد الميكروي، للحفاظ على مصفوفة التربينات العطرية الطبيعية دون إتلاف حراري.'
              : '100% pure cold-pressed botanical essences. Formulated for waterless cold-venturi nebulization, preserving the whole aromatic terpene matrices without thermal degradation.'}
          </Text>

          {/* Micro Highlight Card */}
          <View style={[styles.microHighlightCard, { backgroundColor: colors.surfaceLow }]}>
            <View style={styles.highlightLeft}>
              <View style={[styles.ecoIconCircle, { backgroundColor: colors.accent }]}>
                <Icon name="eco" size={18} color={colors.primary} />
              </View>
              <View style={{ marginStart: 10, flex: 1 }}>
                <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>
                  {isRTL ? 'رذاذ دقيق كولد-فينتوري' : 'Cold-Venturi Micro-Aerosol'}
                </Text>
                <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 1 }]}>
                  {isRTL ? 'بدون مواد صناعية · بدون زيوت ناقلة' : 'Zero synthetics · Zero carrier oils'}
                </Text>
              </View>
            </View>
            <Icon name="verified" size={20} color={colors.primary} />
          </View>
        </View>

        {/* 3. Interactive Filter & Sort Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterBarContainer}
        >
          {/* Filter Sheet Trigger Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setFilterModalVisible(true)}
            style={[styles.filterTriggerBtn, { backgroundColor: colors.ink }]}
          >
            <Icon name="tune" size={16} color={colors.onInk} />
            <Text style={[typography.labelMd, { color: colors.onInk, fontWeight: '600', marginHorizontal: 6 }]}>
              {isRTL ? 'تصفية' : 'Filter'}
            </Text>
            <View style={[styles.countBadge, { backgroundColor: colors.accent }]}>
              <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700', fontSize: 10 }]}>2</Text>
            </View>
          </TouchableOpacity>

          {/* Sort Selector Pill */}
          <View style={[styles.sortPill, { backgroundColor: colors.surfaceLow }]}>
            <Text style={[typography.labelMd, { color: colors.text, fontWeight: '500' }]}>
              {isRTL ? 'المميز ↓' : 'Featured ↓'}
            </Text>
            <Icon name="expand_more" size={16} color={colors.textMuted} style={{ marginStart: 4 }} />
          </View>

          {/* Quick Category Filter Chips */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveChip('woody')}
            style={[
              styles.quickChip,
              activeChip === 'woody'
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.surfaceLow },
            ]}
          >
            {activeChip === 'woody' && (
              <Icon name="check" size={14} color={colors.surface} style={{ marginEnd: 4 }} />
            )}
            <Text
              style={[
                typography.labelMd,
                {
                  color: activeChip === 'woody' ? colors.surface : colors.text,
                  fontWeight: activeChip === 'woody' ? '600' : '500',
                },
              ]}
            >
              {isRTL ? 'خشبي وترابي' : 'Woody & Earthy'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveChip('floral')}
            style={[
              styles.quickChip,
              activeChip === 'floral'
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.surfaceLow },
            ]}
          >
            <Text
              style={[
                typography.labelMd,
                {
                  color: activeChip === 'floral' ? colors.surface : colors.text,
                  fontWeight: activeChip === 'floral' ? '600' : '500',
                },
              ]}
            >
              {isRTL ? 'زهري ومريح' : 'Floral & Calming'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveChip('citrus')}
            style={[
              styles.quickChip,
              activeChip === 'citrus'
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.surfaceLow },
            ]}
          >
            <Text
              style={[
                typography.labelMd,
                {
                  color: activeChip === 'citrus' ? colors.surface : colors.text,
                  fontWeight: activeChip === 'citrus' ? '600' : '500',
                },
              ]}
            >
              {isRTL ? 'حمضيات ويقظة' : 'Citrus & Awakening'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveChip('flacon')}
            style={[
              styles.quickChip,
              activeChip === 'flacon'
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.surfaceLow },
            ]}
          >
            <Text
              style={[
                typography.labelMd,
                {
                  color: activeChip === 'flacon' ? colors.surface : colors.text,
                  fontWeight: activeChip === 'flacon' ? '600' : '500',
                },
              ]}
            >
              50ml Flacon
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* 4. Active Criteria Pills Bar */}
        <View style={styles.activeCriteriaBar}>
          <View style={styles.activeTagsRow}>
            <Text style={[typography.labelSm, { color: colors.textMuted, textTransform: 'uppercase', marginEnd: 6 }]}>
              {isRTL ? 'المحدد:' : 'Active:'}
            </Text>
            <View style={[styles.activeTagPill, { backgroundColor: colors.surfaceHigh }]}>
              <Text style={[typography.labelSm, { color: colors.text, fontWeight: '600' }]}>
                {isRTL ? 'خشبي' : 'Woody'}
              </Text>
              <Icon name="close" size={12} color={colors.textMuted} style={{ marginStart: 4 }} />
            </View>
            <View style={[styles.activeTagPill, { backgroundColor: colors.surfaceHigh }]}>
              <Text style={[typography.labelSm, { color: colors.text, fontWeight: '600' }]}>
                {isRTL ? 'أعشاب نقية' : 'Fresh Herbal'}
              </Text>
              <Icon name="close" size={12} color={colors.textMuted} style={{ marginStart: 4 }} />
            </View>
          </View>
          <Text style={[typography.bodySm, { color: colors.textMuted }]}>
            {isRTL ? '14 نتيجة' : '14 results'}
          </Text>
        </View>

        {/* 5. Product Listing Grid (2-Column Architectural Layout) */}
        <View style={styles.gridContainer}>
          {products.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              style={[styles.productCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            >
              <View style={[styles.productImageWrapper, { backgroundColor: colors.surfaceLow }]}>
                <Image source={item.image} style={styles.productImage} resizeMode="contain" />
                {item.badge && (
                  <View style={[styles.productBadge, { backgroundColor: colors.ink }]}>
                    <Text style={[typography.labelSm, { color: colors.onInk, fontSize: 9, fontWeight: '700' }]}>
                      {item.badge}
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.quickAddBtn, { backgroundColor: colors.primary }]}
                  onPress={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Icon name="add" size={18} color={colors.surface} />
                </TouchableOpacity>
              </View>

              <View style={styles.productMetaRow}>
                <Text style={[typography.labelSm, { color: colors.textMuted }]}>{item.size}</Text>
                <View style={styles.ratingBadge}>
                  <Icon name="star" size={12} color={colors.primary} />
                  <Text style={[typography.labelSm, { color: colors.text, fontWeight: '700', marginStart: 2 }]}>
                    {item.rating}
                  </Text>
                </View>
              </View>

              <Text numberOfLines={1} style={[typography.labelLg, { color: colors.text, fontWeight: '700', marginTop: 4 }]}>
                {item.name}
              </Text>
              <Text numberOfLines={1} style={[typography.bodySm, { color: colors.textMuted, marginTop: 2, fontSize: 11 }]}>
                {item.notes}
              </Text>

              <View style={styles.productPriceRow}>
                <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '700', fontSize: 16 }]}>
                  {item.price}
                </Text>
                <View style={[styles.moodTag, { backgroundColor: colors.surfaceLow }]}>
                  <Text style={[typography.labelSm, { color: colors.primary, fontSize: 9, fontWeight: '600' }]}>
                    {item.tag}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 6. Sanctuary Refill Plan Callout Banner */}
        <View style={styles.bannerSection}>
          <Card surface="low" style={styles.bannerCard}>
            <View style={styles.bannerHeaderRow}>
              <View style={[styles.bannerIconWrap, { backgroundColor: colors.accent }]}>
                <Icon name="all_inclusive" size={22} color={colors.primary} />
              </View>
              <View style={[styles.discountPill, { backgroundColor: colors.surface }]}>
                <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
                  {isRTL ? 'وفر 15%' : 'SAVE 15%'}
                </Text>
              </View>
            </View>

            <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '700', marginTop: 12 }]}>
              {isRTL ? 'خطة ملاذ التجديد التلقائي' : 'Sanctuary Refill Plan'}
            </Text>
            <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 4, lineHeight: 20 }]}>
              {isRTL
                ? 'وفر 15% مع التوصيل التلقائي كل شهرين مع خدمة إعادة تدوير الزجاج وتخصيص حصاد موسمي مجاني.'
                : 'Save 15% on automated bi-monthly deliveries with free white-glove glass recycling and complimentary seasonal reserve allocations.'}
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.bannerCtaBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Store')}
            >
              <Text style={[typography.labelMd, { color: colors.surface, fontWeight: '600' }]}>
                {isRTL ? 'تهيئة خطة الملاذ' : 'Configure Sanctuary Plan'}
              </Text>
              <Icon name={isRTL ? 'arrow_back' : 'arrow_forward'} size={16} color={colors.surface} style={{ marginStart: 6 }} />
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>

      {/* 7. Integrated Bottom-Sheet Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setFilterModalVisible(false)}
          />
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={[typography.labelSm, { color: colors.primary, textTransform: 'uppercase', letterSpacing: 1.5 }]}>
                  {isRTL ? 'أتيليه العطور' : 'Aromatics Atelier'}
                </Text>
                <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '700', marginTop: 2 }]}>
                  {isRTL ? 'تصفية خلاصات الملاذ' : 'Filter Sanctuary Essences'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setFilterModalVisible(false)}
                style={[styles.modalCloseBtn, { backgroundColor: colors.surfaceLow }]}
              >
                <Icon name="close" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Scent Families */}
            <View style={styles.modalSection}>
              <Text style={[typography.labelSm, { color: colors.textMuted, textTransform: 'uppercase', fontWeight: '700' }]}>
                {isRTL ? 'عائلات الروائح' : 'Scent Families'}
              </Text>
              <View style={styles.modalChipRow}>
                {['woody', 'herbal', 'resin', 'citrus'].map((family) => {
                  const isSelected = selectedFamilies.includes(family);
                  const labels: Record<string, { ar: string; en: string }> = {
                    woody: { ar: 'خشبي', en: 'Woody' },
                    herbal: { ar: 'أعشاب طازجة', en: 'Fresh Herbal' },
                    resin: { ar: 'عنبر وراتنج', en: 'Amber Resin' },
                    citrus: { ar: 'حمضيات دافئة', en: 'Warm Citrus' },
                  };
                  return (
                    <TouchableOpacity
                      key={family}
                      activeOpacity={0.8}
                      onPress={() => {
                        if (isSelected) {
                          setSelectedFamilies(selectedFamilies.filter((f) => f !== family));
                        } else {
                          setSelectedFamilies([...selectedFamilies, family]);
                        }
                      }}
                      style={[
                        styles.modalChip,
                        isSelected
                          ? { backgroundColor: colors.primary }
                          : { backgroundColor: colors.surfaceLow },
                      ]}
                    >
                      {isSelected && <Icon name="check" size={14} color={colors.surface} style={{ marginEnd: 4 }} />}
                      <Text
                        style={[
                          typography.labelMd,
                          { color: isSelected ? colors.surface : colors.text, fontWeight: '600' },
                        ]}
                      >
                        {isRTL ? labels[family].ar : labels[family].en}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Aura Density Level */}
            <View style={styles.modalSection}>
              <Text style={[typography.labelSm, { color: colors.textMuted, textTransform: 'uppercase', fontWeight: '700' }]}>
                {isRTL ? 'مستوى كثافة الهالة' : 'Aura Density Level'}
              </Text>
              <View style={styles.densityRow}>
                {[
                  { id: 'subtle', title: isRTL ? 'وشاح ناعم' : 'Subtle Veil', range: isRTL ? 'المستوى ١ - ٣' : 'Level 1 - 3' },
                  { id: 'balanced', title: isRTL ? 'متوازن' : 'Balanced', range: isRTL ? 'المستوى ٤ - ٧' : 'Level 4 - 7' },
                  { id: 'enclosure', title: isRTL ? 'غمر كامل' : 'Enclosure', range: isRTL ? 'المستوى ٨ - ١٠' : 'Level 8 - 10' },
                ].map((item) => {
                  const isSelected = selectedDensity === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.8}
                      onPress={() => setSelectedDensity(item.id)}
                      style={[
                        styles.densityCard,
                        isSelected
                          ? { backgroundColor: colors.accent, borderColor: colors.primary, borderWidth: 1 }
                          : { backgroundColor: colors.surfaceLow, borderColor: 'transparent', borderWidth: 1 },
                      ]}
                    >
                      <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>{item.title}</Text>
                      <Text style={[typography.labelSm, { color: colors.textMuted, fontSize: 10, marginTop: 2 }]}>{item.range}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Price Range Slider */}
            <View style={styles.modalSection}>
              <View style={styles.priceHeader}>
                <Text style={[typography.labelSm, { color: colors.textMuted, textTransform: 'uppercase', fontWeight: '700' }]}>
                  {isRTL ? 'نطاق السعر' : 'Flacon Investment'}
                </Text>
                <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>
                  $35 — ${maxPrice}
                </Text>
              </View>
              <View style={[styles.sliderTrack, { backgroundColor: colors.surfaceLow }]}>
                <View style={[styles.sliderFill, { backgroundColor: colors.primary, width: '75%' }]} />
                <View style={[styles.sliderThumb, { backgroundColor: colors.primary }]} />
              </View>
              <View style={styles.priceBounds}>
                <Text style={[typography.labelSm, { color: colors.textMuted }]}>$30</Text>
                <Text style={[typography.labelSm, { color: colors.textMuted }]}>$80</Text>
              </View>
            </View>

            {/* Modal Actions */}
            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedFamilies(['woody']);
                  setSelectedDensity('balanced');
                  setMaxPrice(65);
                }}
                style={[styles.clearBtn, { backgroundColor: colors.surfaceLow }]}
              >
                <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600' }]}>
                  {isRTL ? 'مسح الكل' : 'Clear All'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setFilterModalVisible(false)}
                style={[styles.applyBtn, { backgroundColor: colors.ink }]}
              >
                <Text style={[typography.labelMd, { color: colors.onInk, fontWeight: '700' }]}>
                  {isRTL ? 'تطبيق (14 نتيجة)' : 'Apply Filters (14 Results)'}
                </Text>
                <Icon name="check" size={16} color={colors.onInk} style={{ marginStart: 6 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  titleColumn: {
    marginStart: 8,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroIntroSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginEnd: 6,
  },
  microHighlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 16,
    marginTop: 14,
  },
  highlightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ecoIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 19,
  },
  countBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 19,
  },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 19,
  },
  activeCriteriaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  activeTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  activeTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gridContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  productCard: {
    width: '48%',
    borderRadius: 18,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  productImageWrapper: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  productImage: {
    width: '80%',
    height: '80%',
  },
  productBadge: {
    position: 'absolute',
    top: 6,
    start: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  quickAddBtn: {
    position: 'absolute',
    bottom: 6,
    end: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  productMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 4,
  },
  moodTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bannerSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  bannerCard: {
    borderRadius: 20,
    padding: 16,
  },
  bannerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bannerCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: 21,
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalSheet: {
    borderTopStartRadius: 28,
    borderTopEndRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  modalHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSection: {
    marginBottom: 18,
  },
  modalChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  modalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
  densityRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  densityCard: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderTrack: {
    height: 6,
    borderRadius: 3,
    marginTop: 12,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderFill: {
    height: 6,
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    start: '73%',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  priceBounds: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  clearBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtn: {
    flex: 2,
    height: 46,
    borderRadius: 23,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
