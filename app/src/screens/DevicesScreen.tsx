import React, { useState } from 'react';
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
import { toArabicNumerals } from '../i18n';
import { AppBar, Card, Icon, Chip, Button } from '../components/ui';

/**
 * DevicesScreen — Connected Sanctuaries Management
 *
 * Target: `odora_devices` (layout) + `idea-01/odora_devices_list` (density)
 *
 * SCREEN ARCHITECTURAL NOTE:
 * Stitch's mockup included a "Synchronized Home Flow" card. Per 08 §4, multi-device
 * synchronization is intentionally omitted because the physical diffuser hardware
 * operates via direct BLE (Bluetooth Low Energy) and does not support mesh/cloud-sync.
 */
interface DevicesScreenProps {
  navigation: any;
}

export const DevicesScreen: React.FC<DevicesScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors, typography, radii, spacing, isRTL } = useTheme();
  const insets = useSafeAreaInsets();

  const [selectedFilter, setSelectedFilter] = useState<'active' | 'all'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [devicePowers, setDevicePowers] = useState({
    living: true,
    reading: false,
    bedroom: false,
  });

  const toggleDevicePower = (id: 'living' | 'reading' | 'bedroom') => {
    setDevicePowers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
                {isRTL ? 'المنظومة' : 'Ecosystem'}
              </Text>
              <Text style={[typography.display, { color: colors.text, fontSize: 26, lineHeight: 34, marginTop: 2 }]}>
                {isRTL ? 'الموزعات المتصلة' : 'Connected Diffusers'}
              </Text>
            </View>

            {/* Pair Device Button */}
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
              <Text style={[typography.labelMd, { color: colors.onPrimary, fontWeight: '600', marginStart: 4 }]}>
                {isRTL ? '+ إقران جهاز' : '+ Pair Device'}
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
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
                placeholder={isRTL ? 'البحث عن الغرف أو العطور...' : 'Search rooms or scents...'}
                placeholderTextColor={colors.textSubtle}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Segmented Filter Pills */}
            <View style={[styles.segmentedContainer, { backgroundColor: colors.surfaceMuted }]}>
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
                    },
                  ]}
                >
                  {isRTL ? 'النشطة (3)' : 'Active (3)'}
                </Text>
              </TouchableOpacity>
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
                    },
                  ]}
                >
                  {isRTL ? 'كل الغرف' : 'All Rooms'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 3. Group: Living Area (2 Devices) */}
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
                {isRTL ? 'منطقة المعيشة' : 'Living Area'}
              </Text>
            </View>
            <Text style={[typography.labelSm, { color: colors.textSubtle }]}>
              {isRTL ? 'جهازان' : '2 Devices'}
            </Text>
          </View>

          {/* Card 1: Living Room Diffuser (Sage Green - Active) */}
          <Card
            surface="lowest"
            style={styles.deviceCard}
            onPress={() => navigation.navigate('DeviceControl')}
            testID="device-card-living-room"
            accessibilityLabel="Living Room Diffuser"
          >
            <View style={styles.deviceCardTop}>
              {/* Thumbnail Container 80x96 */}
              <View style={[styles.deviceThumbnailContainer, { backgroundColor: colors.bgAlt }]}>
                <Image
                  source={require('../../assets/photos/diffuser-a316-sage.png')}
                  style={styles.deviceThumbnailImage}
                  resizeMode="contain"
                />
                <View style={[styles.liveBadge, { backgroundColor: 'rgba(253,249,245,0.85)' }]}>
                  <View style={[styles.statusDotLive, { backgroundColor: colors.primary }]} />
                  <Text style={[typography.labelSm, { color: colors.text, fontSize: 9, fontWeight: '700' }]}>
                    {isRTL ? 'مباشر' : 'LIVE'}
                  </Text>
                </View>
              </View>

              {/* Device Details */}
              <View style={styles.deviceDetails}>
                <View style={styles.deviceMetaHeader}>
                  <Text
                    style={[
                      typography.labelSm,
                      { color: colors.textSubtle, textTransform: isRTL ? 'none' : 'uppercase' },
                    ]}
                  >
                    Odora A316
                  </Text>
                  <View style={styles.telemetryIcons}>
                    <Icon name="bluetooth" size={15} color={colors.primary} />
                    <Icon name="signal_cellular_alt" size={15} color={colors.primary} style={{ marginStart: 4 }} />
                  </View>
                </View>

                <Text style={[typography.headlineSm, { color: colors.text, fontSize: 17, fontWeight: '500', marginTop: 2 }]}>
                  {isRTL ? 'موزع غرفة المعيشة' : 'Living Room Diffuser'}
                </Text>

                <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2 }]}>
                  {isRTL ? 'أخضر حكيم • كتان وقطن' : 'Sage Green • Cotton Linen'}
                </Text>

                {/* Pill Gauge */}
                <View style={[styles.pillGauge, { backgroundColor: colors.bgAlt }]}>
                  <View style={styles.pillGaugeLeft}>
                    <Icon name="opacity" size={14} color={colors.primary} />
                    <Text style={[typography.labelSm, { color: colors.text, fontWeight: '600', marginStart: 4 }]}>
                      {isRTL ? `الزيت ${toArabicNumerals(68)}٪` : 'Oil 68%'}
                    </Text>
                  </View>
                  <Text style={[typography.labelSm, { color: colors.textSubtle }]}>
                    {isRTL ? `المستوى ${toArabicNumerals(6)}` : 'Level 6 Mist'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Inline Tactile Control Bar */}
            <View style={[styles.deviceCardBottom, { borderTopColor: colors.surfaceMuted }]}>
              <View style={styles.deviceCardBottomLeft}>
                <View style={[styles.activeMistingPill, { backgroundColor: colors.accent }]}>
                  <Icon name="airwave" size={13} color={colors.text} />
                  <Text style={[typography.labelSm, { color: colors.text, fontWeight: '600', marginStart: 4, fontSize: 11 }]}>
                    {isRTL ? 'انتشار نشط' : 'Active Misting'}
                  </Text>
                </View>
                <Text style={[typography.labelSm, { color: colors.textSubtle, marginStart: 8 }]}>
                  {isRTL ? 'وضع هادئ' : 'Quiet Mode'}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleDevicePower('living')}
                style={[
                  styles.cardPowerBtn,
                  {
                    backgroundColor: devicePowers.living ? colors.surfaceHigh : colors.surfaceMuted,
                  },
                ]}
              >
                <Icon
                  name="power_settings_new"
                  size={18}
                  color={devicePowers.living ? colors.primary : colors.textSubtle}
                />
              </TouchableOpacity>
            </View>
          </Card>

          {/* Card 2: Reading Nook (Matte White - Scheduled) */}
          <Card
            surface="lowest"
            style={styles.deviceCard}
            onPress={() => navigation.navigate('DeviceControl')}
          >
            <View style={styles.deviceCardTop}>
              <View style={[styles.deviceThumbnailContainer, { backgroundColor: colors.bgAlt }]}>
                <Image
                  source={require('../../assets/photos/diffuser-a316-white.png')}
                  style={styles.deviceThumbnailImage}
                  resizeMode="contain"
                />
                <View style={[styles.liveBadge, { backgroundColor: 'rgba(253,249,245,0.85)' }]}>
                  <Text style={[typography.labelSm, { color: colors.textSubtle, fontSize: 9, fontWeight: '600' }]}>
                    {isRTL ? 'خلال 45د' : 'In 45m'}
                  </Text>
                </View>
              </View>

              <View style={styles.deviceDetails}>
                <View style={styles.deviceMetaHeader}>
                  <Text
                    style={[
                      typography.labelSm,
                      { color: colors.textSubtle, textTransform: isRTL ? 'none' : 'uppercase' },
                    ]}
                  >
                    Odora A316
                  </Text>
                  <Icon name="bluetooth" size={15} color={colors.primary} />
                </View>

                <Text style={[typography.headlineSm, { color: colors.text, fontSize: 17, fontWeight: '500', marginTop: 2 }]}>
                  {isRTL ? 'ركن القراءة' : 'Reading Nook'}
                </Text>

                <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2 }]}>
                  {isRTL ? 'أبيض مطفي • مريمية الغابة' : 'Matte White • Forest Sage'}
                </Text>

                <View style={[styles.pillGauge, { backgroundColor: colors.bgAlt }]}>
                  <View style={styles.pillGaugeLeft}>
                    <Icon name="water_drop" size={14} color={colors.primary} />
                    <Text style={[typography.labelSm, { color: colors.text, fontWeight: '600', marginStart: 4 }]}>
                      {isRTL ? `الزيت ${toArabicNumerals(92)}٪` : 'Oil 92%'}
                    </Text>
                  </View>
                  <Text style={[typography.labelSm, { color: colors.textSubtle }]}>
                    {isRTL ? `المستوى ${toArabicNumerals(3)}` : 'Level 3 Preset'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.deviceCardBottom, { borderTopColor: colors.surfaceMuted }]}>
              <View style={styles.deviceCardBottomLeft}>
                <Icon name="schedule" size={15} color={colors.textSubtle} />
                <Text style={[typography.labelSm, { color: colors.textMuted, marginStart: 6 }]}>
                  {isRTL ? 'مجدول: 20:00 · نسيم هادئ' : 'Scheduled: 8:00 PM · Calm Wind'}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleDevicePower('reading')}
                style={[
                  styles.cardPowerBtn,
                  {
                    backgroundColor: devicePowers.reading ? colors.surfaceHigh : colors.surfaceMuted,
                  },
                ]}
              >
                <Icon
                  name="power_settings_new"
                  size={18}
                  color={devicePowers.reading ? colors.primary : colors.textSubtle}
                />
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* 4. Group: Private Spaces (1 Device) */}
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
                {isRTL ? 'المساحات الخاصة' : 'Private Spaces'}
              </Text>
            </View>
            <Text style={[typography.labelSm, { color: colors.textSubtle }]}>
              {isRTL ? 'جهاز واحد' : '1 Device'}
            </Text>
          </View>

          {/* Card 3: Master Bedroom (Matte Black - Low Oil Warning) */}
          <Card
            surface="lowest"
            style={styles.deviceCard}
            onPress={() => navigation.navigate('DeviceControl')}
          >
            <View style={styles.deviceCardTop}>
              <View style={[styles.deviceThumbnailContainer, { backgroundColor: colors.bgAlt }]}>
                <Image
                  source={require('../../assets/photos/diffuser-a316-black.png')}
                  style={styles.deviceThumbnailImage}
                  resizeMode="contain"
                />
                <View style={[styles.liveBadge, { backgroundColor: colors.errorSoft }]}>
                  <Icon name="warning" size={10} color={colors.error} />
                  <Text style={[typography.labelSm, { color: colors.error, fontSize: 9, fontWeight: '700', marginStart: 2 }]}>
                    24%
                  </Text>
                </View>
              </View>

              <View style={styles.deviceDetails}>
                <View style={styles.deviceMetaHeader}>
                  <Text
                    style={[
                      typography.labelSm,
                      { color: colors.textSubtle, textTransform: isRTL ? 'none' : 'uppercase' },
                    ]}
                  >
                    Odora A316
                  </Text>
                  <Icon name="bluetooth" size={15} color={colors.primary} />
                </View>

                <Text style={[typography.headlineSm, { color: colors.text, fontSize: 17, fontWeight: '500', marginTop: 2 }]}>
                  {isRTL ? 'غرفة النوم الرئيسية' : 'Master Bedroom'}
                </Text>

                <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2 }]}>
                  {isRTL ? 'أسود مطفي • أزهار الحمضيات' : 'Matte Black • Citrus Bloom'}
                </Text>

                <View style={[styles.pillGauge, { backgroundColor: colors.bgAlt }]}>
                  <View style={styles.pillGaugeLeft}>
                    <Icon name="warning" size={14} color={colors.error} />
                    <Text style={[typography.labelSm, { color: colors.error, fontWeight: '600', marginStart: 4 }]}>
                      {isRTL ? 'الزيت 24%' : 'Oil 24%'}
                    </Text>
                  </View>
                  <Text style={[typography.labelSm, { color: colors.error }]}>
                    {isRTL ? 'مستوى زيت منخفض' : 'Low Oil'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.deviceCardBottom, { borderTopColor: colors.surfaceMuted }]}>
              <View style={styles.deviceCardBottomLeft}>
                <Text style={[typography.labelSm, { color: colors.textSubtle }]}>
                  {isRTL ? 'في وضع الاستعداد · اضغط للبدء' : 'Standby · Tap to start'}
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleDevicePower('bedroom')}
                style={[
                  styles.cardPowerBtn,
                  {
                    backgroundColor: devicePowers.bedroom ? colors.surfaceHigh : colors.surfaceMuted,
                  },
                ]}
              >
                <Icon
                  name="power_settings_new"
                  size={18}
                  color={devicePowers.bedroom ? colors.primary : colors.textSubtle}
                />
              </TouchableOpacity>
            </View>
          </Card>
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
