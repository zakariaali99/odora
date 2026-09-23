import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  I18nManager,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';
import { Icon } from '../components/ui/Icon';
import { AppBar } from '../components/ui/AppBar';

const SAGE_DIFFUSER = require('../../assets/photos/diffuser-a316-sage.png');
const LIVINGROOM_DIFFUSER = require('../../assets/photos/diffuser_sage_livingroom.png');

interface ConnectionStatesScreenProps {
  navigation?: any;
  route?: any;
}

type ConnectionStateTab = 'disabled' | 'out_of_range' | 'syncing';

export const ConnectionStatesScreen: React.FC<ConnectionStatesScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors, isDark, isRTL } = useTheme();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<ConnectionStateTab>(
    route?.params?.initialTab || 'disabled'
  );

  // Animations
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    Animated.sequence([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(2200),
      Animated.timing(toastOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => setToastMessage(null));
  };

  useEffect(() => {
    // Rotation for syncing
    const spinAnim = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Pulse for beacon
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.15,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    spinAnim.start();
    pulseAnim.start();

    return () => {
      spinAnim.stop();
      pulseAnim.stop();
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleReconnect = () => {
    setIsReconnecting(true);
    showToast('Scanning for BLE advertisement packet...');
    setTimeout(() => {
      setIsReconnecting(false);
      setActiveTab('syncing');
      showToast('Odora Air 01 detected! Handshaking...');
    }, 1500);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      {/* AppBar */}
      <AppBar
        title={isRTL ? 'حالات الاتصال بالبلوتوث' : 'System Resonance'}
        showBack={true}
        onBack={() => navigation?.goBack?.()}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Telemetry Badge & Title */}
        <View style={styles.headerSection}>
          <View
            style={[
              styles.telemetryBadge,
              { backgroundColor: isDark ? 'rgba(213,230,178,0.18)' : '#D5E6B2' },
            ]}
          >
            <Icon name="sensors" size={15} color={colors.primary} />
            <Text
              style={[
                styles.telemetryBadgeText,
                { color: colors.primary },
              ]}
            >
              HARDWARE TELEMETRY
            </Text>
          </View>

          <Text
            style={[
              styles.screenTitle,
              { color: colors.text },
            ]}
          >
            System Resonance
          </Text>

          <Text
            style={[
              styles.screenSubtitle,
              { color: colors.textMuted },
            ]}
          >
            Hardware status & wireless BLE 5.2 synchronization diagnostic
          </Text>

          {/* State Switcher Pills */}
          <View
            style={[
              styles.tabBar,
              { backgroundColor: colors.surfaceHigh },
            ]}
          >
            <TouchableOpacity
              onPress={() => setActiveTab('disabled')}
              style={[
                styles.tabBtn,
                activeTab === 'disabled' && {
                  backgroundColor: colors.primary,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
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
                    fontFamily: activeTab === 'disabled'
                      ? typography.labelLg.fontFamily
                      : typography.labelMd.fontFamily,
                  },
                ]}
              >
                Disabled
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('out_of_range')}
              style={[
                styles.tabBtn,
                activeTab === 'out_of_range' && {
                  backgroundColor: colors.primary,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
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
                    fontFamily: activeTab === 'out_of_range'
                      ? typography.labelLg.fontFamily
                      : typography.labelMd.fontFamily,
                  },
                ]}
              >
                Out of Range
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab('syncing')}
              style={[
                styles.tabBtn,
                activeTab === 'syncing' && {
                  backgroundColor: colors.primary,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
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
                    fontFamily: activeTab === 'syncing'
                      ? typography.labelLg.fontFamily
                      : typography.labelMd.fontFamily,
                  },
                ]}
              >
                Syncing
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* STATE A: Bluetooth Disabled */}
        {activeTab === 'disabled' && (
          <View style={styles.stateContainer}>
            {/* Visual Halo & Botanical Device Art */}
            <View style={styles.haloGraphicContainer}>
              <View
                style={[
                  styles.haloGlow,
                  { backgroundColor: isDark ? 'rgba(213,230,178,0.12)' : 'rgba(213,230,178,0.35)' },
                ]}
              />
              <View
                style={[
                  styles.ceramicCircle,
                  { backgroundColor: colors.surface },
                ]}
              >
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: colors.bgAlt },
                  ]}
                >
                  <Icon
                    name="bluetooth_disabled"
                    size={40}
                    color={colors.textMuted}
                  />
                  {/* Glowing slash accent */}
                  <View style={[styles.slashAccent, { backgroundColor: colors.primary }]} />
                </View>

                {/* Eco sprig badge */}
                <View
                  style={[
                    styles.ecoBadge,
                    { backgroundColor: '#D5E6B2' },
                  ]}
                >
                  <Icon name="eco" size={16} color={colors.primary} />
                </View>
              </View>
            </View>

            {/* Context & Description */}
            <View style={styles.contextCol}>
              <View
                style={[
                  styles.radioBadge,
                  { backgroundColor: colors.surfaceMuted },
                ]}
              >
                <View style={[styles.radioDot, { backgroundColor: colors.textSubtle }]} />
                <Text
                  style={[
                    styles.radioText,
                    { color: colors.textMuted },
                  ]}
                >
                  RADIO TRANSCEIVER SILENT
                </Text>
              </View>

              <Text
                style={[
                  styles.stateTitle,
                  { color: colors.text },
                ]}
              >
                Bluetooth is Switched Off
              </Text>

              <Text
                style={[
                  styles.stateDescription,
                  { color: colors.textMuted },
                ]}
              >
                Odora requires Bluetooth Low Energy (BLE 5.2) to orchestrate cold-air micro-diffusion and read cartridge levels. Turn on Bluetooth in your device settings.
              </Text>

              {/* Action Buttons */}
              <View style={styles.actionCol}>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openSettings?.();
                    showToast('Opening device settings...');
                  }}
                  style={[
                    styles.primaryCtaBtn,
                    { backgroundColor: colors.ink },
                  ]}
                >
                  <Icon name="bluetooth" size={20} color={colors.onInk} />
                  <Text
                    style={[
                      styles.primaryCtaText,
                      { color: colors.onInk },
                    ]}
                  >
                    Open System Settings
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    showToast('Switching to offline circadian cache...');
                  }}
                  style={[
                    styles.secondaryCtaBtn,
                    { backgroundColor: colors.surfaceHigh },
                  ]}
                >
                  <Icon name="cloud_off" size={18} color={colors.text} />
                  <Text
                    style={[
                      styles.secondaryCtaText,
                      { color: colors.text },
                    ]}
                  >
                    Continue in Offline Read-Only Mode
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Autonomous Circadian Tip Callout */}
              <View
                style={[
                  styles.tipCard,
                  { backgroundColor: colors.bgAlt },
                ]}
              >
                <View
                  style={[
                    styles.tipIconCircle,
                    { backgroundColor: isDark ? 'rgba(213,230,178,0.18)' : '#D5E6B2' },
                  ]}
                >
                  <Icon name="wb_twilight" size={18} color={colors.primary} />
                </View>
                <View style={styles.tipTextCol}>
                  <Text style={[styles.tipOverline, { color: colors.primary }]}>
                    AUTONOMOUS RHYTHM
                  </Text>
                  <Text
                    style={[
                      styles.tipBody,
                      { color: colors.textMuted },
                    ]}
                  >
                    Your diffuser will continue its last active circadian cycle independently.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* STATE B: Out of Range / Disconnected */}
        {activeTab === 'out_of_range' && (
          <View style={styles.stateContainer}>
            <View
              style={[
                styles.disconnectedCard,
                { backgroundColor: colors.surface },
              ]}
            >
              {/* Beacon Ripple Status Header */}
              <View style={styles.beaconHeader}>
                <View style={styles.beaconInfo}>
                  <Animated.View
                    style={[
                      styles.beaconRippleCircle,
                      {
                        backgroundColor: colors.surfaceMuted,
                        transform: [{ scale: pulseValue }],
                      },
                    ]}
                  >
                    <Icon name="podcasts" size={24} color={colors.primary} />
                  </Animated.View>
                  <View style={styles.beaconTextCol}>
                    <Text
                      style={[
                        styles.beaconTitle,
                        { color: colors.text },
                      ]}
                    >
                      Living Room Atelier
                    </Text>
                    <Text
                      style={[
                        styles.beaconSubtitle,
                        { color: colors.textSubtle },
                      ]}
                    >
                      ODORA AIR 01 • MODEL SA-200
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.disconnectedBadge,
                    { backgroundColor: colors.surfaceHigh },
                  ]}
                >
                  <Text
                    style={[
                      styles.disconnectedText,
                      { color: colors.textMuted },
                    ]}
                  >
                    Disconnected
                  </Text>
                </View>
              </View>

              {/* Ambient Telemetry Status Banner */}
              <View
                style={[
                  styles.telemetryBanner,
                  { backgroundColor: colors.bgAlt },
                ]}
              >
                <Icon name="history" size={22} color={colors.primary} />
                <View style={styles.telemetryBannerTextCol}>
                  <Text
                    style={[
                      styles.telemetryBannerMain,
                      { color: colors.text },
                    ]}
                  >
                    Last seen 18 minutes ago
                  </Text>
                  <Text
                    style={[
                      styles.telemetryBannerSub,
                      { color: colors.textMuted },
                    ]}
                  >
                    Estimated distance &gt; 18.5 meters away
                  </Text>
                </View>
              </View>

              {/* Troubleshooting Checklist */}
              <View style={styles.checklistSection}>
                <Text
                  style={[
                    styles.checklistHeader,
                    { color: colors.text },
                  ]}
                >
                  RECONNECTION PROTOCOL
                </Text>

                <View
                  style={[
                    styles.checklistItem,
                    { backgroundColor: colors.surfaceMuted },
                  ]}
                >
                  <Icon name="power" size={20} color={colors.primary} />
                  <Text
                    style={[
                      styles.checklistText,
                      { color: colors.text },
                    ]}
                  >
                    Ensure diffuser is plugged into AC power
                  </Text>
                  <Icon name="check_circle" size={18} color={colors.primary} />
                </View>

                <View
                  style={[
                    styles.checklistItem,
                    { backgroundColor: colors.surfaceMuted },
                  ]}
                >
                  <Icon name="straighten" size={20} color={colors.primary} />
                  <Text
                    style={[
                      styles.checklistText,
                      { color: colors.text },
                    ]}
                  >
                    Bring phone within 15 meters line-of-sight
                  </Text>
                  <Icon name="radio_button_unchecked" size={18} color={colors.textSubtle} />
                </View>

                <View
                  style={[
                    styles.checklistItem,
                    { backgroundColor: colors.surfaceMuted },
                  ]}
                >
                  <Icon name="lightbulb" size={20} color={colors.primary} />
                  <Text
                    style={[
                      styles.checklistText,
                      { color: colors.text },
                    ]}
                  >
                    Check that base ceramic LED halo is glowing
                  </Text>
                  <Icon name="radio_button_unchecked" size={18} color={colors.textSubtle} />
                </View>
              </View>

              {/* Reconnect Action Button */}
              <TouchableOpacity
                onPress={handleReconnect}
                disabled={isReconnecting}
                style={[
                  styles.primaryCtaBtn,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Icon name="refresh" size={20} color={colors.onPrimary} />
                <Text
                  style={[
                    styles.primaryCtaText,
                    { color: colors.onPrimary },
                  ]}
                >
                  {isReconnecting ? 'Searching...' : 'Attempt BLE Reconnect'}
                </Text>
              </TouchableOpacity>

              {/* Cartridge Snapshot preview */}
              <View
                style={[
                  styles.cartridgeSnapshot,
                  { borderTopColor: colors.surfaceHigh },
                ]}
              >
                <View style={styles.cartridgeRow}>
                  <Icon name="opacity" size={16} color={colors.primary} />
                  <Text
                    style={[
                      styles.cartridgeName,
                      { color: colors.textMuted },
                    ]}
                  >
                    Cartridge: Hinoki Canopy
                  </Text>
                </View>
                <Text
                  style={[
                    styles.cartridgeLevel,
                    { color: colors.text },
                  ]}
                >
                  Cached: 74% remaining
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* STATE C: Connecting & Synchronizing */}
        {activeTab === 'syncing' && (
          <View style={styles.stateContainer}>
            <View
              style={[
                styles.disconnectedCard,
                { backgroundColor: colors.surface, alignItems: 'center' },
              ]}
            >
              {/* Concentric Pulsing Visual */}
              <View style={styles.syncVisualContainer}>
                <View
                  style={[
                    styles.syncPulseLayer3,
                    { backgroundColor: isDark ? 'rgba(213,230,178,0.12)' : 'rgba(213,230,178,0.25)' },
                  ]}
                />
                <View
                  style={[
                    styles.syncPulseLayer2,
                    { backgroundColor: isDark ? 'rgba(213,230,178,0.20)' : 'rgba(213,230,178,0.45)' },
                  ]}
                />
                <View
                  style={[
                    styles.syncPulseLayer1,
                    { backgroundColor: isDark ? 'rgba(213,230,178,0.35)' : 'rgba(213,230,178,0.75)' },
                  ]}
                />
                <View
                  style={[
                    styles.syncCenterNode,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Icon name="sync" size={30} color={colors.primary} />
                  </Animated.View>
                  <Text
                    style={[
                      styles.syncNodeText,
                      { color: colors.primary },
                    ]}
                  >
                    BLE 5.2
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.telemetryBadge,
                  { backgroundColor: isDark ? 'rgba(213,230,178,0.18)' : '#D5E6B2', marginBottom: 12 },
                ]}
              >
                <View style={[styles.pingDot, { backgroundColor: colors.primary }]} />
                <Text
                  style={[
                    styles.telemetryBadgeText,
                    { color: colors.primary },
                  ]}
                >
                  CHANNEL HANDSHAKE
                </Text>
              </View>

              <Text
                style={[
                  styles.stateTitle,
                  { color: colors.text, textAlign: 'center' },
                ]}
              >
                Synchronizing Atmosphere...
              </Text>

              <Text
                style={[
                  styles.stateDescription,
                  { color: colors.textMuted, textAlign: 'center', marginBottom: 20 },
                ]}
              >
                Establishing AES-256 encrypted handshake with Odora Air 01 and querying cartridge piezo sensors.
              </Text>

              {/* Synchronizing Telemetry Checklist */}
              <View
                style={[
                  styles.syncTelemetryCard,
                  { backgroundColor: colors.bgAlt },
                ]}
              >
                <View style={styles.syncRow}>
                  <View style={styles.syncRowLeft}>
                    <Icon name="lock" size={18} color={colors.primary} />
                    <Text style={[styles.syncRowLabel, { color: colors.text }]}>
                      Secure Key Agreement
                    </Text>
                  </View>
                  <View style={styles.verifiedTag}>
                    <Icon name="done" size={16} color={colors.primary} />
                    <Text style={[styles.verifiedTagText, { color: colors.primary }]}>
                      Verified
                    </Text>
                  </View>
                </View>

                <View style={styles.syncRow}>
                  <View style={styles.syncRowLeft}>
                    <Icon name="analytics" size={18} color={colors.primary} />
                    <Text style={[styles.syncRowLabel, { color: colors.text }]}>
                      Cartridge Ultrasonic Level
                    </Text>
                  </View>
                  <Text style={[styles.syncingTagText, { color: colors.textMuted }]}>
                    Syncing...
                  </Text>
                </View>

                <View style={styles.syncRow}>
                  <View style={styles.syncRowLeft}>
                    <Icon name="schedule" size={18} color={colors.primary} />
                    <Text style={[styles.syncRowLabel, { color: colors.text }]}>
                      Circadian Micro-Mist Schedule
                    </Text>
                  </View>
                  <Text style={[styles.queuedTagText, { color: colors.textSubtle }]}>
                    Queued
                  </Text>
                </View>

                {/* Progress bar */}
                <View
                  style={[
                    styles.syncProgressBarTrack,
                    { backgroundColor: colors.surfaceHigh },
                  ]}
                >
                  <View
                    style={[
                      styles.syncProgressBarFill,
                      { backgroundColor: colors.primarySoft },
                    ]}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setActiveTab('disabled');
                  showToast('Aborting wireless handshake cleanly.');
                }}
                style={styles.cancelBtn}
              >
                <Text
                  style={[
                    styles.cancelBtnText,
                    { color: colors.textMuted },
                  ]}
                >
                  Cancel Pairing Sequence
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Architectural Luxury Hardware Profile Card */}
        <View
          style={[
            styles.architecturalCard,
            { backgroundColor: colors.bgAlt },
          ]}
        >
          <View style={styles.hardwarePhotoWrapper}>
            <Image
              source={LIVINGROOM_DIFFUSER}
              style={styles.hardwarePhoto}
              resizeMode="cover"
            />
          </View>
          <View style={styles.hardwareInfoCol}>
            <Text style={[styles.hardwareOverline, { color: colors.primary }]}>
              ACTIVE ARCHITECTURE
            </Text>
            <Text
              style={[
                styles.hardwareTitle,
                { color: colors.text },
              ]}
              numberOfLines={1}
            >
              Odora Air 01 • Atelier edition
            </Text>
            <Text
              style={[
                styles.hardwareSubtitle,
                { color: colors.textMuted },
              ]}
              numberOfLines={1}
            >
              Cold-Air Acoustic Atomizer
            </Text>
            <View style={styles.hardwareCertRow}>
              <View style={[styles.certDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.certText, { color: colors.text }]}>
                Sub-22dB Quiet Mark Certified
              </Text>
            </View>
          </View>
        </View>

        {/* Sanctuary Footnote */}
        <View style={styles.footerSection}>
          <View style={styles.footnoteBadge}>
            <Icon name="verified_user" size={16} color={colors.textSubtle} />
            <Text style={[styles.footnoteBadgeText, { color: colors.textSubtle }]}>
              OFFLINE-FIRST INTEGRITY
            </Text>
          </View>
          <Text
            style={[
              styles.footnoteText,
              { color: colors.textMuted },
            ]}
          >
            Odora hardware stores all timer schedules on-device and never relies on cloud servers for basic misting.
          </Text>
        </View>
      </ScrollView>

      {/* Toast Notification */}
      {toastMessage && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              backgroundColor: colors.ink,
              opacity: toastOpacity,
              bottom: insets.bottom + 20,
            },
          ]}
        >
          <Icon name="info" size={18} color="#D8E9B5" />
          <Text
            style={[
              styles.toastText,
              { color: colors.onInk },
            ]}
          >
            {toastMessage}
          </Text>
        </Animated.View>
      )}
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
    gap: 20,
  },
  headerSection: {
    alignItems: 'center',
    gap: 6,
  },
  telemetryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 4,
  },
  telemetryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
    fontFamily: typography.labelLg.fontFamily,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '400',
    fontFamily: typography.headlineLg.fontFamily,
    letterSpacing: -0.2,
  },
  screenSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 290,
    lineHeight: 18,
    fontFamily: typography.bodySm.fontFamily,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 999,
    padding: 4,
    width: '100%',
    maxWidth: 350,
    marginTop: 12,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 999,
  },
  tabBtnText: {
    fontSize: 12,
  },
  stateContainer: {
    alignItems: 'center',
  },
  // State A
  haloGraphicContainer: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    position: 'relative',
  },
  haloGlow: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
  },
  ceramicCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    position: 'relative',
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  slashAccent: {
    position: 'absolute',
    width: 44,
    height: 2,
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
  ecoBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contextCol: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    gap: 8,
  },
  radioBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  radioDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  radioText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    fontFamily: typography.labelLg.fontFamily,
  },
  stateTitle: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: typography.headlineMd.fontFamily,
    marginTop: 4,
  },
  stateDescription: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: typography.bodyMd.fontFamily,
    marginBottom: 8,
  },
  actionCol: {
    width: '100%',
    gap: 10,
    marginBottom: 16,
  },
  primaryCtaBtn: {
    width: '100%',
    height: 52,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryCtaText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: typography.labelLg.fontFamily,
  },
  secondaryCtaBtn: {
    width: '100%',
    height: 48,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryCtaText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: typography.labelMd.fontFamily,
  },
  tipCard: {
    width: '100%',
    borderRadius: radii.card,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  tipIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTextCol: {
    flex: 1,
    gap: 2,
  },
  tipOverline: {
    fontSize: 10,
    letterSpacing: 1.2,
    fontWeight: '600',
    fontFamily: typography.labelLg.fontFamily,
  },
  tipBody: {
    fontSize: 12,
    lineHeight: 17,
    fontFamily: typography.bodySm.fontFamily,
  },
  // State B
  disconnectedCard: {
    width: '100%',
    maxWidth: 350,
    borderRadius: radii.card,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 16,
  },
  beaconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  beaconInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  beaconRippleCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beaconTextCol: {
    gap: 2,
  },
  beaconTitle: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: typography.headlineSm.fontFamily,
  },
  beaconSubtitle: {
    fontSize: 10,
    letterSpacing: 0.8,
    fontFamily: typography.labelSm.fontFamily,
  },
  disconnectedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  disconnectedText: {
    fontSize: 11,
    fontFamily: typography.labelSm.fontFamily,
  },
  telemetryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: radii.md,
  },
  telemetryBannerTextCol: {
    flex: 1,
  },
  telemetryBannerMain: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: typography.bodySm.fontFamily,
  },
  telemetryBannerSub: {
    fontSize: 11,
    fontFamily: typography.labelSm.fontFamily,
  },
  checklistSection: {
    gap: 8,
  },
  checklistHeader: {
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '600',
    fontFamily: typography.labelLg.fontFamily,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: radii.md,
  },
  checklistText: {
    flex: 1,
    fontSize: 12,
    fontFamily: typography.bodySm.fontFamily,
  },
  cartridgeSnapshot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  cartridgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cartridgeName: {
    fontSize: 11,
    fontFamily: typography.bodySm.fontFamily,
  },
  cartridgeLevel: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: typography.bodySm.fontFamily,
  },
  // State C
  syncVisualContainer: {
    width: 170,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 12,
  },
  syncPulseLayer3: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  syncPulseLayer2: {
    position: 'absolute',
    width: 126,
    height: 126,
    borderRadius: 63,
  },
  syncPulseLayer1: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  syncCenterNode: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  syncNodeText: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.2,
    fontFamily: typography.labelLg.fontFamily,
    marginTop: 2,
  },
  pingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  syncTelemetryCard: {
    width: '100%',
    borderRadius: radii.md,
    padding: 14,
    gap: 12,
    marginBottom: 8,
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  syncRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  syncRowLabel: {
    fontSize: 12,
    fontFamily: typography.bodySm.fontFamily,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedTagText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: typography.labelLg.fontFamily,
  },
  syncingTagText: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: typography.bodySm.fontFamily,
  },
  queuedTagText: {
    fontSize: 11,
    fontFamily: typography.bodySm.fontFamily,
  },
  syncProgressBarTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 2,
  },
  syncProgressBarFill: {
    width: '66%',
    height: '100%',
    borderRadius: 3,
  },
  cancelBtn: {
    paddingVertical: 8,
  },
  cancelBtnText: {
    fontSize: 12,
    letterSpacing: 0.5,
    fontFamily: typography.labelMd.fontFamily,
  },
  // Architectural Hardware Card
  architecturalCard: {
    width: '100%',
    maxWidth: 350,
    borderRadius: radii.card,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  hardwarePhotoWrapper: {
    width: 72,
    height: 72,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  hardwarePhoto: {
    width: '100%',
    height: '100%',
  },
  hardwareInfoCol: {
    flex: 1,
    gap: 2,
  },
  hardwareOverline: {
    fontSize: 9,
    letterSpacing: 1.2,
    fontWeight: '600',
    fontFamily: typography.labelLg.fontFamily,
  },
  hardwareTitle: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: typography.headlineSm.fontFamily,
  },
  hardwareSubtitle: {
    fontSize: 11,
    fontFamily: typography.bodySm.fontFamily,
  },
  hardwareCertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  certDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  certText: {
    fontSize: 10,
    fontFamily: typography.labelSm.fontFamily,
  },
  // Footnote
  footerSection: {
    alignItems: 'center',
    gap: 4,
    maxWidth: 300,
    alignSelf: 'center',
  },
  footnoteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footnoteBadgeText: {
    fontSize: 10,
    letterSpacing: 1.2,
    fontFamily: typography.labelLg.fontFamily,
  },
  footnoteText: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    fontFamily: typography.bodySm.fontFamily,
  },
  // Toast
  toastContainer: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 100,
  },
  toastText: {
    fontSize: 13,
    fontFamily: typography.bodySm.fontFamily,
  },
});
