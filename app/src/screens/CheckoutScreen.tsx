import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Tag,
  AlertCircle,
  MapPin,
  Phone,
  User,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, typography, spacing, radii } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { useCartStore } from '../store/useCartStore';
import { api } from '../services/api';

interface CheckoutScreenProps {
  navigation: any;
}

const LIBYAN_CITIES = [
  'طرابلس (Tripoli)',
  'بنغازي (Benghazi)',
  'مصراتة (Misrata)',
  'الزاوية (Zawiya)',
  'زليتن (Zliten)',
  'الخمس (Khoms)',
  'سبها (Sabha)',
  'صبراتة (Sabratha)',
  'غريان (Gharyan)',
  'البيضاء (Bayda)',
  'طبرق (Tobruk)',
  'سرت (Sirte)',
];

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { language, isRTL } = useAppStore();
  const { cart, clearCart } = useCartStore();

  const fontFam =
    language === 'ar'
      ? typography.fontFamily.ar
      : typography.fontFamily.en;

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingCity, setShippingCity] = useState(LIBYAN_CITIES[0]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponSuccess, setCouponSuccess] = useState('');
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  const subtotal = Number(cart.subtotal || 0);
  const deliveryFee = subtotal >= 300 || subtotal === 0 ? 0 : 15.0;
  const finalTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await api.validateCoupon(couponCode.trim(), subtotal);
      if (res && res.valid) {
        const discount = Number(res.discount_amount || 0);
        setDiscountAmount(discount);
        setCouponSuccess(
          language === 'ar'
            ? `تم تطبيق الخصم بنجاح (-${discount.toFixed(2)} د.ل)`
            : `Coupon applied (-${discount.toFixed(2)} LYD)`
        );
      } else {
        setCouponError(res?.message || (language === 'ar' ? 'كوبون غير صالح' : 'Invalid coupon'));
      }
    } catch (err: any) {
      setCouponError(language === 'ar' ? 'كود الخصم غير صالح أو منتهي الصلاحية' : 'Invalid coupon code');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handlePlaceOrder = async () => {
    setFormError('');

    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setFormError(
        language === 'ar'
          ? 'يرجى تعبئة الاسم ورقم الهاتف والعنوان بالتفصيل'
          : 'Please enter your name, phone, and address'
      );
      return;
    }

    setSubmitting(true);
    try {
      const cleanCity = shippingCity.split(' ')[0];
      const res = await api.checkout({
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_email: customerEmail.trim() || undefined,
        shipping_city: cleanCity,
        shipping_address: shippingAddress.trim(),
        payment_method: 'cod',
        coupon_code: discountAmount > 0 ? couponCode.trim() : undefined,
        notes: notes.trim() || undefined,
      });

      if (res && res.order_number) {
        setPlacedOrder(res);
        await clearCart();
      } else {
        setFormError(language === 'ar' ? 'حدث خطأ أثناء إنشاء الطلب' : 'Failed to create order');
      }
    } catch (err: any) {
      console.warn('Checkout error', err);
      setFormError(
        err?.message || (language === 'ar' ? 'تعذر إتمام الطلب، تأكد من اتصال الإنترنت' : 'Checkout failed')
      );
    } finally {
      setSubmitting(false);
    }
  };

  // If order was successfully placed, render Order Confirmation View
  if (placedOrder) {
    return (
      <ScreenContainer>
        <Header showBack={false} rightAction="none" />
        <View style={styles.successContent}>
          <View style={styles.successIconWrap}>
            <CheckCircle2 size={44} color={colors.brandSage} />
          </View>

          <Text style={[styles.successTitle, { fontFamily: fontFam.bold }]}>
            {language === 'ar' ? 'تم تأكيد طلبك بنجاح!' : 'Order Placed Successfully!'}
          </Text>

          <View style={styles.orderNumberBadge}>
            <Text style={styles.orderNumberText}>
              #{placedOrder.order_number}
            </Text>
          </View>

          <Text style={[styles.successSubtitle, { fontFamily: fontFam.regular }]}>
            {language === 'ar'
              ? `شكراً لك ${placedOrder.customer_name}. تم استلام طلبك وسيتم التواصل معك على الرقم ${placedOrder.customer_phone} لتسليم الشحنة في ${placedOrder.shipping_city}.`
              : `Thank you. Your order #${placedOrder.order_number} has been received and will be delivered to ${placedOrder.shipping_city}.`}
          </Text>

          <Card variant="surface" elevation="card" style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { fontFamily: fontFam.regular }]}>
                {language === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'}
              </Text>
              <Text style={[styles.summaryVal, { fontFamily: fontFam.medium }]}>
                {language === 'ar' ? 'الدفع عند الاستلام (COD)' : 'Cash on Delivery'}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { fontFamily: fontFam.regular }]}>
                {language === 'ar' ? 'الإجمالي المطلوب:' : 'Total Amount:'}
              </Text>
              <Text style={[styles.summaryTotal, { fontFamily: fontFam.bold }]}>
                {Number(placedOrder.total_amount).toFixed(2)} {t('store.currency')}
              </Text>
            </View>
          </Card>

          <View style={styles.successActions}>
            <Button
              title={language === 'ar' ? 'العودة للرئيسية' : 'Return Home'}
              onPress={() => navigation.navigate('Home')}
              variant="dark"
              size="lg"
            />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header
        showBack={true}
        onBack={() => navigation.goBack()}
        rightAction="none"
      />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { fontFamily: fontFam.medium }]}>
            {language === 'ar' ? 'إتمام الشراء وتأكيد التوصيل' : 'Checkout & Delivery'}
          </Text>
          <Text style={[styles.subtitle, { fontFamily: fontFam.regular }]}>
            {language === 'ar'
              ? 'توصيل سريع لكافة المدن الليبية مع الدفع عند الاستلام'
              : 'Fast delivery across Libyan cities with Cash on Delivery'}
          </Text>
        </View>

        {formError ? (
          <View style={styles.errorAlert}>
            <AlertCircle size={16} color={colors.dangerRed} />
            <Text style={[styles.errorText, { fontFamily: fontFam.medium }]}>{formError}</Text>
          </View>
        ) : null}

        {/* Customer Information Card */}
        <Card variant="surface" elevation="card" style={styles.formCard}>
          <View style={styles.cardHeader}>
            <User size={18} color={colors.brandSage} />
            <Text style={[styles.cardTitle, { fontFamily: fontFam.bold }]}>
              {language === 'ar' ? '1. بيانات المستلم' : '1. Recipient Info'}
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { fontFamily: fontFam.medium }]}>
              {language === 'ar' ? 'الاسم بالكامل *' : 'Full Name *'}
            </Text>
            <TextInput
              style={[styles.input, { fontFamily: fontFam.regular }]}
              value={customerName}
              onChangeText={setCustomerName}
              placeholder={language === 'ar' ? 'مثال: محمد الفيتوري' : 'e.g. John Doe'}
              placeholderTextColor={colors.inkLight}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { fontFamily: fontFam.medium }]}>
              {language === 'ar' ? 'رقم الهاتف (ليبي) *' : 'Phone Number (Libya) *'}
            </Text>
            <TextInput
              style={[styles.input, { fontFamily: fontFam.regular }]}
              value={customerPhone}
              onChangeText={setCustomerPhone}
              placeholder="091 234 5678"
              keyboardType="phone-pad"
              placeholderTextColor={colors.inkLight}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { fontFamily: fontFam.medium }]}>
              {language === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Email Address (Optional)'}
            </Text>
            <TextInput
              style={[styles.input, { fontFamily: fontFam.regular }]}
              value={customerEmail}
              onChangeText={setCustomerEmail}
              placeholder="example@mail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.inkLight}
            />
          </View>
        </Card>

        {/* Shipping Address Card */}
        <Card variant="surface" elevation="card" style={styles.formCard}>
          <View style={styles.cardHeader}>
            <MapPin size={18} color={colors.brandSage} />
            <Text style={[styles.cardTitle, { fontFamily: fontFam.bold }]}>
              {language === 'ar' ? '2. عنوان التوصيل في ليبيا' : '2. Libyan Delivery Address'}
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { fontFamily: fontFam.medium }]}>
              {language === 'ar' ? 'المدينة' : 'City'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cityPickerScroll}>
              {LIBYAN_CITIES.map((city) => {
                const isSelected = shippingCity === city;
                return (
                  <TouchableOpacity
                    key={city}
                    onPress={() => setShippingCity(city)}
                    style={[
                      styles.cityChip,
                      isSelected && styles.cityChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.cityChipText,
                        isSelected && styles.cityChipTextSelected,
                        { fontFamily: fontFam.medium },
                      ]}
                    >
                      {city}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { fontFamily: fontFam.medium }]}>
              {language === 'ar' ? 'العنوان بالتفصيل *' : 'Detailed Address *'}
            </Text>
            <TextInput
              style={[styles.input, styles.textArea, { fontFamily: fontFam.regular }]}
              value={shippingAddress}
              onChangeText={setShippingAddress}
              placeholder={language === 'ar' ? 'الحي، اسم الشارع، معلم بارز بالقرب منك...' : 'Street name, landmark...'}
              placeholderTextColor={colors.inkLight}
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { fontFamily: fontFam.medium }]}>
              {language === 'ar' ? 'ملاحظة للمندوب (اختياري)' : 'Courier Note (Optional)'}
            </Text>
            <TextInput
              style={[styles.input, { fontFamily: fontFam.regular }]}
              value={notes}
              onChangeText={setNotes}
              placeholder={language === 'ar' ? 'مثال: يرجى الاتصال قبل الوصول' : 'e.g. Call before arrival'}
              placeholderTextColor={colors.inkLight}
            />
          </View>
        </Card>

        {/* Promo Coupon Card */}
        <Card variant="surface" elevation="card" style={styles.formCard}>
          <View style={styles.cardHeader}>
            <Tag size={18} color={colors.brandSage} />
            <Text style={[styles.cardTitle, { fontFamily: fontFam.bold }]}>
              {language === 'ar' ? '3. كود الخصم الترويجي' : '3. Discount Coupon'}
            </Text>
          </View>

          {couponSuccess ? (
            <View style={styles.couponSuccessBox}>
              <CheckCircle2 size={14} color={colors.brandOlive} />
              <Text style={styles.couponSuccessText}>{couponSuccess}</Text>
            </View>
          ) : null}

          {couponError ? (
            <View style={styles.couponErrorBox}>
              <AlertCircle size={14} color={colors.dangerRed} />
              <Text style={styles.couponErrorText}>{couponError}</Text>
            </View>
          ) : null}

          <View style={styles.couponInputRow}>
            <TextInput
              style={[styles.couponInput, { fontFamily: fontFam.medium }]}
              value={couponCode}
              onChangeText={setCouponCode}
              placeholder="ODORA10"
              autoCapitalize="characters"
              placeholderTextColor={colors.inkLight}
            />
            <TouchableOpacity
              style={styles.couponApplyBtn}
              onPress={handleApplyCoupon}
              disabled={validatingCoupon}
            >
              {validatingCoupon ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <Text style={[styles.couponApplyText, { fontFamily: fontFam.bold }]}>
                  {language === 'ar' ? 'تطبيق' : 'Apply'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Card>

        {/* Price Breakdown Summary */}
        <Card variant="surface" elevation="card" style={styles.summaryCard}>
          <Text style={[styles.summaryTitle, { fontFamily: fontFam.bold }]}>
            {language === 'ar' ? 'ملخص الطلب والفاتورة' : 'Order Summary'}
          </Text>

          <View style={styles.priceLine}>
            <Text style={[styles.priceLineLabel, { fontFamily: fontFam.regular }]}>
              {language === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}
            </Text>
            <Text style={[styles.priceLineVal, { fontFamily: fontFam.medium }]}>
              {subtotal.toFixed(2)} {t('store.currency')}
            </Text>
          </View>

          <View style={styles.priceLine}>
            <Text style={[styles.priceLineLabel, { fontFamily: fontFam.regular }]}>
              {language === 'ar' ? 'رسوم التوصيل الشاملة:' : 'Shipping Fee:'}
            </Text>
            <Text style={[styles.priceLineVal, { fontFamily: fontFam.medium }]}>
              {deliveryFee === 0 ? (language === 'ar' ? 'مجاني 🚚' : 'Free 🚚') : `${deliveryFee.toFixed(2)} ${t('store.currency')}`}
            </Text>
          </View>

          {discountAmount > 0 && (
            <View style={styles.priceLine}>
              <Text style={[styles.discountLabel, { fontFamily: fontFam.regular }]}>
                {language === 'ar' ? 'خصم الكوبون:' : 'Discount:'}
              </Text>
              <Text style={[styles.discountVal, { fontFamily: fontFam.bold }]}>
                -{discountAmount.toFixed(2)} {t('store.currency')}
              </Text>
            </View>
          )}

          <View style={styles.totalDivider} />

          <View style={styles.priceLineTotal}>
            <Text style={[styles.totalLabel, { fontFamily: fontFam.bold }]}>
              {language === 'ar' ? 'الإجمالي النهائي (عند الاستلام):' : 'Final Total (Cash on Delivery):'}
            </Text>
            <Text style={[styles.totalVal, { fontFamily: fontFam.bold }]}>
              {finalTotal.toFixed(2)} {t('store.currency')}
            </Text>
          </View>

          {/* Place Order CTA */}
          <View style={styles.placeOrderWrap}>
            <Button
              title={
                submitting
                  ? (language === 'ar' ? 'جاري تأكيد الطلب...' : 'Submitting...')
                  : (language === 'ar' ? `تأكيد الطلب الآن (${finalTotal.toFixed(2)} د.ل)` : `Confirm Order (${finalTotal.toFixed(2)} LYD)`)
              }
              onPress={handlePlaceOrder}
              disabled={submitting}
              variant="dark"
              size="lg"
            />
          </View>
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.title2,
    color: colors.inkPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: typography.fontSize.caption,
    color: colors.inkMuted,
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    padding: 12,
    borderRadius: radii.lg,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: 12,
    color: colors.dangerRed,
    flex: 1,
  },
  formCard: {
    marginBottom: spacing.lg,
    padding: spacing.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceMuted,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: typography.fontSize.body,
    color: colors.inkPrimary,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 12,
    color: colors.inkSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.inkPrimary,
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  cityPickerScroll: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  cityChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginRight: 8,
  },
  cityChipSelected: {
    backgroundColor: colors.brandSage,
    borderColor: colors.brandSage,
  },
  cityChipText: {
    fontSize: 11,
    color: colors.inkSecondary,
  },
  cityChipTextSelected: {
    color: colors.surface,
    fontWeight: 'bold',
  },
  couponInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  couponInput: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.inkPrimary,
    textTransform: 'uppercase',
  },
  couponApplyBtn: {
    backgroundColor: colors.brandOlive,
    paddingHorizontal: 18,
    borderRadius: radii.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  couponApplyText: {
    color: colors.surface,
    fontSize: 12,
  },
  couponSuccessBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: radii.md,
    marginBottom: 8,
  },
  couponSuccessText: {
    fontSize: 11,
    color: colors.brandOlive,
    fontWeight: '600',
  },
  couponErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: radii.md,
    marginBottom: 8,
  },
  couponErrorText: {
    fontSize: 11,
    color: colors.dangerRed,
  },
  summaryCard: {
    padding: spacing.xl,
    backgroundColor: '#FCFAF7',
  },
  summaryTitle: {
    fontSize: 14,
    color: colors.inkPrimary,
    marginBottom: spacing.md,
  },
  priceLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLineLabel: {
    fontSize: 12,
    color: colors.inkMuted,
  },
  priceLineVal: {
    fontSize: 12,
    color: colors.inkPrimary,
  },
  discountLabel: {
    fontSize: 12,
    color: colors.brandOlive,
  },
  discountVal: {
    fontSize: 12,
    color: colors.brandOlive,
  },
  totalDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 10,
  },
  priceLineTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  totalLabel: {
    fontSize: 13,
    color: colors.inkPrimary,
  },
  totalVal: {
    fontSize: 16,
    color: colors.brandOlive,
  },
  placeOrderWrap: {
    marginTop: 4,
  },
  successContent: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  successIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.brandPaleGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  successTitle: {
    fontSize: typography.fontSize.title1,
    color: colors.inkPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  orderNumberBadge: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: radii.pill,
    marginBottom: spacing.md,
  },
  orderNumberText: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.brandOlive,
  },
  successSubtitle: {
    fontSize: 12,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.xxl,
  },
  summaryBox: {
    width: '100%',
    padding: spacing.xl,
    marginBottom: spacing.xxl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.inkMuted,
  },
  summaryVal: {
    fontSize: 12,
    color: colors.inkPrimary,
  },
  summaryTotal: {
    fontSize: 14,
    color: colors.brandOlive,
  },
  successActions: {
    width: '100%',
  },
});

export default CheckoutScreen;
