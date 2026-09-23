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

interface CheckoutScreenProps {
  navigation: any;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors, typography, radii, spacing, isRTL } = useTheme();

  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'sameday'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'wallet'>('cod');
  const [autoRefill, setAutoRefill] = useState(true);

  const baseTotal = 324.0;
  const shippingExtra = deliverySpeed === 'sameday' ? 15.0 : 0.0;
  const finalTotal = baseTotal + shippingExtra;

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
              {isRTL ? 'أودورا — إتمام الطلب' : 'Odora — Checkout'}
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
        {/* 2. Progress Stepper Capsule */}
        <View style={styles.stepperContainer}>
          <View style={[styles.stepperCapsule, { backgroundColor: colors.surfaceLow }]}>
            {/* Step 1: Completed */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircleDone, { backgroundColor: colors.primary }]}>
                <Icon name="check" size={12} color={colors.surface} />
              </View>
              <Text style={[typography.labelSm, { color: colors.text, textTransform: 'uppercase', marginStart: 4 }]}>
                {isRTL ? '1. الشحن' : '1. Shipping'}
              </Text>
            </View>

            <View style={[styles.stepDivider, { backgroundColor: colors.surfaceHigh }]} />

            {/* Step 2: Active */}
            <View style={styles.stepItem}>
              <View style={[styles.stepCircleActive, { backgroundColor: colors.accent }]}>
                <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700', fontSize: 11 }]}>
                  2
                </Text>
              </View>
              <Text style={[typography.labelSm, { color: colors.text, fontWeight: '700', textTransform: 'uppercase', marginStart: 4 }]}>
                {isRTL ? 'الدفع' : 'Payment'}
              </Text>
            </View>

            <View style={[styles.stepDivider, { backgroundColor: colors.surfaceHigh }]} />

            {/* Step 3: Inactive */}
            <View style={[styles.stepItem, { opacity: 0.5 }]}>
              <View style={[styles.stepCircleInactive, { backgroundColor: colors.surfaceHigh }]}>
                <Text style={[typography.labelSm, { color: colors.textMuted, fontSize: 11 }]}>
                  3
                </Text>
              </View>
              <Text style={[typography.labelSm, { color: colors.textMuted, textTransform: 'uppercase', marginStart: 4 }]}>
                {isRTL ? 'المراجعة' : 'Review'}
              </Text>
            </View>
          </View>
        </View>

        {/* 3. Section 1: Delivery Address */}
        <View style={styles.sectionWrap}>
          <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <Icon name="location_on" size={20} color={colors.primary} />
                <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '700', marginStart: 8 }]}>
                  {isRTL ? 'عنوان التوصيل' : 'Delivery Address'}
                </Text>
              </View>
              <TouchableOpacity>
                <Text style={[typography.labelMd, { color: colors.primary, fontWeight: '600' }]}>
                  {isRTL ? 'تعديل' : 'Change'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.addressContent}>
              <Text style={[typography.labelLg, { color: colors.text, fontWeight: '700' }]}>
                {isRTL ? 'طارق الفيتوري' : 'Julian Vance'}
              </Text>
              <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 3, lineHeight: 18 }]}>
                {isRTL
                  ? 'حي الأندلس، شارع النرجس، فيلا 14\nطرابلس، ليبيا'
                  : 'Al Wasl Road, Villa 42, Jumeirah 2\nDubai, United Arab Emirates'}
              </Text>
              <View style={styles.phoneRow}>
                <Icon name="call" size={14} color={colors.textMuted} />
                <Text style={[typography.bodySm, { color: colors.textMuted, marginStart: 6 }]}>
                  {isRTL ? '+218 91 234 5678' : '+971 50 892 4190'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 4. Section 2: Delivery Speed */}
        <View style={styles.sectionWrap}>
          <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <Icon name="local_shipping" size={20} color={colors.primary} />
                <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '700', marginStart: 8 }]}>
                  {isRTL ? 'سرعة التوصيل' : 'Delivery Speed'}
                </Text>
              </View>
            </View>

            <View style={styles.optionsList}>
              {/* Option 1: Complimentary */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setDeliverySpeed('standard')}
                style={[
                  styles.optionCard,
                  deliverySpeed === 'standard'
                    ? { backgroundColor: colors.surfaceLow, borderColor: colors.primary, borderWidth: 1 }
                    : { backgroundColor: colors.surfaceLow, borderColor: 'transparent', borderWidth: 1 },
                ]}
              >
                <View style={styles.optionLeft}>
                  <View style={[styles.radioCircle, deliverySpeed === 'standard' && { borderColor: colors.primary }]}>
                    {deliverySpeed === 'standard' && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
                  </View>
                  <View style={{ marginStart: 10, flex: 1 }}>
                    <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>
                      {isRTL ? 'توصيل سريع مجاني' : 'Complimentary Express Courier'}
                    </Text>
                    <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 11 }]}>
                      {isRTL ? 'مقدر خلال 1–2 يوم عمل' : 'Estimated 1–2 business days'}
                    </Text>
                  </View>
                </View>
                <Text style={[typography.labelMd, { color: colors.primary, fontWeight: '700' }]}>$0.00</Text>
              </TouchableOpacity>

              {/* Option 2: Same-Day */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setDeliverySpeed('sameday')}
                style={[
                  styles.optionCard,
                  deliverySpeed === 'sameday'
                    ? { backgroundColor: colors.surfaceLow, borderColor: colors.primary, borderWidth: 1 }
                    : { backgroundColor: colors.surfaceLow, borderColor: 'transparent', borderWidth: 1 },
                ]}
              >
                <View style={styles.optionLeft}>
                  <View style={[styles.radioCircle, deliverySpeed === 'sameday' && { borderColor: colors.primary }]}>
                    {deliverySpeed === 'sameday' && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
                  </View>
                  <View style={{ marginStart: 10, flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>
                        {isRTL ? 'توصيل بيئي فوري' : 'Same-Day Eco-Courier'}
                      </Text>
                      <View style={[styles.ecoTag, { backgroundColor: colors.accent }]}>
                        <Text style={[typography.labelSm, { color: colors.primary, fontSize: 9, fontWeight: '700' }]}>Eco</Text>
                      </View>
                    </View>
                    <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 11 }]}>
                      {isRTL ? 'توصيل خلال 4 ساعات' : 'Delivered within 4 hours'}
                    </Text>
                  </View>
                </View>
                <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>+$15.00</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 5. Section 3: Payment Method */}
        <View style={styles.sectionWrap}>
          <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <Icon name="account_balance_wallet" size={20} color={colors.primary} />
                <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '700', marginStart: 8 }]}>
                  {isRTL ? 'طريقة الدفع' : 'Payment Method'}
                </Text>
              </View>
              <View style={styles.encryptedBadge}>
                <Icon name="lock" size={13} color={colors.textMuted} />
                <Text style={[typography.labelSm, { color: colors.textMuted, marginStart: 3 }]}>
                  {isRTL ? 'مشفر' : 'Encrypted'}
                </Text>
              </View>
            </View>

            <View style={styles.optionsList}>
              {/* Option 1: Cash on Delivery */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setPaymentMethod('cod')}
                style={[
                  styles.optionCard,
                  paymentMethod === 'cod'
                    ? { backgroundColor: colors.surfaceLow, borderColor: colors.primary, borderWidth: 1 }
                    : { backgroundColor: colors.surfaceLow, borderColor: 'transparent', borderWidth: 1 },
                ]}
              >
                <View style={styles.optionLeft}>
                  <View style={[styles.radioCircle, paymentMethod === 'cod' && { borderColor: colors.primary }]}>
                    {paymentMethod === 'cod' && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
                  </View>
                  <Icon name="payments" size={20} color={colors.primary} style={{ marginStart: 10 }} />
                  <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700', marginStart: 6 }]}>
                    {isRTL ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                  </Text>
                </View>
                <View style={[styles.defaultBadge, { backgroundColor: colors.accent }]}>
                  <Text style={[typography.labelSm, { color: colors.primary, fontSize: 10, fontWeight: '700' }]}>
                    {isRTL ? 'الافتراضي' : 'Default'}
                  </Text>
                </View>
              </TouchableOpacity>
              {paymentMethod === 'cod' && (
                <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 11, marginStart: 32, marginTop: -4, marginBottom: 6 }]}>
                  {isRTL ? 'ادفع نقداً أو عبر البطاقة المصرفية عند وصول المندوب.' : 'Pay with cash or digital terminal upon courier arrival.'}
                </Text>
              )}

              {/* Option 2: Credit Card */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setPaymentMethod('card')}
                style={[
                  styles.optionCard,
                  paymentMethod === 'card'
                    ? { backgroundColor: colors.surfaceLow, borderColor: colors.primary, borderWidth: 1 }
                    : { backgroundColor: colors.surfaceLow, borderColor: 'transparent', borderWidth: 1 },
                ]}
              >
                <View style={styles.optionLeft}>
                  <View style={[styles.radioCircle, paymentMethod === 'card' && { borderColor: colors.primary }]}>
                    {paymentMethod === 'card' && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
                  </View>
                  <Icon name="credit_card" size={20} color={colors.primary} style={{ marginStart: 10 }} />
                  <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700', marginStart: 6 }]}>
                    {isRTL ? 'بطاقة مصرفية / ائتمانية' : 'Credit / Debit Card'}
                  </Text>
                </View>
                <View style={styles.cardBrands}>
                  <Text style={[typography.labelSm, styles.brandPill, { backgroundColor: colors.surfaceHigh }]}>VISA</Text>
                  <Text style={[typography.labelSm, styles.brandPill, { backgroundColor: colors.surfaceHigh }]}>MC</Text>
                </View>
              </TouchableOpacity>

              {/* Option 3: Digital Wallet */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setPaymentMethod('wallet')}
                style={[
                  styles.optionCard,
                  paymentMethod === 'wallet'
                    ? { backgroundColor: colors.surfaceLow, borderColor: colors.primary, borderWidth: 1 }
                    : { backgroundColor: colors.surfaceLow, borderColor: 'transparent', borderWidth: 1 },
                ]}
              >
                <View style={styles.optionLeft}>
                  <View style={[styles.radioCircle, paymentMethod === 'wallet' && { borderColor: colors.primary }]}>
                    {paymentMethod === 'wallet' && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
                  </View>
                  <Icon name="contactless" size={20} color={colors.primary} style={{ marginStart: 10 }} />
                  <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700', marginStart: 6 }]}>
                    {isRTL ? 'محفظة إلكترونية (سداد / تداول)' : 'Digital Wallet'}
                  </Text>
                </View>
                <Icon name={isRTL ? 'arrow_back' : 'arrow_forward'} size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 6. Section 4: Routine Auto-Refill Delight Box */}
        <View style={styles.sectionWrap}>
          <View style={[styles.autoRefillCard, { backgroundColor: colors.surfaceLow }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setAutoRefill(!autoRefill)}
              style={styles.autoRefillHeader}
            >
              <View style={[styles.checkbox, autoRefill && { backgroundColor: colors.primary }]}>
                {autoRefill && <Icon name="check" size={14} color={colors.surface} />}
              </View>
              <View style={{ marginStart: 10, flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[typography.labelLg, { color: colors.text, fontWeight: '700' }]}>
                    {isRTL ? 'التجديد التلقائي لروتين الملاذ' : 'Sanctuary Routine Auto-Refill'}
                  </Text>
                  <View style={[styles.ecoTag, { backgroundColor: colors.accent, marginStart: 6 }]}>
                    <Text style={[typography.labelSm, { color: colors.primary, fontSize: 9, fontWeight: '700' }]}>Save 15%</Text>
                  </View>
                </View>
                <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 11, marginTop: 2, lineHeight: 16 }]}>
                  {isRTL
                    ? 'اشترك في إعادة تزويد زيت ميرمية الغابة تلقائياً كل 60 يوماً. يمكنك الإلغاء بلمسة واحدة.'
                    : 'Subscribe to Forest Sage oil replenishment delivered automatically every 60 days. Cancel or pause anytime with one touch.'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Micro Product Preview */}
            <View style={[styles.refillProductRow, { backgroundColor: colors.surface }]}>
              <View style={[styles.refillThumbWrap, { backgroundColor: colors.surfaceLow }]}>
                <Image
                  source={require('../../assets/photos/oil-forest-sage.png')}
                  style={styles.refillThumb}
                  resizeMode="contain"
                />
              </View>
              <View style={{ marginStart: 10, flex: 1 }}>
                <Text numberOfLines={1} style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>
                  {isRTL ? 'خلاصة ميرمية الغابة (30 مل)' : 'Forest Sage Essence (30ml)'}
                </Text>
                <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 10 }]}>
                  {isRTL ? 'سرو · أعشاب · مطر' : 'Cypress · Herbaceous · Rain'}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[typography.bodySm, { color: colors.textMuted, textDecorationLine: 'line-through', fontSize: 11 }]}>
                  $45.00
                </Text>
                <Text style={[typography.labelMd, { color: colors.primary, fontWeight: '700' }]}>
                  $38.25
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 7. Section 5: Order Summary */}
        <View style={styles.sectionWrap}>
          <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
            <View style={styles.cardHeaderRow}>
              <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '700' }]}>
                {isRTL ? 'ملخص الطلب' : 'Order Summary'}
              </Text>
              <Text style={[typography.labelSm, { color: colors.textMuted, textTransform: 'uppercase' }]}>
                {isRTL ? '3 عناصر' : '3 Elements'}
              </Text>
            </View>

            <View style={styles.summaryList}>
              <View style={styles.summaryRow}>
                <Text style={[typography.bodyMd, { color: colors.textMuted }]}>
                  {isRTL ? 'المجموع الفرعي (موزع + 2 زيوت)' : 'Subtotal (Odora Vessel + 2 Oils)'}
                </Text>
                <Text style={[typography.bodyMd, { color: colors.text, fontWeight: '600' }]}>$334.00</Text>
              </View>

              <View style={styles.summaryRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[typography.bodyMd, { color: colors.primary }]}>
                    {isRTL ? 'رمز ترحيب الأجواء' : 'Atmosphere Welcome Code'}
                  </Text>
                  <View style={[styles.couponCodePill, { backgroundColor: colors.surfaceLow }]}>
                    <Text style={[typography.labelSm, { color: colors.text, fontSize: 10, fontWeight: '700' }]}>ODORA10</Text>
                  </View>
                </View>
                <Text style={[typography.bodyMd, { color: colors.primary, fontWeight: '700' }]}>-$10.00</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={[typography.bodyMd, { color: colors.textMuted }]}>
                  {isRTL ? 'الشحن السريع' : 'Express Courier'}
                </Text>
                <Text style={[typography.bodyMd, { color: colors.primary, fontWeight: '700' }]}>
                  {shippingExtra === 0 ? (isRTL ? 'مجاني' : 'Complimentary') : `+$${shippingExtra.toFixed(2)}`}
                </Text>
              </View>

              <View style={[styles.summaryDivider, { backgroundColor: colors.surfaceLow }]} />

              <View style={styles.totalRow}>
                <View>
                  <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '700' }]}>
                    {isRTL ? 'الإجمالي المستحق' : 'Total Payable'}
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 11 }]}>
                    {isRTL ? 'شامل كافة الرسوم' : 'All applicable taxes included'}
                  </Text>
                </View>
                <Text style={[typography.headlineLg, { color: colors.text, fontWeight: '700' }]}>
                  ${finalTotal.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 8. Fixed Bottom Place Order Action Bar */}
      <View style={[styles.fixedBottomBar, { backgroundColor: colors.surface, borderTopColor: colors.surfaceLow }]}>
        <View style={styles.bottomBarContainer}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => navigation.navigate('OrderConfirmation')}
            style={[styles.placeOrderBtn, { backgroundColor: colors.ink }]}
          >
            <View style={styles.btnLeftGroup}>
              <Icon name="shield" size={18} color={colors.accent} />
              <Text style={[typography.labelLg, { color: colors.onInk, fontWeight: '700', marginStart: 8 }]}>
                {isRTL ? 'تأكيد الطلب' : 'Place Order'}
              </Text>
            </View>
            <Text style={[typography.labelLg, { color: colors.accent, fontWeight: '700' }]}>
              ${finalTotal.toFixed(2)}
            </Text>
          </TouchableOpacity>

          <View style={styles.trustNoteRow}>
            <Icon name="verified_user" size={13} color={colors.primary} />
            <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 10, marginStart: 4 }]}>
              {isRTL ? 'دفع آمن • ضمان استرجاع لمدة 30 يوماً' : '256-Bit Encrypted • 30-Day Ritual Return Guarantee'}
            </Text>
          </View>
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
  stepperContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  stepperCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircleDone: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleInactive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDivider: {
    width: 24,
    height: 2,
    borderRadius: 1,
  },
  sectionWrap: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  sectionCard: {
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressContent: {
    marginStart: 28,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#76786e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ecoTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginStart: 6,
  },
  encryptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cardBrands: {
    flexDirection: 'row',
    gap: 4,
  },
  brandPill: {
    fontSize: 9,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  autoRefillCard: {
    borderRadius: 20,
    padding: 16,
  },
  autoRefillHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#76786e',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  refillProductRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    marginTop: 12,
  },
  refillThumbWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refillThumb: {
    width: '80%',
    height: '80%',
  },
  summaryList: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  couponCodePill: {
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
  bottomBarContainer: {
    alignItems: 'center',
  },
  placeOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 52,
    borderRadius: 26,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  btnLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
});
