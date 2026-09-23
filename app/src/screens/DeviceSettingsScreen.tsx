import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  I18nManager,
  Animated,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';
import { Icon } from '../components/ui/Icon';
import { AppBar } from '../components/ui/AppBar';
import { Toggle } from '../components/ui/Toggle';
import { Slider } from '../components/ui/Slider';

const SAGE_DIFFUSER = require('../../assets/photos/diffuser-a316-sage.png');
const CLOSEUP_DIFFUSER = require('../../assets/photos/diffuser_sage_closeup.png');

interface DeviceSettingsScreenProps {
  navigation?: any;
  route?: any;
}

const ROOM_OPTIONS = [
  'Living Room Atelier',
  'Master Bedroom',
  'Studio Atelier',
  'Dining Gallery',
];

const TIMER_OPTIONS = ['Off', '30m', '1h', '2h', '4h', '8h'];

export const DeviceSettingsScreen: React.FC<DeviceSettingsScreenProps> = ({
  navigation,
  route,
}) => {
  const { colors, isDark, isRTL } = useTheme();
  const insets = useSafeAreaInsets();

  // State
  const [deviceName, setDeviceName] = useState(route?.params?.name || 'Living Room Diffuser');
  const [isRenaming, setIsRenaming] = useState(false);
  const [tempName, setTempName] = useState(deviceName);
  const [selectedRoom, setSelectedRoom] = useState(route?.params?.room || 'Living Room Atelier');

  // Lighting
  const [haloEnabled, setHaloEnabled] = useState(true);
  const [brightness, setBrightness] = useState(40);
  const [nightMode, setNightMode] = useState(true);

  // Cadence
  const [selectedTimer, setSelectedTimer] = useState('2h');
  const [lowOilGuard, setLowOilGuard] = useState(true);
  const [whisperDampening, setWhisperDampening] = useState(true);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastOpacity = useState(new Animated.Value(0))[0];

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
    ]).start(() => {
      setToastMessage(null);
    });
  };

  const handleSaveRename = () => {
    if (tempName.trim().length > 0) {
      setDeviceName(tempName.trim());
      setIsRenaming(false);
      showToast(isRTL ? `تمت إعادة التسمية إلى "${tempName.trim()}"` : `Renamed to "${tempName.trim()}"`);
    }
  };

  const handleCopySerial = () => {
    showToast(isRTL ? 'تم نسخ الرقم التسلسلي للحافظة' : 'Serial ID copied to clipboard');
  };

  const handleResetCache = () => {
    Alert.alert(
      isRTL ? 'إعادة تعيين الذاكرة المؤقتة' : 'Reset Local Cache',
      isRTL
        ? 'هل تريد مسح بيانات الذاكرة المؤقتة واستعادة الإعدادات الأصلية للمصنع؟'
        : 'Clear local profile cache and restore factory calibrations?',
      [
        { text: isRTL ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: isRTL ? 'إعادة التعيين' : 'Reset',
          style: 'destructive',
          onPress: () => showToast(isRTL ? 'تم تفريغ الذاكرة المؤقتة بنجاح' : 'Cache purged successfully'),
        },
      ]
    );
  };

  const handleUnpairDevice = () => {
    Alert.alert(
      isRTL ? 'إلغاء اقتران الموزع' : 'Sanctuary Uncoupling',
      isRTL
        ? 'هل أنت متأكد من رغبتك في إلغاء اقتران موزع أودورا من ملفك الشخصي؟'
        : 'Are you sure you wish to unpair this Odora Air 01 from your sanctuary profile?',
      [
        { text: isRTL ? 'إلغاء' : 'Cancel', style: 'cancel' },
        {
          text: isRTL ? 'إلغاء الاقتران والحذف' : 'Unpair & Remove',
          style: 'destructive',
          onPress: () => {
            showToast(isRTL ? 'تم إلغاء اقتران الموزع بنجاح' : 'Diffuser unlinked from sanctuary');
            setTimeout(() => {
              navigation?.goBack?.();
            }, 800);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      {/* 64pt App Bar */}
      <AppBar
        title={isRTL ? 'إعدادات الجهاز' : 'Device Settings'}
        showBack={true}
        onBack={() => navigation?.goBack?.()}
        actions={[
          {
            avatar: require('../../assets/photos/avatar.jpg'),
            onPress: () => navigation?.navigate?.('Account'),
            label: 'Profile',
          },
        ]}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 48 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. HERO DEVICE OVERVIEW */}
        <View
          style={[
            styles.heroCard,
            { backgroundColor: colors.bgAlt },
          ]}
        >
          {/* Ambient Glow */}
          <View
            style={[
              styles.ambientGlow,
              { backgroundColor: isDark ? 'rgba(88,98,68,0.15)' : 'rgba(88,98,68,0.10)' },
            ]}
          />

          {/* Diffuser Hardware Photo Presentation */}
          <View
            style={[
              styles.photoContainer,
              { backgroundColor: colors.surfaceMuted },
            ]}
          >
            <Image
              source={SAGE_DIFFUSER}
              style={styles.diffuserImage}
              resizeMode="contain"
            />
            {/* Active Pill */}
            <View
              style={[
                styles.activePill,
                { backgroundColor: 'rgba(253, 249, 245, 0.90)' },
              ]}
            >
              <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.activeText, { color: colors.text }]}>
                ACTIVE
              </Text>
            </View>
          </View>

          {/* Device Name Header & Inline Rename */}
          {!isRenaming ? (
            <View style={styles.nameRow}>
              <Text
                style={[
                  styles.deviceNameText,
                  { color: colors.text },
                ]}
              >
                {deviceName}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setTempName(deviceName);
                  setIsRenaming(true);
                }}
                style={styles.renameBtn}
                accessibilityLabel="Rename device"
              >
                <Icon name="edit" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.renameInputContainer}>
              <View
                style={[
                  styles.renameInputWrapper,
                  { backgroundColor: colors.surface },
                ]}
              >
                <TextInput
                  style={[
                    styles.renameInput,
                    {
                      color: colors.text,
                      textAlign: isRTL ? 'right' : 'left',
                    },
                  ]}
                  value={tempName}
                  onChangeText={setTempName}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleSaveRename}
                />
                <TouchableOpacity
                  onPress={handleSaveRename}
                  style={[styles.saveRenameBtn, { backgroundColor: colors.primary }]}
                >
                  <Icon name="check" size={16} color={colors.onPrimary} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Hardware Color & Ceramic Texture Pill */}
          <View style={styles.ceramicRow}>
            <View style={[styles.colorDot, { backgroundColor: colors.primary }]} />
            <Text
              style={[
                styles.ceramicText,
                { color: colors.textMuted },
              ]}
            >
              Sage Alabaster Ceramic
            </Text>
          </View>

          {/* Connection Status & Mesh Telemetry */}
          <View
            style={[
              styles.telemetryPill,
              { backgroundColor: isDark ? 'rgba(213,230,178,0.18)' : '#D5E6B2' },
            ]}
          >
            <View style={[styles.telemetryDot, { backgroundColor: colors.primary }]} />
            <Text
              style={[
                styles.telemetryText,
                { color: colors.primary },
              ]}
            >
              BLE 5.2 Connected · Signal Strong (-58 dBm)
            </Text>
          </View>
        </View>

        {/* 2. SPACE & PLACEMENT */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text
              style={[
                styles.sectionHeaderTitle,
                { color: colors.textMuted },
              ]}
            >
              SPATIAL ASSIGNMENT
            </Text>
            <Text style={[styles.zoneBadge, { color: colors.primary }]}>
              Aura Zone 01
            </Text>
          </View>

          <View
            style={[
              styles.cardContainer,
              { backgroundColor: colors.bgAlt },
            ]}
          >
            <View style={styles.currentSanctuaryRow}>
              <View style={styles.sanctuaryIconWrapper}>
                <View
                  style={[
                    styles.sanctuaryIconBg,
                    { backgroundColor: colors.surfaceMuted },
                  ]}
                >
                  <Icon name="chair" size={20} color={colors.primary} />
                </View>
                <View style={styles.sanctuaryTextCol}>
                  <Text
                    style={[
                      styles.sanctuaryCaption,
                      { color: colors.textMuted },
                    ]}
                  >
                    CURRENT SANCTUARY
                  </Text>
                  <Text
                    style={[
                      styles.sanctuaryTitle,
                      { color: colors.text },
                    ]}
                  >
                    {selectedRoom}
                  </Text>
                </View>
              </View>

              <View style={styles.changeActionRow}>
                <Text
                  style={[
                    styles.changeActionText,
                    { color: colors.textMuted },
                  ]}
                >
                  Change
                </Text>
                <Icon
                  name={isRTL ? 'chevron_left' : 'expand_more'}
                  size={18}
                  color={colors.textMuted}
                />
              </View>
            </View>

            {/* Room selection pills */}
            <View style={styles.roomPillsContainer}>
              {ROOM_OPTIONS.map((room) => {
                const isSelected = selectedRoom === room;
                return (
                  <TouchableOpacity
                    key={room}
                    onPress={() => {
                      setSelectedRoom(room);
                      showToast(`Moved to ${room}`);
                    }}
                    style={[
                      styles.roomPill,
                      {
                        backgroundColor: isSelected
                          ? colors.primary
                          : colors.surfaceMuted,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.roomPillText,
                        {
                          color: isSelected
                            ? colors.onPrimary
                            : colors.text,
                        },
                      ]}
                    >
                      {room}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* 3. HARDWARE LIGHTING & AMBIANCE */}
        <View style={styles.sectionContainer}>
          <Text
            style={[
              styles.sectionHeaderTitle,
              { color: colors.textMuted },
            ]}
          >
            ATMOSPHERE & ILLUMINATION
          </Text>

          <View
            style={[
              styles.cardContainer,
              { backgroundColor: colors.bgAlt },
            ]}
          >
            {/* LED Halo Ring Main Toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingIconCol}>
                <View
                  style={[
                    styles.settingIconBg,
                    { backgroundColor: colors.surfaceMuted },
                  ]}
                >
                  <Icon name="wb_twilight" size={20} color={colors.primary} />
                </View>
                <View style={styles.settingTextCol}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    LED Halo Ring
                  </Text>
                  <Text
                    style={[
                      styles.settingSubtitle,
                      { color: colors.textMuted },
                    ]}
                  >
                    2200K warm circadian baseline radiance
                  </Text>
                </View>
              </View>
              <Toggle
                value={haloEnabled}
                onValueChange={(val) => {
                  setHaloEnabled(val);
                  showToast(val ? 'Halo radiance enabled' : 'Halo radiance disabled');
                }}
              />
            </View>

            {/* LED Halo Intensity Slider */}
            <View style={styles.sliderSection}>
              <View style={styles.sliderHeaderRow}>
                <View style={styles.sliderTitleWithIcon}>
                  <Icon name="lightbulb" size={18} color={colors.primary} />
                  <Text
                    style={[
                      styles.sliderTitleText,
                      { color: colors.text },
                    ]}
                  >
                    Halo Intensity
                  </Text>
                </View>
                <Text style={[styles.sliderValueText, { color: colors.primary }]}>
                  {brightness}%
                </Text>
              </View>

              <Slider
                value={brightness / 100}
                onChange={(val) => {
                  const pct = Math.max(5, Math.min(100, Math.round(val * 100)));
                  setBrightness(pct);
                }}
              />

              <View style={styles.sliderMinMaxRow}>
                <Text
                  style={[
                    styles.sliderLimitText,
                    { color: colors.textMuted },
                  ]}
                >
                  Subtle Ember (5%)
                </Text>
                <Text
                  style={[
                    styles.sliderLimitText,
                    { color: colors.textMuted },
                  ]}
                >
                  Luminous Glow (100%)
                </Text>
              </View>
            </View>

            {/* Night Mode Dimming Schedule Card */}
            <View
              style={[
                styles.subCardRow,
                { backgroundColor: colors.surfaceMuted },
              ]}
            >
              <View style={styles.subCardInfo}>
                <View
                  style={[
                    styles.subCardIconBg,
                    { backgroundColor: colors.surfaceHigh },
                  ]}
                >
                  <Icon name="bedtime" size={16} color={colors.primary} />
                </View>
                <View style={styles.subCardTextCol}>
                  <Text style={[styles.subCardTitle, { color: colors.text }]}>
                    Night Mode Dimming
                  </Text>
                  <Text
                    style={[
                      styles.subCardSubtitle,
                      { color: colors.textMuted },
                    ]}
                  >
                    Mutes LEDs from 22:00 to 07:00
                  </Text>
                </View>
              </View>
              <Toggle
                value={nightMode}
                onValueChange={(val) => {
                  setNightMode(val);
                  showToast(val ? 'Night mode enabled' : 'Night mode disabled');
                }}
              />
            </View>
          </View>
        </View>

        {/* 4. OPERATING CADENCE & SAFETY */}
        <View style={styles.sectionContainer}>
          <Text
            style={[
              styles.sectionHeaderTitle,
              { color: colors.textMuted },
            ]}
          >
            CADENCE & ULTRASONIC CONTROL
          </Text>

          <View
            style={[
              styles.cardContainer,
              { backgroundColor: colors.bgAlt },
            ]}
          >
            {/* Auto-Off Sleep Timer Segmented */}
            <View style={styles.timerSection}>
              <View style={styles.timerHeaderRow}>
                <View style={styles.sliderTitleWithIcon}>
                  <Icon name="timer" size={18} color={colors.primary} />
                  <Text
                    style={[
                      styles.sliderTitleText,
                      { color: colors.text },
                    ]}
                  >
                    Auto-Off Sleep Timer
                  </Text>
                </View>
                <Text style={[styles.sliderValueText, { color: colors.primary }]}>
                  {selectedTimer === 'Off' ? 'Timer off' : `${selectedTimer} active`}
                </Text>
              </View>

              <View
                style={[
                  styles.timerGrid,
                  { backgroundColor: colors.surfaceMuted },
                ]}
              >
                {TIMER_OPTIONS.map((opt) => {
                  const isSelected = selectedTimer === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => {
                        setSelectedTimer(opt);
                        showToast(
                          opt === 'Off'
                            ? 'Sleep timer deactivated'
                            : `Sleep timer set for ${opt}`
                        );
                      }}
                      style={[
                        styles.timerBtn,
                        isSelected && {
                          backgroundColor: colors.primary,
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.1,
                          shadowRadius: 2,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.timerBtnText,
                          {
                            color: isSelected
                              ? colors.onPrimary
                              : colors.textMuted,
                            fontFamily: isSelected
                              ? typography.labelLg.fontFamily
                              : typography.labelMd.fontFamily,
                          },
                        ]}
                      >
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Low-Oil Auto Stop Toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingIconCol}>
                <View
                  style={[
                    styles.settingIconBg,
                    { backgroundColor: colors.surfaceMuted },
                  ]}
                >
                  <Icon name="opacity" size={20} color={colors.primary} />
                </View>
                <View style={styles.settingTextCol}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Low-Oil Guard
                  </Text>
                  <Text
                    style={[
                      styles.settingSubtitle,
                      { color: colors.textMuted },
                    ]}
                  >
                    Prevents dry cold-venturi nebulization when cartridge reservoir falls below 5%
                  </Text>
                </View>
              </View>
              <Toggle
                value={lowOilGuard}
                onValueChange={(val) => {
                  setLowOilGuard(val);
                  showToast(val ? 'Low-oil guard enabled' : 'Low-oil guard disabled');
                }}
              />
            </View>

            {/* Acoustic Whisper Dampening Toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingIconCol}>
                <View
                  style={[
                    styles.settingIconBg,
                    { backgroundColor: colors.surfaceMuted },
                  ]}
                >
                  <Icon name="volume_mute" size={20} color={colors.primary} />
                </View>
                <View style={styles.settingTextCol}>
                  <View style={styles.titleWithBadge}>
                    <Text style={[styles.settingTitle, { color: colors.text }]}>
                      Acoustic Whisper Dampening
                    </Text>
                    <View
                      style={[
                        styles.dbBadge,
                        { backgroundColor: '#D8E9B5' },
                      ]}
                    >
                      <Text style={[styles.dbBadgeText, { color: '#131F01' }]}>
                        &lt;14 dB
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.settingSubtitle,
                      { color: colors.textMuted },
                    ]}
                  >
                    Ultra-quiet vibration frequency for deep meditation and rest
                  </Text>
                </View>
              </View>
              <Toggle
                value={whisperDampening}
                onValueChange={(val) => {
                  setWhisperDampening(val);
                  showToast(val ? 'Whisper dampening enabled' : 'Whisper dampening disabled');
                }}
              />
            </View>
          </View>
        </View>

        {/* Secondary Photographic Atmospheric Accent */}
        <View
          style={[
            styles.accentBanner,
            { backgroundColor: colors.surfaceMuted },
          ]}
        >
          <View style={styles.accentTextCol}>
            <Text style={[styles.accentOverline, { color: colors.primary }]}>
              ARTISAN VESSEL
            </Text>
            <Text style={[styles.accentTitle, { color: colors.text }]}>
              Sculpted Alabaster & Clay
            </Text>
            <Text
              style={[
                styles.accentDescription,
                { color: colors.textMuted },
              ]}
            >
              Calibrated ultrasonic micro-diffusion preserving organic botanical terpenes.
            </Text>
          </View>

          <View style={styles.accentPhotoWrapper}>
            <Image
              source={CLOSEUP_DIFFUSER}
              style={styles.accentPhoto}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* 5. HARDWARE TECHNICAL SPECIFICATIONS */}
        <View style={styles.sectionContainer}>
          <Text
            style={[
              styles.sectionHeaderTitle,
              { color: colors.textMuted },
            ]}
          >
            DEVICE ARCHITECTURE & TELEMETRY
          </Text>

          <View
            style={[
              styles.cardContainer,
              { backgroundColor: colors.bgAlt, paddingVertical: 4 },
            ]}
          >
            {/* Spec Row 1: Model */}
            <View style={styles.specRow}>
              <Text
                style={[
                  styles.specLabel,
                  { color: colors.textMuted },
                ]}
              >
                Hardware Model
              </Text>
              <Text style={[styles.specValue, { color: colors.text }]}>
                Odora Air 01 (A316)
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.surfaceHigh }]} />

            {/* Spec Row 2: Serial */}
            <View style={styles.specRow}>
              <Text
                style={[
                  styles.specLabel,
                  { color: colors.textMuted },
                ]}
              >
                Serial ID
              </Text>
              <TouchableOpacity
                onPress={handleCopySerial}
                style={styles.serialCopyRow}
                accessibilityLabel="Copy Serial ID"
              >
                <Text
                  style={[
                    styles.specValueMono,
                    { color: colors.text },
                  ]}
                >
                  OD-7729-SAGE-2024
                </Text>
                <Icon name="content_copy" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.surfaceHigh }]} />

            {/* Spec Row 3: MAC */}
            <View style={styles.specRow}>
              <Text
                style={[
                  styles.specLabel,
                  { color: colors.textMuted },
                ]}
              >
                BLE MAC
              </Text>
              <Text
                style={[
                  styles.specValueMono,
                  { color: colors.text },
                ]}
              >
                3C:8A:1F:B4:72:90
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.surfaceHigh }]} />

            {/* Spec Row 4: Firmware */}
            <View style={styles.specRow}>
              <View>
                <Text
                  style={[
                    styles.specLabel,
                    { color: colors.textMuted },
                  ]}
                >
                  Installed Firmware
                </Text>
                <View style={styles.verifiedRow}>
                  <Icon name="verified" size={12} color={colors.primary} />
                  <Text style={[styles.verifiedText, { color: colors.primary }]}>
                    Firmware is up to date
                  </Text>
                </View>
              </View>
              <Text style={[styles.specValue, { color: colors.text }]}>
                v2.4.1-rc
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.surfaceHigh }]} />

            {/* Spec Row 5: Chamber Capacity */}
            <View style={styles.specRow}>
              <Text
                style={[
                  styles.specLabel,
                  { color: colors.textMuted },
                ]}
              >
                Chamber Reservoir
              </Text>
              <Text style={[styles.specValue, { color: colors.text }]}>
                50ml Cold-Nebulization Vessel
              </Text>
            </View>
          </View>
        </View>

        {/* 6. DANGER ZONE */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeaderTitle, { color: colors.error }]}>
            DEVICE ADMINISTRATION
          </Text>

          <View
            style={[
              styles.cardContainer,
              {
                backgroundColor: isDark ? 'rgba(255, 218, 214, 0.08)' : 'rgba(255, 218, 214, 0.35)',
              },
            ]}
          >
            <View style={styles.dangerHeaderRow}>
              <Icon name="warning" size={22} color={colors.error} />
              <Text style={[styles.dangerTitle, { color: colors.error }]}>
                Sanctuary Uncoupling
              </Text>
            </View>

            <Text
              style={[
                styles.dangerDescription,
                { color: colors.textMuted },
              ]}
            >
              Removing this diffuser will clear scheduled circadian rituals, reset mesh cryptographic credentials, and unbind it from your personal Odora profile.
            </Text>

            <View style={styles.dangerActionCol}>
              <TouchableOpacity
                onPress={handleResetCache}
                style={[
                  styles.dangerResetBtn,
                  { backgroundColor: colors.surfaceMuted },
                ]}
              >
                <Icon name="restart_alt" size={18} color={colors.text} />
                <Text style={[styles.dangerResetText, { color: colors.text }]}>
                  Reset Local Cache
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUnpairDevice}
                style={[
                  styles.dangerUnpairBtn,
                  { backgroundColor: colors.error },
                ]}
              >
                <Icon name="link_off" size={18} color={colors.onPrimary} />
                <Text style={[styles.dangerUnpairText, { color: colors.onPrimary }]}>
                  Unpair & Remove
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Toast Notification */}
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
          <Icon name="check_circle" size={18} color="#D8E9B5" />
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
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 24,
  },
  // Hero Card
  heroCard: {
    borderRadius: radii.card,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  ambientGlow: {
    position: 'absolute',
    top: -48,
    width: 256,
    height: 256,
    borderRadius: 128,
  },
  photoContainer: {
    width: 144,
    height: 180,
    borderRadius: radii.card,
    overflow: 'hidden',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  diffuserImage: {
    width: '90%',
    height: '90%',
  },
  activePill: {
    position: 'absolute',
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  activeText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.4,
    fontFamily: typography.labelLg.fontFamily,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  deviceNameText: {
    fontSize: 22,
    fontWeight: '500',
    fontFamily: typography.headlineMd.fontFamily,
    letterSpacing: -0.2,
  },
  renameBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  renameInputContainer: {
    width: '100%',
    maxWidth: 280,
    marginBottom: 8,
  },
  renameInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  renameInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 4,
    fontFamily: typography.bodyMd.fontFamily,
  },
  saveRenameBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  ceramicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  ceramicText: {
    fontSize: 12,
    fontFamily: typography.bodySm.fontFamily,
  },
  telemetryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  telemetryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  telemetryText: {
    fontSize: 12,
    fontFamily: typography.labelMd.fontFamily,
    fontWeight: '500',
  },
  // Section Structure
  sectionContainer: {
    gap: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    letterSpacing: 1.2,
    fontWeight: '600',
    fontFamily: typography.labelLg.fontFamily,
    paddingHorizontal: 4,
  },
  zoneBadge: {
    fontSize: 11,
    fontFamily: typography.labelMd.fontFamily,
  },
  cardContainer: {
    borderRadius: radii.card,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  // Spatial
  currentSanctuaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sanctuaryIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sanctuaryIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sanctuaryTextCol: {
    gap: 2,
  },
  sanctuaryCaption: {
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: '600',
    fontFamily: typography.labelLg.fontFamily,
  },
  sanctuaryTitle: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: typography.headlineSm.fontFamily,
  },
  changeActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  changeActionText: {
    fontSize: 13,
    fontFamily: typography.bodySm.fontFamily,
  },
  roomPillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 4,
  },
  roomPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
  },
  roomPillText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: typography.labelMd.fontFamily,
  },
  // Setting Row with Toggle
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  settingIconCol: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  settingIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  settingTextCol: {
    flex: 1,
    gap: 2,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: typography.headlineSm.fontFamily,
  },
  settingSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    fontFamily: typography.bodySm.fontFamily,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  dbBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  dbBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: typography.labelLg.fontFamily,
  },
  // Slider Section
  sliderSection: {
    gap: 10,
  },
  sliderHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sliderTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sliderTitleText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: typography.labelLg.fontFamily,
  },
  sliderValueText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: typography.labelLg.fontFamily,
  },
  sliderMinMaxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  sliderLimitText: {
    fontSize: 10,
    fontFamily: typography.labelSm.fontFamily,
  },
  // Sub Card
  subCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: radii.md,
    gap: 12,
  },
  subCardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  subCardIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subCardTextCol: {
    flex: 1,
  },
  subCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: typography.labelLg.fontFamily,
  },
  subCardSubtitle: {
    fontSize: 11,
    fontFamily: typography.bodySm.fontFamily,
  },
  // Timer Grid
  timerSection: {
    gap: 10,
  },
  timerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timerGrid: {
    flexDirection: 'row',
    borderRadius: 999,
    padding: 4,
  },
  timerBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  timerBtnText: {
    fontSize: 12,
  },
  // Accent Banner
  accentBanner: {
    borderRadius: radii.card,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  accentTextCol: {
    flex: 1,
    gap: 4,
  },
  accentOverline: {
    fontSize: 10,
    letterSpacing: 1.4,
    fontWeight: '600',
    fontFamily: typography.labelLg.fontFamily,
  },
  accentTitle: {
    fontSize: 17,
    fontWeight: '500',
    fontFamily: typography.headlineSm.fontFamily,
  },
  accentDescription: {
    fontSize: 12,
    lineHeight: 17,
    fontFamily: typography.bodySm.fontFamily,
  },
  accentPhotoWrapper: {
    width: 76,
    height: 104,
    borderRadius: radii.card,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  accentPhoto: {
    width: '100%',
    height: '100%',
  },
  // Hardware Specs
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  specLabel: {
    fontSize: 13,
    fontFamily: typography.bodySm.fontFamily,
  },
  specValue: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: typography.labelMd.fontFamily,
  },
  serialCopyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specValueMono: {
    fontSize: 12,
    fontFamily: 'Courier',
    letterSpacing: 0.5,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  verifiedText: {
    fontSize: 11,
    fontFamily: typography.labelSm.fontFamily,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  // Danger Zone
  dangerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dangerTitle: {
    fontSize: 17,
    fontWeight: '500',
    fontFamily: typography.headlineSm.fontFamily,
  },
  dangerDescription: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: typography.bodySm.fontFamily,
  },
  dangerActionCol: {
    gap: 10,
    paddingTop: 4,
  },
  dangerResetBtn: {
    height: 48,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dangerResetText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: typography.labelLg.fontFamily,
  },
  dangerUnpairBtn: {
    height: 48,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#ba1a1a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  dangerUnpairText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: typography.labelLg.fontFamily,
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
