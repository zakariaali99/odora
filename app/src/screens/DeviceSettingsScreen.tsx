import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme';
import { typography } from '../theme/typography';
import { radii } from '../theme/radii';
import { Icon } from '../components/ui/Icon';
import { AppBar } from '../components/ui/AppBar';
import { Toggle } from '../components/ui/Toggle';
import { Sheet } from '../components/ui/Sheet';
import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';
import { useAppStore, SHARED_ROOMS, getLocalizedDeviceName } from '../store/useAppStore';
import { previewConfig } from '../previewTarget';

const SAGE_DIFFUSER = require('../../assets/photos/diffuser-a316-sage.png');
const CLOSEUP_DIFFUSER = require('../../assets/photos/diffuser_sage_closeup.png');

interface DeviceSettingsScreenProps {
  navigation?: any;
  route?: any;
}

const TIMER_OPTIONS_AR = ['إيقاف', '30د', '1س', '2س', '4س', '8س'];
const TIMER_OPTIONS_EN = ['Off', '30m', '1h', '2h', '4h', '8h'];

export const DeviceSettingsScreen: React.FC<DeviceSettingsScreenProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const activeNav = navigation?.navigate ? navigation : nav;
  const { colors, isDark, isRTL } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (previewConfig.scrollToEnd) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: false });
      }, 150);
    }
  }, []);

  const { devices, selectedDeviceId, updateDevice, removeDevice } = useAppStore();
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

  // State
  const [deviceName, setDeviceName] = useState(getLocalizedDeviceName(activeDevice.name, isRTL));
  const [isRenaming, setIsRenaming] = useState(false);
  const [tempName, setTempName] = useState(getLocalizedDeviceName(activeDevice.name, isRTL));

  // Shared Rooms (Item 7: One shared room list between Pairing and Settings)
  const roomOptions = SHARED_ROOMS.map((r) => ({
    key: r.key,
    name: isRTL ? r.nameAr : r.nameEn,
  }));
  const currentMatchingRoom = SHARED_ROOMS.find(
    (r) =>
      r.key === activeDevice.roomName ||
      r.nameAr === activeDevice.roomName ||
      r.nameEn === activeDevice.roomName
  );
  const initialRoomName = currentMatchingRoom
    ? (isRTL ? currentMatchingRoom.nameAr : currentMatchingRoom.nameEn)
    : (activeDevice.roomName || (isRTL ? SHARED_ROOMS[0].nameAr : SHARED_ROOMS[0].nameEn));
  const [selectedRoom, setSelectedRoom] = useState(initialRoomName);

  useEffect(() => {
    if (activeDevice.roomName) {
      const match = SHARED_ROOMS.find(
        (r) =>
          r.key === activeDevice.roomName ||
          r.nameAr === activeDevice.roomName ||
          r.nameEn === activeDevice.roomName
      );
      if (match) {
        setSelectedRoom(isRTL ? match.nameAr : match.nameEn);
      }
    }
  }, [activeDevice.roomName, isRTL]);

  // Real Timer & Safety State
  const timerOptions = isRTL ? TIMER_OPTIONS_AR : TIMER_OPTIONS_EN;
  const [selectedTimerIndex, setSelectedTimerIndex] = useState(3); // '2h' / '2س'
  const [lowOilGuard, setLowOilGuard] = useState(true);

  // Forget Device Confirm Sheet
  const [showForgetSheet, setShowForgetSheet] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleSaveRename = () => {
    if (tempName.trim().length > 0) {
      setDeviceName(tempName.trim());
      updateDevice(activeDevice.id, { name: tempName.trim() });
      setIsRenaming(false);
      showToast(t('deviceSettings.toastRenamed', { name: tempName.trim() }));
    }
  };

  const handleCopySerial = () => {
    showToast(t('deviceSettings.toastSerialCopied'));
  };

  const handleForgetDevice = () => {
    setShowForgetSheet(true);
  };

  const handleConfirmForget = () => {
    setShowForgetSheet(false);
    removeDevice(activeDevice.id);
    showToast(t('deviceSettings.deviceForgottenToast', 'تم إلغاء اقتران الجهاز بنجاح'));
    setTimeout(() => {
      (activeNav as any).navigate('MainTabs', { screen: 'Devices' });
    }, 400);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      {/* 64pt App Bar with Back and Round Avatar */}
      <AppBar
        title={t('deviceSettings.title', 'إعدادات الجهاز')}
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

      {/* Floating Feedback Toast */}
      {toastMessage && (
        <View style={[styles.toastContainer, { backgroundColor: colors.ink }]}>
          <Icon name="check_circle" size={18} color={colors.accent} />
          <Text style={[styles.toastText, { color: colors.onInk }]}>
            {toastMessage}
          </Text>
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 64 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. HERO DEVICE OVERVIEW (Grey circle behind image removed per Item 14) */}
        <View style={[styles.heroCard, { backgroundColor: colors.bgAlt }]}>
          {/* Diffuser Hardware Photo Presentation */}
          <View style={[styles.photoContainer, { backgroundColor: 'transparent', shadowOpacity: 0, elevation: 0 }]}>
            <Image
              source={
                activeDevice.colorway === 'white'
                  ? require('../../assets/photos/diffuser-a316-white.png')
                  : activeDevice.colorway === 'black'
                  ? require('../../assets/photos/diffuser-a316-black.png')
                  : SAGE_DIFFUSER
              }
              style={styles.diffuserImage}
              resizeMode="contain"
            />
            {/* Active Pill Badge */}
            <View style={[styles.activePill, { backgroundColor: 'rgba(253, 249, 245, 0.92)' }]}>
              <View style={[styles.activeDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.activeText, { color: colors.text }]}>
                {t('deviceSettings.active', 'نشط')}
              </Text>
            </View>
          </View>

          {/* Device Name Header & Inline Rename */}
          {!isRenaming ? (
            <View style={styles.nameRow}>
              <Text style={[styles.deviceNameText, { color: colors.text }]}>
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
              <View style={[styles.renameInputWrapper, { backgroundColor: colors.surface }]}>
                <TextInput
                  style={[
                    styles.renameInput,
                    {
                      color: colors.text,
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

          {/* Hardware Color Pill */}
          <View style={styles.ceramicRow}>
            <View style={[styles.colorDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.ceramicText, { color: colors.textMuted }]}>
              {t('deviceSettings.matteSage', 'خزف ميرمية غير لامع')}
            </Text>
          </View>

          {/* Connection Status (Real BLE Status per 08 §4) */}
          <View
            style={[
              styles.telemetryPill,
              { backgroundColor: isDark ? 'rgba(213,230,178,0.18)' : '#D5E6B2' },
            ]}
          >
            <View style={[styles.telemetryDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.telemetryText, { color: colors.primary }]}>
              {t('deviceSettings.bleConnected', 'متصل عبر البلوتوث · الإشارة قوية')}
            </Text>
          </View>
        </View>

        {/* 2. SPATIAL ASSIGNMENT (Item 14: Zone 01 removed; Chevron mirrored) */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionHeaderTitle, { color: colors.textMuted }]}>
              {t('deviceSettings.spatialAssignment', 'تخصيص المكان')}
            </Text>
          </View>

          <View style={[styles.cardContainer, { backgroundColor: colors.bgAlt }]}>
            <View style={styles.currentSanctuaryRow}>
              <View style={styles.sanctuaryIconWrapper}>
                <View style={[styles.sanctuaryIconBg, { backgroundColor: colors.surfaceMuted }]}>
                  <Icon name="chair" size={20} color={colors.primary} />
                </View>
                <View style={styles.sanctuaryTextCol}>
                  <Text style={[styles.sanctuaryCaption, { color: colors.textMuted }]}>
                    {t('deviceSettings.currentRoom', 'الغرفة الحالية')}
                  </Text>
                  <Text style={[styles.sanctuaryTitle, { color: colors.text }]}>
                    {selectedRoom}
                  </Text>
                </View>
              </View>

              <View style={styles.changeActionRow}>
                <Text style={[styles.changeActionText, { color: colors.textMuted }]}>
                  {t('deviceSettings.change', 'تغيير')}
                </Text>
                {/* autoMirror: true on chevron_right will mirror it to point left in RTL */}
                <Icon
                  name="chevron_right"
                  size={18}
                  color={colors.textMuted}
                />
              </View>
            </View>

            {/* Room selection pills (Item 7: One shared room list between Pairing and Settings) */}
            <View style={styles.roomPillsContainer}>
              {roomOptions.map((room) => {
                const isSelected =
                  selectedRoom === room.name ||
                  selectedRoom === room.key ||
                  (room.key === 'office' &&
                    (selectedRoom === 'المكتب' ||
                      selectedRoom === 'المكتب الخاص' ||
                      selectedRoom === 'Office' ||
                      selectedRoom === 'Private Office')) ||
                  (room.key === 'living_room' &&
                    (selectedRoom === 'غرفة المعيشة' ||
                      selectedRoom === 'Living Room')) ||
                  (room.key === 'master_bedroom' &&
                    (selectedRoom === 'غرفة النوم الرئيسية' ||
                      selectedRoom === 'Master Bedroom')) ||
                  (room.key === 'guest_salon' &&
                    (selectedRoom === 'صالة الضيوف' ||
                      selectedRoom === 'Guest Salon'));
                return (
                  <TouchableOpacity
                    key={room.key}
                    onPress={() => {
                      setSelectedRoom(room.name);
                      updateDevice(activeDevice.id, { roomName: room.name });
                      showToast(t('deviceSettings.roomMovedToast', { room: room.name }));
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
                      {room.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* 3. AUTO-OFF TIMER & SAFETY (Real Settings replacing LED/Acoustics per 06 §1.4 & 08 §4) */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeaderTitle, { color: colors.textMuted }]}>
            {t('deviceSettings.autoOffAndSafety', 'مؤقت التشغيل والسلامة')}
          </Text>

          <View style={[styles.cardContainer, { backgroundColor: colors.bgAlt }]}>
            {/* Auto-Off Sleep Timer Segmented Control */}
            <View style={styles.timerSection}>
              <View style={styles.timerHeaderRow}>
                <View style={styles.timerTitleWithIcon}>
                  <Icon name="timer" size={18} color={colors.primary} />
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    {t('deviceSettings.autoOffTimer', 'مؤقت الإيقاف التلقائي')}
                  </Text>
                </View>
                <Text style={[styles.timerValueText, { color: colors.primary }]}>
                  {selectedTimerIndex === 0
                    ? t('deviceSettings.disabled', 'معطّل')
                    : t('deviceSettings.activeTimer', { timer: timerOptions[selectedTimerIndex] })}
                </Text>
              </View>

              <View style={[styles.timerSegmentGroup, { backgroundColor: colors.surfaceMuted }]}>
                {timerOptions.map((opt, idx) => {
                  const isSelected = selectedTimerIndex === idx;
                  return (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => {
                        setSelectedTimerIndex(idx);
                        showToast(
                          idx === 0
                            ? t('deviceSettings.toastSleepOff')
                            : t('deviceSettings.toastSleepSet', { opt })
                        );
                      }}
                      style={[
                        styles.timerBtn,
                        isSelected && {
                          backgroundColor: colors.primary,
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.15,
                          shadowRadius: 2,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.timerBtnText,
                          {
                            color: isSelected ? colors.onPrimary : colors.textMuted,
                            fontWeight: isSelected ? '600' : '400',
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

            {/* Low-Oil Guard Toggle (Item 4: Reword as estimate if oilSensor OFF; Western 5% digit) */}
            <View style={styles.settingRow}>
              <View style={styles.settingIconCol}>
                <View style={[styles.settingIconBg, { backgroundColor: colors.surfaceMuted }]}>
                  <Icon name="opacity" size={20} color={colors.primary} />
                </View>
                <View style={styles.settingTextCol}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    {activeDevice.oilSensor
                      ? t('deviceSettings.lowOilGuard', 'تنبيه انخفاض مستوى الزيت')
                      : t('deviceSettings.lowOilGuardEstimated', 'تنبيه عند اقتراب نفاد الزيت (تقديري)')}
                  </Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>
                    {activeDevice.oilSensor
                      ? t('deviceSettings.lowOilDesc', 'إيقاف التفتيت تلقائياً وإرسال تنبيه عند انخفاض مخزون الزيت عن 5%')
                      : t('deviceSettings.lowOilDescEstimated', 'إرسال تنبيه تقديري بحسب ساعات التشغيل عند اقتراب نفاد مخزون الزيت دون حساس مباشر')}
                  </Text>
                </View>
              </View>
              <Toggle
                value={lowOilGuard}
                onValueChange={(val) => {
                  setLowOilGuard(val);
                  showToast(
                    val
                      ? t('deviceSettings.toastLowOilGuardOn')
                      : t('deviceSettings.toastLowOilGuardOff')
                  );
                }}
              />
            </View>
          </View>
        </View>

        {/* 4. REAL CRAFTSMANSHIP ACCENT CARD */}
        <View style={[styles.craftCard, { backgroundColor: colors.bgAlt }]}>
          <View style={styles.craftTextCol}>
            <Text style={[styles.craftEyebrow, { color: colors.primary }]}>
              {getLocalizedDeviceName(activeDevice.name, isRTL) || 'Odora A316'}
            </Text>
            <Text style={[styles.craftTitle, { color: colors.text }]}>
              {t('deviceSettings.deviceCraftTitle', 'خزف ميرمية مصقول يدوياً')}
            </Text>
            <Text style={[styles.craftDesc, { color: colors.textMuted }]}>
              {t('deviceSettings.deviceCraftDesc', 'تقنية تفتيت ميكروي بارد بدون ماء أو حرارة لحفظ كامل الخصائص العطرية للزيوت النقية.')}
            </Text>
          </View>
          <View style={styles.craftImageWrapper}>
            <Image
              source={CLOSEUP_DIFFUSER}
              style={styles.craftImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* 5. HARDWARE TECHNICAL SPECIFICATIONS (Real device specs only per 06 §1.4 & 08 §4) */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeaderTitle, { color: colors.textMuted }]}>
            {t('deviceSettings.deviceInfo', 'معلومات الجهاز')}
          </Text>

          <View style={[styles.cardContainer, { backgroundColor: colors.bgAlt, paddingVertical: 4 }]}>
            {/* Spec Row 1: Model */}
            <View style={styles.specRow}>
              <Text style={[styles.specLabel, { color: colors.textMuted }]}>
                {t('deviceSettings.model', 'طراز الجهاز')}
              </Text>
              <Text style={[styles.specValue, { color: colors.text }]}>
                Odora A316
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.surfaceMuted }]} />

            {/* Spec Row 2: Serial Number */}
            <View style={styles.specRow}>
              <Text style={[styles.specLabel, { color: colors.textMuted }]}>
                {t('deviceSettings.serialNumber', 'الرقم التسلسلي')}
              </Text>
              <View style={styles.serialValueRow}>
                <Text style={[styles.serialCode, { color: colors.text }]}>
                  OD-A316-2026-X99
                </Text>
                <TouchableOpacity
                  onPress={handleCopySerial}
                  style={styles.copyBtn}
                  accessibilityLabel="Copy Serial"
                >
                  <Icon name="content_copy" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.surfaceMuted }]} />

            {/* Spec Row 3: Date Added */}
            <View style={styles.specRow}>
              <Text style={[styles.specLabel, { color: colors.textMuted }]}>
                {t('deviceSettings.dateAdded', 'تاريخ الإضافة')}
              </Text>
              <Text style={[styles.specValue, { color: colors.text }]}>
                {t('deviceSettings.manufactureDateValue')}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.surfaceMuted }]} />

            {/* Spec Row 4: Connection Protocol */}
            <View style={styles.specRow}>
              <Text style={[styles.specLabel, { color: colors.textMuted }]}>
                {t('deviceSettings.connection', 'نوع الاتصال')}
              </Text>
              <Text style={[styles.specValue, { color: colors.text }]}>
                {t('deviceSettings.bleProtocol', 'بلوتوث منخفض الطاقة (BLE)')}
              </Text>
            </View>
          </View>
        </View>

        {/* 6. DANGER ZONE (Forget Device) */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeaderTitle, { color: colors.error }]}>
            {t('deviceSettings.dangerZone', 'إدارة الجهاز')}
          </Text>

          <View style={[styles.dangerCard, { backgroundColor: isDark ? 'rgba(186,26,26,0.12)' : '#FDF2F2' }]}>
            <View style={styles.dangerHeaderRow}>
              <Icon name="warning" size={20} color={colors.error} />
              <Text style={[styles.dangerTitle, { color: colors.error }]}>
                {t('deviceSettings.forgetDevice', 'إلغاء اقتران الجهاز')}
              </Text>
            </View>
            <Text style={[styles.dangerDesc, { color: colors.textMuted }]}>
              {t('deviceSettings.forgetDesc', 'سيؤدي حذف هذا الموزع إلى مسح الجداول الزمنية وإلغاء اقترانه من حسابك. يمكنك إعادة إقرانه في أي وقت.')}
            </Text>

            <TouchableOpacity
              onPress={handleForgetDevice}
              style={[styles.forgetBtn, { backgroundColor: colors.error }]}
              activeOpacity={0.85}
              testID="forget-device-button"
              accessibilityLabel={t('deviceSettings.forgetDevice', 'إلغاء اقتران الجهاز')}
              accessibilityRole="button"
            >
              <Icon name="link_off" size={18} color="#FFFFFF" />
              <Text style={styles.forgetBtnText}>
                {t('deviceSettings.forgetDevice', 'إلغاء اقتران الجهاز')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Forget Device Confirmation Sheet */}
      <Sheet
        visible={showForgetSheet}
        onClose={() => setShowForgetSheet(false)}
      >
        <View style={styles.sheetContent}>
          <View style={[styles.sheetIconCircle, { backgroundColor: isDark ? 'rgba(186,26,26,0.15)' : '#FEE2E2' }]}>
            <Icon name="warning" size={32} color={colors.error} />
          </View>

          <Text style={[typography.headlineSm, styles.sheetTitle, { color: colors.text }]}>
            {t('deviceSettings.forgetConfirmTitle', 'إلغاء اقتران الجهاز؟')}
          </Text>

          <Text style={[typography.bodyMd, styles.sheetDesc, { color: colors.textMuted }]}>
            {t('deviceSettings.forgetConfirmDesc', 'هل أنت متأكد من رغبتك في إلغاء اقتران هذا الجهاز؟ سيتم حذف الجداول الزمنية وإلغاء ربطه بحسابك.')}
          </Text>

          <View style={styles.sheetActions}>
            <Button
              title={t('deviceSettings.confirmForget', 'إلغاء الاقتران والحذف')}
              onPress={handleConfirmForget}
              testID="confirm-forget-button"
              style={{ width: '100%', marginBottom: 12, backgroundColor: colors.error }}
              textStyle={{ color: '#FFFFFF', fontWeight: '700' }}
            />
            <Button
              title={t('common.cancel', 'إلغاء')}
              variant="ghost"
              onPress={() => setShowForgetSheet(false)}
              style={{ width: '100%' }}
            />
          </View>
        </View>
      </Sheet>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
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
  heroCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 20,
  },
  ambientGlow: {
    position: 'absolute',
    top: -20,
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  photoContainer: {
    width: 144,
    height: 180,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
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
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  deviceNameText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  renameBtn: {
    padding: 6,
    borderRadius: 16,
  },
  renameInputContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  renameInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.full,
    paddingHorizontal: 14,
    paddingVertical: 4,
    width: '85%',
  },
  renameInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 4,
  },
  saveRenameBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: 8,
  },
  ceramicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  ceramicText: {
    fontSize: 13,
  },
  telemetryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
  },
  telemetryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  telemetryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0,
  },
  zoneBadge: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardContainer: {
    borderRadius: 20,
    padding: 16,
  },
  currentSanctuaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sanctuaryIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sanctuaryIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sanctuaryTextCol: {
    gap: 2,
  },
  sanctuaryCaption: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0,
  },
  sanctuaryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  changeActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  changeActionText: {
    fontSize: 13,
  },
  roomPillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 4,
  },
  roomPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.full,
  },
  roomPillText: {
    fontSize: 13,
    fontWeight: '500',
  },
  timerSection: {
    marginBottom: 16,
  },
  timerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timerTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerValueText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timerSegmentGroup: {
    flexDirection: 'row',
    borderRadius: radii.full,
    padding: 3,
  },
  timerBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
  },
  timerBtnText: {
    fontSize: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  settingIconCol: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
    paddingEnd: 12,
  },
  settingIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  settingTextCol: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  settingSubtitle: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  craftCard: {
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  craftTextCol: {
    flex: 1,
    paddingEnd: 12,
  },
  craftEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0,
  },
  craftTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  craftDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
  craftImageWrapper: {
    width: 72,
    height: 96,
    borderRadius: 14,
    overflow: 'hidden',
  },
  craftImage: {
    width: '100%',
    height: '100%',
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  specLabel: {
    fontSize: 13,
  },
  specValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  serialValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  serialCode: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0,
  },
  copyBtn: {
    padding: 4,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  dangerCard: {
    borderRadius: 20,
    padding: 18,
  },
  dangerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  dangerDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  forgetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: radii.full,
  },
  forgetBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  sheetContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
  sheetIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  sheetDesc: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  sheetActions: {
    width: '100%',
  },
});

export default DeviceSettingsScreen;
