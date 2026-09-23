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

interface CartScreenProps {
  navigation: any;
}

export const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors, typography, radii, spacing, isRTL } = useTheme();

  const [items, setItems] = useState([
    {
      id: 'diffuser-01',
      title: isRTL ? 'موزع أودورا إير 01' : 'Odora Air 01 Diffuser',
      subtitle: isRTL ? 'أخضر ميرمية · حجرة 50 مل القياسية' : 'Sage Green · Standard 50ml Chamber',
      price: 185.0,
      qty: 1,
      image: require('../../assets/photos/diffuser-sage-clean.png'),
    },
    {
      id: 'oil-sage',
      title: isRTL ? 'زيت عطر ميرمية الغابة' : 'Forest Sage Fragrance Oil',
      subtitle: isRTL ? 'مستخلص تفتيت بارد 30 مل' : '30ml Cold-Diffusion Extract',
      price: 42.0,
      qty: 2,
      image: require('../../assets/photos/oil-forest-sage.png'),
    },
    {
      id: 'pedestal-stone',
      title: isRTL ? 'قاعدة ترافيرتين الرخامية' : 'Honed Travertine Pedestal',
      subtitle: isRTL ? 'قاعدة حجر رملي طبيعي' : 'Natural Sandstone Base',
      price: 65.0,
      qty: 1,
      image: require('../../assets/photos/diffuser-white-clean.png'),
    },
  ]);

  const [hasPromo, setHasPromo] = useState(true);

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const subtotal = items.reduce((acc, it) => acc + it.price * it.qty, 0);
  const discount = hasPromo ? 10.0 : 0.0;
  const shipping = subtotal >= 300 || subtotal === 0 ? 0.0 : 15.0;
  const total = Math.max(0, subtotal - discount + shipping);

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* 1. Header (64pt, Back button + Title + Share + Cart badge) */}
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
              {isRTL ? 'أودورا — سلة المشتريات' : 'Odora — Cart'}
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
            onPress: () => {},
            label: 'Cart',
          },
        ]}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 2. Sanctuary Header Context */}
        <View style={styles.cartHeaderRow}>
          <View style={styles.titleWithCount}>
            <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '700' }]}>
              {isRTL ? 'حقيبة الملاذ' : 'Sanctuary Bag'}
            </Text>
            <Text style={[typography.bodySm, { color: colors.textMuted, marginStart: 6 }]}>
              ({items.length} {isRTL ? 'عناصر' : 'items'})
            </Text>
          </View>
          <TouchableOpacity onPress={() => setItems([])}>
            <Text style={[typography.labelMd, { color: colors.textMuted, fontWeight: '600' }]}>
              {isRTL ? 'مسح الكل' : 'Clear all'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3. Complimentary Express Delivery Meter */}
        <View style={styles.meterSection}>
          <View style={[styles.meterCard, { backgroundColor: colors.surfaceLow }]}>
            <View style={styles.meterTextRow}>
              <View style={styles.meterIconAndText}>
                <Icon name="local_shipping" size={18} color={colors.primary} />
                <Text style={[typography.bodySm, { color: colors.text, marginStart: 8 }]}>
                  {isRTL ? 'أضف ' : 'Add '}
                  <Text style={{ color: colors.primary, fontWeight: '700' }}>$15.00</Text>
                  {isRTL ? ' للحصول على شحن سريع مجاني' : ' for complimentary express delivery'}
                </Text>
              </View>
              <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>85%</Text>
            </View>
            <View style={[styles.meterTrack, { backgroundColor: colors.surfaceHigh }]}>
              <View style={[styles.meterFill, { backgroundColor: colors.primary, width: '85%' }]} />
            </View>
          </View>
        </View>

        {/* 4. Cart Line Items Stack */}
        <View style={styles.itemsSection}>
          {items.map((item) => (
            <View key={item.id} style={[styles.itemCard, { backgroundColor: colors.surface }]}>
              <View style={[styles.itemImageWrap, { backgroundColor: colors.surfaceLow }]}>
                <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
              </View>

              <View style={styles.itemDetails}>
                <View style={styles.itemTitleRow}>
                  <View style={{ flex: 1, marginEnd: 8 }}>
                    <Text numberOfLines={1} style={[typography.labelLg, { color: colors.text, fontWeight: '700' }]}>
                      {item.title}
                    </Text>
                    <Text numberOfLines={1} style={[typography.bodySm, { color: colors.textMuted, fontSize: 11 }]}>
                      {item.subtitle}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
                    <Icon name="close" size={16} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <View style={styles.itemBottomRow}>
                  <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '700', fontSize: 16 }]}>
                    ${(item.price * item.qty).toFixed(2)}
                  </Text>

                  {/* Quantity Stepper Capsule */}
                  <View style={[styles.stepperPill, { backgroundColor: colors.surfaceLow }]}>
                    <TouchableOpacity
                      onPress={() => updateQty(item.id, -1)}
                      style={styles.stepperBtn}
                    >
                      <Icon name="remove" size={14} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700', marginHorizontal: 8 }]}>
                      {item.qty}
                    </Text>
                    <TouchableOpacity
                      onPress={() => updateQty(item.id, 1)}
                      style={styles.stepperBtn}
                    >
                      <Icon name="add" size={14} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 5. Complimentary Botanical Offering Tag */}
        <View style={styles.offeringSection}>
          <View style={[styles.offeringCard, { backgroundColor: colors.accent }]}>
            <View style={[styles.offeringIconCircle, { backgroundColor: colors.surface }]}>
              <Icon name="spa" size={18} color={colors.primary} />
            </View>
            <View style={{ marginStart: 12, flex: 1 }}>
              <Text style={[typography.labelSm, { color: colors.primary, textTransform: 'uppercase', fontWeight: '700' }]}>
                {isRTL ? 'هدية الأتيليه المجانية' : 'Complimentary Offering'}
              </Text>
              <Text style={[typography.bodySm, { color: colors.text, fontWeight: '600', marginTop: 1 }]}>
                {isRTL ? 'صندل أبيض وسوسن (عينة نباتية 5 مل)' : 'White Santal & Iris (5ml botanical sample)'}
              </Text>
            </View>
          </View>
        </View>

        {/* 6. Voucher / Promo Code Field */}
        <View style={styles.promoSection}>
          <Text style={[typography.labelSm, { color: colors.textMuted, textTransform: 'uppercase', fontWeight: '700', marginBottom: 8 }]}>
            {isRTL ? 'قسيمة الملاذ / رمز الهدية' : 'Sanctuary Voucher / Gift Code'}
          </Text>
          <View style={[styles.promoBar, { backgroundColor: colors.surface }]}>
            <View style={styles.promoLeft}>
              <Icon name="sell" size={18} color={colors.primary} />
              {hasPromo ? (
                <View style={[styles.voucherBadge, { backgroundColor: colors.accent }]}>
                  <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
                    AUTUMN10 (-$10.00)
                  </Text>
                </View>
              ) : (
                <Text style={[typography.bodyMd, { color: colors.textMuted, marginStart: 8 }]}>
                  {isRTL ? 'أدخل رمز القسيمة' : 'Enter voucher code'}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={() => setHasPromo(!hasPromo)}>
              <Text style={[typography.labelMd, { color: hasPromo ? colors.error : colors.primary, fontWeight: '600' }]}>
                {hasPromo ? (isRTL ? 'حذف' : 'Remove') : (isRTL ? 'تطبيق' : 'Apply')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 7. Order Summary Breakdown */}
        <View style={styles.summarySection}>
          <View style={[styles.summaryCard, { backgroundColor: colors.surfaceLow }]}>
            <View style={styles.summaryRow}>
              <Text style={[typography.bodyMd, { color: colors.textMuted }]}>{isRTL ? 'المجموع الفرعي' : 'Subtotal'}</Text>
              <Text style={[typography.bodyMd, { color: colors.text, fontWeight: '600' }]}>
                ${subtotal.toFixed(2)}
              </Text>
            </View>

            {hasPromo && (
              <View style={styles.summaryRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[typography.bodyMd, { color: colors.primary }]}>{isRTL ? 'خصم القسيمة' : 'Voucher Discount'}</Text>
                  <View style={[styles.summaryVoucherPill, { backgroundColor: colors.accent }]}>
                    <Text style={[typography.labelSm, { color: colors.primary, fontSize: 10, fontWeight: '700' }]}>AUTUMN10</Text>
                  </View>
                </View>
                <Text style={[typography.bodyMd, { color: colors.primary, fontWeight: '700' }]}>-$10.00</Text>
              </View>
            )}

            <View style={styles.summaryRow}>
              <Text style={[typography.bodyMd, { color: colors.textMuted }]}>
                {isRTL ? 'التوصيل السريع التقديري' : 'Estimated Express Delivery'}
              </Text>
              <Text style={[typography.bodyMd, { color: colors.primary, fontWeight: '700' }]}>
                {shipping === 0 ? (isRTL ? 'مجاني ($0.00)' : 'Free ($0.00)') : `$${shipping.toFixed(2)}`}
              </Text>
            </View>

            <View style={[styles.summaryDivider, { backgroundColor: colors.surfaceHigh }]} />

            <View style={styles.totalRow}>
              <View>
                <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '700' }]}>
                  {isRTL ? 'الإجمالي' : 'Total'}
                </Text>
                <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 11 }]}>
                  {isRTL ? 'شامل الضرائب المحلية' : 'Local taxes included'}
                </Text>
              </View>
              <Text style={[typography.headlineMd, { color: colors.text, fontWeight: '700' }]}>
                ${total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* 8. Assurance Row */}
        <View style={styles.assuranceRow}>
          <View style={styles.assuranceItem}>
            <Icon name="verified" size={16} color={colors.textMuted} />
            <Text style={[typography.labelSm, { color: colors.textMuted, textTransform: 'uppercase', marginStart: 4 }]}>
              {isRTL ? 'ضمان لسنتين' : '2-Yr Warranty'}
            </Text>
          </View>
          <View style={[styles.assuranceDot, { backgroundColor: colors.surfaceHigh }]} />
          <View style={styles.assuranceItem}>
            <Icon name="published_with_changes" size={16} color={colors.textMuted} />
            <Text style={[typography.labelSm, { color: colors.textMuted, textTransform: 'uppercase', marginStart: 4 }]}>
              {isRTL ? 'تجربة 30 يوماً' : '30-Day Ritual Trial'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 9. Fixed Bottom Checkout Bar */}
      <View style={[styles.fixedBottomBar, { backgroundColor: colors.surface, borderTopColor: colors.surfaceLow }]}>
        <View style={styles.bottomBarContent}>
          <View>
            <Text style={[typography.labelSm, { color: colors.textMuted, textTransform: 'uppercase' }]}>
              {isRTL ? `الإجمالي (${items.length} عناصر)` : `Total (${items.length} items)`}
            </Text>
            <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '700', fontSize: 18 }]}>
              ${total.toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => navigation.navigate('Checkout')}
            style={[styles.checkoutBtn, { backgroundColor: colors.ink }]}
          >
            <Icon name="lock" size={16} color={colors.onInk} />
            <Text style={[typography.labelLg, { color: colors.onInk, fontWeight: '700', marginHorizontal: 6 }]}>
              {isRTL ? 'إتمام الطلب' : 'Checkout'}
            </Text>
            <Icon name={isRTL ? 'arrow_back' : 'arrow_forward'} size={16} color={colors.onInk} />
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
  cartHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
  },
  titleWithCount: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  meterSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  meterCard: {
    borderRadius: 18,
    padding: 14,
  },
  meterTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  meterIconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  meterTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  meterFill: {
    height: 6,
    borderRadius: 3,
  },
  itemsSection: {
    paddingHorizontal: 20,
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  itemImageWrap: {
    width: 72,
    height: 72,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemImage: {
    width: '80%',
    height: '80%',
  },
  itemDetails: {
    marginStart: 12,
    flex: 1,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  removeBtn: {
    padding: 4,
  },
  itemBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 14,
  },
  stepperBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offeringSection: {
    paddingHorizontal: 20,
    marginTop: 14,
  },
  offeringCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
  },
  offeringIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoSection: {
    paddingHorizontal: 20,
    marginTop: 18,
  },
  promoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  promoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  voucherBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginStart: 8,
  },
  summarySection: {
    paddingHorizontal: 20,
    marginTop: 18,
  },
  summaryCard: {
    borderRadius: 20,
    padding: 18,
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryVoucherPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginStart: 6,
  },
  summaryDivider: {
    height: 1,
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  assuranceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 20,
  },
  assuranceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assuranceDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  fixedBottomBar: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 22,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
});
