import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { useAppStore } from '../store/useAppStore';
import {
  Icon,
  Button,
  IconButton,
  Chip,
  SegmentedControl,
  Card,
  IntensityGauge,
  PresetChips,
  Slider,
  Toggle,
  ListRow,
  Input,
  StatusPill,
  StatBlock,
  ProductCard,
  QuantityStepper,
  Badge,
  EmptyState,
  Skeleton,
  Banner,
  Toast,
  ConnectionState,
  Sheet,
  LatinText,
} from '../components/ui';

export const DevUiKitScreen: React.FC = () => {
  const { colors, typography, spacing, isDark, radii, elevation } = useTheme();
  const { isRTL, requestLanguageChange, themeMode, setThemeMode } = useAppStore();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const themeParam = params.get('theme');
      const langParam = params.get('lang');
      if (themeParam === 'dark' || themeParam === 'light' || themeParam === 'system') {
        setThemeMode(themeParam as any);
      }
      if (langParam === 'ar' || langParam === 'en') {
        useAppStore.getState().setLanguage(langParam, false);
      }
    }
  }, []);

  // Interactive component states
  const [gaugeValue, setGaugeValue] = useState(5);
  const [sliderValue, setSliderValue] = useState(0.65);
  const [toggleActive, setToggleActive] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState<'continuous' | 'interval'>('interval');
  const [activeChip, setActiveChip] = useState('all');
  const [stepperCount, setStepperCount] = useState(2);
  const [inputText, setInputText] = useState('Odora A316');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const samplePhoto = require('../../assets/photos/diffuser-a316-sage.png');

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* Fixed Sticky Header for Switching Theme & Direction */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
            borderBottomWidth: 1,
            paddingTop: Math.max(insets.top, 12),
            paddingHorizontal: spacing.screenMargin,
            paddingBottom: spacing.sm,
          },
          elevation.e1,
        ]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '700' }]}>
              {isRTL ? 'معاينة نظام التصميم' : 'UI Kit Showcase'}
            </Text>
            <Text style={[typography.labelSm, { color: colors.textSubtle }]}>
              {isRTL ? 'إصدار أودورا 05 — مكونات وتوكنز' : 'Odora 05 Design System · /dev/ui-kit'}
            </Text>
          </View>

          {/* Quick Language Toggle */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => requestLanguageChange(isRTL ? 'en' : 'ar')}
            style={[
              styles.langPill,
              {
                backgroundColor: colors.accent,
                borderRadius: radii.pill,
              },
            ]}
          >
            <Icon name="translate" size={16} color={colors.text} />
            <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600', marginStart: 6 }]}>
              {isRTL ? 'English' : 'العربية'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Theme Mode Segmented Controls */}
        <View style={{ marginTop: spacing.sm }}>
          <SegmentedControl
            options={[
              { value: 'light', label: isRTL ? 'فاتح' : 'Light' },
              { value: 'dark', label: isRTL ? 'داكن' : 'Dark' },
              { value: 'system', label: isRTL ? 'تلقائي' : 'System' },
            ]}
            selected={themeMode}
            onChange={(val) => setThemeMode(val as any)}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: spacing.screenMargin,
            paddingBottom: insets.bottom + 80,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Section: Typography Scale */}
        <SectionHeader title={isRTL ? '١. مقياس الخطوط (Typography)' : '1. Typography Scale'} />
        <Card style={styles.sectionCard}>
          <Text style={[typography.display, { color: colors.text }]}>Display (Outfit 36)</Text>
          <Text style={[typography.headlineLg, { color: colors.text, marginTop: 4 }]}>Headline Lg (Outfit 26)</Text>
          <Text style={[typography.headlineMd, { color: colors.text, marginTop: 4 }]}>Headline Md (Outfit 22)</Text>
          <Text style={[typography.headlineSm, { color: colors.text, marginTop: 4 }]}>Headline Sm (Outfit 18)</Text>
          <Text style={[typography.bodyLg, { color: colors.textMuted, marginTop: 8 }]}>
            Body Lg — Natural cold-air diffusion preserves raw botanical integrity.
          </Text>
          <Text style={[typography.bodyMd, { color: colors.textMuted, marginTop: 4 }]}>
            Body Md — Designed for calming sanctuaries and executive spaces.
          </Text>
          <Text style={[typography.bodySm, { color: colors.textSubtle, marginTop: 4 }]}>
            Body Sm — Micro-mist particles disperse without heat or water.
          </Text>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8, alignItems: 'center' }}>
            <Text style={[typography.labelLg, { color: colors.primary }]}>Label Lg</Text>
            <Text style={[typography.labelMd, { color: colors.textMuted }]}>Label Md</Text>
            <Text style={[typography.labelSm, { color: colors.textSubtle }]}>LABEL SM EYEBROW</Text>
          </View>
        </Card>

        {/* Section: Color Palette Swatches */}
        <SectionHeader title={isRTL ? '٢. لوحة الألوان المعتمدة (Colors)' : '2. Color Swatches'} />
        <Card style={styles.sectionCard}>
          <View style={styles.swatchGrid}>
            <ColorSwatch label="primary" color={colors.primary} />
            <ColorSwatch label="primarySoft" color={colors.primarySoft} />
            <ColorSwatch label="accent" color={colors.accent} textColor={colors.text} />
            <ColorSwatch label="accentStrong" color={colors.accentStrong} textColor={colors.text} />
            <ColorSwatch label="ink" color={colors.ink} textColor={colors.onInk} />
            <ColorSwatch label="surface" color={colors.surface} textColor={colors.text} hasBorder />
            <ColorSwatch label="surfaceMuted" color={colors.surfaceMuted} textColor={colors.text} />
            <ColorSwatch label="success" color={colors.success} />
            <ColorSwatch label="warning" color={colors.warning} />
            <ColorSwatch label="error" color={colors.error} />
          </View>
        </Card>

        {/* Section: Buttons & Icon Buttons */}
        <SectionHeader title={isRTL ? '٣. الأزرار (Buttons & Icon Buttons)' : '3. Buttons & Icon Buttons'} />
        <View style={styles.buttonStack}>
          <Button
            title={isRTL ? 'زر أساسي (Primary)' : 'Primary Button'}
            variant="primary"
            icon="nest_remote"
            onPress={() => setShowToast(true)}
          />
          <Button
            title={isRTL ? 'زر ثانوي (Secondary)' : 'Secondary Button'}
            variant="secondary"
            onPress={() => {}}
          />
          <Button
            title={isRTL ? 'زر ناعم (Soft)' : 'Soft Button'}
            variant="soft"
            onPress={() => {}}
          />
          <Button
            title={isRTL ? 'زر شفاف (Ghost)' : 'Ghost Button'}
            variant="ghost"
            onPress={() => {}}
          />
          <Button
            title="Loading Button"
            variant="primary"
            loading
            onPress={() => {}}
          />

          <View style={styles.iconButtonRow}>
            <IconButton name="power_settings_new" onPress={() => {}} color={colors.primary} />
            <IconButton name="add" onPress={() => {}} />
            <IconButton name="remove" onPress={() => {}} />
            <IconButton name="tune" onPress={() => {}} />
            <IconButton name="settings" onPress={() => {}} />
            <IconButton name="shopping_bag" onPress={() => {}} />
          </View>
        </View>

        {/* Section: Intensity Gauge & Presets */}
        <SectionHeader title={isRTL ? '٤. مقياس الكثافة الذكي (Intensity Gauge)' : '4. Intensity Gauge & Presets'} />
        <Card variant="device" style={{ alignItems: 'center' }}>
          <IntensityGauge
            value={gaugeValue}
            onChange={setGaugeValue}
            caption={isRTL ? 'انتشار ناعم ومثالي' : 'Optimal Scenting'}
          />
          <View style={{ marginTop: spacing.md, width: '100%' }}>
            <PresetChips
              currentValue={gaugeValue}
              onSelect={setGaugeValue}
              hasBurstCapability={true}
            />
          </View>
        </Card>

        {/* Section: Controls (Segmented, Slider, Toggle) */}
        <SectionHeader title={isRTL ? '٥. عناصر التحكم والتبديل (Controls)' : '5. Mode, Slider & Toggle'} />
        <Card style={styles.sectionCard}>
          <Text style={[typography.labelMd, { color: colors.textMuted, marginBottom: 8 }]}>
            {isRTL ? 'وضع الرش (Continuous / Interval):' : 'Diffuser Spray Mode:'}
          </Text>
          <SegmentedControl
            options={[
              { value: 'continuous', label: isRTL ? 'مستمر' : 'Continuous' },
              { value: 'interval', label: isRTL ? 'فترات ذكية' : 'Interval' },
            ]}
            selected={selectedSegment}
            onChange={(v) => setSelectedSegment(v as any)}
          />

          <View style={{ marginTop: spacing.lg }}>
            <Text style={[typography.labelMd, { color: colors.textMuted, marginBottom: 4 }]}>
              {isRTL ? 'مستوى الانزلاق التناظري (Continuous Slider):' : 'Continuous Slider:'} {Math.round(sliderValue * 100)}%
            </Text>
            <Slider value={sliderValue} onChange={setSliderValue} />
          </View>

          <View style={styles.toggleRow}>
            <View>
              <Text style={[typography.bodyMd, { color: colors.text, fontWeight: '600' }]}>
                {isRTL ? 'الجدولة التلقائية' : 'Auto Schedule Routine'}
              </Text>
              <Text style={[typography.bodySm, { color: colors.textMuted }]}>
                {isRTL ? 'يعمل الجهاز تلقائياً حسب المواعيد' : 'Diffuser runs per programmed daily timers'}
              </Text>
            </View>
            <Toggle value={toggleActive} onValueChange={setToggleActive} />
          </View>
        </Card>

        {/* Section: Chips & Filter Badges */}
        <SectionHeader title={isRTL ? '٦. الرقائق والتصنيفات (Chips & Badges)' : '6. Chips & Badges'} />
        <View style={styles.chipsRow}>
          <Chip
            label={isRTL ? 'الكل' : 'All'}
            active={activeChip === 'all'}
            onPress={() => setActiveChip('all')}
            count={6}
          />
          <Chip
            label={isRTL ? 'غرفة المعيشة' : 'Living Room'}
            active={activeChip === 'living'}
            onPress={() => setActiveChip('living')}
            count={2}
          />
          <Chip
            label={isRTL ? 'المكتب' : 'Executive Office'}
            active={activeChip === 'office'}
            onPress={() => setActiveChip('office')}
            count={1}
          />
          <Chip
            label={isRTL ? 'غرفة النوم' : 'Master Bedroom'}
            active={activeChip === 'bedroom'}
            onPress={() => setActiveChip('bedroom')}
          />
        </View>

        <View style={styles.badgeRow}>
          <Badge label={isRTL ? 'نشط الآن' : 'Active'} variant="accent" />
          <Badge label={isRTL ? 'زيت منخفض' : 'Low Oil'} variant="warning" />
          <Badge label={isRTL ? 'خطأ بالاتصال' : 'Error'} variant="error" />
          <Badge label={isRTL ? 'متصل' : 'Connected'} variant="success" />
          <Badge label={isRTL ? 'غير نشط' : 'Standby'} variant="neutral" />
        </View>

        {/* Section: Product Card & Quantity Stepper */}
        <SectionHeader title={isRTL ? '٧. بطاقة المنتج والشراء (Product Card)' : '7. Product Card & Stepper'} />
        <View style={{ flexDirection: 'row', gap: 14 }}>
          <View style={{ flex: 1 }}>
            <ProductCard
              name="Odora A316 Sage"
              category={isRTL ? 'أجهزة التعطير' : 'Diffuser Unit'}
              price={480}
              imageSource={samplePhoto}
              tag="new"
              onPress={() => {}}
              onAddToCart={() => setShowToast(true)}
            />
          </View>
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <Card variant="compact" style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[typography.labelMd, { color: colors.textMuted, marginBottom: 8 }]}>
                {isRTL ? 'تعديل الكمية' : 'Quantity Stepper'}
              </Text>
              <QuantityStepper
                value={stepperCount}
                onDecrease={() => setStepperCount(Math.max(1, stepperCount - 1))}
                onIncrease={() => setStepperCount(stepperCount + 1)}
              />
              <Text style={[typography.bodySm, { color: colors.textSubtle, marginTop: 12 }]}>
                {isRTL ? 'الإجمالي: ' : 'Total: '}
                <Text style={{ fontWeight: '700', color: colors.primary }}>
                  {(stepperCount * 480).toLocaleString()} {isRTL ? 'د.ل' : 'LYD'}
                </Text>
              </Text>
            </Card>
          </View>
        </View>

        {/* Section: Stat Blocks & List Rows */}
        <SectionHeader title={isRTL ? '٨. بطاقات البيانات والقوائم (Stats & List Rows)' : '8. Stat Blocks & List Rows'} />
        <View style={styles.statsRow}>
          <StatBlock
            label={isRTL ? 'مستوى الزيت' : 'Oil Level'}
            value="84%"
            subValue={isRTL ? '(تقديري)' : '(Est.)'}
            icon="water_drop"
            progress={0.84}
          />
          <StatBlock
            label={isRTL ? 'الجدول التالي' : 'Next Routine'}
            value="19:00"
            subValue={isRTL ? 'مسائي' : 'Evening'}
            icon="schedule"
          />
          <StatBlock
            label={isRTL ? 'الكثافة' : 'Intensity'}
            value="Level 5"
            icon="tune"
            progress={0.5}
          />
        </View>

        <Card style={[styles.sectionCard, { paddingVertical: 4, marginTop: spacing.md }]}>
          <ListRow
            title={isRTL ? 'إعدادات الجهاز والروتين' : 'Device Settings & Routines'}
            subtitle={isRTL ? 'أودورا A316 — غرفة المعيشة' : 'Odora A316 — Living Room'}
            icon="tune"
            onPress={() => {}}
          />
          <ListRow
            title={isRTL ? 'اللغة والاتجاه' : 'Language & Region'}
            value={isRTL ? 'العربية' : 'English'}
            icon="translate"
            onPress={() => requestLanguageChange(isRTL ? 'en' : 'ar')}
          />
          <ListRow
            title={isRTL ? 'حذف الجهاز' : 'Forget Device'}
            subtitle={isRTL ? 'إلغاء الاقتران المباشر' : 'Disconnect and remove record'}
            icon="delete_outline"
            destructive
            showDivider={false}
            onPress={() => {}}
          />
        </Card>

        {/* Section: Inputs */}
        <SectionHeader title={isRTL ? '٩. حقول الإدخال (Inputs)' : '9. Input Fields'} />
        <Card style={styles.sectionCard}>
          <Input
            label={isRTL ? 'اسم الجهاز' : 'Device Name'}
            value={inputText}
            onChangeText={setInputText}
            leadingIcon="air"
          />
          <Input
            label={isRTL ? 'البريد الإلكتروني' : 'Email Address'}
            placeholder="name@example.ly"
            leadingIcon="person"
          />
          <Input
            label={isRTL ? 'حقل به خطأ' : 'Input with Error'}
            value="invalid-value"
            error={isRTL ? 'يرجى إدخال رقم هاتف ليبي صحيح (+218)' : 'Please enter a valid Libyan phone (+218)'}
            leadingIcon="error"
          />
        </Card>

        {/* Section: Floating Status Pill */}
        <SectionHeader title={isRTL ? '١٠. كبسولة الحالة العائمة (Status Pill)' : '10. Floating Status Pill'} />
        <View style={{ paddingVertical: 12 }}>
          <StatusPill
            label={isRTL ? 'الجهاز يعطر بنشاط · اضغط للإيقاف' : 'Diffuser active · tap to pause'}
            active={true}
            onPress={() => setShowToast(true)}
          />
        </View>

        {/* Section: Banners */}
        <SectionHeader title={isRTL ? '١١. رسائل التنبيه (Banners)' : '11. Inline Banners'} />
        <View style={{ gap: 10 }}>
          <Banner
            message={isRTL ? 'البلوتوث متصل مباشرة بجهازك دون الحاجة لإنترنت.' : 'Bluetooth connected directly — works completely offline.'}
            variant="info"
          />
          <Banner
            message={isRTL ? 'مستوى الزيت منخفض (أقل من 15٪). نوصي بإعادة الطلب.' : 'Low oil level estimated below 15%. Consider refilling.'}
            variant="warning"
            actionText={isRTL ? 'طلب الآن' : 'Reorder'}
            onAction={() => setShowToast(true)}
          />
          <Banner
            message={isRTL ? 'تعذر العثور على الجهاز في النطاق القريب.' : 'Unable to locate device in immediate Bluetooth proximity.'}
            variant="error"
          />
        </View>

        {/* Section: Connection States */}
        <SectionHeader title={isRTL ? '١٢. حالات الاتصال (Connection States)' : '12. Connection States'} />
        <ConnectionState
          status="bluetooth_off"
          inline
          onAction={() => setShowToast(true)}
        />
        <View style={{ height: 10 }} />
        <ConnectionState
          status="out_of_range"
          inline
          onAction={() => setShowToast(true)}
        />

        {/* Section: Skeletons & Empty State */}
        <SectionHeader title={isRTL ? '١٣. هياكل التحميل والحالات الفارغة (Skeletons & Empty)' : '13. Skeleton & Empty State'} />
        <Card style={[styles.sectionCard, { gap: 10 }]}>
          <Skeleton height={24} width="60%" />
          <Skeleton height={16} width="90%" />
          <Skeleton height={16} width="75%" />
        </Card>

        <EmptyState
          icon="air"
          title={isRTL ? 'لا توجد أجهزة متصلة' : 'No Diffusers Paired'}
          description={isRTL ? 'قم بتشغيل جهاز أودورا واقترب منه للاتصال عبر البلوتوث المباشر.' : 'Power on your Odora unit and bring your phone nearby to pair via Bluetooth.'}
          actionTitle={isRTL ? 'بدء الاقتران' : 'Pair Diffuser'}
          onAction={() => setIsSheetOpen(true)}
        />

        {/* Trigger Sheet Demo */}
        <View style={{ marginTop: spacing.lg }}>
          <Button
            title={isRTL ? 'فتح النافذة السفلية (Open Bottom Sheet)' : 'Open Bottom Sheet Demo'}
            variant="secondary"
            onPress={() => setIsSheetOpen(true)}
          />
        </View>
      </ScrollView>

      {/* Bottom Sheet Demo */}
      <Sheet visible={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
        <View style={{ paddingVertical: spacing.md, alignItems: 'center' }}>
          <Text style={[typography.headlineSm, { color: colors.text, marginBottom: 8 }]}>
            {isRTL ? 'نافذة اختيار الروتين والجدول' : 'Select Scent Routine'}
          </Text>
          <Text style={[typography.bodyMd, { color: colors.textMuted, textAlign: 'center', marginBottom: 20 }]}>
            {isRTL ? 'اختر توقيت التشغيل ونسبة الكثافة المرغوبة للحجرة.' : 'Configure daily start/end misting cadence and work-to-pause ratios.'}
          </Text>
          <Button
            title={isRTL ? 'حفظ وتطبيق على الجهاز' : 'Save Routine to Diffuser'}
            variant="primary"
            onPress={() => setIsSheetOpen(false)}
          />
        </View>
      </Sheet>

      {/* Toast Notification */}
      <Toast
        message={isRTL ? 'تم تنفيذ الإجراء بنجاح' : 'Action completed successfully'}
        visible={showToast}
        onDismiss={() => setShowToast(false)}
      />
    </View>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => {
  const { typography, colors, spacing } = useTheme();
  return (
    <View style={{ marginTop: spacing.xl, marginBottom: spacing.sm }}>
      <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700' }]}>
        {title}
      </Text>
    </View>
  );
};

const ColorSwatch: React.FC<{
  label: string;
  color: string;
  textColor?: string;
  hasBorder?: boolean;
}> = ({ label, color, textColor = '#FFFFFF', hasBorder = false }) => {
  const { radii, colors } = useTheme();
  return (
    <View
      style={[
        styles.swatchItem,
        {
          backgroundColor: color,
          borderRadius: radii.md,
          borderColor: hasBorder ? colors.border : 'transparent',
          borderWidth: hasBorder ? 1 : 0,
        },
      ]}
    >
      <Text style={{ color: textColor, fontSize: 11, fontWeight: '600' }}>
        {label}
      </Text>
      <Text style={{ color: textColor, fontSize: 9, opacity: 0.85 }}>
        {color}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerBar: {
    width: '100%',
    zIndex: 100,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  scrollContent: {
    paddingTop: 12,
  },
  sectionCard: {
    width: '100%',
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  swatchItem: {
    width: '31%',
    height: 52,
    padding: 6,
    justifyContent: 'space-between',
  },
  buttonStack: {
    width: '100%',
    gap: 10,
  },
  iconButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default DevUiKitScreen;
