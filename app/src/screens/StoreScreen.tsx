import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Star, Check, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, typography, spacing, radii, shadows } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { useCartStore } from '../store/useCartStore';
import { api } from '../services/api';

interface StoreScreenProps {
  navigation: any;
}

export const StoreScreen: React.FC<StoreScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { language, isRTL } = useAppStore();
  const { cart, addItem, fetchCart } = useCartStore();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const fontFam =
    language === 'ar'
      ? typography.fontFamily.ar
      : typography.fontFamily.en;

  // Local image asset mapping based on product slug/type
  const getProductImage = (slug: string, productType: string) => {
    if (productType === 'diffuser' || slug.includes('diffuser')) {
      return require('../../assets/images/brand_photo_4.png');
    }
    if (slug.includes('cotton')) {
      return require('../../assets/images/brand_photo_2.png');
    }
    if (slug.includes('bundle')) {
      return require('../../assets/images/brand_photo_1.png');
    }
    return require('../../assets/images/brand_photo_3.png');
  };

  useEffect(() => {
    const loadStoreData = async () => {
      setLoading(true);
      try {
        const res = await api.getProducts();
        const items = res.results || res || [];
        if (Array.isArray(items) && items.length > 0) {
          setProducts(items);
        } else {
          // Graceful fallback if empty
          setProducts([
            {
              id: 'odora-diffuser-a316',
              slug: 'odora-diffuser-a316',
              name_ar: 'جهاز أودورا A316 الذكي',
              name_en: 'Odora A316 Smart Diffuser',
              subtitle_ar: 'تذرية هوائية بدون ماء · تغطية 900 م³',
              subtitle_en: 'Waterless Cold-Air · 900 m³ Coverage',
              price: '320.00',
              rating: 4.9,
              reviews_count: 24,
              product_type: 'diffuser',
              colorways: [{ id: '1', name_ar: 'أخضر مريمي', hex_code: '#919C7A' }],
            },
            {
              id: 'forest-sage-fragrance-oil',
              slug: 'forest-sage-fragrance-oil',
              name_ar: 'زيت مريمية الغابة النقي',
              name_en: 'Forest Sage Pure Fragrance',
              subtitle_ar: 'صنوبر، خزامى، مريمية، أرز · 500 مل',
              subtitle_en: 'Pine, Lavender, Sage · 500ml',
              price: '45.00',
              rating: 5.0,
              reviews_count: 38,
              product_type: 'oil',
            },
          ]);
        }
      } catch (err) {
        console.warn('Using offline fallback products for StoreScreen', err);
        setProducts([
          {
            id: 'odora-diffuser-a316',
            slug: 'odora-diffuser-a316',
            name_ar: 'جهاز أودورا A316 الذكي',
            name_en: 'Odora A316 Smart Diffuser',
            subtitle_ar: 'تذرية هوائية بدون ماء · تغطية 900 م³',
            subtitle_en: 'Waterless Cold-Air · 900 m³ Coverage',
            price: '320.00',
            rating: 4.9,
            product_type: 'diffuser',
          },
          {
            id: 'forest-sage-fragrance-oil',
            slug: 'forest-sage-fragrance-oil',
            name_ar: 'زيت مريمية الغابة النقي',
            name_en: 'Forest Sage Pure Fragrance',
            subtitle_ar: 'صنوبر، خزامى، مريمية، أرز · 500 مل',
            subtitle_en: 'Pine, Lavender, Sage · 500ml',
            price: '45.00',
            rating: 5.0,
            product_type: 'oil',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadStoreData();
    fetchCart();
  }, []);

  const handleAddToCart = async (item: any) => {
    const defaultColorway = item.colorways?.[0]?.id || null;
    const success = await addItem(item.id, defaultColorway, 1);
    
    // Animate visual check feedback
    setAddedMap((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [item.id]: false }));
    }, 2200);
  };

  return (
    <ScreenContainer>
      <Header
        showBack={true}
        onBack={() => navigation.goBack()}
        rightAction="none"
      />

      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.brandBadge}>
            <Sparkles size={12} color={colors.brandOlive} />
            <Text style={[styles.brandBadgeText, { fontFamily: fontFam.bold }]}>
              {language === 'ar' ? 'متجر أودورا الرسمي' : 'ODORA BOUTIQUE'}
            </Text>
          </View>
          <Text style={[styles.title, { fontFamily: fontFam.medium }]}>
            {t('store.title')}
          </Text>
          <Text style={[styles.subtitle, { fontFamily: fontFam.regular }]}>
            {t('store.subtitle')}
          </Text>
        </View>

        {/* Loading Spinner */}
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color={colors.brandSage} />
            <Text style={[styles.loadingText, { fontFamily: fontFam.regular }]}>
              {language === 'ar' ? 'جاري تحميل الأجهزة والزيوت العطرية...' : 'Loading products...'}
            </Text>
          </View>
        ) : (
          /* Live Product Cards */
          products.map((item) => {
            const isAdded = !!addedMap[item.id];
            const name = language === 'ar' ? (item.name_ar || item.name) : (item.name_en || item.name_ar || item.name);
            const subtitle = language === 'ar' ? item.subtitle_ar : (item.subtitle_en || item.subtitle_ar);
            const price = Number(item.price || item.final_price || 0).toFixed(2);
            const rating = item.rating || 5.0;

            return (
              <Card key={item.id} variant="surface" elevation="card" style={styles.productCard}>
                <View style={styles.imageWrap}>
                  <Image
                    source={getProductImage(item.slug || '', item.product_type || '')}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  <View style={styles.ratingBadge}>
                    <Star size={12} color={colors.warningAmber} fill={colors.warningAmber} />
                    <Text style={styles.ratingText}>{Number(rating).toFixed(1)}</Text>
                  </View>
                </View>

                <View style={styles.cardDetails}>
                  <Text style={[styles.productName, { fontFamily: fontFam.medium }]}>
                    {name}
                  </Text>
                  {subtitle ? (
                    <Text style={[styles.productColorway, { fontFamily: fontFam.regular }]}>
                      {subtitle}
                    </Text>
                  ) : null}

                  <View style={styles.priceRow}>
                    <View style={styles.priceGroup}>
                      <Text style={[styles.priceValue, { fontFamily: fontFam.bold }]}>
                        {price}
                      </Text>
                      <Text style={[styles.priceCurrency, { fontFamily: fontFam.regular }]}>
                        {t('store.currency')}
                      </Text>
                    </View>

                    <Button
                      title={isAdded ? (language === 'ar' ? 'تمت الإضافة ✓' : 'Added ✓') : t('store.addToCart')}
                      onPress={() => handleAddToCart(item)}
                      variant={isAdded ? 'outline' : 'dark'}
                      size="sm"
                      icon={isAdded ? <Check size={14} color={colors.brandSage} /> : <ShoppingBag size={14} color={colors.surface} />}
                    />
                  </View>
                </View>
              </Card>
            );
          })
        )}
      </View>

      {/* Floating Bottom Cart Bar when items are present */}
      {cart.total_items > 0 && (
        <View style={styles.cartBarContainer}>
          <TouchableOpacity
            style={styles.cartBar}
            onPress={() => navigation.navigate('Checkout')}
            activeOpacity={0.9}
          >
            <View style={styles.cartBarLeft}>
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cart.total_items}</Text>
              </View>
              <View>
                <Text style={[styles.cartBarTitle, { fontFamily: fontFam.bold }]}>
                  {language === 'ar' ? 'سلة التسوق والمتابعة' : 'Shopping Cart'}
                </Text>
                <Text style={[styles.cartBarTotal, { fontFamily: fontFam.regular }]}>
                  {Number(cart.total_price || cart.subtotal || 0).toFixed(2)} {t('store.currency')}
                </Text>
              </View>
            </View>

            <View style={styles.cartBarRight}>
              <Text style={[styles.cartCheckoutText, { fontFamily: fontFam.bold }]}>
                {language === 'ar' ? 'إتمام الطلب' : 'Checkout'}
              </Text>
              {isRTL ? (
                <ArrowLeft size={16} color={colors.surface} />
              ) : (
                <ArrowRight size={16} color={colors.surface} />
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 110,
  },
  titleSection: {
    marginBottom: spacing.xl,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.brandPaleGreen,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  brandBadgeText: {
    fontSize: 10,
    color: colors.brandOlive,
    letterSpacing: 1,
  },
  title: {
    fontSize: typography.fontSize.title1,
    color: colors.inkPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.bodySm,
    color: colors.inkMuted,
    lineHeight: typography.lineHeight.bodySm,
  },
  loadingBox: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: typography.fontSize.caption,
    color: colors.inkMuted,
  },
  productCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  imageWrap: {
    height: 190,
    width: '100%',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
  },
  ratingText: {
    fontSize: typography.fontSize.caption,
    color: colors.inkPrimary,
    fontWeight: '600',
  },
  cardDetails: {
    padding: spacing.xl,
  },
  productName: {
    fontSize: typography.fontSize.title3,
    color: colors.inkPrimary,
    marginBottom: 4,
  },
  productColorway: {
    fontSize: typography.fontSize.caption,
    color: colors.inkMuted,
    marginBottom: spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  priceValue: {
    fontSize: typography.fontSize.title2,
    color: colors.inkPrimary,
  },
  priceCurrency: {
    fontSize: typography.fontSize.caption,
    color: colors.inkMuted,
  },
  cartBarContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    zIndex: 99,
  },
  cartBar: {
    backgroundColor: colors.brandOlive,
    borderRadius: radii.xl,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  cartBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.brandPaleGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.brandOlive,
  },
  cartBarTitle: {
    color: colors.surface,
    fontSize: 13,
  },
  cartBarTotal: {
    color: colors.brandPaleGreen,
    fontSize: 12,
  },
  cartBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
  },
  cartCheckoutText: {
    color: colors.surface,
    fontSize: 12,
  },
});

export default StoreScreen;
