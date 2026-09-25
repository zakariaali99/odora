import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Modal,
  TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { AppBar, Card, Icon, Button, Chip } from '../components/ui';
import { useAppStore, AppDevice, SHARED_ROOMS } from '../store/useAppStore';
import { previewConfig } from '../previewTarget';

interface DevicePairingScreenProps {
  navigation: any;
}

export const DevicePairingScreen: React.FC<DevicePairingScreenProps> = ({
  navigation,
}) => {
  const { t } = useTranslation();
  const { colors, typography, radii, spacing, isRTL } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (previewConfig.scrollToEnd) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: false });
      }, 150);
    }
  }, []);

  const { addDevice, setSelectedDeviceId, devices } = useAppStore();

  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [selectedColorway, setSelectedColorway] = useState<'sage' | 'white' | 'black'>('sage');
  const [customDeviceName, setCustomDeviceName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<string>('living_room');
  const [setupSheetVisible, setSetupSheetVisible] = useState(Boolean(previewConfig?.sheet));
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (previewConfig?.sheet !== undefined) {
      setSetupSheetVisible(Boolean(previewConfig.sheet));
    }
  }, [previewConfig?.sheet, previewConfig?.timestamp]);

  // Radar pulse animation (3s cycle matching Stitch)
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const radarScaleOuter = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1.06],
  });
  const radarScaleInner = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03],
  });

  // Unique non-duplicate default name based on room (Item 6)
  const getUniqueDeviceName = (roomKey: string): string => {
    const room = SHARED_ROOMS.find((r) => r.key === roomKey) || SHARED_ROOMS[0];
    const roomName = isRTL ? room.nameAr : room.nameEn;
    const baseName = isRTL ? `موزع ${roomName}` : `${roomName} Diffuser`;
    const existingNames = devices.map((d) => d.name);
    if (!existingNames.includes(baseName)) {
      return baseName;
    }
    let count = 2;
    while (existingNames.includes(`${baseName} ${count}`)) {
      count++;
    }
    return `${baseName} ${count}`;
  };

  const handleConnect = (device: { name: string; colorway: 'sage' | 'white' | 'black'; defaultName?: string }) => {
    setSelectedDevice(device.name);
    setSelectedColorway(device.colorway);
    setCustomDeviceName(getUniqueDeviceName(selectedRoom));
    setSetupSheetVisible(true);
  };

  const handleCompleteSetup = () => {
    const newId = 'diffuser_' + Date.now();
    const roomObj = SHARED_ROOMS.find((r) => r.key === selectedRoom) || SHARED_ROOMS[0];
    const roomName = isRTL ? roomObj.nameAr : roomObj.nameEn;
    const finalName = customDeviceName.trim() || getUniqueDeviceName(selectedRoom);

    // Item 6: Don't claim which oil is loaded
    const newDevice: AppDevice = {
      id: newId,
      name: finalName,
      roomName: roomName,
      colorway: selectedColorway,
      model: 'Odora A316',
      power: true,
      intensity: 7,
      mode: 'interval',
      oilLevel: 100,
      oilName: isRTL ? 'لم يتم تحميل زيت' : 'No oil loaded',
      oilRemainingDays: 30,
      oilSensor: false,
      burst: false,
      isOnline: true,
      connectionType: 'ble',
      signalDbm: -52,
    };

    addDevice(newDevice);
    setSelectedDeviceId(newId);

    setSetupSheetVisible(false);
    setToastMessage(t('pairing.pairingSuccessToast', 'تم الإقران بنجاح! جاري فتح شاشة التحكم...'));
    setTimeout(() => {
      setToastMessage(null);
      navigation.navigate('DeviceControl');
    }, 1000);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* 1. App Bar (Back button + title) */}
      <AppBar
        showBack
        title={t('pairing.title', 'إقران موزع جديد')}
      />

      {/* Floating Toast Notification (Item 12: show below app bar) */}
      {toastMessage && (
        <View style={[styles.toastContainer, { top: insets.top + 68, backgroundColor: colors.ink }]}>
          <Icon name="check_circle" size={18} color={colors.accent} />
          <Text style={[typography.bodySm, { color: colors.onInk, marginStart: 8, fontWeight: '600' }]}>
            {toastMessage}
          </Text>
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 48 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Header: Bluetooth Discovery */}
        <View style={styles.headerSection}>
          <View style={[styles.discoveryBadge, { backgroundColor: colors.accent }]}>
            <View style={[styles.pulseDot, { backgroundColor: colors.primary }]} />
            <Text
              style={[
                typography.labelSm,
                {
                  color: colors.text,
                  fontWeight: '700',
                  textTransform: isRTL ? 'none' : 'uppercase',
                  letterSpacing: isRTL ? 0 : 1,
                  marginStart: 6,
                },
              ]}
            >
              {t('pairing.discoveryBadge', 'اكتشاف البلوتوث')}
            </Text>
          </View>

          <Text style={[typography.display, { color: colors.text, fontSize: 26, lineHeight: 34, marginTop: 8 }]}>
            {t('pairing.title', 'إقران موزع جديد')}
          </Text>

          <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 4, maxWidth: 300, textAlign: 'center' }]}>
            {t('pairing.scanningHint', 'ضع موزع أودورا على مقربة ليتم التعرف عليه ومزامنته تلقائياً.')}
          </Text>
        </View>

        {/* 3. Radar Scanning Canvas */}
        <View style={styles.radarSection}>
          <View style={styles.radarContainer}>
            {/* Outer animated ring */}
            <Animated.View
              style={[
                styles.radarRingOuter,
                {
                  backgroundColor: colors.accent,
                  opacity: 0.25,
                  transform: [{ scale: radarScaleOuter }],
                },
              ]}
            />
            {/* Middle animated ring */}
            <Animated.View
              style={[
                styles.radarRingMiddle,
                {
                  backgroundColor: colors.accent,
                  opacity: 0.45,
                  transform: [{ scale: radarScaleInner }],
                },
              ]}
            />
            {/* Inner ring */}
            <View style={[styles.radarRingInner, { backgroundColor: colors.surfaceMuted }]} />

            {/* Center Device Preview Card */}
            <View style={[styles.centerDeviceCard, { backgroundColor: colors.surface }]}>
              <View style={[styles.centerDot, { backgroundColor: colors.accent }]}>
                <View style={[styles.centerDotInner, { backgroundColor: colors.primary }]} />
              </View>
              <View style={[styles.centerDeviceImageWrap, { backgroundColor: colors.bgAlt }]}>
                <Image
                  source={require('../../assets/photos/diffuser-a316-sage.png')}
                  style={styles.centerDeviceImg}
                  resizeMode="contain"
                />
              </View>
              <Text
                style={[
                  typography.labelSm,
                  {
                    color: colors.textSubtle,
                    fontWeight: '700',
                    letterSpacing: isRTL ? 0 : 1.2,
                    textTransform: isRTL ? 'none' : 'uppercase',
                  },
                ]}
              >
                ODORA
              </Text>
            </View>

            {/* Scanning Badge floating top-right */}
            <View style={[styles.scanningBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Icon name="sensors" size={16} color={colors.primary} />
              <Text style={[typography.labelSm, { color: colors.text, fontWeight: '600', marginStart: 4 }]}>
                {t('pairing.scanningBle', 'جاري المسح')}
              </Text>
            </View>
          </View>

          {/* Searching Status Pill */}
          <View style={[styles.searchingPill, { backgroundColor: colors.bgAlt }]}>
            <View style={[styles.pulseDot, { backgroundColor: colors.primary }]} />
            <Text style={[typography.bodySm, { color: colors.textMuted, marginStart: 6, fontWeight: '500' }]}>
              {t('pairing.scanning', 'جاري البحث عن موزعات أودورا القريبة...')}
            </Text>
          </View>
        </View>

        {/* 4. Available Devices List */}
        <View style={styles.devicesListSection}>
          <View style={styles.devicesHeaderRow}>
            <Text style={[typography.headlineSm, { color: colors.text, fontSize: 18, fontWeight: '500' }]}>
              {t('pairing.nearbyTitle', 'الأجهزة المتاحة')}
            </Text>
            <Text style={[typography.labelMd, { color: colors.primary, fontWeight: '600' }]}>
              {t('pairing.detectedCount', { count: 2 })}
            </Text>
          </View>

          {/* Device 1: Sage Green */}
          <Card surface="lowest" style={styles.deviceRowCard}>
            <View style={styles.deviceRowLeft}>
              <View style={[styles.deviceRowThumbWrap, { backgroundColor: colors.bgAlt }]}>
                <Image
                  source={require('../../assets/photos/diffuser-a316-sage.png')}
                  style={styles.deviceRowThumb}
                  resizeMode="contain"
                />
              </View>
              <View style={{ marginStart: 14, flex: 1 }}>
                <View style={styles.deviceNameRow}>
                  <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600', fontSize: 14 }]}>
                    Odora A316
                  </Text>
                  <View style={[styles.colorPill, { backgroundColor: colors.accent }]}>
                    <Text style={[typography.labelSm, { color: colors.text, fontSize: 10, fontWeight: '600' }]}>
                      {t('pairing.diffuserSage', 'أخضر ميرمية')}
                    </Text>
                  </View>
                </View>

                <View style={styles.signalRow}>
                  <Icon name="signal_cellular_alt" size={14} color={colors.primary} />
                  <Text style={[typography.labelSm, { color: colors.primary, marginStart: 2 }]}>
                    -48 dBm
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.textSubtle, marginHorizontal: 4 }]}>
                    •
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.textMuted }]}>
                    {t('pairing.readyToPair', 'جاهز للإقران')}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                handleConnect({
                  name: t('pairing.diffuserModelSage', 'أودورا A316 — أخضر ميرمية'),
                  colorway: 'sage',
                })
              }
              style={[styles.connectBtn, { backgroundColor: colors.ink }]}
            >
              <Text style={[typography.labelMd, { color: colors.onInk, fontWeight: '600', letterSpacing: 0 }]}>
                {t('pairing.connect', 'اتصال')}
              </Text>
            </TouchableOpacity>
          </Card>

          {/* Device 2: Matte White */}
          <Card surface="lowest" style={styles.deviceRowCard}>
            <View style={styles.deviceRowLeft}>
              <View style={[styles.deviceRowThumbWrap, { backgroundColor: colors.bgAlt }]}>
                <Image
                  source={require('../../assets/photos/diffuser-a316-white.png')}
                  style={styles.deviceRowThumb}
                  resizeMode="contain"
                />
              </View>
              <View style={{ marginStart: 14, flex: 1 }}>
                <View style={styles.deviceNameRow}>
                  <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600', fontSize: 14, letterSpacing: 0 }]}>
                    Odora A316
                  </Text>
                  <View style={[styles.colorPill, { backgroundColor: colors.surfaceMuted }]}>
                    <Text style={[typography.labelSm, { color: colors.textMuted, fontSize: 10, letterSpacing: 0 }]}>
                      {t('pairing.diffuserWhite', 'أبيض مطفي')}
                    </Text>
                  </View>
                </View>

                <View style={styles.signalRow}>
                  <Icon name="signal_cellular_alt" size={14} color={colors.textSubtle} />
                  <Text style={[typography.labelSm, { color: colors.textSubtle, marginStart: 2, letterSpacing: 0 }]}>
                    -65 dBm
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.textSubtle, marginHorizontal: 4 }]}>
                    •
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.textMuted, letterSpacing: 0 }]}>
                    {t('pairing.readyToPair', 'جاهز للإقران')}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                handleConnect({
                  name: t('pairing.diffuserModelWhite', 'أودورا A316 — أبيض مطفي'),
                  colorway: 'white',
                  defaultName: t('pairing.officeDiffuser', 'موزع المكتب'),
                })
              }
              style={[styles.connectBtn, { backgroundColor: colors.surfaceHigh }]}
            >
              <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600', letterSpacing: 0 }]}>
                {t('pairing.connect', 'اتصال')}
              </Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* 5. Bluetooth Diagnostic / Off Link (Flow 2) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('ConnectionStates', { initialState: 'disabled' })}
          style={[styles.btOffBanner, { backgroundColor: colors.surfaceMuted }]}
        >
          <Icon name="bluetooth_disabled" size={20} color={colors.primary} />
          <View style={{ flex: 1, marginStart: 10 }}>
            <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600', letterSpacing: 0 }]}>
              {t('pairing.bluetoothTrouble', 'البلوتوث متوقف أو يواجه مشكلة؟')}
            </Text>
            <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2, letterSpacing: 0 }]}>
              {t('pairing.bluetoothTroubleDesc', 'اضغط هنا لفتح تشخيص الاتصال اللاسلكي وحالات الاتصال.')}
            </Text>
          </View>
          <Icon name="chevron_right" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* 6. Help / Troubleshooting Card */}
        <View style={styles.helpSection}>
          <Card surface="low" style={styles.helpCard}>
            <View style={styles.helpRow}>
              <View style={[styles.helpIconWrap, { backgroundColor: colors.accent }]}>
                <Icon name="bluetooth_searching" size={18} color={colors.text} />
              </View>
              <View style={{ flex: 1, marginStart: 12 }}>
                <Text style={[typography.bodySm, { color: colors.textMuted, lineHeight: 18, letterSpacing: 0 }]}>
                  {t('pairing.troubleshootHint', 'تأكد من توصيل الموزع بالطاقة الكهربائية وأنه على مسافة لا تزيد عن 5 أمتار. احتفظ بالبلوتوث مفعلاً.')}
                </Text>
                <View style={styles.helpLinksRow}>
                  <TouchableOpacity activeOpacity={0.7} style={styles.serialLink}>
                    <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '700', letterSpacing: 0 }]}>
                      {t('pairing.enterSerial', 'إدخال الرقم التسلسلي')}
                    </Text>
                    <Icon name="arrow_forward" size={13} color={colors.primary} style={{ marginStart: 4 }} />
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={[typography.labelSm, { color: colors.textSubtle, marginStart: 16, letterSpacing: 0 }]}>
                      {t('pairing.troubleshoot', 'حل المشكلات')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* 7. Setup Bottom Sheet Modal (Item 3: Name + Room step; Item 15/18: No chamber/prefilled claims) */}
      <Modal
        visible={setupSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSetupSheetVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.sheetContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.sheetHandle, { backgroundColor: colors.surfaceMuted }]} />

            {/* Sheet Header */}
            <View style={styles.sheetHeader}>
              <View>
                <Text
                  style={[
                    typography.labelSm,
                    {
                      color: colors.primary,
                      fontWeight: '700',
                      textTransform: isRTL ? 'none' : 'uppercase',
                      letterSpacing: isRTL ? 0 : 1,
                    },
                  ]}
                >
                  {t('pairing.deviceSynchronized', 'تمت مزامنة الجهاز')}
                </Text>
                <Text style={[typography.headlineSm, { color: colors.text, fontSize: 20, fontWeight: '500', marginTop: 2, letterSpacing: 0 }]}>
                  {selectedDevice || 'Odora A316'}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSetupSheetVisible(false)}
                style={[styles.closeSheetBtn, { backgroundColor: colors.surfaceMuted }]}
              >
                <Icon name="close" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Scent Capsule Information (Item 6: Don't claim which oil is loaded) */}
            <Card surface="low" style={styles.preloadedCard}>
              <View style={styles.preloadedRow}>
                <View style={[styles.preloadedIconWrap, { backgroundColor: colors.surface }]}>
                  <Icon name="spa" size={24} color={colors.primary} />
                </View>
                <View style={{ marginStart: 12, flex: 1 }}>
                  <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600', letterSpacing: 0 }]}>
                    {t('pairing.noOilLoaded', 'لم يتم تحميل كبسولة عطرية')}
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2, letterSpacing: 0 }]}>
                    {t('pairing.noOilDesc', 'جاهز لإضافة الزيت العطري بعد اكتمال الإقران.')}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Device Name Input (Item 3: Add name step) */}
            <View style={styles.nameInputSection}>
              <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600', marginBottom: 6, letterSpacing: 0 }]}>
                {t('pairing.deviceName', 'اسم الجهاز')}
              </Text>
              <View style={[styles.nameInputField, { backgroundColor: colors.surfaceMuted }]}>
                <TextInput
                  style={[
                    styles.nameInputText,
                    {
                      color: colors.text,
                    },
                  ]}
                  value={customDeviceName}
                  onChangeText={setCustomDeviceName}
                  placeholder={t('pairing.deviceNamePlaceholder', 'مثال: موزع الصالون')}
                  placeholderTextColor={colors.textSubtle}
                />
              </View>
            </View>

            {/* Room Location Selection (Item 7: Shared room list) */}
            <View style={styles.roomSelectSection}>
              <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600', marginBottom: 8, letterSpacing: 0 }]}>
                {t('pairing.assignRoom', 'تحديد موقع الغرفة')}
              </Text>
              <View style={styles.roomChipsRow}>
                {SHARED_ROOMS.map((room) => (
                  <Chip
                    key={room.key}
                    label={isRTL ? room.nameAr : room.nameEn}
                    active={selectedRoom === room.key}
                    onPress={() => {
                      setSelectedRoom(room.key);
                      setCustomDeviceName(getUniqueDeviceName(room.key));
                    }}
                    style={{ marginEnd: 8, marginBottom: 8 }}
                  />
                ))}
              </View>
            </View>

            {/* Sticky Actions */}
            <View style={styles.sheetActions}>
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={handleCompleteSetup}
                style={[styles.completeBtn, { backgroundColor: colors.ink }]}
              >
                <Text style={[typography.labelMd, { color: colors.onInk, fontWeight: '600', fontSize: 15, letterSpacing: 0 }]}>
                  {t('pairing.completeSetup', 'إكمال الإعداد والتشغيل')}
                </Text>
                <Icon name="check_circle" size={18} color={colors.onInk} style={{ marginStart: 6 }} />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSetupSheetVisible(false)}
                style={styles.cancelLink}
              >
                <Text style={[typography.labelSm, { color: colors.textMuted, letterSpacing: 0 }]}>
                  {t('pairing.cancel', 'إلغاء ومتابعة المسح')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  toastContainer: {
    position: 'absolute',
    top: 72,
    alignSelf: 'center',
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  discoveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  radarSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  radarContainer: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  radarRingOuter: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  radarRingMiddle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  radarRingInner: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  centerDeviceCard: {
    width: 112,
    height: 144,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    shadowColor: '#232821',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 10,
  },
  centerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  centerDeviceImageWrap: {
    width: 64,
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerDeviceImg: {
    width: 56,
    height: 72,
  },
  scanningBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    shadowColor: '#232821',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    zIndex: 20,
  },
  searchingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginTop: 16,
  },
  devicesListSection: {
    marginBottom: 20,
  },
  devicesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  deviceRowCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  deviceRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceRowThumbWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  deviceRowThumb: {
    width: 40,
    height: 40,
  },
  deviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colorPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  signalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  connectBtn: {
    paddingHorizontal: 18,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: 12,
  },
  helpSection: {
    marginBottom: 16,
  },
  helpCard: {
    padding: 16,
  },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  helpIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  helpLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  serialLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  closeSheetBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preloadedCard: {
    padding: 16,
    marginBottom: 20,
  },
  preloadedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preloadedIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomSelectSection: {
    marginBottom: 24,
  },
  roomChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sheetActions: {
    gap: 12,
  },
  completeBtn: {
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelLink: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  btOffBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 20,
  },
  nameInputSection: {
    marginBottom: 16,
  },
  nameInputField: {
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  nameInputText: {
    fontSize: 15,
    paddingVertical: 4,
  },
});

export default DevicePairingScreen;
