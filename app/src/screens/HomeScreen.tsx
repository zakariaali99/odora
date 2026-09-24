import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../theme';
import { AppBar, Card, Icon } from '../components/ui';
import { getDeviceController } from '../device/DeviceController';
import { DeviceState } from '../device/types';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors, typography, radii, spacing, isRTL, motion } = useTheme();
  const insets = useSafeAreaInsets();
  const controller = getDeviceController();
  const [deviceState, setDeviceState] = useState<DeviceState>(
    controller.getState()
  );

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

  useEffect(() => {
    const unsub = controller.onStateChange((state) => {
      setDeviceState(state);
    });
    return unsub;
  }, [controller]);

  const handleTogglePower = () => {
    controller.setPower(!deviceState.power);
  };

  const isPowerOn = deviceState.power;
  const intensityLevel = deviceState.intensity || 6;

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
                  fontWeight: '500',
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
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Top Welcome & Sanctuary Ambience Badge */}
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
                    textTransform: isRTL ? 'none' : 'uppercase',
                    fontSize: 10,
                    letterSpacing: isRTL ? 0 : 0.8,
                  },
                ]}
              >
                {isRTL ? 'الملاذ الحيوي · متوازن' : 'Living Sanctuary · Optimal'}
              </Text>
            </View>
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
              {isRTL ? 'التالي: 08:00' : 'Next: 08:00 AM'}
            </Text>
          </View>

          <View style={styles.greetingHeader}>
            <Text style={[typography.display, { color: colors.text, fontSize: 26, lineHeight: 34 }]}>
              {isRTL ? 'مساء الخير، جوليان' : 'Good evening, Julian'}
            </Text>
            <Text style={[typography.bodySm, { color: colors.textMuted, marginTop: 2 }]}>
              {isRTL
                ? 'الأجواء مهيأة للاسترخاء والهدوء المسائي.'
                : 'Atmosphere calibrated for restorative evening calm.'}
            </Text>
          </View>
        </View>

        {/* 3. Main Hero Card: Active Device & Misting Status */}
        <TouchableOpacity
          activeOpacity={0.96}
          onPress={() => navigation.navigate('DeviceControl')}
          style={styles.heroCardTouch}
        >
          <Card
            variant="hero"
            surface="lowest"
            style={[styles.heroCard, { shadowColor: '#232821', shadowOpacity: 0.06 }]}
          >
            {/* Top Card Header */}
            <View style={styles.cardHeaderRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.eyebrowRow}>
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
                    {isRTL ? 'الغرفة الرئيسية' : 'Primary Chamber'}
                  </Text>
                  <View style={[styles.eyebrowDot, { backgroundColor: colors.border }]} />
                  <Text style={[typography.labelSm, { color: colors.textMuted }]}>
                    {isRTL ? 'نمط مستمر' : 'Continuous Mode'}
                  </Text>
                </View>

                <Text
                  style={[
                    typography.headlineSm,
                    { color: colors.text, fontSize: 20, lineHeight: 28, fontWeight: '500', marginTop: 2 },
                  ]}
                >
                  {isRTL ? 'موزع غرفة المعيشة' : 'Living Room Diffuser'}
                </Text>

                <View style={styles.statusRow}>
                  <View
                    style={[
                      styles.statusDotLive,
                      { backgroundColor: isPowerOn ? colors.primary : colors.textSubtle },
                    ]}
                  />
                  <Text style={[typography.bodySm, { color: colors.text, fontWeight: '500' }]}>
                    {isPowerOn
                      ? (isRTL ? 'يعمل الآن' : 'Misting Now')
                      : (isRTL ? 'في وضع الاستعداد' : 'Standby')}
                  </Text>
                  <Text style={[typography.bodySm, { color: colors.textMuted }]}>
                    {' · '}{isRTL ? 'انتشار ميكروي بارد' : 'Cold Micro-Diffusion'}
                  </Text>
                </View>
              </View>

              {/* Master Power Toggle Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleTogglePower}
                style={[
                  styles.powerBtn,
                  {
                    backgroundColor: isPowerOn ? colors.ink : colors.surfaceHigh,
                  },
                ]}
                accessibilityLabel="Toggle diffuser power"
              >
                <Icon
                  name="power_settings_new"
                  size={22}
                  color={isPowerOn ? colors.onInk : colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* Centerpiece Device Image with Ambient Vapor & Contained Halo */}
            <View style={styles.centerpieceContainer}>
              {/* Soft Contained Halo directly behind the device presentation */}
              <View
                style={[
                  styles.deviceHalo,
                  { backgroundColor: colors.accent, opacity: 0.18 },
                ]}
              />

              {isPowerOn && (
                <Animated.View
                  style={[
                    styles.vaporContainer,
                    {
                      transform: [
                        { translateY: mistTranslateY },
                        { scale: mistScale },
                      ],
                      opacity: mistOpacity,
                    },
                  ]}
                >
                  <Svg width={48} height={80} viewBox="0 0 60 100">
                    <Path
                      d="M30,90 Q22,70 34,50 T30,10 Q26,30 22,55 T30,90 Z"
                      fill={colors.primarySoft}
                      opacity={0.45}
                    />
                    <Path
                      d="M28,95 Q36,75 26,50 T32,15 Q34,40 28,65 T28,95 Z"
                      fill={colors.primarySoft}
                      opacity={0.3}
                    />
                  </Svg>
                </Animated.View>
              )}

              {/* Wide Landscape Product Image (Matches Stitch ≈350x230 crop) */}
              <View style={[styles.deviceImageContainer, { backgroundColor: colors.bgAlt }]}>
                <Image
                  source={require('../../assets/photos/diffuser_sage_hero.png')}
                  style={styles.deviceHeroImage}
                  resizeMode="cover"
                />
              </View>

              {/* Fragrance Capsule Tag */}
              <View
                style={[
                  styles.capsuleTag,
                  { backgroundColor: colors.bgAlt, borderColor: colors.border },
                ]}
              >
                <Icon name="spa" size={16} color={colors.primary} />
                <Text style={[typography.labelMd, { color: colors.text, marginStart: 4, fontWeight: '500' }]}>
                  {isRTL ? 'مريمية الغابة والأرز' : 'Forest Sage & Cedar'}
                </Text>
                <Text style={[typography.labelSm, { color: colors.textSubtle, marginStart: 4 }]}>
                  30ml
                </Text>
              </View>
            </View>

            {/* Quick Slider Preview Bar */}
            <View style={styles.dispersionBarSection}>
              <View style={styles.dispersionHeader}>
                <Text
                  style={[
                    typography.labelSm,
                    {
                      color: colors.textMuted,
                      textTransform: isRTL ? 'none' : 'uppercase',
                      letterSpacing: isRTL ? 0 : 0.8,
                    },
                  ]}
                >
                  {isRTL ? 'معدل الانتشار' : 'Aroma Dispersion'}
                </Text>
                <Text style={[typography.labelMd, { color: colors.text, fontWeight: '600' }]}>
                  {isPowerOn ? `${intensityLevel * 10}% · Level ${intensityLevel}` : (isRTL ? 'متوقف' : 'Standby · Off')}
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
                <Text style={[typography.labelSm, { color: colors.textSubtle }]}>
                  {isRTL ? 'خفيف' : 'Subtle Veil'}
                </Text>
                <Text style={[typography.labelSm, { color: colors.textSubtle }]}>
                  {isRTL ? 'متوازن' : 'Balanced'}
                </Text>
                <Text style={[typography.labelSm, { color: colors.textSubtle }]}>
                  {isRTL ? 'مكثف' : 'Rich Enclosure'}
                </Text>
              </View>
            </View>
          </Card>
        </TouchableOpacity>

        {/* 4. Telemetry / Stat Cards Row (3 Grid Cards) */}
        <View style={styles.statCardsRow}>
          {/* Card 1: Oil Level */}
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
                  { color: colors.textMuted, textTransform: isRTL ? 'none' : 'uppercase' },
                ]}
              >
                {isRTL ? 'الزيت' : 'Oil Level'}
              </Text>
              <Icon name="opacity" size={16} color={colors.primary} />
            </View>
            <View style={styles.statValueBlock}>
              <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '600' }]}>
                68%
              </Text>
              <Text style={[typography.bodySm, { color: colors.textSubtle, fontSize: 11 }]}>
                {isRTL ? '~18 يوم متبقي' : '~18 days left'}
              </Text>
            </View>
            <View style={[styles.statProgressTrack, { backgroundColor: colors.surfaceMuted }]}>
              <View
                style={[
                  styles.statProgressFill,
                  { width: '68%', backgroundColor: colors.primarySoft },
                ]}
              />
            </View>
          </Card>

          {/* Card 2: Next Routine (Replaces Acoustics per 08 §4) */}
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
                  { color: colors.textMuted, textTransform: isRTL ? 'none' : 'uppercase' },
                ]}
              >
                {isRTL ? 'الجدول' : 'Routine'}
              </Text>
              <Icon name="schedule" size={16} color={colors.primarySoft} />
            </View>
            <View style={styles.statValueBlock}>
              <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '600' }]}>
                19:00
              </Text>
              <Text style={[typography.bodySm, { color: colors.textSubtle, fontSize: 11 }]}>
                {isRTL ? 'هدوء المساء' : 'Evening Calm'}
              </Text>
            </View>
            <View style={[styles.statProgressTrack, { backgroundColor: colors.surfaceMuted }]}>
              <View
                style={[
                  styles.statProgressFill,
                  { width: '82%', backgroundColor: colors.primarySoft },
                ]}
              />
            </View>
          </Card>

          {/* Card 3: Diffusion Mode (Replaces Circadian per 08 §4) */}
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
                  { color: colors.textMuted, textTransform: isRTL ? 'none' : 'uppercase' },
                ]}
              >
                {isRTL ? 'النمط' : 'Mode'}
              </Text>
              <Icon name="airwave" size={16} color={colors.primary} />
            </View>
            <View style={styles.statValueBlock}>
              <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '600' }]}>
                {isRTL ? 'نبض' : 'Interval'}
              </Text>
              <Text style={[typography.bodySm, { color: colors.textSubtle, fontSize: 11 }]}>
                {isRTL ? '30ث / 60ث' : '30s on · 60s off'}
              </Text>
            </View>
            <View style={[styles.statProgressTrack, { backgroundColor: colors.surfaceMuted }]}>
              <View
                style={[
                  styles.statProgressFill,
                  { width: '50%', backgroundColor: colors.primarySoft },
                ]}
              />
            </View>
          </Card>
        </View>

        {/* 5. Connected Sanctuaries Carousel */}
        <View style={styles.sanctuariesSection}>
          <View style={styles.sanctuariesHeader}>
            <Text style={[typography.headlineSm, { color: colors.text, fontWeight: '500' }]}>
              {isRTL ? 'الأجهزة المتصلة' : 'Connected Sanctuaries'}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Devices')}
            >
              <Text style={[typography.labelMd, { color: colors.primary, fontWeight: '600' }]}>
                {isRTL ? 'إدارة (3)' : 'Manage (3)'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sanctuariesCarousel}
          >
            {/* Device 1: Living Room */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => navigation.navigate('DeviceControl')}
              style={[styles.sanctuaryCardTouch]}
            >
              <Card surface="lowest" style={styles.sanctuaryCard}>
                <View style={styles.sanctuaryTop}>
                  <View style={[styles.deviceThumbCircle, { backgroundColor: colors.bgAlt }]}>
                    <Image
                      source={require('../../assets/photos/diffuser-a316-sage.png')}
                      style={styles.deviceThumbImage}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={{ flex: 1, marginStart: 12 }}>
                    <Text
                      numberOfLines={1}
                      style={[typography.headlineSm, { color: colors.text, fontSize: 16, fontWeight: '500' }]}
                    >
                      {isRTL ? 'غرفة المعيشة' : 'Living Room'}
                    </Text>
                    <View style={styles.sanctuaryStatusLine}>
                      <View style={[styles.statusDotSmall, { backgroundColor: colors.primary }]} />
                      <Text style={[typography.labelSm, { color: colors.textMuted, marginStart: 4 }]}>
                        {isRTL ? 'نشط · أخضر حكيم' : 'Active · Sage Green'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.sanctuaryFooter}>
                  <Text style={[typography.bodySm, { color: colors.textSubtle }]}>
                    {isRTL ? 'مريمية الغابة' : 'Forest Sage'}
                  </Text>
                  <View style={[styles.chamberPill, { backgroundColor: colors.accent }]}>
                    <Text style={[typography.labelSm, { color: colors.text, fontSize: 10, fontWeight: '600' }]}>
                      {isRTL ? 'حجرة 1' : 'Chamber 1'}
                    </Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>

            {/* Device 2: Master Bedroom */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => navigation.navigate('DeviceControl')}
              style={styles.sanctuaryCardTouch}
            >
              <Card surface="lowest" style={styles.sanctuaryCard}>
                <View style={styles.sanctuaryTop}>
                  <View style={[styles.deviceThumbCircle, { backgroundColor: colors.bgAlt }]}>
                    <Image
                      source={require('../../assets/photos/diffuser-a316-white.png')}
                      style={styles.deviceThumbImage}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={{ flex: 1, marginStart: 12 }}>
                    <Text
                      numberOfLines={1}
                      style={[typography.headlineSm, { color: colors.text, fontSize: 16, fontWeight: '500' }]}
                    >
                      {isRTL ? 'غرفة النوم الرئيسية' : 'Master Bedroom'}
                    </Text>
                    <View style={styles.sanctuaryStatusLine}>
                      <View style={[styles.statusDotSmall, { backgroundColor: colors.textSubtle }]} />
                      <Text style={[typography.labelSm, { color: colors.textSubtle, marginStart: 4 }]}>
                        {isRTL ? 'متوقف مؤقتاً · أبيض' : 'Paused · Matte White'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.sanctuaryFooter}>
                  <Text style={[typography.bodySm, { color: colors.textSubtle }]}>
                    {isRTL ? 'صندل وسوسن' : 'White Santal & Iris'}
                  </Text>
                  <View style={[styles.chamberPill, { backgroundColor: colors.surfaceMuted }]}>
                    <Text style={[typography.labelSm, { color: colors.textSubtle, fontSize: 10 }]}>
                      {isRTL ? 'استراحة' : 'Resting'}
                    </Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>

            {/* Device 3: Studio Suite */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => navigation.navigate('DeviceControl')}
              style={styles.sanctuaryCardTouch}
            >
              <Card surface="lowest" style={styles.sanctuaryCard}>
                <View style={styles.sanctuaryTop}>
                  <View style={[styles.deviceThumbCircle, { backgroundColor: colors.bgAlt }]}>
                    <Image
                      source={require('../../assets/photos/diffuser-a316-black.png')}
                      style={styles.deviceThumbImage}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={{ flex: 1, marginStart: 12 }}>
                    <Text
                      numberOfLines={1}
                      style={[typography.headlineSm, { color: colors.text, fontSize: 16, fontWeight: '500' }]}
                    >
                      {isRTL ? 'جناح الاستوديو' : 'Studio Suite'}
                    </Text>
                    <View style={styles.sanctuaryStatusLine}>
                      <View style={[styles.statusDotSmall, { backgroundColor: colors.textSubtle }]} />
                      <Text style={[typography.labelSm, { color: colors.textSubtle, marginStart: 4 }]}>
                        {isRTL ? 'استعداد · أسود' : 'Standby · Charcoal'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.sanctuaryFooter}>
                  <Text style={[typography.bodySm, { color: colors.textSubtle }]}>
                    {isRTL ? 'سرو مدخن' : 'Smoky Cypress'}
                  </Text>
                  <View style={[styles.chamberPill, { backgroundColor: colors.surfaceMuted }]}>
                    <Text style={[typography.labelSm, { color: colors.textSubtle, fontSize: 10 }]}>
                      {isRTL ? 'مزامنة نوم' : 'Sleep Sync'}
                    </Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* 6. Autumn Curated Store Teaser Card */}
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
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  shadowColor: '#232821',
                  shadowOpacity: 0.03,
                },
              ]}
            >
              <View
                style={[
                  styles.storeTeaserTextContent,
                  {
                    paddingEnd: isRTL ? 0 : 16,
                    paddingStart: isRTL ? 16 : 0,
                    alignItems: isRTL ? 'flex-end' : 'flex-start',
                  },
                ]}
              >
                <View
                  style={[
                    styles.curatedPill,
                    {
                      backgroundColor: colors.accent,
                      alignSelf: isRTL ? 'flex-end' : 'flex-start',
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
                        textTransform: isRTL ? 'none' : 'uppercase',
                        letterSpacing: isRTL ? 0 : 0.8,
                      },
                    ]}
                  >
                    {isRTL ? 'مختارات الخريف' : 'Autumn Curated'}
                  </Text>
                </View>

                <Text
                  style={[
                    typography.headlineSm,
                    {
                      color: colors.text,
                      fontWeight: '500',
                      fontSize: 18,
                      marginTop: 6,
                      textAlign: isRTL ? 'right' : 'left',
                    },
                  ]}
                >
                  {isRTL ? 'هينوكي مدخن وشاي أبيض' : 'Smoky Hinoki & White Tea'}
                </Text>

                <Text
                  numberOfLines={2}
                  style={[
                    typography.bodySm,
                    {
                      color: colors.textMuted,
                      marginTop: 4,
                      textAlign: isRTL ? 'right' : 'left',
                    },
                  ]}
                >
                  {isRTL
                    ? 'زيوت نباتية مقطرة بالبخار ومصممة للحضور الذهني والصفاء العميق.'
                    : 'Artisanal steam-distilled botanicals formulated for mindful presence and deep clarity.'}
                </Text>

                <View
                  style={[
                    styles.exploreLinkRow,
                    { flexDirection: isRTL ? 'row-reverse' : 'row' },
                  ]}
                >
                  <Text style={[typography.labelMd, { color: colors.primary, fontWeight: '600' }]}>
                    {isRTL ? 'استكشف العطور' : 'Explore Fragrances'}
                  </Text>
                  <Icon
                    name={isRTL ? 'arrow_backward' : 'arrow_forward'}
                    size={16}
                    color={colors.primary}
                    style={{ marginHorizontal: 4 }}
                  />
                </View>
              </View>

              {/* Real Bottle Image Placement */}
              <View style={styles.teaserImageContainer}>
                <Image
                  source={require('../../assets/photos/oil-cotton-linen.png')}
                  style={styles.teaserBottleImage}
                  resizeMode="contain"
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
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  welcomeSection: {
    marginBottom: 16,
  },
  ambienceBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ambienceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginEnd: 8,
  },
  greetingHeader: {
    marginTop: 4,
  },
  heroCardTouch: {
    marginBottom: 16,
  },
  heroCard: {
    position: 'relative',
    overflow: 'hidden',
  },
  deviceHalo: {
    position: 'absolute',
    top: 36,
    width: 160,
    height: 160,
    borderRadius: 80,
    alignSelf: 'center',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eyebrowDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  statusDotLive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginEnd: 8,
  },
  powerBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerpieceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    position: 'relative',
  },
  vaporContainer: {
    position: 'absolute',
    top: 0,
    zIndex: 15,
  },
  deviceImageContainer: {
    width: '100%',
    height: 230,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  deviceHeroImage: {
    width: '100%',
    height: '100%',
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statValueBlock: {
    marginVertical: 6,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sanctuariesCarousel: {
    gap: 16,
  },
  sanctuaryCardTouch: {
    width: 256,
  },
  sanctuaryCard: {
    padding: 16,
    height: 130,
    justifyContent: 'space-between',
  },
  sanctuaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceThumbCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  deviceThumbImage: {
    width: 40,
    height: 40,
  },
  sanctuaryStatusLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  sanctuaryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(35,40,33,0.06)',
    paddingTop: 8,
  },
  chamberPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  storeTeaserSection: {
    marginBottom: 16,
  },
  storeTeaserCard: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  storeTeaserTextContent: {
    flex: 1,
    paddingEnd: 12,
    zIndex: 10,
  },
  curatedPill: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  exploreLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  teaserImageContainer: {
    width: 88,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  teaserBottleImage: {
    width: '100%',
    height: '100%',
  },
});

export default HomeScreen;
