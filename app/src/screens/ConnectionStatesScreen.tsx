import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Animated,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';
import { Icon } from '../components/ui/Icon';
import { AppBar } from '../components/ui/AppBar';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from 'react-i18next';
import { previewConfig } from '../previewTarget';

interface ConnectionStatesScreenProps {
  navigation?: any;
  route?: any;
}

type ConnectionStateTab = 'disabled' | 'out_of_range' | 'syncing';

export const ConnectionStatesScreen: React.FC<ConnectionStatesScreenProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const { colors, isDark, isRTL } = useTheme();
  const insets = useSafeAreaInsets();
  const { devices, selectedDeviceId, connectionStatus, setConnectionStatus } = useAppStore();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (previewConfig.scrollToEnd) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: false });
      }, 150);
    }
  }, []);

  const activeDevice = devices.find((d) => d.id === selectedDeviceId) || devices[0] || {
    id: 'default',
    name: isRTL ? 'موزع أودورا 01' : 'Odora Air 01',
    roomName: isRTL ? 'غرفة المعيشة' : 'Living Room',
    oilLevel: 74,
    oilName: isRTL ? 'كانوبي الهينوكي' : 'Hinoki Canopy',
    oilSensor: true,
    power: true,
    intensity: 8,
    mode: 'interval' as const,
    colorway: 'sage' as const,
    burst: true,
  };

  const initialTab: ConnectionStateTab =
    route?.params?.initialState === 'out_of_range'
      ? 'out_of_range'
      : route?.params?.initialState === 'syncing'
      ? 'syncing'
      : 'disabled';

  const [activeTab, setActiveTab] = useState<ConnectionStateTab>(initialTab);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync animation spin
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, [spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleRetry = () => {
    setIsReconnecting(true);
    showToast(isRTL ? 'جاري محاولة إعادة الاتصال...' : 'Attempting to reconnect...');
    setTimeout(() => {
      setIsReconnecting(false);
      setConnectionStatus('connected');
      showToast(isRTL ? 'تم الاتصال بالجهاز بنجاح' : 'Connected successfully');
    }, 1800);
  };

  const handleOpenSettings = () => {
    showToast(isRTL ? 'فتح إعدادات النظام...' : 'Opening system settings...');
    Linking.openSettings?.();
  };

  const handleOfflineMode = () => {
    showToast(isRTL ? 'تم التبديل إلى وضع عدم الاتصال للقراءة فقط' : 'Switched to offline read-only mode');
    navigation?.goBack?.();
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      {/* 64pt App Bar with leading title */}
      <AppBar
        title={t('connectionStates.title', 'حالات الاتصال')}
        showBack={true}
        onBack={() => navigation?.goBack?.()}
        centerTitle={false}
        actions={[
          {
            avatar: require('../../assets/photos/avatar.jpg'),
            onPress: () => navigation?.navigate?.('Account'),
            label: 'Profile',
          },
        ]}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <View style={[styles.toastContainer, { backgroundColor: colors.ink }]}>
          <Icon name="info" size={18} color={colors.accent} />
          <Text style={[styles.toastText, { color: colors.onInk, letterSpacing: 0 }]}>
            {toastMessage}
          </Text>
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 48 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Centered Header per Stitch idea-02 */}
        <View style={styles.headerSection}>
          <View style={[styles.telemetryBadge, { backgroundColor: colors.surfaceMuted }]}>
            <Icon name="sensors" size={14} color={colors.primary} />
            <Text style={[styles.telemetryBadgeText, { color: colors.primary, letterSpacing: 0 }]}>
              {t('connectionStates.badge', 'تشخيص الاتصال اللاسلكي')}
            </Text>
          </View>

          <Text style={[styles.screenTitle, { color: colors.text, letterSpacing: 0 }]}>
            {t('connectionStates.title', 'حالة اتصال الموزع')}
          </Text>

          <Text style={[styles.screenSubtitle, { color: colors.textMuted, letterSpacing: 0 }]}>
            {t('connectionStates.subtitle', 'تشخيص حالة العتاد ومزامنة البلوتوث اللاسلكي')}
          </Text>

          {/* 3-State Switcher Pills per Stitch idea-02 */}
          <View style={[styles.tabBar, { backgroundColor: colors.surfaceMuted }]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setActiveTab('disabled');
                setConnectionStatus('disabled');
              }}
              style={[
                styles.tabBtn,
                activeTab === 'disabled' && {
                  backgroundColor: colors.primary,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.15,
                  shadowRadius: 2,
                },
              ]}
            >
              <Icon
                name="bluetooth_disabled"
                size={16}
                color={activeTab === 'disabled' ? colors.onPrimary : colors.textMuted}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  {
                    color: activeTab === 'disabled' ? colors.onPrimary : colors.textMuted,
                    fontWeight: activeTab === 'disabled' ? '600' : '400',
                    letterSpacing: 0,
                  },
                ]}
              >
                {t('connectionStates.tabDisabled', 'معطل')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setActiveTab('out_of_range');
                setConnectionStatus('out_of_range');
              }}
              style={[
                styles.tabBtn,
                activeTab === 'out_of_range' && {
                  backgroundColor: colors.primary,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.15,
                  shadowRadius: 2,
                },
              ]}
            >
              <Icon
                name="podcasts"
                size={16}
                color={activeTab === 'out_of_range' ? colors.onPrimary : colors.textMuted}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  {
                    color: activeTab === 'out_of_range' ? colors.onPrimary : colors.textMuted,
                    fontWeight: activeTab === 'out_of_range' ? '600' : '400',
                    letterSpacing: 0,
                  },
                ]}
              >
                {t('connectionStates.tabOutOfRange', 'خارج النطاق')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setActiveTab('syncing');
                setConnectionStatus('syncing');
              }}
              style={[
                styles.tabBtn,
                activeTab === 'syncing' && {
                  backgroundColor: colors.primary,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.15,
                  shadowRadius: 2,
                },
              ]}
            >
              <Icon
                name="sync"
                size={16}
                color={activeTab === 'syncing' ? colors.onPrimary : colors.textMuted}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  {
                    color: activeTab === 'syncing' ? colors.onPrimary : colors.textMuted,
                    fontWeight: activeTab === 'syncing' ? '600' : '400',
                    letterSpacing: 0,
                  },
                ]}
              >
                {t('connectionStates.tabSyncing', 'مزامنة')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* STATE A: Bluetooth Disabled (Matching Stitch idea-02) */}
        {activeTab === 'disabled' && (
          <View style={styles.stateAContainer}>
            {/* Visual Halo & Botanical Device Art */}
            <View style={styles.deviceArtBox}>
              <View style={[styles.haloGlowRing, { backgroundColor: colors.accent }]} />
              <View style={[styles.circularArtBackdrop, { backgroundColor: colors.surfaceHigh }]}>
                <Image
                  source={require('../../assets/photos/diffuser_sage_closeup.png')}
                  style={styles.circularArtImg}
                  resizeMode="cover"
                />
                <View style={styles.circularArtOverlay} />
                {/* Minimalist Glowing Bluetooth Off Vector Graphic */}
                <View style={[styles.btCenterNode, { backgroundColor: colors.surface }]}>
                  <Icon name="bluetooth_disabled" size={40} color={colors.textMuted} />
                  <View style={[styles.btSlashLine, { backgroundColor: colors.primary }]} />
                </View>
                {/* Botanical sprig badge */}
                <View style={[styles.botanicalBadge, { backgroundColor: colors.accent }]}>
                  <Icon name="eco" size={16} color={colors.primary} />
                </View>
              </View>
            </View>

            {/* Context & Description */}
            <View style={[styles.badgePill, { backgroundColor: colors.surfaceMuted }]}>
              <View style={[styles.statusDot, { backgroundColor: colors.textSubtle }]} />
              <Text style={[styles.badgePillText, { color: colors.textMuted, letterSpacing: 0 }]}>
                {t('connectionStates.radioSilent', 'جهاز الإرسال والاستقبال صامت')}
              </Text>
            </View>

            <Text style={[styles.stateTitleText, { color: colors.text, letterSpacing: 0 }]}>
              {t('connectionStates.bluetoothOffTitle', 'البلوتوث متوقف')}
            </Text>

            <Text style={[styles.stateBodyText, { color: colors.textMuted, letterSpacing: 0 }]}>
              {t('connectionStates.bluetoothOffDesc', 'يتطلب أودورا تقنية البلوتوث لإدارة الانتشار الدقيق وقراءة مستوى الزيت. يرجى تفعيل البلوتوث في إعدادات جهازك.')}
            </Text>

            {/* Buttons per Stitch */}
            <View style={styles.buttonsColumn}>
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={handleOpenSettings}
                style={[styles.primaryBtn, { backgroundColor: colors.ink }]}
              >
                <Icon name="bluetooth" size={20} color={colors.onInk} />
                <Text style={[styles.primaryBtnText, { color: colors.onInk, letterSpacing: 0 }]}>
                  {t('connectionStates.openSettings', 'فتح إعدادات النظام')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleOfflineMode}
                style={[styles.secondaryBtn, { backgroundColor: colors.surfaceMuted }]}
              >
                <Icon name="cloud_off" size={18} color={colors.text} />
                <Text style={[styles.secondaryBtnText, { color: colors.text, letterSpacing: 0 }]}>
                  {t('connectionStates.continueOffline', 'المتابعة في وضع عدم الاتصال للقراءة فقط')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Autonomous Rhythm Tile */}
            <View style={[styles.autoRhythmCard, { backgroundColor: colors.surfaceMuted }]}>
              <View style={[styles.autoRhythmIconBox, { backgroundColor: colors.accent }]}>
                <Icon name="wb_twilight" size={20} color={colors.primary} />
              </View>
              <View style={styles.autoRhythmTextBox}>
                <Text style={[styles.autoRhythmTitle, { color: colors.primary, letterSpacing: 0 }]}>
                  {t('connectionStates.autonomousRhythmTitle', 'الإيقاع المستقل')}
                </Text>
                <Text style={[styles.autoRhythmBody, { color: colors.textMuted, letterSpacing: 0 }]}>
                  {t('connectionStates.autonomousRhythmDesc', 'سيواصل الموزع دورته المجدولة الأخيرة بشكل مستقل دون الحاجة لاتصال مستمر.')}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* STATE B: Out of Range / Disconnected (Matching Stitch idea-02) */}
        {activeTab === 'out_of_range' && (
          <View style={[styles.stateCardBox, { backgroundColor: colors.bgAlt }]}>
            {/* Header with Beacon Ripple */}
            <View style={styles.beaconHeaderRow}>
              <View style={styles.beaconHeaderLeft}>
                <View style={[styles.beaconIconCircle, { backgroundColor: colors.surfaceMuted }]}>
                  <Icon name="podcasts" size={24} color={colors.primary} />
                </View>
                <View style={{ marginStart: 12 }}>
                  <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '600', letterSpacing: 0 }]}>
                    {activeDevice.name}
                  </Text>
                  <Text style={[typography.labelSm, { color: colors.textSubtle, letterSpacing: 0 }]}>
                    {isRTL ? 'أودورا إير 01 · طراز SA-200' : 'Odora Air 01 • Model SA-200'}
                  </Text>
                </View>
              </View>
              <View style={[styles.disconnectBadge, { backgroundColor: colors.surfaceHigh }]}>
                <Text style={[typography.labelSm, { color: colors.textMuted, fontSize: 11, letterSpacing: 0 }]}>
                  {isRTL ? 'غير متصل' : 'Disconnected'}
                </Text>
              </View>
            </View>

            {/* Ambient Telemetry Status Banner */}
            <View style={[styles.telemetryBanner, { backgroundColor: colors.surfaceMuted }]}>
              <Icon name="history" size={22} color={colors.primary} />
              <View style={{ marginStart: 10, flex: 1 }}>
                <Text style={[typography.bodySm, { color: colors.text, fontWeight: '600', letterSpacing: 0 }]}>
                  {isRTL ? 'آخر ظهور منذ 18 دقيقة' : 'Last seen 18 minutes ago'}
                </Text>
                <Text style={[typography.labelSm, { color: colors.textMuted, letterSpacing: 0 }]}>
                  {isRTL ? 'المسافة التقديرية أكثر من 18.5 متراً' : 'Estimated distance > 18.5 meters away'}
                </Text>
              </View>
            </View>

            {/* Reconnection Checklist */}
            <View style={styles.reconnectSection}>
              <Text style={[styles.reconnectHeaderTitle, { color: colors.text, letterSpacing: 0 }]}>
                {isRTL ? 'بروتوكول استعادة الاتصال' : 'RECONNECTION PROTOCOL'}
              </Text>
              <View style={[styles.checklistItem, { backgroundColor: colors.surface }]}>
                <Icon name="power" size={20} color={colors.primary} />
                <Text style={[styles.checklistText, { color: colors.text, letterSpacing: 0 }]}>
                  {isRTL ? 'تأكد من توصيل الموزع بمصدر الطاقة' : 'Ensure diffuser is plugged into AC power'}
                </Text>
                <Icon name="check_circle" size={18} color={colors.primary} />
              </View>
              <View style={[styles.checklistItem, { backgroundColor: colors.surface }]}>
                <Icon name="straighten" size={20} color={colors.primary} />
                <Text style={[styles.checklistText, { color: colors.text, letterSpacing: 0 }]}>
                  {isRTL ? 'اقترب من الجهاز لمسافة أقل من 15 متراً' : 'Bring phone within 15 meters line-of-sight'}
                </Text>
                <Icon name="radio_button_unchecked" size={18} color={colors.textSubtle} />
              </View>
              <View style={[styles.checklistItem, { backgroundColor: colors.surface }]}>
                <Icon name="lightbulb" size={20} color={colors.primary} />
                <Text style={[styles.checklistText, { color: colors.text, letterSpacing: 0 }]}>
                  {isRTL ? 'تأكد من إضاءة مؤشر التشغيل على القاعدة' : 'Check that base ceramic LED is on'}
                </Text>
                <Icon name="radio_button_unchecked" size={18} color={colors.textSubtle} />
              </View>
            </View>

            {/* Tactile Action Button */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleRetry}
              disabled={isReconnecting}
              style={[styles.primaryBtn, { backgroundColor: colors.ink }]}
            >
              <Icon name="refresh" size={20} color={colors.onInk} />
              <Text style={[styles.primaryBtnText, { color: colors.onInk, letterSpacing: 0 }]}>
                {isReconnecting
                  ? (isRTL ? 'جاري إعادة الاتصال...' : 'Attempting BLE Reconnect...')
                  : (isRTL ? 'محاولة إعادة الاتصال' : 'Attempt BLE Reconnect')}
              </Text>
            </TouchableOpacity>

            {/* Cartridge Snapshot preview */}
            <View style={styles.cartridgeSnapshotRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="opacity" size={16} color={colors.primary} />
                <Text style={[typography.labelSm, { color: colors.textMuted, letterSpacing: 0 }]}>
                  {isRTL ? `الزيت: ${activeDevice.oilName}` : `Cartridge: ${activeDevice.oilName}`}
                </Text>
              </View>
              <Text style={[typography.labelSm, { color: colors.text, fontWeight: '600', letterSpacing: 0 }]}>
                {isRTL ? `المحفوظ: ${activeDevice.oilLevel}% متبقٍ` : `Cached: ${activeDevice.oilLevel}% remaining`}
              </Text>
            </View>
          </View>
        )}

        {/* STATE C: Connecting & Synchronizing (Matching Stitch idea-02) */}
        {activeTab === 'syncing' && (
          <View style={[styles.stateCardBox, { backgroundColor: colors.bgAlt, alignItems: 'center' }]}>
            {/* Pulsing Concentric Visual */}
            <View style={styles.syncVisualBox}>
              <View style={[styles.syncPulseOuter, { backgroundColor: colors.accent, opacity: 0.3 }]} />
              <View style={[styles.syncPulseMid, { backgroundColor: colors.accent, opacity: 0.6 }]} />
              <View style={[styles.syncNodeCenter, { backgroundColor: colors.surface }]}>
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Icon name="sync" size={32} color={colors.primary} />
                </Animated.View>
                <Text style={[styles.syncBleText, { color: colors.primary, letterSpacing: 0 }]}>
                  BLE 5.2
                </Text>
              </View>
            </View>

            <View style={[styles.badgePill, { backgroundColor: colors.surfaceMuted }]}>
              <View style={[styles.statusDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.badgePillText, { color: colors.primary, letterSpacing: 0 }]}>
                {isRTL ? 'مصافحة القناة' : 'CHANNEL HANDSHAKE'}
              </Text>
            </View>

            <Text style={[styles.stateTitleText, { color: colors.text, letterSpacing: 0 }]}>
              {isRTL ? 'جارٍ مزامنة الأجواء...' : 'Synchronizing Atmosphere...'}
            </Text>

            <Text style={[styles.stateBodyText, { color: colors.textMuted, letterSpacing: 0 }]}>
              {isRTL
                ? 'جارٍ إنشاء اتصال مشفر مع موزع أودورا وقراءة مستشعرات العبوة.'
                : 'Establishing encrypted handshake with Odora Air 01 and querying cartridge piezo sensors.'}
            </Text>

            {/* Real-time Telemetry Checklist */}
            <View style={[styles.syncChecklist, { backgroundColor: colors.surfaceMuted }]}>
              <View style={styles.syncRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Icon name="lock" size={18} color={colors.primary} />
                  <Text style={[typography.bodySm, { color: colors.text, letterSpacing: 0 }]}>
                    {isRTL ? 'الاتفاق على المفتاح الآمن' : 'Secure Key Agreement'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="done" size={16} color={colors.primary} />
                  <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '600', letterSpacing: 0 }]}>
                    {isRTL ? 'تم التحقق' : 'Verified'}
                  </Text>
                </View>
              </View>

              <View style={styles.syncRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Icon name="analytics" size={18} color={colors.primary} />
                  <Text style={[typography.bodySm, { color: colors.text, letterSpacing: 0 }]}>
                    {isRTL ? 'مستوى الزيت الدقيق' : 'Cartridge Sensor Level'}
                  </Text>
                </View>
                <Text style={[typography.labelSm, { color: colors.textMuted, fontWeight: '600', letterSpacing: 0 }]}>
                  {isRTL ? 'جارٍ المزامنة...' : 'Syncing...'}
                </Text>
              </View>

              <View style={styles.syncRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Icon name="schedule" size={18} color={colors.primary} />
                  <Text style={[typography.bodySm, { color: colors.text, letterSpacing: 0 }]}>
                    {isRTL ? 'جدول الرذاذ الميكروي' : 'Micro-Mist Schedule'}
                  </Text>
                </View>
                <Text style={[typography.labelSm, { color: colors.textSubtle, letterSpacing: 0 }]}>
                  {isRTL ? 'في الانتظار' : 'Queued'}
                </Text>
              </View>

              {/* Progress Bar */}
              <View style={[styles.progressTrack, { backgroundColor: colors.surfaceHigh }]}>
                <View style={[styles.progressFill, { backgroundColor: colors.primary, width: '65%' }]} />
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setActiveTab('disabled');
                setConnectionStatus('disabled');
              }}
              style={styles.cancelSyncBtn}
            >
              <Text style={[typography.labelMd, { color: colors.textMuted, letterSpacing: 0 }]}>
                {isRTL ? 'إلغاء المزامنة' : 'Cancel Pairing Sequence'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Shared Hardware Profile Card per Stitch idea-02 */}
        <View style={[styles.deviceCard, { backgroundColor: colors.surfaceMuted }]}>
          <Image
            source={require('../../assets/photos/diffuser-a316-sage.png')}
            style={styles.deviceCardThumb}
            resizeMode="cover"
          />
          <View style={styles.deviceCardTextCol}>
            <Text style={[styles.deviceCardOverline, { color: colors.primary, letterSpacing: 0 }]}>
              {t('connectionStates.activeHardware', 'الجهاز النشط')}
            </Text>
            <Text style={[styles.deviceCardTitle, { color: colors.text, letterSpacing: 0 }]} numberOfLines={1}>
              {activeDevice.name}
            </Text>
            <Text style={[styles.deviceCardSubtitle, { color: colors.textMuted, letterSpacing: 0 }]} numberOfLines={1}>
              {isRTL ? 'موزع رذاذ بارد هادئ' : 'Cold-Air Acoustic Atomizer'}
            </Text>
            <View style={styles.deviceCardBadgeRow}>
              <View style={[styles.greenDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.deviceCardBadgeText, { color: colors.text, letterSpacing: 0 }]}>
                {isRTL ? 'معتمد بهدوء فائق أقل من 22 ديسيبل' : 'Sub-22dB Quiet Mark Certified'}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer Note per Stitch idea-02 */}
        <View style={styles.footerSection}>
          <View style={styles.footerBadgeRow}>
            <Icon name="verified_user" size={16} color={colors.textSubtle} />
            <Text style={[styles.footerBadgeText, { color: colors.textSubtle, letterSpacing: 0 }]}>
              {t('connectionStates.offlineIntegrityTitle', 'أولوية العمل دون اتصال')}
            </Text>
          </View>
          <Text style={[styles.footerText, { color: colors.textMuted, letterSpacing: 0 }]}>
            {t('connectionStates.offlineIntegrityDesc', 'يحفظ جهاز أودورا جميع الجداول محلياً على الجهاز ولا يعتمد على خوادم سحابية للتشغيل الأساسي.')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  toastContainer: {
    position: 'absolute',
    top: 76,
    alignSelf: 'center',
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 20,
    textAlign: 'center',
  },
  telemetryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.full,
    marginBottom: 8,
  },
  telemetryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  screenSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 290,
  },
  tabBar: {
    flexDirection: 'row',
    width: '100%',
    padding: 4,
    borderRadius: radii.full,
    marginTop: 18,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: radii.full,
    gap: 6,
  },
  tabBtnText: {
    fontSize: 12,
  },
  stateAContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  deviceArtBox: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 12,
  },
  haloGlowRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    opacity: 0.35,
  },
  circularArtBackdrop: {
    width: 192,
    height: 192,
    borderRadius: 96,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circularArtImg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.25,
  },
  circularArtOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  btCenterNode: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  btSlashLine: {
    position: 'absolute',
    width: 56,
    height: 3,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  botanicalBadge: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.full,
    marginBottom: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  stateTitleText: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  stateBodyText: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  buttonsColumn: {
    width: '100%',
    gap: 10,
    marginBottom: 16,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryBtn: {
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '500',
  },
  autoRhythmCard: {
    width: '100%',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  autoRhythmIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoRhythmTextBox: {
    flex: 1,
  },
  autoRhythmTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  autoRhythmBody: {
    fontSize: 12,
    lineHeight: 18,
  },
  stateCardBox: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    marginTop: 8,
  },
  beaconHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  beaconHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  beaconIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disconnectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  telemetryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginVertical: 14,
  },
  reconnectSection: {
    gap: 8,
    marginBottom: 16,
  },
  reconnectHeaderTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    gap: 10,
  },
  checklistText: {
    flex: 1,
    fontSize: 13,
  },
  cartridgeSnapshotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  syncVisualBox: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 16,
  },
  syncPulseOuter: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  syncPulseMid: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  syncNodeCenter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  syncBleText: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  syncChecklist: {
    width: '100%',
    borderRadius: 18,
    padding: 14,
    gap: 12,
    marginBottom: 14,
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  cancelSyncBtn: {
    paddingVertical: 8,
  },
  deviceCard: {
    width: '100%',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 16,
  },
  deviceCardThumb: {
    width: 72,
    height: 72,
    borderRadius: 14,
  },
  deviceCardTextCol: {
    flex: 1,
  },
  deviceCardOverline: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  deviceCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  deviceCardSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  deviceCardBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  deviceCardBadgeText: {
    fontSize: 11,
  },
  footerSection: {
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 8,
    maxWidth: 300,
    alignSelf: 'center',
  },
  footerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  footerBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  footerText: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
});

export default ConnectionStatesScreen;
