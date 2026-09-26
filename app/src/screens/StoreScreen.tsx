import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Animated,
  RefreshControl,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme';
import { weightFamily } from '../theme/typography';
import { AppBar, Card, Icon, Skeleton, LatinText } from '../components/ui';
import { useShopStore, cartCount } from '../store/useShopStore';
import { formatPrice } from '../utils/money';
import { mediaUrl } from '../utils/media';
import { loc } from '../utils/localized';
import { ProductListItem } from '../types/shop';

import { previewConfig } from '../previewTarget';

interface StoreScreenProps {
  navigation: any;
}

export const StoreScreen: React.FC<StoreScreenProps> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const { colors, typography, isRTL } = useTheme();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);

  const {
    config,
    categories,
    products,
    status,
    addingId,
    loadStore,
    addToCart,
  } = useShopStore();

  const totalCartItems = useShopStore(cartCount);

  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [selectedColorwayIds, setSelectedColorwayIds] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  useEffect(() => {
    if (previewConfig?.scrollToEnd && status === 'ready') {
      const timer = setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: false });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const showToast = (message: string) => {
    setToastMessage(message);
    Animated.sequence([
      Animated.timing(toastAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => setToastMessage(null));
  };

  const handleAddToCart = async (product: ProductListItem, colorwayId?: string | null) => {
    const success = await addToCart(product.id, colorwayId);
    if (success) {
      showToast(t('store.addedToCart'));
    } else {
      showToast(t('store.addFailed'));
    }
  };

  const getSelectedColorway = (product: ProductListItem) => {
    if (!product.colorways || product.colorways.length === 0) return null;
    const selectedId = selectedColorwayIds[product.id];
    if (selectedId) {
      const found = product.colorways.find((c) => c.id === selectedId);
      if (found) return found;
    }
    const defaultCw = product.colorways.find((c) => c.is_default);
    return defaultCw || product.colorways[0];
  };

  const getProductImageUri = (product: ProductListItem) => {
    const cw = getSelectedColorway(product);
    if (cw?.image) return mediaUrl(cw.image);
    if (product.main_image) return mediaUrl(product.main_image);
    return null;
  };

  const formatCapacity = (cap: string | null | undefined) => {
    if (!cap) return '';
    const match = cap.match(/(\d+)\s*(.*)/);
    if (match) {
      const num = match[1];
      const unit = match[2];
      const unitText = isRTL ? (unit.toLowerCase().includes('ml') ? 'مل' : unit) : unit;
      return `\u2066${num}\u2069 ${unitText}`;
    }
    return cap;
  };

  // Section 5 Definitions
  const filtered = useMemo(() => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter((p) => p.category_slug === selectedCategory);
  }, [products, selectedCategory]);

  const featuredBundle = useMemo(() => {
    if (selectedCategory !== 'all' && selectedCategory !== 'bundles') {
      return null;
    }
    return filtered.find((p) => p.product_type === 'bundle' && p.is_featured) ?? null;
  }, [filtered, selectedCategory]);

  const visibleProducts = useMemo(() => {
    if (!featuredBundle) return filtered;
    return filtered.filter((p) => p.id !== featuredBundle.id);
  }, [filtered, featuredBundle]);

  const allVisibleInStock = useMemo(() => {
    return visibleProducts.length > 0 && visibleProducts.every((p) => p.stock > 0);
  }, [visibleProducts]);

  const diffuserProducts = useMemo(() => {
    return visibleProducts.filter((p) => p.product_type === 'diffuser');
  }, [visibleProducts]);

  const oilProducts = useMemo(() => {
    return visibleProducts.filter(
      (p) => p.product_type === 'oil' || p.product_type === 'accessory'
    );
  }, [visibleProducts]);

  const oilCardWidth = (screenWidth - 40 - 16) / 2;

  const renderLoadingSkeleton = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.searchRow}>
        <Skeleton height={48} borderRadius={24} style={styles.searchSkeleton} />
        <Skeleton height={48} width={48} borderRadius={24} />
      </View>
      <View style={styles.chipsSkeletonRow}>
        <Skeleton height={36} width={80} borderRadius={18} style={styles.chipSkeleton} />
        <Skeleton height={36} width={110} borderRadius={18} style={styles.chipSkeleton} />
        <Skeleton height={36} width={130} borderRadius={18} style={styles.chipSkeleton} />
      </View>
      <Skeleton height={320} borderRadius={32} style={styles.bundleSkeleton} />
      <Skeleton height={26} width={180} borderRadius={8} style={styles.sectionTitleSkeleton} />
      <Skeleton height={280} borderRadius={32} style={styles.diffuserSkeleton} />
      <View style={styles.oilsGridSkeleton}>
        <Skeleton height={220} width={oilCardWidth} borderRadius={32} />
        <Skeleton height={220} width={oilCardWidth} borderRadius={32} />
      </View>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.centerContainer}>
      <Icon name="error_outline" size={48} color={colors.error} />
      <Text
        style={[
          typography.headlineSm,
          {
            color: colors.text,
            fontFamily: weightFamily(isRTL, 'medium'),
            marginTop: 16,
            textAlign: 'center',
          },
        ]}
      >
        {t('store.loadError')}
      </Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => loadStore()}
        style={[styles.retryButton, { backgroundColor: colors.primary }]}
      >
        <Text
          style={[
            typography.labelMd,
            {
              color: colors.onPrimary,
              fontFamily: weightFamily(isRTL, 'bold'),
            },
          ]}
        >
          {t('store.retry')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* 5.1 App Bar (64pt, pulse dot + title + Cart with badge + Profile avatar) */}
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
                  fontFamily: weightFamily(isRTL, 'medium'),
                  marginStart: 8,
                },
              ]}
            >
              {t('store.title')}
            </Text>
          </View>
        }
        actions={[
          {
            icon: 'shopping_bag',
            onPress: () => navigation.navigate('Cart'),
            label: t('store.cartA11y', { count: totalCartItems }),
            badge: totalCartItems > 0 ? totalCartItems : undefined,
          },
          {
            avatar: require('../../assets/photos/avatar.jpg'),
            onPress: () => navigation.navigate('Account'),
            label: 'Profile',
          },
        ]}
      />

      {/* 5.11 Floating Toast Notification */}
      {toastMessage && (
        <Animated.View
          pointerEvents="none"
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
          <View style={styles.toastContent}>
            <Icon name="check_circle" size={18} color={colors.accent} />
            <Text
              style={[
                typography.labelMd,
                {
                  color: colors.onInk,
                  fontFamily: weightFamily(isRTL, 'medium'),
                  marginStart: 8,
                },
              ]}
            >
              {toastMessage}
            </Text>
          </View>
        </Animated.View>
      )}

      {status === 'loading' && products.length === 0 ? (
        renderLoadingSkeleton()
      ) : status === 'error' && products.length === 0 ? (
        renderErrorState()
      ) : (
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 112 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={status === 'loading'}
              onRefresh={loadStore}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          {/* 5.2 Search & Filter Row */}
          <View style={styles.searchRow}>
            <Pressable
              onPress={() => navigation.navigate('Search')}
              style={[
                styles.searchPill,
                {
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <Icon name="search" size={20} color={colors.textSubtle} />
              <Text
                numberOfLines={1}
                style={[
                  typography.bodySm,
                  {
                    color: colors.textSubtle,
                    fontFamily: weightFamily(isRTL, 'regular'),
                    marginStart: 8,
                    flex: 1,
                    textAlign: 'left',
                  },
                ]}
              >
                {t('store.searchPlaceholder')}
              </Text>
            </Pressable>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Category', {})}
              style={[
                styles.filterButton,
                {
                  backgroundColor: colors.surfaceHigh,
                },
              ]}
              accessibilityLabel="Filter"
            >
              <Icon name="tune" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* 5.3 Category Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScrollContent}
            style={styles.chipsScrollView}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSelectedCategory('all')}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    selectedCategory === 'all'
                      ? colors.primary
                      : colors.surfaceMuted,
                },
              ]}
            >
              <Text
                style={[
                  typography.labelMd,
                  {
                    color:
                      selectedCategory === 'all'
                        ? colors.onPrimary
                        : colors.text,
                    fontFamily: weightFamily(
                      isRTL,
                      selectedCategory === 'all' ? 'semiBold' : 'medium'
                    ),
                  },
                ]}
              >
                {t('store.all')} ({products.length})
              </Text>
            </TouchableOpacity>

            {[...categories]
              .sort((a, b) => a.order - b.order)
              .map((cat) => {
                const isActive = selectedCategory === cat.slug;
                return (
                  <TouchableOpacity
                    key={cat.id || cat.slug}
                    activeOpacity={0.7}
                    onPress={() => setSelectedCategory(cat.slug)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isActive
                          ? colors.primary
                          : colors.surfaceMuted,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        typography.labelMd,
                        {
                          color: isActive ? colors.onPrimary : colors.text,
                          fontFamily: weightFamily(
                            isRTL,
                            isActive ? 'semiBold' : 'medium'
                          ),
                        },
                      ]}
                    >
                      {t('store.chipWithCount', {
                        name: loc(cat, 'name', i18n.language),
                        count: cat.products_count,
                      })}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>

          {/* 5.4 Featured Spotlight Bundle Card */}
          {featuredBundle && (
            <Card
              variant="hero"
              onPress={() =>
                navigation.navigate('ProductDetail', {
                  productId: featuredBundle.slug,
                })
              }
              style={[
                styles.bundleCard,
                {
                  backgroundColor: colors.surfaceLow,
                },
              ]}
            >
              <View
                style={[
                  styles.bundleImageWrap,
                  { backgroundColor: colors.surfaceMuted },
                ]}
              >
                {featuredBundle.main_image ? (
                  <Image
                    source={{ uri: mediaUrl(featuredBundle.main_image)! }}
                    style={styles.bundleImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Icon name="spa" size={40} color={colors.textSubtle} />
                  </View>
                )}
                <View
                  style={[
                    styles.featuredBadgeWrap,
                    { backgroundColor: colors.accent },
                  ]}
                >
                  <Text
                    style={[
                      typography.labelSm,
                      {
                        color: colors.text,
                        fontFamily: weightFamily(isRTL, 'semiBold'),
                        letterSpacing: isRTL ? 0 : 0.8,
                      },
                    ]}
                  >
                    {t('store.featuredBadge')}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.bundleContent,
                  { backgroundColor: colors.surface },
                ]}
              >
                <View style={styles.bundleHeaderRow}>
                  <Text
                    numberOfLines={2}
                    style={[
                      typography.headlineSm,
                      {
                        color: colors.text,
                        fontFamily: weightFamily(isRTL, 'medium'),
                        flexShrink: 1,
                        textAlign: 'left',
                      },
                    ]}
                  >
                    {loc(featuredBundle, 'name', i18n.language)}
                  </Text>
                  <View style={styles.bundlePriceRow}>
                    <Text
                      style={[
                        typography.labelMd,
                        {
                          color: colors.primary,
                          fontFamily: weightFamily(isRTL, 'semiBold'),
                        },
                      ]}
                    >
                      {formatPrice(featuredBundle.final_price)}
                    </Text>
                    {featuredBundle.has_discount && (
                      <Text
                        style={[
                          typography.labelMd,
                          {
                            color: colors.textSubtle,
                            fontFamily: weightFamily(isRTL, 'regular'),
                            textDecorationLine: 'line-through',
                          },
                        ]}
                      >
                        {formatPrice(featuredBundle.price)}
                      </Text>
                    )}
                  </View>
                </View>

                {Boolean(loc(featuredBundle, 'subtitle', i18n.language)) && (
                  <Text
                    numberOfLines={2}
                    style={[
                      typography.bodySm,
                      {
                        color: colors.textMuted,
                        fontFamily: weightFamily(isRTL, 'regular'),
                        textAlign: 'left',
                      },
                    ]}
                  >
                    {loc(featuredBundle, 'subtitle', i18n.language)}
                  </Text>
                )}

                <View style={styles.bundleFooterRow}>
                  <View style={styles.savingsWrap}>
                    {featuredBundle.has_discount && (
                      <Text
                        style={[
                          typography.labelMd,
                          {
                            color: colors.primary,
                            fontFamily: weightFamily(isRTL, 'semiBold'),
                            textAlign: 'left',
                          },
                        ]}
                      >
                        {t('store.youSave', {
                          amount: formatPrice(
                            Number(featuredBundle.price) -
                              Number(featuredBundle.final_price)
                          ),
                        })}
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate('ProductDetail', {
                        productId: featuredBundle.slug,
                      })
                    }
                    style={[
                      styles.shopBundleButton,
                      { backgroundColor: colors.ink },
                    ]}
                  >
                    <Text
                      style={[
                        typography.labelMd,
                        {
                          color: colors.onInk,
                          fontFamily: weightFamily(isRTL, 'semiBold'),
                        },
                      ]}
                    >
                      {t('store.shopBundle')}
                    </Text>
                    <Icon
                      name="arrow_forward"
                      size={16}
                      color={colors.onInk}
                      autoMirror={true}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          )}

          {/* 5.5 Section Header */}
          {visibleProducts.length > 0 && (
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderTextWrap}>
                <Text
                  style={[
                    typography.headlineSm,
                    {
                      color: colors.text,
                      fontFamily: weightFamily(isRTL, 'medium'),
                      textAlign: 'left',
                    },
                  ]}
                >
                  {t('store.collectionTitle')}
                </Text>
                <Text
                  style={[
                    typography.bodySm,
                    {
                      color: colors.textSubtle,
                      fontFamily: weightFamily(isRTL, 'regular'),
                      marginTop: 2,
                      textAlign: 'left',
                    },
                  ]}
                >
                  {t('store.collectionCount', {
                    count: visibleProducts.length,
                  })}
                </Text>
              </View>
              {allVisibleInStock && (
                <Text
                  style={[
                    typography.labelSm,
                    {
                      color: colors.textSubtle,
                      fontFamily: weightFamily(isRTL, 'semiBold'),
                    },
                  ]}
                >
                  {t('store.inStock')}
                </Text>
              )}
            </View>
          )}

          {/* 5.10 Empty Filter State */}
          {!featuredBundle && visibleProducts.length === 0 && (
            <View style={styles.emptyFilterContainer}>
              <Text
                style={[
                  typography.bodyMd,
                  {
                    color: colors.textMuted,
                    fontFamily: weightFamily(isRTL, 'regular'),
                    textAlign: 'center',
                  },
                ]}
              >
                {t('store.emptyFilter')}
              </Text>
            </View>
          )}

          {/* 5.6 Diffuser Cards — full width */}
          {diffuserProducts.map((diffuser) => {
            const selectedCw = getSelectedColorway(diffuser);
            const isAdding = addingId === diffuser.id;
            return (
              <Card
                key={diffuser.id}
                variant="hero"
                onPress={() =>
                  navigation.navigate('ProductDetail', {
                    productId: diffuser.slug,
                  })
                }
                style={[
                  styles.diffuserCard,
                  {
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                <View
                  style={[
                    styles.diffuserImageWrap,
                    { backgroundColor: colors.surfaceMuted },
                  ]}
                >
                  {getProductImageUri(diffuser) ? (
                    <Image
                      source={{ uri: getProductImageUri(diffuser)! }}
                      style={styles.diffuserImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Icon
                        name="devices_other"
                        size={40}
                        color={colors.textSubtle}
                      />
                    </View>
                  )}
                </View>

                <View style={styles.diffuserHeaderRow}>
                  <Text
                    numberOfLines={1}
                    style={[
                      typography.headlineSm,
                      {
                        color: colors.text,
                        fontFamily: weightFamily(isRTL, 'medium'),
                        flexShrink: 1,
                        textAlign: 'left',
                      },
                    ]}
                  >
                    {loc(diffuser, 'name', i18n.language)}
                  </Text>
                  <Text
                    style={[
                      typography.labelLg,
                      {
                        color: colors.primary,
                        fontFamily: weightFamily(isRTL, 'semiBold'),
                        marginStart: 8,
                      },
                    ]}
                  >
                    {formatPrice(diffuser.final_price)}
                  </Text>
                </View>

                {Boolean(loc(diffuser, 'subtitle', i18n.language)) && (
                  <Text
                    numberOfLines={2}
                    style={[
                      typography.bodySm,
                      {
                        color: colors.textMuted,
                        fontFamily: weightFamily(isRTL, 'regular'),
                        textAlign: 'left',
                      },
                    ]}
                  >
                    {loc(diffuser, 'subtitle', i18n.language)}
                  </Text>
                )}

                {/* Color finish swatches + Add button */}
                <View style={styles.diffuserFooterRow}>
                  <View style={styles.colorwaysRow}>
                    {diffuser.colorways.map((cw) => {
                      const isCwSelected = selectedCw?.id === cw.id;
                      return (
                        <TouchableOpacity
                          key={cw.id}
                          activeOpacity={0.8}
                          accessibilityLabel={loc(cw, 'name', i18n.language)}
                          onPress={() =>
                            setSelectedColorwayIds((prev) => ({
                              ...prev,
                              [diffuser.id]: cw.id,
                            }))
                          }
                          style={[
                            styles.colorwayDotWrap,
                            {
                              borderColor: isCwSelected
                                ? colors.primary
                                : colors.border,
                              borderWidth: isCwSelected ? 2 : 1,
                            },
                          ]}
                        >
                          <View
                            style={[
                              styles.colorwayDot,
                              { backgroundColor: cw.hex_code },
                            ]}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={isAdding}
                    onPress={() =>
                      handleAddToCart(diffuser, selectedCw?.id)
                    }
                    style={[
                      styles.diffuserAddButton,
                      { backgroundColor: colors.accent },
                    ]}
                  >
                    {isAdding ? (
                      <ActivityIndicator
                        size="small"
                        color={colors.text}
                      />
                    ) : (
                      <>
                        <Icon name="add" size={16} color={colors.text} />
                        <Text
                          style={[
                            typography.labelMd,
                            {
                              color: colors.text,
                              fontFamily: weightFamily(isRTL, 'medium'),
                              marginStart: 4,
                            },
                          ]}
                        >
                          {t('store.add')}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </Card>
            );
          })}

          {/* 5.7 Oils / Accessories Grid — 2 Columns */}
          <View style={styles.oilsGrid}>
            {oilProducts.map((oil) => {
              const isAdding = addingId === oil.id;
              const topNotes = loc(
                oil.scent_notes,
                'top_notes',
                i18n.language
              );
              return (
                <Card
                  key={oil.id}
                  variant="hero"
                  onPress={() =>
                    navigation.navigate('ProductDetail', {
                      productId: oil.slug,
                    })
                  }
                  style={[
                    styles.oilCard,
                    {
                      width: oilCardWidth,
                      backgroundColor: colors.surface,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.oilImageWrap,
                      { backgroundColor: colors.surfaceMuted },
                    ]}
                  >
                    {getProductImageUri(oil) ? (
                      <Image
                        source={{ uri: getProductImageUri(oil)! }}
                        style={styles.oilImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.imagePlaceholder}>
                        <Icon name="eco" size={32} color={colors.textSubtle} />
                      </View>
                    )}
                  </View>

                  <View style={styles.oilDetails}>
                    <Text
                      numberOfLines={1}
                      style={[
                        typography.labelLg,
                        {
                          color: colors.text,
                          fontFamily: weightFamily(isRTL, 'semiBold'),
                          textAlign: 'left',
                        },
                      ]}
                    >
                      {loc(oil, 'name', i18n.language)}
                    </Text>

                    {Boolean(oil.capacity) && (
                      <Text
                        numberOfLines={1}
                        style={[
                          typography.bodySm,
                          {
                            color: colors.textSubtle,
                            fontFamily: weightFamily(isRTL, 'regular'),
                            textAlign: 'left',
                          },
                        ]}
                      >
                        {formatCapacity(oil.capacity)}
                      </Text>
                    )}

                    {Boolean(topNotes) && (
                      <Text
                        numberOfLines={1}
                        style={[
                          typography.labelSm,
                          {
                            color: colors.textSubtle,
                            fontFamily: weightFamily(isRTL, 'regular'),
                            textAlign: 'left',
                          },
                        ]}
                      >
                        {topNotes}
                      </Text>
                    )}
                  </View>

                  <View style={styles.oilBottomRow}>
                    <Text
                      style={[
                        typography.labelMd,
                        {
                          color: colors.text,
                          fontFamily: weightFamily(isRTL, 'medium'),
                        },
                      ]}
                    >
                      {formatPrice(oil.final_price)}
                    </Text>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      disabled={isAdding}
                      onPress={() => handleAddToCart(oil, null)}
                      style={[
                        styles.oilAddButton,
                        { backgroundColor: colors.surfaceMuted },
                      ]}
                      accessibilityLabel={t('store.add')}
                    >
                      {isAdding ? (
                        <ActivityIndicator
                          size="small"
                          color={colors.text}
                        />
                      ) : (
                        <Icon name="add" size={16} color={colors.text} />
                      )}
                    </TouchableOpacity>
                  </View>
                </Card>
              );
            })}
          </View>

          {/* 5.8 Benefits Card */}
          <View
            style={[
              styles.benefitsCard,
              {
                backgroundColor: colors.surfaceMuted,
              },
            ]}
          >
            {/* Delivery */}
            <View style={styles.benefitRow}>
              <View
                style={[
                  styles.benefitIconWrap,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Icon name="local_shipping" size={20} color={colors.primary} />
              </View>
              <View style={styles.benefitTextWrap}>
                <Text
                  style={[
                    typography.labelMd,
                    {
                      color: colors.text,
                      fontFamily: weightFamily(isRTL, 'medium'),
                      textAlign: 'left',
                    },
                  ]}
                >
                  {t('store.benefitDeliveryTitle', {
                    amount: formatPrice(
                      config?.free_delivery_threshold ?? '300.00'
                    ),
                  })}
                </Text>
                <Text
                  style={[
                    typography.bodySm,
                    {
                      color: colors.textSubtle,
                      fontFamily: weightFamily(isRTL, 'regular'),
                      marginTop: 2,
                      textAlign: 'left',
                    },
                  ]}
                >
                  {t('store.benefitDeliveryBody', {
                    fee: formatPrice(config?.delivery_fee ?? '15.00'),
                  })}
                </Text>
              </View>
            </View>

            {/* Cash on Delivery */}
            {config?.cod_enabled !== false && (
              <View style={styles.benefitRow}>
                <View
                  style={[
                    styles.benefitIconWrap,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <Icon name="payments" size={20} color={colors.primary} />
                </View>
                <View style={styles.benefitTextWrap}>
                  <Text
                    style={[
                      typography.labelMd,
                      {
                        color: colors.text,
                        fontFamily: weightFamily(isRTL, 'medium'),
                        textAlign: 'left',
                      },
                    ]}
                  >
                    {t('store.benefitCodTitle')}
                  </Text>
                  <Text
                    style={[
                      typography.bodySm,
                      {
                        color: colors.textSubtle,
                        fontFamily: weightFamily(isRTL, 'regular'),
                        marginTop: 2,
                        textAlign: 'left',
                      },
                    ]}
                  >
                    {t('store.benefitCodBody')}
                  </Text>
                </View>
              </View>
            )}

            {/* Waterless Technology */}
            <View style={styles.benefitRow}>
              <View
                style={[
                  styles.benefitIconWrap,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Icon name="water_drop" size={20} color={colors.primary} />
              </View>
              <View style={styles.benefitTextWrap}>
                <Text
                  style={[
                    typography.labelMd,
                    {
                      color: colors.text,
                      fontFamily: weightFamily(isRTL, 'medium'),
                      textAlign: 'left',
                    },
                  ]}
                >
                  {t('store.benefitWaterlessTitle')}
                </Text>
                <Text
                  style={[
                    typography.bodySm,
                    {
                      color: colors.textSubtle,
                      fontFamily: weightFamily(isRTL, 'regular'),
                      marginTop: 2,
                      textAlign: 'left',
                    },
                  ]}
                >
                  {t('store.benefitWaterlessBody')}
                </Text>
              </View>
            </View>

            {/* Warranty (only if warranty_months is configured as a number) */}
            {typeof config?.warranty_months === 'number' &&
              config.warranty_months > 0 && (
                <View style={styles.benefitRow}>
                  <View
                    style={[
                      styles.benefitIconWrap,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    <Icon name="verified_user" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.benefitTextWrap}>
                    <Text
                      style={[
                        typography.labelMd,
                        {
                          color: colors.text,
                          fontFamily: weightFamily(isRTL, 'medium'),
                          textAlign: 'left',
                        },
                      ]}
                    >
                      {t('store.benefitWarrantyTitle', {
                        months: config.warranty_months,
                      })}
                    </Text>
                    <Text
                      style={[
                        typography.bodySm,
                        {
                          color: colors.textSubtle,
                          fontFamily: weightFamily(isRTL, 'regular'),
                          marginTop: 2,
                          textAlign: 'left',
                        },
                      ]}
                    >
                      {t('store.benefitWarrantyBody')}
                    </Text>
                  </View>
                </View>
              )}
          </View>

          {/* 5.9 Editorial Wordmark Footer */}
          <View style={styles.wordmarkContainer}>
            <LatinText
              weight="light"
              style={[styles.wordmarkText, { color: colors.textSubtle }]}
            >
              odora
            </LatinText>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
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
    top: 80,
    alignSelf: 'center',
    zIndex: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: 'rgba(35, 40, 33, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  searchPill: {
    flex: 1,
    height: 48,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: 'rgba(35, 40, 33, 0.03)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 1,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsScrollView: {
    marginTop: 16,
    marginHorizontal: -20,
  },
  chipsScrollContent: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    height: 36,
    borderRadius: 999,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bundleCard: {
    borderRadius: 32,
    overflow: 'hidden',
    marginTop: 16,
    shadowColor: 'rgba(35, 40, 33, 0.06)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 4,
  },
  bundleImageWrap: {
    width: '100%',
    height: 224,
    overflow: 'hidden',
    position: 'relative',
  },
  bundleImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBadgeWrap: {
    position: 'absolute',
    top: 8,
    start: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  bundleContent: {
    padding: 24,
    gap: 8,
  },
  bundleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },
  bundlePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bundleFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  savingsWrap: {
    flex: 1,
  },
  shopBundleButton: {
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  sectionHeaderTextWrap: {
    flex: 1,
  },
  emptyFilterContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diffuserCard: {
    borderRadius: 32,
    padding: 16,
    gap: 8,
    marginTop: 8,
    shadowColor: 'rgba(35, 40, 33, 0.03)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 2,
  },
  diffuserImageWrap: {
    width: '100%',
    height: 224,
    borderRadius: 16,
    overflow: 'hidden',
  },
  diffuserImage: {
    width: '100%',
    height: '100%',
  },
  diffuserHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  diffuserFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  colorwaysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorwayDotWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorwayDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  diffuserAddButton: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  oilsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16,
  },
  oilCard: {
    borderRadius: 32,
    padding: 8,
    shadowColor: 'rgba(35, 40, 33, 0.03)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 2,
    justifyContent: 'space-between',
  },
  oilImageWrap: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: 16,
    overflow: 'hidden',
  },
  oilImage: {
    width: '100%',
    height: '100%',
  },
  oilDetails: {
    paddingTop: 4,
    paddingHorizontal: 4,
    gap: 2,
  },
  oilBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  oilAddButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitsCard: {
    borderRadius: 32,
    padding: 24,
    gap: 16,
    marginTop: 24,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  benefitIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitTextWrap: {
    flex: 1,
  },
  wordmarkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  wordmarkText: {
    fontSize: 14,
    letterSpacing: 4,
    textTransform: 'lowercase',
  },
  skeletonContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  searchSkeleton: {
    flex: 1,
    marginEnd: 8,
  },
  chipsSkeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  chipSkeleton: {
    marginEnd: 8,
  },
  bundleSkeleton: {
    marginTop: 16,
  },
  sectionTitleSkeleton: {
    marginTop: 24,
  },
  diffuserSkeleton: {
    marginTop: 8,
  },
  oilsGridSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
