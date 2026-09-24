import React, { useState, useEffect, useRef } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../theme';
import {
  AppBar,
  Card,
  Icon,
  IntensityGauge,
  PresetChips,
  SegmentedControl,
  Toggle,
  StatusPill,
} from '../components/ui';
import { getDeviceController } from '../device/DeviceController';
import { DeviceState } from '../device/types';

interface DeviceControlScreenProps {
  navigation: any;
  route?: any;
}

export const DeviceControlScreen: React.FC<DeviceControlScreenProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const { colors, typography, radii, spacing, isRTL } = useTheme();
  const insets = useSafeAreaInsets();
  const controller = getDeviceController();

  const [deviceState, setDeviceState] = useState<DeviceState>(
    controller.getState()
  );
  const [sprayMode, setSprayMode] = useState<'continuous' | 'interval'>('interval');
  const [scheduleActive, setScheduleActive] = useState(true);
  const [timerActive, setTimerActive] = useState(true);

  // Mist animation
  const mistAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(mistAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(mistAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [mistAnim]);

  useEffect(() => {
    const unsub = controller.onStateChange((state) => {
      setDeviceState(state);
    });
    return unsub;
  }, [controller]);

  const isPowerOn = deviceState.power;
  const intensity = deviceState.intensity || 6;

  const handleIntensityChange = (val: number) => {
    controller.setIntensity(val);
  };

  const handleTogglePower = () => {
    controller.setPower(!deviceState.power);
  };

  const mistTranslateY = mistAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });
  const mistOpacity = mistAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* 1. App Bar (64pt, Back + Title + more_horiz -> Settings + Avatar) */}
      <AppBar
        showBack
        title={isRTL ? 'التحكم بالجهاز' : 'Device Control'}
        actions={[
          {
            icon: 'more_horiz',
            onPress: () => navigation.navigate('DeviceSettings'),
            label: 'Settings',
          },
          {
            avatar: require('../../assets/photos/avatar.jpg'),
            onPress: () => navigation.navigate('Account'),
            label: 'Profile',
          },
        ]}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 56 + 24 + insets.bottom + 48 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Sub-header Device Status Pill */}
        <View style={styles.subHeaderSection}>
          <View style={styles.statusPillLeft}>
            <View style={styles.blePingContainer}>
              <View style={[styles.blePingOuter, { backgroundColor: colors.accent }]} />
              <View style={[styles.blePingInner, { backgroundColor: colors.primary }]} />
            </View>
            <Text
              style={[
                typography.labelMd,
                { color: colors.textMuted, marginStart: 8, fontWeight: '600', fontSize: 11 },
              ]}
            >
              {isRTL ? 'متصل عبر البلوتوث' : 'BLE CONNECTED'}
            </Text>
            <Text style={[typography.bodySm, { color: colors.textSubtle, marginHorizontal: 4 }]}>
              ·
            </Text>
            <Text style={[typography.labelMd, { color: colors.textMuted, fontSize: 12 }]}>
              {isRTL ? 'غرفة المعيشة' : 'Living Room'}
            </Text>
          </View>

          <View style={[styles.activePillBadge, { backgroundColor: colors.bgAlt }]}>
            <Icon name="air" size={14} color={colors.primary} />
            <Text
              style={[
                typography.labelSm,
                { color: colors.primary, fontWeight: '700', marginStart: 4, fontSize: 10 },
              ]}
            >
              {isPowerOn ? (isRTL ? 'نشط' : 'ACTIVE') : (isRTL ? 'استعداد' : 'STANDBY')}
            </Text>
          </View>
        </View>

        {/* 3. Hardware Presentation & Mist Canvas */}
        <Card surface="low" style={styles.hardwareCard}>
          {/* Subtle mist effect above device */}
          {isPowerOn && (
            <Animated.View
              style={[
                styles.mistContainer,
                {
                  transform: [{ translateY: mistTranslateY }],
                  opacity: mistOpacity,
                },
              ]}
            >
              <Svg width={180} height={140} viewBox="0 0 200 160">
                <Defs>
                  <LinearGradient id="mistGrad" x1="100" y1="20" x2="100" y2="140" gradientUnits="userSpaceOnUse">
                    <Stop offset="0" stopColor={colors.primarySoft} stopOpacity={0.8} />
                    <Stop offset="0.7" stopColor={colors.accent} stopOpacity={0.3} />
                    <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
                  </LinearGradient>
                </Defs>
                <Path
                  d="M100 140 C92 110, 80 80, 88 40 C92 20, 108 20, 112 40 C120 80, 108 110, 100 140 Z"
                  fill="url(#mistGrad)"
                />
              </Svg>
            </Animated.View>
          )}

          {/* Device Image (176x208) */}
          <View style={styles.hardwareImageWrapper}>
            <Image
              source={require('../../assets/photos/diffuser_control_sage.png')}
              style={styles.hardwareImage}
              resizeMode="cover"
            />
          </View>

          {/* Quick Room Atmosphere Meta (Replaces Temp/RH per 08 §4) */}
          <View style={styles.telemetryRow}>
            <View style={styles.telemetryItem}>
              <Icon name="bluetooth" size={14} color={colors.primary} />
              <Text style={[typography.labelMd, { color: colors.textMuted, marginStart: 4, fontSize: 11 }]}>
                {isRTL ? 'متصل' : 'Connected'}
              </Text>
            </View>
            <View style={[styles.metaDot, { backgroundColor: colors.border }]} />
            <View style={styles.telemetryItem}>
              <Icon name="signal_cellular_alt" size={14} color={colors.primary} />
              <Text style={[typography.labelMd, { color: colors.textMuted, marginStart: 4, fontSize: 11 }]}>
                {isRTL ? 'إشارة قوية (-58 dBm)' : 'Signal Strong (-58 dBm)'}
              </Text>
            </View>
            <View style={[styles.metaDot, { backgroundColor: colors.border }]} />
            <View style={styles.telemetryItem}>
              <Icon name="eco" size={14} color={colors.primary} />
              <Text style={[typography.labelMd, { color: colors.primary, fontWeight: '600', marginStart: 4, fontSize: 11 }]}>
                {isRTL ? 'انتشار بارد' : 'Cold Diffusion'}
              </Text>
            </View>
          </View>
        </Card>

        {/* 4. Interactive Intensity Dial Hero Card */}
        <Card surface="lowest" style={styles.dialCard}>
          <View style={styles.dialHeader}>
            <View>
              <Text
                style={[
                  typography.labelSm,
                  {
                    color: colors.textSubtle,
                    fontWeight: '700',
                    textTransform: isRTL ? 'none' : 'uppercase',
                    letterSpacing: isRTL ? 0 : 1,
                  },
                ]}
              >
                {isRTL ? 'معدل الانتشار' : 'DIFFUSION RATE'}
              </Text>
              <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '500', fontSize: 18, marginTop: 2 }]}>
                {isRTL ? 'كثافة العطر' : 'Aroma Intensity'}
              </Text>
            </View>

            <View style={[styles.modeBadge, { backgroundColor: colors.accent }]}>
              <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600', fontSize: 11 }]}>
                {sprayMode === 'interval' ? (isRTL ? 'نمط الفترات' : 'Interval Mode') : (isRTL ? 'نمط مستمر' : 'Continuous Mode')}
              </Text>
            </View>
          </View>

          {/* Circular Gauge (224pt, stroke 8, number 36 light font) */}
          <IntensityGauge
            value={intensity}
            onChange={handleIntensityChange}
            max={10}
            caption={isRTL ? 'انتشار عطري متوازن' : 'Balanced Floral Dispersion'}
          />

          {/* Preset Chips Row */}
          <View style={styles.presetsRow}>
            <PresetChips
              currentValue={intensity}
              onSelect={handleIntensityChange}
              hasBurstCapability={false}
            />
          </View>

          {/* Mode Segmented Control: Continuous / Interval */}
          <View style={styles.modeSegmentedRow}>
            <SegmentedControl<'continuous' | 'interval'>
              options={[
                { label: isRTL ? 'مستمر' : 'Continuous', value: 'continuous' },
                { label: isRTL ? 'فترات' : 'Interval', value: 'interval' },
              ]}
              selected={sprayMode}
              onChange={(val) => setSprayMode(val)}
            />
          </View>

          {/* Dial Micro-details Footer per 08 §4 */}
          <View style={[styles.dialFooterRow, { borderTopColor: colors.surfaceMuted }]}>
            <View style={styles.dialFooterItem}>
              <Icon name="airwave" size={16} color={colors.primary} />
              <Text style={[typography.bodySm, { color: colors.text, fontWeight: '500', marginStart: 6 }]}>
                {isPowerOn ? (isRTL ? 'ينتشر الآن · 12 ثانية' : 'Spraying · 12s') : (isRTL ? 'متوقف مؤقتاً' : 'Paused · 48s')}
              </Text>
            </View>
            <View style={styles.dialFooterItem}>
              <Icon name="check_circle" size={16} color={colors.primarySoft} />
              <Text style={[typography.bodySm, { color: colors.textMuted, marginStart: 6 }]}>
                {isRTL ? 'هواء بارد بدون ماء' : 'Waterless Cold-Air'}
              </Text>
            </View>
          </View>
        </Card>

        {/* 5. Cartridge / Fragrance Chamber Status Card */}
        <Card surface="lowest" style={styles.cartridgeCard}>
          <View style={styles.cartridgeTopRow}>
            <View style={styles.cartridgeLeft}>
              <View style={[styles.cartridgeThumbWrap, { backgroundColor: colors.surfaceMuted }]}>
                <Image
                  source={require('../../assets/photos/oil-forest-sage.png')}
                  style={styles.cartridgeThumbImage}
                  resizeMode="contain"
                />
              </View>
              <View style={{ marginStart: 12, flex: 1 }}>
                <Text
                  style={[
                    typography.labelSm,
                    {
                      color: colors.textSubtle,
                      fontWeight: '700',
                      textTransform: isRTL ? 'none' : 'uppercase',
                      letterSpacing: isRTL ? 0 : 0.8,
                    },
                  ]}
                >
                  {isRTL ? 'الحجرة النشطة' : 'CHAMBER ACTIVE'}
                </Text>
                <Text style={[typography.headlineSm, { color: colors.text, fontSize: 18, fontWeight: '500', marginTop: 2 }]}>
                  {isRTL ? 'مريمية الغابة' : 'Forest Sage'}
                </Text>
                <Text numberOfLines={1} style={[typography.bodySm, { color: colors.textMuted, marginTop: 2 }]}>
                  {isRTL ? 'أوكالبتوس، صنوبر متوسطي، طحلب بري' : 'Eucalyptus, Mediterranean Pine & Wild Moss'}
                </Text>
              </View>
            </View>

            <Text style={[typography.headlineSm, { color: colors.primary, fontWeight: '600', fontSize: 20 }]}>
              68%
            </Text>
          </View>

          {/* Capacity Progress Bar */}
          <View style={styles.cartridgeProgressSection}>
            <View style={[styles.cartridgeTrack, { backgroundColor: colors.surfaceMuted }]}>
              <View
                style={[
                  styles.cartridgeFill,
                  { width: '68%', backgroundColor: colors.primary },
                ]}
              />
            </View>
            <View style={styles.cartridgeMetaRow}>
              <Text style={[typography.bodySm, { color: colors.textMuted }]}>
                {isRTL ? 'حوالي 18 يوم متبقي (تقديري)' : 'Approx. 18 days remaining (Est.)'}
              </Text>
              <Text style={[typography.bodySm, { color: colors.text, fontWeight: '600' }]}>
                34 ml / 50 ml
              </Text>
            </View>
          </View>

          {/* Action Buttons: Reorder Oil + Scent History */}
          <View style={styles.cartridgeActionButtons}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Store')}
              style={[styles.reorderBtn, { backgroundColor: colors.accent }]}
            >
              <Icon name="shopping_bag" size={18} color={colors.text} />
              <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600', marginStart: 6 }]}>
                {isRTL ? 'إعادة طلب الزيت' : 'Reorder Oil'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {}}
              style={[styles.historyBtn, { backgroundColor: colors.surfaceMuted }]}
            >
              <Icon name="history" size={18} color={colors.text} />
              <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600', marginStart: 6 }]}>
                {isRTL ? 'سجل العطور' : 'Scent History'}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 6. Quick Settings Shortcuts Bento */}
        <View style={styles.bentoSection}>
          <View style={styles.bentoHeader}>
            <Text style={[typography.headlineSm, { color: colors.text, fontSize: 18, fontWeight: '500' }]}>
              {isRTL ? 'أجواء الجهاز' : 'Device Ambience'}
            </Text>
            <Text style={[typography.labelMd, { color: colors.textMuted }]}>
              {isRTL ? 'أتمتتان نشطتان' : '2 automations active'}
            </Text>
          </View>

          {/* Routine 1: Schedule Shortcut */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => navigation.navigate('Schedule')}
          >
            <Card surface="lowest" style={styles.bentoCard}>
              <View style={styles.bentoCardLeft}>
                <View style={[styles.bentoIconWrap, { backgroundColor: colors.bgAlt }]}>
                  <Icon name="schedule" size={20} color={colors.primary} />
                </View>
                <View style={{ marginStart: 12, flex: 1 }}>
                  <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600' }]}>
                    {isRTL ? 'الجدول اليومي' : 'Circadian Schedule'}
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2 }]}>
                    {isRTL ? 'نشط 08:00 – 22:00 · دورة ذكية' : 'Active 08:00 – 22:00 · Smart Cycle'}
                  </Text>
                </View>
              </View>
              <Toggle
                value={scheduleActive}
                onValueChange={setScheduleActive}
              />
            </Card>
          </TouchableOpacity>

          {/* Routine 2: Auto-off Timer (Replaces Glow per 08 §4) */}
          <Card surface="lowest" style={[styles.bentoCard, { marginTop: 10 }]}>
            <View style={styles.bentoCardLeft}>
              <View style={[styles.bentoIconWrap, { backgroundColor: colors.bgAlt }]}>
                <Icon name="timer" size={20} color={colors.primary} />
              </View>
              <View style={{ marginStart: 12, flex: 1 }}>
                <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600' }]}>
                  {isRTL ? 'مؤقت الإيقاف التلقائي' : 'Auto-off Timer'}
                </Text>
                <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2 }]}>
                  {isRTL ? 'ساعتان متبقيتان · إيقاف سلس' : '2 Hours remaining · Gentle fade'}
                </Text>
              </View>
            </View>
            <Toggle
              value={timerActive}
              onValueChange={setTimerActive}
            />
          </Card>
        </View>
      </ScrollView>

      {/* 7. Floating Status Pill (Fixed 56pt at bottom) */}
      <View style={[styles.floatingPillContainer, { bottom: Math.max(insets.bottom, 16) + 16 }]}>
        <StatusPill
          active={isPowerOn}
          onPress={handleTogglePower}
          label={
            isPowerOn
              ? (isRTL ? 'الموزع يعمل · اضغط للإيقاف المؤقت' : 'Diffuser active · tap to pause')
              : (isRTL ? 'الموزع متوقف · اضغط للتشغيل' : 'Diffuser paused · tap to start')
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  subHeaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blePingContainer: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  blePingOuter: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    opacity: 0.6,
  },
  blePingInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activePillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  hardwareCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
  },
  mistContainer: {
    position: 'absolute',
    top: 6,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  hardwareImageWrapper: {
    width: 176,
    height: 208,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  hardwareImage: {
    width: '100%',
    height: '100%',
  },
  telemetryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    zIndex: 10,
  },
  telemetryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 8,
  },
  dialCard: {
    padding: 24,
    marginBottom: 16,
  },
  dialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  presetsRow: {
    marginTop: 8,
    marginBottom: 12,
  },
  modeSegmentedRow: {
    marginBottom: 16,
  },
  dialFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  dialFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartridgeCard: {
    padding: 20,
    marginBottom: 16,
  },
  cartridgeTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cartridgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cartridgeThumbWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cartridgeThumbImage: {
    width: 44,
    height: 44,
  },
  cartridgeProgressSection: {
    marginTop: 14,
  },
  cartridgeTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  cartridgeFill: {
    height: '100%',
    borderRadius: 4,
  },
  cartridgeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  cartridgeActionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  reorderBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bentoSection: {
    marginBottom: 16,
  },
  bentoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bentoCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bentoCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginEnd: 12,
  },
  bentoIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingPillContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    zIndex: 50,
  },
});

export default DeviceControlScreen;
