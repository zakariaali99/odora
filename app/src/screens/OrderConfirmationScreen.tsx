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

interface OrderConfirmationScreenProps {
  navigation: any;
  route?: {
    params?: {
      orderId?: string;
    };
  };
}

export const OrderConfirmationScreen: React.FC<OrderConfirmationScreenProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const { colors, typography, radii, spacing, isRTL } = useTheme();

  const [copied, setCopied] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(true);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* 1. Header (64pt, Close button + Title + Receipt action) */}
      <AppBar
        leading={
          <View style={styles.appBarLeading}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Home')}
              style={styles.backButton}
            >
              <Icon name="close" size={20} color={colors.text} />
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
              {isRTL ? 'أودورا — تأكيد الطلب' : 'Odora — Order Confirmation'}
            </Text>
          </View>
        }
        actions={[
          {
            icon: 'receipt_long',
            onPress: () => {},
            label: 'Receipt',
          },
        ]}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 2. Hero Celebration & Ambient Joy */}
        <View style={styles.celebrationSection}>
          <View style={styles.radiatingCirclesWrap}>
            <View style={[styles.outerGlowRing, { backgroundColor: colors.accent }]} />
            <View style={[styles.innerCirclePulse, { backgroundColor: colors.surfaceHigh }]} />
            <View style={[styles.ecoIconCircle, { backgroundColor: colors.primary }]}>
              <Icon name="eco" size={36} color={colors.surface} />
            </View>
            <Text style={[styles.sparkleOne, { color: colors.primary }]}>✦</Text>
            <Text style={[styles.sparkleTwo, { color: colors.primary }]}>✦</Text>
          </View>

          <View style={[styles.confirmedBadge, { backgroundColor: colors.accent }]}>
            <Icon name="verified" size={14} color={colors.primary} />
            <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700', textTransform: 'uppercase', marginStart: 4 }]}>
              {isRTL ? 'محجوز ومؤكد' : 'Reserved & Confirmed'}
            </Text>
          </View>

          <Text style={[typography.headlineLg, { color: colors.text, fontWeight: '600', textAlign: 'center', marginTop: 10 }]}>
            {isRTL ? 'ملاذك الهادئ في طريقه إليك.' : 'Your sanctuary is on the way.'}
          </Text>

          <Text style={[typography.bodyMd, { color: colors.textMuted, textAlign: 'center', marginTop: 6, lineHeight: 22, maxWidth: 320 }]}>
            {isRTL
              ? 'شكراً لك. نحن نجهز باقة الموزع النباتية بعناية فائقة لتصل إلى باب منزلك.'
              : 'Thank you, Julian. We are preparing your curated botanical diffuser package with utmost care.'}
          </Text>

          {/* Order Reference Chip with Copy Feedback */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleCopy}
            style={[styles.orderChip, { backgroundColor: colors.surfaceLow }]}
          >
            <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600' }]}>
              Order #OD-89421
            </Text>
            <Text style={{ color: colors.textMuted, marginHorizontal: 6 }}>·</Text>
            <Text style={[typography.bodySm, { color: colors.textMuted }]}>
              {isRTL ? 'اليوم في 19:42' : 'Today at 19:42'}
            </Text>
            <Icon
              name={copied ? 'check' : 'content_copy'}
              size={15}
              color={copied ? colors.primary : colors.textMuted}
              style={{ marginStart: 6 }}
            />
            {copied && (
              <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700', marginStart: 4 }]}>
                {isRTL ? 'تم النسخ!' : 'Copied!'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 3. Visual Hardware Anchor Hero Card */}
        <View style={styles.hardwareHeroSection}>
          <View style={[styles.hardwareHeroCard, { backgroundColor: colors.surfaceLow }]}>
            <Image
              source={require('../../assets/photos/diffuser_sage_livingroom.png')}
              style={styles.hardwareHeroImage}
              resizeMode="cover"
            />
            <View style={styles.hardwareHeroOverlay}>
              <View style={[styles.batchPill, { backgroundColor: 'rgba(255,255,255,0.92)' }]}>
                <View style={[styles.pulseDot, { backgroundColor: colors.primary }]} />
                <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600' }]}>
                  Batch No. OD-SAGE-718
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 4. Live Delivery Timeline Card */}
        <View style={styles.timelineSection}>
          <Card surface="low" style={styles.timelineCard}>
            <View style={styles.timelineHeader}>
              <View>
                <Text style={[typography.labelSm, { color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 }]}>
                  {isRTL ? 'الموعد التقديري للوصول' : 'Estimated Arrival'}
                </Text>
                <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '700', marginTop: 2 }]}>
                  {isRTL ? 'غداً، 24 أكتوبر' : 'Tomorrow, Oct 24'}
                </Text>
                <Text style={[typography.bodySm, { color: colors.primary, fontWeight: '600' }]}>
                  {isRTL ? 'بحلول الساعة 4:00 مساءً' : 'by 4:00 PM'}
                </Text>
              </View>
              <View style={[styles.courierIconWrap, { backgroundColor: colors.accent }]}>
                <Icon name="local_shipping" size={20} color={colors.primary} />
              </View>
            </View>

            <View style={[styles.courierMetaRow, { backgroundColor: colors.surface }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="nest_eco_leaf" size={16} color={colors.primary} />
                <Text style={[typography.bodySm, { color: colors.text, fontWeight: '600', marginStart: 6 }]}>
                  Odora Eco-Express
                </Text>
              </View>
              <Text style={[typography.labelSm, { color: colors.textMuted }]}>TIP-984210</Text>
            </View>

            {/* Stepped Progress Tracker */}
            <View style={styles.stepsVerticalWrap}>
              {/* Vertical connecting line */}
              <View style={[styles.verticalConnectingLine, { backgroundColor: colors.surfaceHigh }]} />

              {/* Step 1: Placed */}
              <View style={styles.stepVerticalRow}>
                <View style={[styles.stepIconDot, { backgroundColor: colors.primary }]}>
                  <Icon name="check" size={14} color={colors.surface} />
                </View>
                <View style={styles.stepVerticalContent}>
                  <View style={styles.stepTitleRow}>
                    <Text style={[typography.labelLg, { color: colors.text, fontWeight: '700' }]}>
                      {isRTL ? 'تم تسجيل الطلب' : 'Order Placed'}
                    </Text>
                    <Text style={[typography.bodySm, { color: colors.textMuted }]}>19:42</Text>
                  </View>
                  <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 11, marginTop: 1 }]}>
                    {isRTL ? 'تم تأكيد الدفع وتخصيص المخزون.' : 'Payment confirmed & inventory allocated.'}
                  </Text>
                </View>
              </View>

              {/* Step 2: Active Preparation */}
              <View style={styles.stepVerticalRow}>
                <View style={[styles.stepIconDot, { backgroundColor: colors.accent }]}>
                  <View style={[styles.pulsePingDot, { backgroundColor: colors.primary }]} />
                </View>
                <View style={styles.stepVerticalContent}>
                  <View style={styles.stepTitleRow}>
                    <Text style={[typography.labelLg, { color: colors.primary, fontWeight: '700' }]}>
                      {isRTL ? 'التحضير اليدوي وضبط الجودة' : 'Artisanal Preparation & Scent QC'}
                    </Text>
                    <View style={[styles.activeTag, { backgroundColor: colors.accent }]}>
                      <Text style={[typography.labelSm, { color: colors.primary, fontSize: 9, fontWeight: '700' }]}>Active</Text>
                    </View>
                  </View>
                  <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 11, marginTop: 1 }]}>
                    {isRTL
                      ? 'عصر الخلاصات النباتية وإجراء معايرة توازن محول الرذاذ.'
                      : 'Cold-pressing botanical oils and performing mist transducer balance checks.'}
                  </Text>
                </View>
              </View>

              {/* Step 3: Courier Dispatched */}
              <View style={styles.stepVerticalRow}>
                <View style={[styles.stepIconDot, { backgroundColor: colors.surfaceHigh }]}>
                  <View style={[styles.stepDotInner, { backgroundColor: colors.textMuted }]} />
                </View>
                <View style={styles.stepVerticalContent}>
                  <View style={styles.stepTitleRow}>
                    <Text style={[typography.labelLg, { color: colors.textMuted, fontWeight: '600' }]}>
                      {isRTL ? 'تم التسليم لشركة الشحن' : 'Dispatched via Courier'}
                    </Text>
                    <Text style={[typography.bodySm, { color: colors.textMuted }]}>
                      {isRTL ? 'قيد الانتظار' : 'Pending'}
                    </Text>
                  </View>
                  <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 11, marginTop: 1 }]}>
                    {isRTL ? 'موعد استلام المندوب المحدد: 08:30 صباحاً.' : 'Courier collection scheduled for 08:30 AM.'}
                  </Text>
                </View>
              </View>

              {/* Step 4: Delivered */}
              <View style={styles.stepVerticalRow}>
                <View style={[styles.stepIconDot, { backgroundColor: colors.surfaceHigh }]}>
                  <View style={[styles.stepDotInner, { backgroundColor: colors.textMuted }]} />
                </View>
                <View style={styles.stepVerticalContent}>
                  <View style={styles.stepTitleRow}>
                    <Text style={[typography.labelLg, { color: colors.textMuted, fontWeight: '600' }]}>
                      {isRTL ? 'التسليم في الملاذ' : 'Delivered to Sanctuary'}
                    </Text>
                    <Text style={[typography.bodySm, { color: colors.textMuted }]}>16:00</Text>
                  </View>
                  <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 11, marginTop: 1 }]}>
                    {isRTL ? 'التسليم في حي الأندلس، طرابلس.' : 'Handover at Villa 42, Jumeirah 2, Dubai.'}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* 5. Curated Package Summary (Interactive Accordion) */}
        <View style={styles.accordionSection}>
          <View style={[styles.accordionCard, { backgroundColor: colors.surface }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setAccordionOpen(!accordionOpen)}
              style={styles.accordionHeader}
            >
              <View style={styles.accordionHeaderLeft}>
                <View style={[styles.inventoryIconBox, { backgroundColor: colors.surfaceLow }]}>
                  <Icon name="inventory_2" size={22} color={colors.primary} />
                </View>
                <View style={{ marginStart: 12 }}>
                  <Text style={[typography.labelLg, { color: colors.text, fontWeight: '700' }]}>
                    {isRTL ? 'الباقة المختارة' : 'Curated Package'}
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 11 }]}>
                    {isRTL ? '3 عناصر · انقر لمعاينة التفاصيل' : '3 items · Tap to inspect details'}
                  </Text>
                </View>
              </View>
              <Icon
                name={accordionOpen ? 'expand_less' : 'expand_more'}
                size={22}
                color={colors.textMuted}
              />
            </TouchableOpacity>

            {accordionOpen && (
              <View style={styles.accordionContent}>
                {/* Item 1 */}
                <View style={[styles.accordionItemRow, { backgroundColor: colors.surfaceLow }]}>
                  <View style={styles.accordionItemLeft}>
                    <Image
                      source={require('../../assets/photos/diffuser-sage-clean.png')}
                      style={styles.accordionThumb}
                      resizeMode="contain"
                    />
                    <View style={{ marginStart: 10 }}>
                      <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>
                        Odora Air 01
                      </Text>
                      <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 10 }]}>
                        {isRTL ? 'أخضر ميرمية معتم · تفتيت بارد' : 'Matte Sage Green · Ultrasonic'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>$220.00</Text>
                </View>

                {/* Item 2 */}
                <View style={[styles.accordionItemRow, { backgroundColor: colors.surfaceLow }]}>
                  <View style={styles.accordionItemLeft}>
                    <Image
                      source={require('../../assets/photos/oil-forest-sage.png')}
                      style={styles.accordionThumb}
                      resizeMode="contain"
                    />
                    <View style={{ marginStart: 10 }}>
                      <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>
                        {isRTL ? 'خلاصة ميرمية الغابة' : 'Forest Sage Essence'}
                      </Text>
                      <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 10 }]}>
                        {isRTL ? 'زجاج كهرماني 30 مل · العدد: 2' : '30ml Amber Glass · Qty: 2'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>$64.00</Text>
                </View>

                {/* Item 3 */}
                <View style={[styles.accordionItemRow, { backgroundColor: colors.surfaceLow }]}>
                  <View style={styles.accordionItemLeft}>
                    <Image
                      source={require('../../assets/photos/diffuser-white-clean.png')}
                      style={styles.accordionThumb}
                      resizeMode="contain"
                    />
                    <View style={{ marginStart: 10 }}>
                      <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>
                        {isRTL ? 'قاعدة ترافيرتين منحوتة' : 'Carved Travertine Stand'}
                      </Text>
                      <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 10 }]}>
                        {isRTL ? 'حجر طبيعي مسنفر' : 'Honed Natural Stone'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>$40.00</Text>
                </View>

                {/* Summary Info */}
                <View style={[styles.accordionSummaryBox, { backgroundColor: colors.surfaceLow }]}>
                  <View style={styles.accordionSummaryRow}>
                    <Text style={[typography.bodySm, { color: colors.textMuted }]}>{isRTL ? 'طريقة الدفع' : 'Payment Method'}</Text>
                    <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600' }]}>{isRTL ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</Text>
                  </View>
                  <View style={styles.accordionSummaryRow}>
                    <Text style={[typography.bodySm, { color: colors.textMuted }]}>{isRTL ? 'وجهة التسليم' : 'Destination'}</Text>
                    <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600' }]}>
                      {isRTL ? 'حي الأندلس، طرابلس' : 'Villa 42, Jumeirah 2, Dubai'}
                    </Text>
                  </View>
                  <View style={[styles.accordionSummaryRow, { borderTopWidth: 1, borderTopColor: colors.surfaceHigh, paddingTop: 6 }]}>
                    <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>{isRTL ? 'إجمالي الطلب' : 'Total Order Amount'}</Text>
                    <Text style={[typography.labelLg, { color: colors.text, fontWeight: '700' }]}>$324.00</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* 6. Delight Helper Card: Setup Preparation */}
        <View style={styles.helperSection}>
          <View style={[styles.helperCard, { backgroundColor: colors.accent }]}>
            <View style={[styles.helperIconCircle, { backgroundColor: colors.surface }]}>
              <Icon name="tips_and_updates" size={20} color={colors.primary} />
            </View>
            <View style={{ marginStart: 12, flex: 1 }}>
              <Text style={[typography.labelLg, { color: colors.text, fontWeight: '700' }]}>
                {isRTL ? 'جهّز الموزع للإقران السلس' : 'Prepare Diffuser for Pairing'}
              </Text>
              <Text style={[typography.bodySm, { color: colors.textMuted, fontSize: 11, marginTop: 2, lineHeight: 16 }]}>
                {isRTL
                  ? 'تعرّف على جدولة الأجواء وتحميل خراطيش الزيت بينما شحنتك في الطريق.'
                  : 'Familiarize yourself with ambient scheduling and chamber loading while your parcel is in transit.'}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('DevicePairing')}
                style={styles.guideLink}
              >
                <Text style={[typography.labelMd, { color: colors.primary, fontWeight: '700' }]}>
                  {isRTL ? 'قراءة دليل الإعداد السريع' : 'Read Quick Setup Guide'}
                </Text>
                <Icon name={isRTL ? 'arrow_back' : 'arrow_forward'} size={14} color={colors.primary} style={{ marginStart: 4 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 7. Final Sticky-Style Pill Actions */}
        <View style={styles.finalActionsSection}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => {}}
            style={[styles.pushAlertsBtn, { backgroundColor: colors.ink }]}
          >
            <Icon name="notifications_active" size={18} color={colors.onInk} />
            <Text style={[typography.labelLg, { color: colors.onInk, fontWeight: '700', marginStart: 8 }]}>
              {isRTL ? 'تفعيل إشعارات وصول الشحنة' : 'Enable Arrival Push Alerts'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Home')}
            style={[styles.returnHomeBtn, { backgroundColor: colors.surfaceLow }]}
          >
            <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700' }]}>
              {isRTL ? 'العودة للوحة التحكم' : 'Return to Dashboard'}
            </Text>
          </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 40,
  },
  celebrationSection: {
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 16,
  },
  radiatingCirclesWrap: {
    width: 104,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 12,
  },
  outerGlowRing: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 52,
    opacity: 0.5,
  },
  innerCirclePulse: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 43,
  },
  ecoIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(88,98,68,0.35)',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 3,
  },
  sparkleOne: {
    position: 'absolute',
    top: 4,
    end: 8,
    fontSize: 14,
  },
  sparkleTwo: {
    position: 'absolute',
    bottom: 8,
    start: 6,
    fontSize: 12,
  },
  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  orderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 14,
  },
  hardwareHeroSection: {
    paddingHorizontal: 20,
    marginTop: 18,
  },
  hardwareHeroCard: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  hardwareHeroImage: {
    width: '100%',
    height: '100%',
  },
  hardwareHeroOverlay: {
    position: 'absolute',
    bottom: 12,
    start: 12,
  },
  batchPill: {
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
  timelineSection: {
    paddingHorizontal: 20,
    marginTop: 18,
  },
  timelineCard: {
    borderRadius: 20,
    padding: 18,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  courierIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courierMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 16,
  },
  stepsVerticalWrap: {
    position: 'relative',
    paddingStart: 4,
  },
  verticalConnectingLine: {
    position: 'absolute',
    start: 15,
    top: 14,
    bottom: 14,
    width: 2,
  },
  stepVerticalRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  stepIconDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  stepDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pulsePingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepVerticalContent: {
    marginStart: 12,
    flex: 1,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  accordionSection: {
    paddingHorizontal: 20,
    marginTop: 18,
  },
  accordionCard: {
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inventoryIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accordionContent: {
    marginTop: 14,
    gap: 8,
  },
  accordionItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 12,
  },
  accordionItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accordionThumb: {
    width: 38,
    height: 38,
  },
  accordionSummaryBox: {
    padding: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 4,
  },
  accordionSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  helperSection: {
    paddingHorizontal: 20,
    marginTop: 18,
  },
  helperCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 20,
  },
  helperIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  finalActionsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 10,
  },
  pushAlertsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  returnHomeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 23,
  },
});
