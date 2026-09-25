import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme';
import { AppBar, Card, Icon } from '../components/ui';

interface SearchScreenProps {
  navigation: any;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors, typography, radii, spacing, isRTL } = useTheme();

  const [searchText, setSearchText] = useState('');
  const [activeAtmosphere, setActiveAtmosphere] = useState('all');
  const [recentSearches, setRecentSearches] = useState([
    isRTL ? 'خرطوشة ميرمية الغابة' : 'Forest Sage Cartridge',
    isRTL ? 'مجموعة تنظيف كولد فينتوري' : 'Cold-Venturi Cleaning Kit',
    isRTL ? 'قاعدة ترافيرتين الرخامية' : 'Travertine Ambiance Base',
    isRTL ? 'هينوكي كيوتو 50 مل' : 'Kyoto Hinoki 50ml',
  ]);

  const removeRecent = (index: number) => {
    setRecentSearches(recentSearches.filter((_, i) => i !== index));
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* 1. Header (64pt, Back button + Odora Atelier subtitle + Title + Avatar) */}
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
                {isRTL ? 'أودورا — البحث والاستكشاف' : 'Odora — Search & Discovery'}
              </Text>
            </View>
          </View>
        }
        actions={[
          {
            avatar: require('../../assets/photos/avatar.jpg'),
            onPress: () => (navigation as any).navigate('MainTabs', { screen: 'Account' }),
            label: 'Profile',
          },
        ]}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 2. Search Bar & Status */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, { backgroundColor: colors.surfaceLow }]}>
            <Icon name="search" size={20} color={colors.textMuted} style={{ marginEnd: 10 }} />
            <TextInput
              style={[
                styles.searchInput,
                typography.bodyMd,
                { color: colors.text, textAlign: 'left' },
              ]}
              placeholder={isRTL ? 'هينوكي، ميرمية، ترافيرتين، 50 مل...' : 'Hinoki, sage, travertine, 50ml...'}
              placeholderTextColor={colors.textMuted}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchText('')}
                style={[styles.clearBtn, { backgroundColor: colors.surfaceHigh }]}
              >
                <Icon name="close" size={14} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.statusRow}>
            <Text style={[typography.labelSm, { color: colors.textMuted, textTransform: 'uppercase' }]}>
              {isRTL ? 'فهرس الأجواء: 48 تركيبة نشطة' : 'Atmosphere Index: 48 Blends Active'}
            </Text>
            <View style={styles.connectedBadge}>
              <View style={[styles.pulseDot, { backgroundColor: colors.primary }]} />
              <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
                {isRTL ? 'متصل' : 'Connected'}
              </Text>
            </View>
          </View>
        </View>

        {/* 3. Filter Chips (Sensorial tags) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChipsRow}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveAtmosphere('all')}
            style={[
              styles.atmosphereChip,
              activeAtmosphere === 'all'
                ? { backgroundColor: colors.ink }
                : { backgroundColor: colors.surfaceLow },
            ]}
          >
            <Icon
              name="spa"
              size={15}
              color={activeAtmosphere === 'all' ? colors.onInk : colors.text}
              style={{ marginEnd: 6 }}
            />
            <Text
              style={[
                typography.labelMd,
                {
                  color: activeAtmosphere === 'all' ? colors.onInk : colors.text,
                  fontWeight: '600',
                },
              ]}
            >
              {isRTL ? 'كافة الأجواء' : 'All Atmospheres'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveAtmosphere('nebulizers')}
            style={[
              styles.atmosphereChip,
              activeAtmosphere === 'nebulizers'
                ? { backgroundColor: colors.ink }
                : { backgroundColor: colors.surfaceLow },
            ]}
          >
            <Text
              style={[
                typography.labelMd,
                {
                  color: activeAtmosphere === 'nebulizers' ? colors.onInk : colors.text,
                  fontWeight: '500',
                },
              ]}
            >
              {isRTL ? 'الموزعات الباردة' : 'Cold Nebulizers'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveAtmosphere('oils')}
            style={[
              styles.atmosphereChip,
              activeAtmosphere === 'oils'
                ? { backgroundColor: colors.ink }
                : { backgroundColor: colors.surfaceLow },
            ]}
          >
            <Text
              style={[
                typography.labelMd,
                {
                  color: activeAtmosphere === 'oils' ? colors.onInk : colors.text,
                  fontWeight: '500',
                },
              ]}
            >
              {isRTL ? 'الزيوت النباتية' : 'Botanical Oils'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setActiveAtmosphere('stone')}
            style={[
              styles.atmosphereChip,
              activeAtmosphere === 'stone'
                ? { backgroundColor: colors.ink }
                : { backgroundColor: colors.surfaceLow },
            ]}
          >
            <Text
              style={[
                typography.labelMd,
                {
                  color: activeAtmosphere === 'stone' ? colors.onInk : colors.text,
                  fontWeight: '500',
                },
              ]}
            >
              {isRTL ? 'حجر وترافيرتين' : 'Travertine & Stone'}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* 4. Recent Searches Pill Cloud */}
        {recentSearches.length > 0 && (
          <View style={styles.recentsSection}>
            <View style={[styles.recentsCard, { backgroundColor: colors.surfaceLow }]}>
              <View style={styles.recentsHeader}>
                <View style={styles.recentsTitleRow}>
                  <Icon name="history" size={18} color={colors.textMuted} style={{ marginEnd: 6 }} />
                  <Text style={[typography.headlineSm, { color: colors.text, fontSize: 16, fontWeight: '600' }]}>
                    {isRTL ? 'عمليات البحث الأخيرة' : 'Recent Searches'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setRecentSearches([])}>
                  <Text style={[typography.labelMd, { color: colors.primary, fontWeight: '600' }]}>
                    {isRTL ? 'مسح الكل' : 'Clear All'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.recentsPillsWrapper}>
                {recentSearches.map((term, index) => (
                  <View key={index} style={[styles.recentPill, { backgroundColor: colors.surfaceHigh }]}>
                    <Text style={[typography.bodySm, { color: colors.text, marginEnd: 6 }]}>{term}</Text>
                    <TouchableOpacity onPress={() => removeRecent(index)}>
                      <Icon name="close" size={13} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* 5. Trending Fragrance Notes */}
        <View style={styles.trendingSection}>
          <View style={styles.trendingHeader}>
            <Text style={[typography.headlineSm, { color: colors.text, fontSize: 16, fontWeight: '600' }]}>
              {isRTL ? 'نوتات عطرية شائعة' : 'Trending Fragrance Notes'}
            </Text>
            <Text style={[typography.labelSm, { color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 }]}>
              {isRTL ? 'مباشر' : 'REALTIME'}
            </Text>
          </View>

          <View style={[styles.trendingList, { backgroundColor: colors.surface }]}>
            {[
              {
                icon: 'trending_up',
                title: isRTL ? 'هينوكي مدخن وشاي أبيض' : 'Smoky Hinoki & White Tea',
                sub: isRTL ? 'رائج · 1.2 ألف عملية بحث' : 'Trending · 1.2k queries',
                iconColor: colors.primary,
                iconBg: colors.accent,
              },
              {
                icon: 'eco',
                title: isRTL ? 'خشب الأرز والبرغموت المسائي' : 'Cedarwood & Bergamot Dusk Refill',
                sub: isRTL ? 'دفعة حصاد موسمي جديدة' : 'New seasonal harvest lot',
                iconColor: colors.primary,
                iconBg: colors.accent,
              },
              {
                icon: 'air',
                title: isRTL ? 'موزع رذاذ بارد بدون ماء' : 'Waterless Cold-Air Nebulizer Vessel',
                sub: isRTL ? 'إصدار التصميم المعماري' : 'Hardware design edition',
                iconColor: colors.textMuted,
                iconBg: colors.surfaceLow,
              },
              {
                icon: 'wb_twilight',
                title: isRTL ? 'حمضيات وفيتيفر فجر اليوم' : 'Citrus & Vetiver Dawn',
                sub: isRTL ? 'مزامنة إيقاع الفجر اليومي' : 'Sunrise rhythm sync',
                iconColor: colors.primary,
                iconBg: colors.accent,
              },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                style={[
                  styles.trendingItem,
                  index > 0 && { borderTopWidth: 1, borderTopColor: colors.surfaceLow },
                ]}
                onPress={() => navigation.navigate('Category')}
              >
                <View style={styles.trendingLeft}>
                  <View style={[styles.trendIconCircle, { backgroundColor: item.iconBg }]}>
                    <Icon name={item.icon} size={18} color={item.iconColor} />
                  </View>
                  <View style={{ marginStart: 12, flex: 1 }}>
                    <Text numberOfLines={1} style={[typography.labelLg, { color: colors.text, fontWeight: '600' }]}>
                      {item.title}
                    </Text>
                    <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 11, marginTop: 1 }]}>
                      {item.sub}
                    </Text>
                  </View>
                </View>
                <Icon name="arrow_forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 6. Popular Essentials Grid */}
        <View style={styles.essentialsSection}>
          <View style={styles.essentialsHeader}>
            <Text style={[typography.headlineSm, { color: colors.text, fontSize: 16, fontWeight: '600' }]}>
              {isRTL ? 'أساسيات الأتيليه الشائعة' : 'Popular Atelier Essentials'}
            </Text>
            <Text style={[typography.labelSm, { color: colors.primary, textTransform: 'uppercase', fontWeight: '700' }]}>
              {isRTL ? '3 مميزة' : '3 Featured'}
            </Text>
          </View>

          <View style={styles.essentialsRow}>
            {/* Diffuser Card */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.essentialCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('ProductDetail')}
            >
              <View style={[styles.essentialImageWrap, { backgroundColor: colors.surfaceLow }]}>
                <Image
                  source={require('../../assets/photos/diffuser-sage-clean.png')}
                  style={styles.essentialImage}
                  resizeMode="contain"
                />
                <View style={[styles.essentialBadge, { backgroundColor: colors.surface }]}>
                  <Text style={[typography.labelSm, { color: colors.text, fontSize: 9, fontWeight: '700' }]}>
                    {isRTL ? 'الأكثر طلباً' : 'Bestseller'}
                  </Text>
                </View>
              </View>
              <View style={styles.essentialContent}>
                <View style={styles.essentialRatingRow}>
                  <Icon name="star" size={13} color={colors.primary} />
                  <Text style={[typography.labelSm, { color: colors.text, fontWeight: '700', marginStart: 2 }]}>4.9</Text>
                  <Text style={[typography.labelSm, { color: colors.textMuted, marginStart: 2 }]}> (428)</Text>
                </View>
                <Text numberOfLines={1} style={[typography.labelLg, { color: colors.text, fontWeight: '700', marginTop: 3 }]}>
                  Odora Air 01
                </Text>
                <Text numberOfLines={1} style={[typography.bodySm, { color: colors.textMuted, fontSize: 11 }]}>
                  {isRTL ? 'سيراميك أخضر غير لامع' : 'Sage Green Matte Ceramic'}
                </Text>
                <View style={styles.essentialPriceRow}>
                  <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '700', fontSize: 16 }]}>$180</Text>
                  <TouchableOpacity
                    style={[styles.addShoppingBagBtn, { backgroundColor: colors.primary }]}
                    onPress={(e) => {
                      e.stopPropagation();
                      navigation.navigate('Cart');
                    }}
                  >
                    <Icon name="add_shopping_cart" size={16} color={colors.surface} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>

            {/* Oil Card */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.essentialCard, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate('ProductDetail')}
            >
              <View style={[styles.essentialImageWrap, { backgroundColor: colors.surfaceLow }]}>
                <Image
                  source={require('../../assets/photos/oil-forest-sage.png')}
                  style={styles.essentialImage}
                  resizeMode="contain"
                />
                <View style={[styles.essentialBadge, { backgroundColor: colors.accent }]}>
                  <Text style={[typography.labelSm, { color: colors.primary, fontSize: 9, fontWeight: '700' }]}>
                    50ml Refill
                  </Text>
                </View>
              </View>
              <View style={styles.essentialContent}>
                <View style={styles.essentialRatingRow}>
                  <Icon name="star" size={13} color={colors.primary} />
                  <Text style={[typography.labelSm, { color: colors.text, fontWeight: '700', marginStart: 2 }]}>4.8</Text>
                  <Text style={[typography.labelSm, { color: colors.textMuted, marginStart: 2 }]}> (189)</Text>
                </View>
                <Text numberOfLines={1} style={[typography.labelLg, { color: colors.text, fontWeight: '700', marginTop: 3 }]}>
                  {isRTL ? 'ميرمية الغابة' : 'Forest Sage'}
                </Text>
                <Text numberOfLines={1} style={[typography.bodySm, { color: colors.textMuted, fontSize: 11 }]}>
                  {isRTL ? 'أوكالبتوس وصنوبر' : 'Eucalyptus & Pine'}
                </Text>
                <View style={styles.essentialPriceRow}>
                  <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '700', fontSize: 16 }]}>$42</Text>
                  <TouchableOpacity
                    style={[styles.addShoppingBagBtn, { backgroundColor: colors.ink }]}
                    onPress={(e) => {
                      e.stopPropagation();
                      navigation.navigate('Cart');
                    }}
                  >
                    <Icon name="add_shopping_cart" size={16} color={colors.onInk} />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Card 3: Horizontal Capsule */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.horizontalCapsuleCard, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('ProductDetail')}
          >
            <View style={[styles.capsuleThumbWrap, { backgroundColor: colors.surfaceLow }]}>
              <Image
                source={require('../../assets/photos/diffuser-white-clean.png')}
                style={styles.capsuleThumb}
                resizeMode="contain"
              />
            </View>
            <View style={styles.capsuleContent}>
              <View style={styles.capsuleBadgeRow}>
                <View style={[styles.moodTag, { backgroundColor: colors.accent }]}>
                  <Text style={[typography.labelSm, { color: colors.primary, fontSize: 9, fontWeight: '700' }]}>
                    {isRTL ? 'إصدار محدود' : 'Limited Edition'}
                  </Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Icon name="star" size={12} color={colors.primary} />
                  <Text style={[typography.labelSm, { color: colors.text, fontWeight: '700', marginStart: 2 }]}>5.0</Text>
                </View>
              </View>
              <Text numberOfLines={1} style={[typography.labelLg, { color: colors.text, fontWeight: '700', marginTop: 3 }]}>
                {isRTL ? 'قاعدة حجر ألاباستر' : 'Alabaster Stone Pod'}
              </Text>
              <Text numberOfLines={1} style={[typography.bodySm, { color: colors.textMuted, fontSize: 11 }]}>
                {isRTL ? 'وعاء ترافيرتين إيطالي منحوت يدوياً' : 'Hand-carved Italian Travertine Vessel'}
              </Text>
              <View style={styles.capsuleBottomRow}>
                <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '700', fontSize: 16 }]}>$195</Text>
                <View style={[styles.detailsBtnPill, { backgroundColor: colors.surfaceLow }]}>
                  <Text style={[typography.labelSm, { color: colors.text, fontWeight: '600' }]}>
                    {isRTL ? 'التفاصيل' : 'Details'}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* 7. Botanical Discovery Banner */}
        <View style={styles.conciergeSection}>
          <Card surface="low" style={styles.conciergeCard}>
            <View style={[styles.conciergeIcon, { backgroundColor: colors.accent }]}>
              <Icon name="spa" size={20} color={colors.primary} />
            </View>
            <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '700', marginTop: 10 }]}>
              {isRTL ? 'توليفات نباتية نقية مختارة' : 'Pure Botanical Harvests'}
            </Text>
            <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 4, lineHeight: 20 }]}>
              {isRTL
                ? 'استكشف مجموعتنا المكونة من 24 دفعة حصاد نباتية لصنع البصمة العطرية الفريدة لمنزلك.'
                : "Explore our collection of 24 botanical harvest lots to craft your home's unique fragrance signature."}
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.conciergeBtn, { backgroundColor: colors.ink }]}
              onPress={() => navigation.navigate('Category')}
            >
              <Text style={[typography.labelMd, { color: colors.onInk, fontWeight: '600' }]}>
                {isRTL ? 'تصفح كافة التوليفات' : 'Browse All Blends'}
              </Text>
              <Icon name="arrow_forward" size={16} color={colors.onInk} style={{ marginStart: 6 }} />
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>
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
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
  },
  searchInput: {
    flex: 1,
    height: 44,
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginEnd: 4,
  },
  filterChipsRow: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
  },
  atmosphereChip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  recentsSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  recentsCard: {
    borderRadius: 20,
    padding: 16,
  },
  recentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recentsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentsPillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  recentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: 12,
    paddingEnd: 8,
    paddingVertical: 6,
    borderRadius: 16,
  },
  trendingSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  trendingList: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  trendingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trendIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  essentialsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  essentialsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  essentialsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  essentialCard: {
    flex: 1,
    borderRadius: 18,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  essentialImageWrap: {
    width: '100%',
    height: 140,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  essentialImage: {
    width: '85%',
    height: '85%',
  },
  essentialBadge: {
    position: 'absolute',
    top: 6,
    start: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  essentialContent: {
    marginTop: 8,
  },
  essentialRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  essentialPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 2,
  },
  addShoppingBagBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalCapsuleCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 18,
    marginTop: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  capsuleThumbWrap: {
    width: 80,
    height: 80,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capsuleThumb: {
    width: '80%',
    height: '80%',
  },
  capsuleContent: {
    marginStart: 12,
    flex: 1,
  },
  capsuleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  capsuleBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  detailsBtnPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  conciergeSection: {
    paddingHorizontal: 20,
    marginTop: 4,
  },
  conciergeCard: {
    borderRadius: 20,
    padding: 18,
  },
  conciergeIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conciergeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 22,
    marginTop: 14,
  },
});
