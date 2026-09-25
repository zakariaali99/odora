import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { AppBar } from '../components/ui/AppBar';
import { Icon } from '../components/ui/Icon';
import { Card } from '../components/ui/Card';
import { useAppStore } from '../store/useAppStore';
import { previewConfig } from '../previewTarget';

interface DevicesScreenProps {
  navigation: any;
}

export const DevicesScreen: React.FC<DevicesScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors, typography, isRTL } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (previewConfig.scrollToEnd) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: false });
      }, 150);
    }
  }, []);

  const { devices, setSelectedDeviceId, toggleDevicePower } = useAppStore();

  const [selectedFilter, setSelectedFilter] = useState<'active' | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDevices = devices.filter((d) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      d.name.toLowerCase().includes(query) ||
      d.roomName.toLowerCase().includes(query) ||
      d.oilName.toLowerCase().includes(query);
    if (selectedFilter === 'active') {
      return matchesSearch && d.power;
    }
    return matchesSearch;
  });

  const activeCount = devices.filter((d) => d.power).length;

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* 1. App Bar (64pt, Stitch: title uppercase + nest_remote + avatar) */}
      <AppBar
        leading={
          <View style={styles.appBarLeading}>
            <View style={[styles.pulseDot, { backgroundColor: colors.primarySoft }]} />
            <Text
              style={[
                typography.headlineSm,
                {
                  color: colors.text,
                  fontSize: 18,
                  lineHeight: 26,
                  fontWeight: '500',
                  textTransform: isRTL ? 'none' : 'uppercase',
                  marginStart: 8,
                  letterSpacing: 0,
                },
              ]}
            >
              {t('nav.devices', 'Devices')}
            </Text>
          </View>
        }
        actions={[
          {
            icon: 'nest_remote',
            onPress: () => {},
            label: 'Remote',
          },
          {
            avatar: require('../../assets/photos/avatar.jpg'),
            onPress: () => navigation.navigate('Account'),
            label: 'Profile',
          },
        ]}
      />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Header & Pair Action */}
        <View style={styles.headerSection}>
          <View style={styles.headerRow}>
            <View>
              <Text
                style={[
                  typography.labelSm,
                  {
                    color: colors.textSubtle,
                    textTransform: isRTL ? 'none' : 'uppercase',
                    letterSpacing: isRTL ? 0 : 1.2,
                  },
                ]}
              >
                {t('devicesScreen.ecosystem', 'المنظومة')}
              </Text>
              <Text style={[typography.display, { color: colors.text, fontSize: 26, lineHeight: 34, marginTop: 2, letterSpacing: 0 }]}>
                {t('devicesScreen.title', 'الموزعات المتصلة')}
              </Text>
            </View>

            {/* Pair Device Button (Item 12: drop + from text) */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('DevicePairing')}
              style={[
                styles.pairBtn,
                { backgroundColor: colors.primary },
              ]}
              testID="pair-device-button"
              accessibilityLabel="Pair Device"
              accessibilityRole="button"
            >
              <Icon name="add" size={18} color={colors.onPrimary} />
              <Text style={[typography.labelMd, { color: colors.onPrimary, fontWeight: '600', marginStart: 4, letterSpacing: 0 }]}>
                {t('devicesScreen.pairDevice', 'إقران جهاز')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search & Filter Controls */}
          <View style={styles.filterControlsRow}>
            <View style={[styles.searchInputContainer, { backgroundColor: colors.surfaceMuted }]}>
              <Icon name="search" size={20} color={colors.textMuted} />
              <TextInput
                style={[
                  styles.searchInput,
                  {
                    color: colors.text,
                    fontFamily: isRTL ? 'IBMPlexSansArabic_400Regular' : 'PlusJakartaSans_400Regular',
                  },
                ]}
                placeholder={t('devicesScreen.searchPlaceholder', 'البحث عن الغرف أو العطور...')}
                placeholderTextColor={colors.textSubtle}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Segmented Filter Pills */}
            <View style={[styles.segmentedContainer, { backgroundColor: colors.surfaceMuted }]}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedFilter('all')}
                style={[
                  styles.segmentBtn,
                  selectedFilter === 'all' && [styles.segmentBtnActive, { backgroundColor: colors.surface }],
                ]}
              >
                <Text
                  style={[
                    typography.labelMd,
                    {
                      color: selectedFilter === 'all' ? colors.text : colors.textMuted,
                      fontWeight: selectedFilter === 'all' ? '600' : '500',
                      letterSpacing: 0,
                    },
                  ]}
                >
                  {isRTL ? `كل الغرف (${devices.length})` : `All Rooms (${devices.length})`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedFilter('active')}
                style={[
                  styles.segmentBtn,
                  selectedFilter === 'active' && [styles.segmentBtnActive, { backgroundColor: colors.surface }],
                ]}
              >
                <Text
                  style={[
                    typography.labelMd,
                    {
                      color: selectedFilter === 'active' ? colors.text : colors.textMuted,
                      fontWeight: selectedFilter === 'active' ? '600' : '500',
                      letterSpacing: 0,
                    },
                  ]}
                >
                  {isRTL ? `النشطة (${activeCount})` : `Active (${activeCount})`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 3. Dynamic Devices Section */}
        <View style={styles.groupSection}>
          <View style={styles.groupHeaderRow}>
            <View style={styles.groupHeaderLeft}>
              <View style={[styles.groupDot, { backgroundColor: colors.primarySoft }]} />
              <Text
                style={[
                  typography.labelSm,
                  {
                    color: colors.text,
                    fontWeight: '700',
                    textTransform: isRTL ? 'none' : 'uppercase',
                    letterSpacing: isRTL ? 0 : 1,
                  },
                ]}
              >
                {isRTL ? 'الأجهزة المتصلة' : 'Connected Units'}
              </Text>
            </View>
            <Text style={[typography.labelSm, { color: colors.textSubtle, letterSpacing: 0 }]}>
              {isRTL ? `${filteredDevices.length} أجهزة` : `${filteredDevices.length} Devices`}
            </Text>
          </View>

          {filteredDevices.map((device) => {
            const isPowerOn = device.power;
            const thumbSource =
              device.colorway === 'white'
                ? require('../../assets/photos/diffuser-a316-white.png')
                : device.colorway === 'black'
                ? require('../../assets/photos/diffuser-a316-black.png')
                : require('../../assets/photos/diffuser-a316-sage.png');

            return (
              <Card
                key={device.id}
                surface="lowest"
                style={styles.deviceCard}
                onPress={() => {
                  setSelectedDeviceId(device.id);
                  navigation.navigate('DeviceControl');
                }}
                testID={`device-card-${device.id}`}
                accessibilityLabel={device.name}
              >
                <View style={styles.deviceCardTop}>
                  <View style={[styles.deviceThumbnailContainer, { backgroundColor: colors.bgAlt }]}>
                    <Image
                      source={thumbSource}
                      style={styles.deviceThumbnailImage}
                      resizeMode="contain"
                    />
                    <View style={[styles.liveBadge, { backgroundColor: 'rgba(253,249,245,0.85)' }]}>
                      <View
                        style={[
                          styles.statusDotLive,
                          { backgroundColor: isPowerOn ? colors.primary : colors.textSubtle },
                        ]}
                      />
                      <Text
                        style={[
                          typography.labelSm,
                          {
                            color: isPowerOn ? colors.text : colors.textSubtle,
                            fontSize: 9,
                            fontWeight: '700',
                            letterSpacing: 0,
                          },
                        ]}
                      >
                        {isPowerOn ? t('common.active') : t('common.idle')}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.deviceDetails}>
                    <View style={styles.deviceMetaHeader}>
                      <Text
                        style={[
                          typography.labelSm,
                          { color: colors.textSubtle, textTransform: isRTL ? 'none' : 'uppercase', letterSpacing: 0 },
                        ]}
                      >
                        {device.model}
                      </Text>
                      <View style={styles.telemetryIcons}>
                        <Icon name="bluetooth" size={15} color={colors.primary} />
                        <Icon name="signal_cellular_alt" size={15} color={colors.primary} style={{ marginStart: 4 }} />
                      </View>
                    </View>

                    <Text
                      style={[
                        typography.headlineSm,
                        { color: colors.text, fontSize: 17, fontWeight: '500', marginTop: 2, letterSpacing: 0 },
                      ]}
                    >
                      {device.name}
                    </Text>

                    <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2, letterSpacing: 0 }]}>
                      {device.roomName} • {device.oilName}
                    </Text>

                    {/* Pill Gauge */}
                    <View style={[styles.pillGauge, { backgroundColor: colors.bgAlt }]}>
                      <View style={styles.pillGaugeLeft}>
                        <Icon name="opacity" size={14} color={colors.primary} />
                        <Text style={[typography.labelSm, { color: colors.text, fontWeight: '600', marginStart: 4, letterSpacing: 0 }]}>
                          {`${t('home.oil')} ${device.oilLevel}% ${device.oilSensor ? '' : t('home.oilEstimated')}`}
                        </Text>
                      </View>
                      <Text style={[typography.labelSm, { color: colors.textSubtle, letterSpacing: 0 }]}>
                        {t('device.level', { level: device.intensity })}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Inline Tactile Control Bar */}
                <View style={[styles.deviceCardBottom, { borderTopColor: colors.surfaceMuted }]}>
                  <View style={styles.deviceCardBottomLeft}>
                    <View
                      style={[
                        styles.activeMistingPill,
                        { backgroundColor: isPowerOn ? colors.accent : colors.surfaceMuted },
                      ]}
                    >
                      <Icon
                        name="airwave"
                        size={13}
                        color={isPowerOn ? colors.text : colors.textMuted}
                      />
                      <Text
                        style={[
                          typography.labelSm,
                          {
                            color: isPowerOn ? colors.text : colors.textMuted,
                            fontWeight: '600',
                            marginStart: 4,
                            fontSize: 11,
                            letterSpacing: 0,
                          },
                        ]}
                      >
                        {isPowerOn ? t('devicesScreen.activeMist') : t('devicesScreen.standby')}
                      </Text>
                    </View>
                    <Text style={[typography.labelSm, { color: colors.textSubtle, marginStart: 8, letterSpacing: 0 }]}>
                      {device.mode === 'continuous' ? t('home.continuous') : t('home.interval')}
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => toggleDevicePower(device.id)}
                    style={[
                      styles.cardPowerBtn,
                      {
                        backgroundColor: isPowerOn ? colors.surfaceHigh : colors.surfaceMuted,
                      },
                    ]}
                  >
                    <Icon
                      name="power_settings_new"
                      size={18}
                      color={isPowerOn ? colors.primary : colors.textSubtle}
                    />
                  </TouchableOpacity>
                </View>
              </Card>
            );
          })}
        </View>
      </ScrollView>
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
  appBarLeading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  headerSection: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pairBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 22,
    shadowColor: '#232821',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  filterControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInputContainer: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginStart: 8,
    fontSize: 13,
  },
  segmentedContainer: {
    height: 44,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
  },
  segmentBtn: {
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    shadowColor: '#232821',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  groupSection: {
    marginBottom: 20,
  },
  groupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  groupHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  groupDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginEnd: 8,
  },
  deviceCard: {
    padding: 16,
    marginBottom: 12,
  },
  deviceCardTop: {
    flexDirection: 'row',
  },
  deviceThumbnailContainer: {
    width: 80,
    height: 96,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  deviceThumbnailImage: {
    width: 70,
    height: 86,
  },
  liveBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  statusDotLive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginEnd: 4,
  },
  deviceDetails: {
    flex: 1,
    marginStart: 14,
    justifyContent: 'space-between',
  },
  deviceMetaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  telemetryIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillGauge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginTop: 6,
  },
  pillGaugeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 8,
    marginTop: 10,
  },
  deviceCardBottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeMistingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  cardPowerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DevicesScreen;
