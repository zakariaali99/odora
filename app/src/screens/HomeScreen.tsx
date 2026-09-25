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
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../theme';
import { AppBar, Card, Icon } from '../components/ui';
import { useAppStore, getLocalizedDeviceName, getLocalizedOilName, getLocalizedRoomName } from '../store/useAppStore';
import { previewConfig } from '../previewTarget';

const DIFFUSER_IMAGES = {
  sage: require('../../assets/photos/diffuser-a316-sage.png'),
  white: require('../../assets/photos/diffuser-a316-white.png'),
  black: require('../../assets/photos/diffuser-a316-black.png'),
};

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
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

  const { devices, selectedDeviceId, setSelectedDeviceId, toggleDevicePower, routines } = useAppStore();
  const nextRoutine = routines?.find((r) => r.enabled) || routines?.[0];
  const activeDevice = devices.find((d) => d.id === selectedDeviceId) || devices[0] || {
    id: 'living',
    name: 'موزع غرفة المعيشة',
    roomName: 'غرفة المعيشة',
    colorway: 'sage',
    model: 'Odora A316',
    power: true,
    intensity: 8,
    mode: 'interval' as const,
    oilLevel: 68,
    oilName: 'مريمية الغابة والأرز',
    oilRemainingDays: 18,
    oilSensor: false,
    burst: false,
    isOnline: true,
    connectionType: 'ble' as const,
    signalDbm: -58,
  };

  const isPowerOn = activeDevice.power;
  const intensityLevel = activeDevice.intensity || 8;

  // Mist floating animation (4.5s cycle matching Stitch)
  const mistAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(mistAnim, {
          toValue: 1,
          duration: 2250,
          useNativeDriver: true,
        }),
        Animated.timing(mistAnim, {
          toValue: 0,
          duration: 2250,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [mistAnim]);

  const handleTogglePower = () => {
    toggleDevicePower(activeDevice.id);
  };

  const mistTranslateY = mistAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -7],
  });
  const mistScale = mistAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1.05],
  });
  const mistOpacity = mistAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.65],
  });

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* 1. App Bar (64pt, Stitch: title + nest_remote + avatar) */}
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
                  fontWeight: '600',
                  textTransform: isRTL ? 'none' : 'uppercase',
                  marginStart: 8,
                },
              ]}
            >
              {t('nav.home', 'Home')}
            </Text>
          </View>
        }
        actions={[
          {
            icon: 'nest_remote',
            onPress: () => navigation.navigate('Devices'),
            label: 'Devices',
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
        {/* 2. Top Welcome & Ambience Badge */}
        <View style={styles.welcomeSection}>
          <View style={styles.ambienceBadgeRow}>
            <View
              style={[
                styles.ambienceBadge,
                { backgroundColor: colors.accent, opacity: 0.9 },
              ]}
            >
              <View style={[styles.statusDotSmall, { backgroundColor: colors.primary }]} />
              <Text
                style={[
                  typography.labelSm,
                  {
                    color: colors.text,
                    fontWeight: '600',
                    fontSize: 11,
                    letterSpacing: 0,
                  },
                ]}
              >
                {t('home.ambienceBalanced', 'متوازن')}
              </Text>
            </View>
            <Text
              style={[
                typography.labelSm,
                {
                  color: colors.textSubtle,
                  letterSpacing: 0,
                },
              ]}
            >
              {t('home.nextSchedulePrefix', 'التالي: 08:00')}
            </Text>
          </View>

          <View style={styles.greetingHeader}>
            <Text
              style={[
                typography.display,
                {
                  color: colors.text,
                  fontSize: 26,
                  lineHeight: 34,
                  textAlign: 'auto',
                  writingDirection: isRTL ? 'rtl' : 'ltr',
                },
              ]}
            >
              {t('home.greeting')}
            </Text>
            <Text
              style={[
                typography.bodySm,
                {
                  color: colors.textMuted,
                  marginTop: 2,
                  textAlign: 'auto',
                  writingDirection: isRTL ? 'rtl' : 'ltr',
                },
              ]}
            >
              {t('home.subGreeting')}
            </Text>
          </View>
        </View>

        {/* 3. Main Hero Card: Active Device & Misting Status */}
        <TouchableOpacity
          activeOpacity={0.96}
          onPress={() => {
            setSelectedDeviceId(activeDevice.id);
            navigation.navigate('DeviceControl');
          }}
          style={styles.heroCardTouch}
          testID="home-hero-card"
          accessibilityLabel="Device Control Hero"
          accessibilityRole="button"
        >
          <Card
            variant="hero"
            surface="lowest"
            style={[styles.heroCard, { shadowColor: '#232821', shadowOpacity: 0.06 }]}
          >
            {/* Top Card Header: Text Column (flex 1) + 48pt Power Button with 12pt gap */}
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderTextCol}>
                <View style={styles.eyebrowRow}>
                  <Text
                    style={[
                      typography.labelSm,
                      {
                        color: colors.primary,
                        fontWeight: '700',
                        letterSpacing: 0,
                      },
                    ]}
                  >
                    {getLocalizedRoomName(activeDevice.roomName, isRTL)}
                  </Text>
                  <View style={[styles.eyebrowDot, { backgroundColor: colors.border }]} />
                  <Text style={[typography.labelSm, { color: colors.textMuted, letterSpacing: 0 }]}>
                    {activeDevice.mode === 'continuous' ? t('home.continuous') : t('home.interval')}
                  </Text>
                </View>

                <Text
                  style={[
                    typography.headlineSm,
                    {
                      color: colors.text,
                      fontSize: 20,
                      lineHeight: 28,
                      fontWeight: '600',
                      marginTop: 2,
                      textAlign: 'auto',
                      writingDirection: isRTL ? 'rtl' : 'ltr',
                    },
                  ]}
                >
                  {getLocalizedDeviceName(activeDevice.name, isRTL)}
                </Text>

                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.statusDotLive,
                      { backgroundColor: isPowerOn ? colors.primary : colors.textSubtle },
                    ]}
                  />
                  <Text style={[typography.bodySm, { color: colors.text, fontWeight: '500' }]}>
                    {isPowerOn ? t('home.statusActive') : t('home.statusStandby')}
                  </Text>
                </View>
              </View>

              {/* Master Power Toggle Button (48x48 rounded-full, 0 overlap) */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleTogglePower}
                style={[
                  styles.powerBtn,
                  {
                    backgroundColor: isPowerOn ? colors.ink : colors.surfaceHigh,
                    marginStart: 12,
                  },
                ]}
                accessibilityLabel="Toggle diffuser power"
                testID="home-power-toggle"
              >
                <Icon
                  name="power_settings_new"
                  size={22}
                  color={isPowerOn ? colors.onInk : colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* Centerpiece Device Image: 192x192 Square, Centered, Radius 16 per Stitch (Item 10: fill square, object-cover, nothing behind) */}
            <View style={styles.centerpieceContainer}>


              {/* 192x192 Square Diffuser Presentation - photo fills the square, no frame behind */}
              <View style={styles.deviceImageContainer}>
                <Image
                  source={DIFFUSER_IMAGES[activeDevice.colorway] || DIFFUSER_IMAGES.sage}
                  style={styles.deviceHeroImage}
                  resizeMode="cover"
                />
              </View>

              {/* Fragrance Capsule Tag (No '30ml' leak, oil name only) */}
              <View
                style={[
                  styles.capsuleTag,
                  { backgroundColor: colors.bgAlt, borderColor: colors.border },
                ]}
              >
                <Icon name="spa" size={16} color={colors.primary} />
                <Text style={[typography.labelMd, { color: colors.text, marginStart: 6, fontWeight: '600' }]}>
                  {activeDevice.oilName}
                </Text>
              </View>
            </View>

            {/* Quick Slider Preview Bar (Standard 0-9 digits) */}
            <View style={styles.dispersionBarSection}>
              <View style={styles.dispersionHeader}>
                <Text
                  style={[
                    typography.labelSm,
                    {
                      color: colors.textMuted,
                      letterSpacing: 0,
                    },
                  ]}
                >
                  {t('home.dispersionRate', 'معدل الانتشار')}
                </Text>
                <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600' }]}>
                  {isPowerOn
                    ? `${intensityLevel * 10}% · ${t('device.level', { level: intensityLevel })}`
                    : t('common.off')}
                </Text>
              </View>

              <View style={[styles.progressBarTrack, { backgroundColor: colors.surfaceMuted }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: isPowerOn ? `${intensityLevel * 10}%` : '0%',
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              </View>

              <View style={styles.dispersionLabels}>
                <Text style={[typography.labelSm, { color: colors.textSubtle, fontSize: 11 }]}>
                  {t('presets.gentle', 'خفيف')}
                </Text>
                <Text style={[typography.labelSm, { color: colors.textSubtle, fontSize: 11 }]}>
                  {t('presets.medium', 'معتدل')}
                </Text>
                <Text style={[typography.labelSm, { color: colors.textSubtle, fontSize: 11 }]}>
                  {t('presets.intense', 'مكثف')}
                </Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        {/* 4. Quick Context Stats Row (Dynamic values from activeDevice & schedule) */}
        <View style={styles.statCardsRow}>
          {/* Card 1: Oil Level & Days Remaining */}
          <Card
            variant="compact"
            surface="lowest"
            style={styles.statCard}
            onPress={() => navigation.navigate('DeviceControl')}
          >
            <View style={styles.statTopRow}>
              <Text
                style={[
                  typography.labelSm,
                  { color: colors.textMuted, letterSpacing: 0 },
                ]}
              >
                {t('home.oil', 'الزيت')}
              </Text>
              <Icon name="opacity" size={16} color={colors.primary} />
            </View>
            <View style={styles.statValueBlock}>
              <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '600' }]}>
                {activeDevice.oilLevel}%
              </Text>
              <Text style={[typography.bodySm, { color: colors.textSubtle, fontSize: 11 }]}>
                {t('home.daysLeft', { count: activeDevice.oilRemainingDays })}
              </Text>
            </View>
            <View style={[styles.statProgressTrack, { backgroundColor: colors.surfaceMuted }]}>
              <View
                style={[
                  styles.statProgressFill,
                  {
                    width: `${activeDevice.oilLevel}%`,
                    backgroundColor: colors.primarySoft,
                  },
                ]}
              />
            </View>
          </Card>

          {/* Card 2: Next Routine */}
          <Card
            variant="compact"
            surface="lowest"
            style={styles.statCard}
            onPress={() => navigation.navigate('Schedule')}
          >
            <View style={styles.statTopRow}>
              <Text
                style={[
                  typography.labelSm,
                  { color: colors.textMuted, letterSpacing: 0 },
                ]}
              >
                {t('home.schedule', 'الجدول')}
              </Text>
              <Icon name="schedule" size={16} color={colors.primarySoft} />
            </View>
            <View style={styles.statValueBlock}>
              <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '600' }]}>
                {nextRoutine ? nextRoutine.startTime : '08:00'}
              </Text>
              <Text style={[typography.bodySm, { color: colors.textSubtle, fontSize: 11 }]}>
                {nextRoutine ? nextRoutine.name : t('home.nextRoutineDefault', 'هدوء المساء')}
              </Text>
            </View>
            <View style={[styles.statProgressTrack, { backgroundColor: colors.surfaceMuted }]}>
              <View
                style={[
                  styles.statProgressFill,
                  {
                    width: '82%',
                    backgroundColor: colors.primarySoft,
                  },
                ]}
              />
            </View>
          </Card>

          {/* Card 3: Diffusion Mode */}
          <Card
            variant="compact"
            surface="lowest"
            style={styles.statCard}
            onPress={() => navigation.navigate('DeviceControl')}
          >
            <View style={styles.statTopRow}>
              <Text
                style={[
                  typography.labelSm,
                  { color: colors.textMuted, letterSpacing: 0 },
                ]}
              >
                {t('home.mode', 'النمط')}
              </Text>
              <Icon name="airwave" size={16} color={colors.primary} />
            </View>
            <View style={styles.statValueBlock}>
              <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '600' }]}>
                {activeDevice.mode === 'continuous' ? t('home.continuous') : t('home.interval')}
              </Text>
              <Text style={[typography.bodySm, { color: colors.textSubtle, fontSize: 11 }]}>
                {t('home.intervalTiming', '30ث / 60ث')}
              </Text>
            </View>
            <View style={[styles.statProgressTrack, { backgroundColor: colors.surfaceMuted }]}>
              <View
                style={[
                  styles.statProgressFill,
                  {
                    width: '50%',
                    backgroundColor: colors.primarySoft,
                  },
                ]}
              />
            </View>
          </Card>
        </View>

        {/* 5. Connected Diffusers Carousel (Dynamic from store, no chamber/sanctuary wording) */}
        <View style={styles.sanctuariesSection}>
          <View style={styles.sanctuariesHeader}>
            <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '600' }]}>
              {t('home.connectedDiffusers')}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Devices')}
              testID="manage-devices-button"
              accessibilityLabel="Manage Devices"
              accessibilityRole="button"
            >
              <Text style={[typography.labelMd, { color: colors.primary, fontWeight: '600' }]}>
                {t('home.manageCount', { count: devices.length })}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.sanctuariesScrollView}
            contentContainerStyle={styles.sanctuariesCarousel}
          >
            {devices.map((device, idx) => (
              <TouchableOpacity
                key={device.id}
                activeOpacity={0.88}
                onPress={() => {
                  setSelectedDeviceId(device.id);
                  navigation.navigate('DeviceControl');
                }}
                style={styles.sanctuaryCardTouch}
                testID={idx === 0 ? 'home-device-card' : `home-device-card-${device.id}`}
                accessibilityLabel={`Device Card ${device.name}`}
                accessibilityRole="button"
              >
                <Card surface="lowest" style={styles.sanctuaryCard}>
                  <View style={styles.sanctuaryTop}>
                    <View style={[styles.deviceThumbCircle, { backgroundColor: colors.bgAlt }]}>
                      <Image
                        source={DIFFUSER_IMAGES[device.colorway] || DIFFUSER_IMAGES.sage}
                        style={styles.deviceThumbImage}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={{ flex: 1, marginStart: 12 }}>
                      <Text
                        numberOfLines={1}
                        style={[
                          typography.headlineSm,
                          {
                            color: colors.text,
                            fontSize: 16,
                            fontWeight: '600',
                            textAlign: 'auto',
                            writingDirection: isRTL ? 'rtl' : 'ltr',
                          },
                        ]}
                      >
                        {getLocalizedDeviceName(device.name, isRTL)}
                      </Text>
                      <View style={styles.sanctuaryStatusLine}>
                        <View
                          style={[
                            styles.statusDotSmall,
                            { backgroundColor: device.power ? colors.primary : colors.textSubtle },
                          ]}
                        />
                        <Text style={[typography.labelSm, { color: colors.textMuted, marginStart: 4 }]}>
                          {device.power ? t('common.active') : t('common.idle')}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.sanctuaryFooter}>
                    <Text style={[typography.bodySm, { color: colors.textSubtle }]}>
                      {getLocalizedOilName(device.oilName, isRTL)}
                    </Text>
                    <View style={[styles.colorBadge, { backgroundColor: colors.surfaceMuted }]}>
                      <Text style={[typography.labelSm, { color: colors.text, fontSize: 11, fontWeight: '600' }]}>
                        {getLocalizedRoomName(device.roomName, isRTL)}
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 6. Curated Collection Store Teaser Card */}
        <View style={styles.storeTeaserSection}>
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={() => navigation.navigate('Store')}
          >
            <Card
              surface="low"
              style={[
                styles.storeTeaserCard,
                {
                  shadowColor: '#232821',
                  shadowOpacity: 0.03,
                },
              ]}
            >
              <View style={styles.storeTeaserTextContent}>
                <View
                  style={[
                    styles.curatedPill,
                    {
                      backgroundColor: colors.accent,
                      alignSelf: 'flex-start',
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.labelSm,
                      {
                        color: colors.text,
                        fontWeight: '700',
                        fontSize: 10,
                        letterSpacing: 0,
                      },
                    ]}
                  >
                    {t('home.curatedCollection')}
                  </Text>
                </View>

                <Text
                  style={[
                    typography.headlineSm,
                    {
                      color: colors.text,
                      fontWeight: '600',
                      fontSize: 18,
                      marginTop: 6,
                      textAlign: 'auto',
                      writingDirection: isRTL ? 'rtl' : 'ltr',
                    },
                  ]}
                >
                  {t('home.curatedTitle', 'هينوكي مدخن وشاي أبيض')}
                </Text>

                <Text
                  numberOfLines={2}
                  style={[
                    typography.bodySm,
                    {
                      color: colors.textMuted,
                      marginTop: 4,
                      textAlign: 'auto',
                      writingDirection: isRTL ? 'rtl' : 'ltr',
                    },
                  ]}
                >
                  {t('home.curatedDesc')}
                </Text>

                <View style={styles.exploreLinkRow}>
                  <Text style={[typography.labelMd, { color: colors.primary, fontWeight: '600' }]}>
                    {t('home.discoverNow')}
                  </Text>
                  <Icon
                    name={isRTL ? 'arrow_back' : 'arrow_forward'}
                    size={16}
                    color={colors.primary}
                    style={{ marginHorizontal: 4 }}
                  />
                </View>
              </View>

              {/* Real Curated Image bleeding to bottom-end corner */}
              <View style={styles.teaserImageContainer}>
                <Image
                  source={require('../../assets/photos/hinoki-curated.jpg')}
                  style={styles.teaserBottleImage}
                  resizeMode="cover"
                />
              </View>
            </Card>
          </TouchableOpacity>
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
    paddingTop: 12,
  },
  appBarLeading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  welcomeSection: {
    marginBottom: 16,
  },
  ambienceBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ambienceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginEnd: 6,
  },
  greetingHeader: {
    marginTop: 4,
  },
  heroCardTouch: {
    marginBottom: 16,
  },
  heroCard: {
    padding: 16,
    borderRadius: 24,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    zIndex: 10,
    marginBottom: 8,
  },
  cardHeaderTextCol: {
    flex: 1,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  eyebrowDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDotLive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginEnd: 6,
  },
  powerBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  centerpieceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    position: 'relative',
  },
  deviceHalo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  vaporContainer: {
    position: 'absolute',
    top: -24,
    zIndex: 15,
  },
  deviceImageContainer: {
    width: 192,
    height: 192,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  deviceHeroImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  capsuleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 12,
    borderWidth: 1,
  },
  dispersionBarSection: {
    zIndex: 10,
    paddingTop: 8,
  },
  dispersionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  dispersionLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minHeight: 104,
    padding: 12,
    justifyContent: 'space-between',
  },
  statTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statValueBlock: {
    marginVertical: 4,
  },
  statProgressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  statProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  sanctuariesSection: {
    marginBottom: 24,
  },
  sanctuariesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sanctuariesScrollView: {
    marginHorizontal: -20,
  },
  sanctuariesCarousel: {
    paddingHorizontal: 20,
    paddingEnd: 8,
  },
  sanctuaryCardTouch: {
    width: 210,
    marginEnd: 12,
  },
  sanctuaryCard: {
    padding: 14,
    borderRadius: 20,
  },
  sanctuaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceThumbCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  deviceThumbImage: {
    width: 32,
    height: 32,
  },
  sanctuaryStatusLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  sanctuaryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  colorBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  storeTeaserSection: {
    marginBottom: 16,
  },
  storeTeaserCard: {
    padding: 16,
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 160,
    justifyContent: 'center',
  },
  storeTeaserTextContent: {
    maxWidth: '65%',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  curatedPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  exploreLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  teaserImageContainer: {
    position: 'absolute',
    bottom: 0,
    end: 0,
    width: 130,
    height: 144,
    borderTopStartRadius: 20,
    overflow: 'hidden',
  },
  teaserBottleImage: {
    width: '100%',
    height: '100%',
  },
});
