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
import { useNavigation } from '@react-navigation/native';
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
import { useAppStore, getLocalizedDeviceName, getLocalizedOilName, getLocalizedRoomName } from '../store/useAppStore';
import { getDeviceController } from '../device/DeviceController';
import { previewConfig } from '../previewTarget';

const DIFFUSER_IMAGES = {
  sage: require('../../assets/photos/diffuser_control_sage.png'),
  white: require('../../assets/photos/diffuser-a316-white.png'),
  black: require('../../assets/photos/diffuser-a316-black.png'),
};

interface DeviceControlScreenProps {
  navigation: any;
  route?: any;
}

export const DeviceControlScreen: React.FC<DeviceControlScreenProps> = ({
  navigation,
  route,
}) => {
  const nav = useNavigation<any>();
  const activeNav = navigation?.navigate ? navigation : nav;
  const { t } = useTranslation();
  const { colors, typography, isRTL } = useTheme();
  const insets = useSafeAreaInsets();
  const controller = getDeviceController();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (previewConfig.scrollToEnd) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: false });
      }, 150);
    }
  }, []);

  const {
    devices,
    selectedDeviceId,
    connectionStatus,
    toggleDevicePower,
    setDeviceIntensity,
    updateDevice,
  } = useAppStore();

  const activeDevice =
    devices.find((d) => d.id === selectedDeviceId) ||
    devices[0] || {
      id: 'living',
      name: 'موزع غرفة المعيشة',
      roomName: 'غرفة المعيشة',
      colorway: 'sage' as const,
      model: 'Odora A316',
      power: true,
      intensity: 8,
      mode: 'interval' as const,
      oilLevel: 68,
      oilName: 'مريمية الغابة',
      oilRemainingDays: 18,
      oilSensor: false,
      burst: false,
      isOnline: true,
      connectionType: 'ble' as const,
      signalDbm: -58,
    };

  const isPowerOn = activeDevice.power;
  const intensity = activeDevice.intensity || 6;
  const sprayMode = activeDevice.mode;

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

  const handleIntensityChange = (val: number) => {
    setDeviceIntensity(activeDevice.id, val);
    controller.setIntensity(val);
  };

  const handleTogglePower = () => {
    toggleDevicePower(activeDevice.id);
    controller.setPower(!activeDevice.power);
  };

  const handleModeChange = (mode: 'continuous' | 'interval') => {
    updateDevice(activeDevice.id, { mode });
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
      {/* 1. App Bar (64pt, Back + Title leading next to chevron + more_horiz -> Settings + Avatar) */}
      <AppBar
        showBack
        title={t('deviceControl.title', 'Device Control')}
        actions={[
          {
            icon: 'more_horiz',
            onPress: () => activeNav.navigate('DeviceSettings'),
            label: t('deviceSettings.title', 'Settings'),
          },
          {
            avatar: require('../../assets/photos/avatar.jpg'),
            onPress: () => (activeNav as any).navigate('MainTabs', { screen: 'Account' }),
            label: t('nav.account', 'Profile'),
          },
        ]}
      />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 56 + 24 + insets.bottom + 48 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Sub-header Device Status Pill */}
        <View style={styles.subHeaderSection}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => activeNav.navigate('ConnectionStates', { initialState: connectionStatus, deviceId: activeDevice.id })}
            style={styles.statusPillLeft}
          >
            <View style={styles.blePingContainer}>
              <View
                style={[
                  styles.blePingOuter,
                  { backgroundColor: connectionStatus === 'connected' ? colors.accent : colors.surfaceHigh },
                ]}
              />
              <View
                style={[
                  styles.blePingInner,
                  { backgroundColor: connectionStatus === 'connected' ? colors.primary : colors.textSubtle },
                ]}
              />
            </View>
            <Text
              style={[
                typography.labelMd,
                { color: colors.textMuted, marginStart: 8, fontWeight: '600', fontSize: 11, letterSpacing: 0 },
              ]}
            >
              {connectionStatus === 'connected'
                ? t('device.connectedBle', 'متصل عبر البلوتوث')
                : t('device.disconnected', 'غير متصل')}
            </Text>
            <Text style={[typography.bodySm, { color: colors.textSubtle, marginHorizontal: 4 }]}>
              ·
            </Text>
            <Text style={[typography.labelMd, { color: colors.textMuted, fontSize: 12, letterSpacing: 0 }]}>
              {getLocalizedRoomName(activeDevice.roomName, isRTL)}
            </Text>
          </TouchableOpacity>

          <View style={[styles.activePillBadge, { backgroundColor: colors.bgAlt }]}>
            <Icon name="air" size={14} color={colors.primary} />
            <Text
              style={[
                typography.labelSm,
                { color: colors.primary, fontWeight: '700', marginStart: 4, fontSize: 10, letterSpacing: 0 },
              ]}
            >
              {isPowerOn ? t('common.active', 'نشط') : t('common.idle', 'استعداد')}
            </Text>
          </View>
        </View>

        {/* 2b. Inline Connection Diagnostic Banner if not connected (Flow 2) */}
        {connectionStatus !== 'connected' && (
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => activeNav.navigate('ConnectionStates', { initialState: connectionStatus, deviceId: activeDevice.id })}
            style={[styles.connectionAlertBanner, { backgroundColor: colors.accent }]}
          >
            <Icon
              name={connectionStatus === 'disabled' ? 'bluetooth_disabled' : 'podcasts'}
              size={20}
              color={colors.text}
            />
            <View style={{ marginStart: 10, flex: 1 }}>
              <Text style={[typography.labelMd, { color: colors.text, fontWeight: '700', letterSpacing: 0 }]}>
                {connectionStatus === 'disabled'
                  ? t('connectionStates.bluetoothOffTitle', 'البلوتوث متوقف على الهاتف')
                  : t('connectionStates.outOfRangeTitle', 'الموزع خارج النطاق أو غير متصل')}
              </Text>
              <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2, letterSpacing: 0 }]}>
                {t('deviceControl.connectionDiagnostic', 'تشخيص الاتصال اللاسلكي')}
              </Text>
            </View>
            <Icon name="chevron_right" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}

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
              source={DIFFUSER_IMAGES[activeDevice.colorway] || DIFFUSER_IMAGES.sage}
              style={styles.hardwareImage}
              resizeMode="contain"
            />
          </View>

          {/* Quick Room Atmosphere Meta with Bidi LTR wrapped technical values */}
          <View style={styles.telemetryRow}>
            <View style={styles.telemetryItem}>
              <Icon name="bluetooth" size={14} color={colors.primary} />
              <Text style={[typography.labelMd, { color: colors.textMuted, marginStart: 4, fontSize: 11, letterSpacing: 0 }]}>
                {connectionStatus === 'connected' ? t('common.active', 'متصل') : t('connection.disconnectedTitle', 'منفصل')}
              </Text>
            </View>
            <View style={[styles.metaDot, { backgroundColor: colors.border }]} />
            <View style={styles.telemetryItem}>
              <Icon name="signal_cellular_alt" size={14} color={colors.primary} />
              <Text style={[typography.labelMd, { color: colors.textMuted, marginStart: 4, fontSize: 11, letterSpacing: 0 }]}>
                {t('deviceControl.signalStrong', 'إشارة قوية')}
                {' '}
                <Text style={{ writingDirection: 'ltr' }}>{'\u202A'}({activeDevice.signalDbm} dBm){'\u202C'}</Text>
              </Text>
            </View>
            <View style={[styles.metaDot, { backgroundColor: colors.border }]} />
            <View style={styles.telemetryItem}>
              <Icon name="eco" size={14} color={colors.primary} />
              <Text style={[typography.labelMd, { color: colors.primary, fontWeight: '600', marginStart: 4, fontSize: 11, letterSpacing: 0 }]}>
                {t('deviceControl.waterlessColdAir', 'انتشار بارد')}
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
                    textTransform: isRTL ? "none" : "uppercase",
                    letterSpacing: isRTL ? 0 : 1,
                  },
                ]}
              >
                {t('deviceControl.dispersionRate', 'DIFFUSION RATE')}
              </Text>
              <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '500', fontSize: 18, marginTop: 2, letterSpacing: 0 }]}>
                {t('deviceControl.scentDensity', 'Aroma Intensity')}
              </Text>
              <Text style={[typography.labelMd, { color: colors.textMuted, fontWeight: '600', marginTop: 2, letterSpacing: 0 }]}>
                {`\u2066${intensity * 10}%\u2069 · ${t('device.level', { level: intensity })}`}
              </Text>
            </View>

            <View style={[styles.modeBadge, { backgroundColor: colors.accent }]}>
              <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600', fontSize: 11, letterSpacing: 0 }]}>
                {sprayMode === 'interval' ? t('home.interval', 'فترات') : t('home.continuous', 'مستمر')}
              </Text>
            </View>
          </View>

          {/* Circular Gauge (Full Ring 224pt, r 82, stroke 8 with -/+ buttons) */}
          <IntensityGauge
            value={intensity}
            onChange={handleIntensityChange}
            max={10}
            caption={t('device.optimalScenting', 'انتشار عطري متوازن')}
          />

          {/* Preset Chips Row (Boost chip hidden when burst is OFF) */}
          <View style={styles.presetsRow}>
            <PresetChips
              currentValue={intensity}
              onSelect={handleIntensityChange}
              hasBurstCapability={activeDevice.burst}
            />
          </View>

          {/* Mode Segmented Control: Continuous / Interval */}
          <View style={styles.modeSegmentedRow}>
            <SegmentedControl<'continuous' | 'interval'>
              options={[
                { label: t('home.continuous', 'مستمر'), value: 'continuous' },
                { label: t('home.interval', 'فترات'), value: 'interval' },
              ]}
              selected={sprayMode}
              onChange={handleModeChange}
            />
          </View>

          {/* Dial Micro-details Footer */}
          <View style={[styles.dialFooterRow, { borderTopColor: colors.surfaceMuted }]}>
            <View style={styles.dialFooterItem}>
              <Icon name="airwave" size={16} color={colors.primary} />
              <Text style={[typography.bodySm, { color: colors.text, fontWeight: '500', marginStart: 6, letterSpacing: 0 }]}>
                {isPowerOn ? t('home.statusActive', 'ينتشر الآن') : t('home.statusStandby', 'في وضع الاستعداد')}
              </Text>
            </View>
            <View style={styles.dialFooterItem}>
              <Icon name="check_circle" size={16} color={colors.primarySoft} />
              <Text style={[typography.bodySm, { color: colors.textMuted, marginStart: 6, letterSpacing: 0 }]}>
                {t('deviceControl.waterlessColdAir', 'هواء بارد بدون ماء')}
              </Text>
            </View>
          </View>
        </Card>

        {/* 5. Oil Status Card (Item 7: % in its own column; Item 15: No "chamber" wording) */}
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
                <Text style={[typography.headlineSm, { color: colors.text, fontSize: 18, fontWeight: '500', letterSpacing: 0 }]}>
                  {getLocalizedOilName(activeDevice.oilName, isRTL)}
                </Text>
                <Text numberOfLines={1} style={[typography.bodySm, { color: colors.textMuted, marginTop: 2, letterSpacing: 0 }]}>
                  {t('deviceControl.fragranceNotes', 'أوكالبتوس، صنوبر متوسطي، طحلب بري')}
                </Text>
              </View>
            </View>

            {/* Percentage in its own column at the end of header row (Item 7) */}
            <View style={styles.cartridgePercentCol}>
              <Text style={[typography.headlineSm, { color: colors.primary, fontWeight: '700', fontSize: 22, letterSpacing: 0 }]}>
                {`\u2066${activeDevice.oilLevel}%\u2069`}
              </Text>
            </View>
          </View>

          {/* Capacity Progress Bar */}
          <View style={styles.cartridgeProgressSection}>
            <View style={[styles.cartridgeTrack, { backgroundColor: colors.surfaceMuted }]}>
              <View
                style={[
                  styles.cartridgeFill,
                  { width: `${activeDevice.oilLevel}%`, backgroundColor: colors.primary },
                ]}
              />
            </View>
            <View style={styles.cartridgeMetaRow}>
              <Text style={[typography.bodySm, { color: colors.textMuted, letterSpacing: 0 }]}>
                {t('deviceControl.daysRemainingEstimate', {
                  count: activeDevice.oilRemainingDays,
                  estimate: activeDevice.oilSensor ? '' : t('home.oilEstimated', '(تقديري)'),
                  defaultValue: isRTL
                    ? `حوالي ${activeDevice.oilRemainingDays} يوم متبقي ${activeDevice.oilSensor ? '' : '(تقديري)'}`
                    : `Approx. ${activeDevice.oilRemainingDays} days remaining ${activeDevice.oilSensor ? '' : '(Est.)'}`,
                })}
              </Text>
              <Text style={[typography.bodySm, { color: colors.text, fontWeight: '600', letterSpacing: 0 }]}>
                {`\u2066${Math.round(50 * (activeDevice.oilLevel / 100))} ml / 50 ml\u2069`}
              </Text>
            </View>
          </View>

          {/* Action Buttons: Reorder Oil + Scent History */}
          <View style={styles.cartridgeActionButtons}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => (navigation as any).navigate('MainTabs', { screen: 'Store' })}
              style={[styles.reorderBtn, { backgroundColor: colors.accent }]}
            >
              <Icon name="shopping_bag" size={18} color={colors.text} />
              <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600', marginStart: 6, letterSpacing: 0 }]}>
                {t('device.reorderOil', 'إعادة طلب الزيت')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {}}
              style={[styles.historyBtn, { backgroundColor: colors.surfaceMuted }]}
            >
              <Icon name="history" size={18} color={colors.text} />
              <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600', marginStart: 6, letterSpacing: 0 }]}>
                {t('deviceControl.scentHistory')}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 6. Quick Settings Shortcuts Bento */}
        <View style={styles.bentoSection}>
          <View style={styles.bentoHeader}>
            <Text style={[typography.headlineSm, { color: colors.text, fontSize: 18, fontWeight: '500', letterSpacing: 0 }]}>
              {t('deviceControl.ambienceTitle')}
            </Text>
            <Text style={[typography.labelMd, { color: colors.textMuted, letterSpacing: 0 }]}>
              {t('scheduleScreen.routinesCount', { count: 2 })}
            </Text>
          </View>

          {/* Routine 1: Schedule Shortcut (Item 8: Schedule belongs to device) */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => activeNav.navigate('Schedule', { deviceId: activeDevice.id })}
            testID="schedule-row-button"
            accessibilityLabel="Daily Schedule"
            accessibilityRole="button"
          >
            <Card surface="lowest" style={styles.bentoCard}>
              <View style={styles.bentoCardLeft}>
                <View style={[styles.bentoIconWrap, { backgroundColor: colors.bgAlt }]}>
                  <Icon name="schedule" size={20} color={colors.primary} />
                </View>
                <View style={{ marginStart: 12, flex: 1 }}>
                  <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600', letterSpacing: 0 }]}>
                    {t('deviceControl.dailySchedule', 'الجدول اليومي')}
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2, letterSpacing: 0 }]}>
                    {t('device.scheduleActive', 'يعمل وفق الجدول المبرمج')}
                  </Text>
                </View>
              </View>
              <Toggle
                value={scheduleActive}
                onValueChange={setScheduleActive}
              />
            </Card>
          </TouchableOpacity>

          {/* Routine 2: Auto-off Timer */}
          <Card surface="lowest" style={[styles.bentoCard, { marginTop: 10 }]}>
            <View style={styles.bentoCardLeft}>
              <View style={[styles.bentoIconWrap, { backgroundColor: colors.bgAlt }]}>
                <Icon name="timer" size={20} color={colors.primary} />
              </View>
              <View style={{ marginStart: 12, flex: 1 }}>
                <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600', letterSpacing: 0 }]}>
                  {t('deviceSettings.autoOffTimer', 'مؤقت الإيقاف التلقائي')}
                </Text>
                <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2, letterSpacing: 0 }]}>
                  {timerActive ? t('deviceControl.timerActiveDesc') : t('deviceSettings.disabled')}
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
              ? t('deviceControl.tapToPause', 'الموزع يعمل · اضغط للإيقاف المؤقت')
              : t('deviceControl.tapToStart', 'الموزع متوقف · اضغط للتشغيل')
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
  connectionAlertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
  },
  cartridgeCard: {
    padding: 20,
    marginBottom: 16,
  },
  cartridgeTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  cartridgeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cartridgePercentCol: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingTop: 2,
    minWidth: 50,
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
