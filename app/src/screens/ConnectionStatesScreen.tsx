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
import { EmptyState } from '../components/ui/EmptyState';
import {
  useAppStore,
  getLocalizedDeviceName,
  getLocalizedOilName,
  getLocalizedRoomName,
} from '../store/useAppStore';
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
  const { colors, isRTL } = useTheme();
  const insets = useSafeAreaInsets();
  const { devices, selectedDeviceId, setConnectionStatus } = useAppStore();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (previewConfig.scrollToEnd) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: false });
      }, 150);
    }
  }, []);

  const [isReconnecting, setIsReconnecting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const initialTab: ConnectionStateTab =
    route?.params?.initialState === 'out_of_range' || route?.params?.initialTab === 'out_of_range'
      ? 'out_of_range'
      : route?.params?.initialState === 'syncing' || route?.params?.initialTab === 'syncing'
      ? 'syncing'
      : 'disabled';

  const [activeTab, setActiveTab] = useState<ConnectionStateTab>(initialTab);

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

  if (devices.length === 0) {
    return (
      <View style={[styles.root, { backgroundColor: colors.bg }]}>
        <AppBar
          title={t('connection.title')}
          showBack={true}
          onBack={() => navigation?.goBack?.()}
        />
        <EmptyState
          icon="air"
          title={t('connection.noDevicesTitle')}
          description=""
          actionTitle={t('connection.pairCta')}
          onAction={() => (navigation as any)?.navigate?.('DevicePairing')}
        />
      </View>
    );
  }

  const activeDevice =
    (route?.params?.deviceId ? devices.find((d) => d.id === route.params.deviceId) : null) ||
    devices.find((d) => d.id === selectedDeviceId) ||
    devices[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleRetry = () => {
    setIsReconnecting(true);
    showToast(t('connection.toastReconnecting'));
    setTimeout(() => {
      setIsReconnecting(false);
      setConnectionStatus('connected');
      showToast(t('connection.toastConnected'));
    }, 1800);
  };

  const handleOpenSettings = () => {
    showToast(t('connection.toastOpeningSettings'));
    Linking.openSettings?.();
  };

  const handleOfflineMode = () => {
    showToast(t('connection.toastOfflineMode'));
    navigation?.goBack?.();
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      {/* 64pt App Bar with leading title */}
      <AppBar
        title={t('connection.title')}
        showBack={true}
        onBack={() => navigation?.goBack?.()}
        centerTitle={false}
        actions={[
          {
            avatar: require('../../assets/photos/avatar.jpg'),
            onPress: () => (navigation as any)?.navigate?.('MainTabs', { screen: 'Account' }),
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
          <View style={[styles.liveStatusBadge, { backgroundColor: colors.surfaceMuted }]}>
            <Icon name="sensors" size={14} color={colors.primary} />
            <Text style={[styles.liveStatusBadgeText, { color: colors.primary, letterSpacing: 0 }]}>
              {t('connection.badge')}
            </Text>
          </View>

          <Text style={[styles.screenTitle, { color: colors.text, letterSpacing: 0 }]}>
            {t('connection.title')}
          </Text>

          <Text style={[styles.screenSubtitle, { color: colors.textMuted, letterSpacing: 0 }]}>
            {t('connection.subtitle')}
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
                {t('connection.tabDisabled')}
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
                {t('connection.tabOutOfRange')}
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
                {t('connection.tabSyncing')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* STATE A: Bluetooth Disabled */}
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
                </View>
              </View>
              {/* Botanical sprig badge */}
              <View style={[styles.botanicalBadge, { backgroundColor: colors.accent }]}>
                <Icon name="eco" size={16} color={colors.primary} />
              </View>
            </View>

            {/* Context & Description */}
            <View style={[styles.badgePill, { backgroundColor: colors.surfaceMuted }]}>
              <View style={[styles.statusDot, { backgroundColor: colors.textSubtle }]} />
              <Text style={[styles.badgePillText, { color: colors.textMuted, letterSpacing: 0 }]}>
                {t('connection.radioSilent')}
              </Text>
            </View>

            <Text style={[styles.stateTitleText, { color: colors.text, letterSpacing: 0 }]}>
              {t('connection.bluetoothOffTitle')}
            </Text>

            <Text style={[styles.stateBodyText, { color: colors.textMuted, letterSpacing: 0 }]}>
              {t('connection.bluetoothOffDesc')}
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
                  {t('connection.openSettings')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleOfflineMode}
                style={[styles.secondaryBtn, { backgroundColor: colors.surfaceMuted }]}
              >
                <Icon name="cloud_off" size={18} color={colors.text} />
                <Text style={[styles.secondaryBtnText, { color: colors.text, letterSpacing: 0 }]}>
                  {t('connection.continueOffline')}
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
                  {t('connection.autonomousRhythmTitle')}
                </Text>
                <Text style={[styles.autoRhythmBody, { color: colors.textMuted, letterSpacing: 0 }]}>
                  {t('connection.autonomousRhythmDesc')}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* STATE B: Out of Range / Disconnected */}
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
                    {getLocalizedDeviceName(activeDevice.name, isRTL)}
                  </Text>
                  <Text style={[typography.labelSm, { color: colors.textSubtle, letterSpacing: 0 }]}>
                    {`Odora A316 · ${getLocalizedRoomName(activeDevice.roomName, isRTL)}`}
                  </Text>
                </View>
              </View>
              <View style={[styles.disconnectBadge, { backgroundColor: colors.surfaceHigh }]}>
                <Text style={[typography.labelSm, { color: colors.textMuted, fontSize: 11, letterSpacing: 0 }]}>
                  {t('connection.disconnected')}
                </Text>
              </View>
            </View>

            {/* Ambient Status Banner */}
            <View style={[styles.ambientStatusBanner, { backgroundColor: colors.surfaceMuted }]}>
              <Icon name="history" size={22} color={colors.primary} />
              <View style={{ marginStart: 10, flex: 1 }}>
                <Text style={[typography.bodySm, { color: colors.text, fontWeight: '600', letterSpacing: 0 }]}>
                  {t('connection.lastSeen')}
                </Text>
                <Text style={[typography.labelSm, { color: colors.textMuted, letterSpacing: 0 }]}>
                  {t('connection.estimatedDistance')}
                </Text>
              </View>
            </View>

            {/* Reconnection Checklist */}
            <View style={styles.reconnectSection}>
              <Text style={[styles.reconnectHeaderTitle, { color: colors.text, letterSpacing: 0 }]}>
                {t('connection.reconnectionProtocol')}
              </Text>
              <View style={[styles.checklistItem, { backgroundColor: colors.surface }]}>
                <Icon name="power" size={20} color={colors.primary} />
                <Text style={[styles.checklistText, { color: colors.text, letterSpacing: 0 }]}>
                  {t('connection.checkPower')}
                </Text>
                <Icon name="check_circle" size={18} color={colors.primary} />
              </View>
              <View style={[styles.checklistItem, { backgroundColor: colors.surface }]}>
                <Icon name="straighten" size={20} color={colors.primary} />
                <Text style={[styles.checklistText, { color: colors.text, letterSpacing: 0 }]}>
                  {t('connection.checkDistance')}
                </Text>
                <Icon name="radio_button_unchecked" size={18} color={colors.textSubtle} />
              </View>
              <View style={[styles.checklistItem, { backgroundColor: colors.surface }]}>
                <Icon name="lightbulb" size={20} color={colors.primary} />
                <Text style={[styles.checklistText, { color: colors.text, letterSpacing: 0 }]}>
                  {t('connection.checkLed')}
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
                  ? t('connection.reconnectingBle')
                  : t('connection.attemptReconnect')}
              </Text>
            </TouchableOpacity>

            {/* Cartridge Snapshot preview */}
            <View style={styles.cartridgeSnapshotRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="opacity" size={16} color={colors.primary} />
                <Text style={[typography.labelSm, { color: colors.textMuted, letterSpacing: 0 }]}>
                  {`${t('deviceControl.activeOil')}: ${getLocalizedOilName(activeDevice.oilName, isRTL)}`}
                </Text>
              </View>
              <Text style={[typography.labelSm, { color: colors.text, fontWeight: '600', letterSpacing: 0 }]}>
                {`${activeDevice.oilLevel}%`}
              </Text>
            </View>
          </View>
        )}

        {/* STATE C: Connecting & Synchronizing */}
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
                {t('connection.channelHandshake')}
              </Text>
            </View>

            <Text style={[styles.stateTitleText, { color: colors.text, letterSpacing: 0 }]}>
              {t('connection.syncingAtmosphere')}
            </Text>

            <Text style={[styles.stateBodyText, { color: colors.textMuted, letterSpacing: 0 }]}>
              {t('connection.syncingBody', { name: getLocalizedDeviceName(activeDevice.name, isRTL) })}
            </Text>

            {/* Exactly 3 rows (or 4 when activeDevice.oilSensor === true) */}
            <View style={[styles.syncChecklist, { backgroundColor: colors.surfaceMuted }]}>
              <View style={styles.syncRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Icon name="done" size={18} color={colors.primary} />
                  <Text style={[typography.bodySm, { color: colors.text, letterSpacing: 0 }]}>
                    {t('connection.checkDeviceFound')}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="done" size={16} color={colors.primary} />
                  <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '600', letterSpacing: 0 }]}>
                    {t('connection.verified')}
                  </Text>
                </View>
              </View>

              <View style={styles.syncRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Icon name="bluetooth" size={18} color={colors.primary} />
                  <Text style={[typography.bodySm, { color: colors.text, letterSpacing: 0 }]}>
                    {t('connection.checkConnected')}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="done" size={16} color={colors.primary} />
                  <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '600', letterSpacing: 0 }]}>
                    {t('connection.verified')}
                  </Text>
                </View>
              </View>

              <View style={styles.syncRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Icon name="sync" size={18} color={colors.primary} />
                  <Text style={[typography.bodySm, { color: colors.text, letterSpacing: 0 }]}>
                    {t('connection.checkSyncSettings')}
                  </Text>
                </View>
                <Text style={[typography.labelSm, { color: colors.textMuted, fontWeight: '600', letterSpacing: 0 }]}>
                  {t('connection.syncingStatus')}
                </Text>
              </View>

              {activeDevice.oilSensor && (
                <View style={styles.syncRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Icon name="water_drop" size={18} color={colors.primary} />
                    <Text style={[typography.bodySm, { color: colors.text, letterSpacing: 0 }]}>
                      {t('connection.checkReadOil')}
                    </Text>
                  </View>
                  <Text style={[typography.labelSm, { color: colors.textSubtle, letterSpacing: 0 }]}>
                    {t('connection.queuedStatus')}
                  </Text>
                </View>
              )}

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
                {t('connection.cancelSync')}
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
              {t('connection.activeHardware')}
            </Text>
            <Text style={[styles.deviceCardTitle, { color: colors.text, letterSpacing: 0 }]} numberOfLines={1}>
              {getLocalizedDeviceName(activeDevice.name, isRTL)}
            </Text>
            <Text style={[styles.deviceCardSubtitle, { color: colors.textMuted, letterSpacing: 0 }]} numberOfLines={1}>
              {`Odora A316 · ${getLocalizedRoomName(activeDevice.roomName, isRTL)}`}
            </Text>
            <View style={styles.deviceCardBadgeRow}>
              <View style={[styles.greenDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.deviceCardBadgeText, { color: colors.text, letterSpacing: 0 }]}>
                {t('connection.lastSettings', {
                  level: activeDevice.intensity,
                  mode: activeDevice.mode === 'interval' ? t('deviceControl.interval') : t('deviceControl.continuous'),
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer Note per Stitch idea-02 */}
        <View style={styles.footerSection}>
          <View style={styles.footerBadgeRow}>
            <Icon name="verified_user" size={16} color={colors.textSubtle} />
            <Text style={[styles.footerBadgeText, { color: colors.textSubtle, letterSpacing: 0 }]}>
              {t('connection.offlineIntegrityTitle')}
            </Text>
          </View>
          <Text style={[styles.footerText, { color: colors.textMuted, letterSpacing: 0 }]}>
            {t('connection.offlineIntegrityDesc')}
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
  liveStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.full,
    marginBottom: 8,
  },
  liveStatusBadgeText: {
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
    borderRadius: radii.full,
    padding: 4,
    marginTop: 18,
    width: '100%',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: radii.full,
  },
  tabBtnText: {
    fontSize: 12,
  },
  stateAContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  deviceArtBox: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  haloGlowRing: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    opacity: 0.45,
  },
  circularArtBackdrop: {
    width: 176,
    height: 176,
    borderRadius: 88,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circularArtImg: {
    width: '100%',
    height: '100%',
  },
  circularArtOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  btCenterNode: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  botanicalBadge: {
    position: 'absolute',
    bottom: 8,
    end: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.full,
    marginBottom: 10,
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
    textAlign: 'center',
    marginBottom: 8,
  },
  stateBodyText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  buttonsColumn: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: radii.full,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: radii.full,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '500',
  },
  autoRhythmCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    width: '100%',
    gap: 14,
    marginBottom: 16,
  },
  autoRhythmIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoRhythmTextBox: {
    flex: 1,
  },
  autoRhythmTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  autoRhythmBody: {
    fontSize: 12,
    lineHeight: 16,
  },
  stateCardBox: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  beaconHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  ambientStatusBanner: {
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
    paddingTop: 14,
    marginTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  syncVisualBox: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    position: 'relative',
  },
  syncPulseOuter: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  syncPulseMid: {
    position: 'absolute',
    width: 108,
    height: 108,
    borderRadius: 54,
  },
  syncNodeCenter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  syncBleText: {
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
  },
  syncChecklist: {
    width: '100%',
    borderRadius: 18,
    padding: 14,
    gap: 12,
    marginVertical: 14,
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  cancelSyncBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    gap: 14,
    marginBottom: 20,
  },
  deviceCardThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  deviceCardTextCol: {
    flex: 1,
  },
  deviceCardOverline: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  deviceCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  deviceCardSubtitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  deviceCardBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    paddingBottom: 24,
    paddingHorizontal: 12,
  },
  footerBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  footerBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
  },
});
