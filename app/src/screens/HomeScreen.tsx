import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Power, Droplets, Wind, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { LanguageToggle } from '../components/LanguageToggle';
import { colors, typography, spacing, radii, shadows } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { getDeviceController } from '../device/DeviceController';
import { DeviceState } from '../device/types';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { language, isRTL } = useAppStore();
  const controller = getDeviceController();
  const [deviceState, setDeviceState] = useState<DeviceState>(
    controller.getState()
  );

  useEffect(() => {
    const unsub = controller.onStateChange((state) => {
      setDeviceState(state);
    });
    return unsub;
  }, [controller]);

  const handleTogglePower = () => {
    controller.setPower(!deviceState.power);
  };

  const fontFam =
    language === 'ar'
      ? typography.fontFamily.ar
      : typography.fontFamily.en;

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <ScreenContainer>
      <Header
        showBack={false}
        rightAction="settings"
        onRightAction={() => navigation.navigate('Settings')}
      />

      <View style={styles.content}>
        {/* Language Quick Switcher */}
        <View style={styles.langRow}>
          <LanguageToggle />
        </View>

        {/* Brand Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={[styles.eyebrow, { fontFamily: fontFam.medium }]}>
            {t('common.taglineEn')}
          </Text>
          <Text style={[styles.greetingTitle, { fontFamily: fontFam.light }]}>
            {t('home.greeting')}
          </Text>
          <Text style={[styles.greetingSubtitle, { fontFamily: fontFam.regular }]}>
            {t('home.subGreeting')}
          </Text>
        </View>

        {/* Real Brand Lifestyle Hero Banner */}
        <View style={styles.heroCardWrapper}>
          <Card variant="surface" elevation="elevated" style={styles.heroCard}>
            <Image
              source={require('../../assets/images/brand_photo_2.png')}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay}>
              <View style={styles.heroBadge}>
                <Sparkles size={14} color={colors.brandOlive} />
                <Text style={[styles.heroBadgeText, { fontFamily: fontFam.medium }]}>
                  {t('home.scentOfTheDay')}
                </Text>
              </View>
              <Text style={[styles.heroTitle, { fontFamily: fontFam.medium }]}>
                {language === 'ar' ? 'مريمية الغابة · Forest Sage' : 'Forest Sage · Pure Aroma'}
              </Text>
              <Text style={[styles.heroNotes, { fontFamily: fontFam.regular }]}>
                {t('device.topNotes')}
              </Text>
            </View>
          </Card>
        </View>

        {/* My Diffusers Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { fontFamily: fontFam.medium }]}>
            {t('home.myDevices')}
          </Text>
          <View style={styles.statusIndicator}>
            <View
              style={[
                styles.dot,
                { backgroundColor: deviceState.power ? colors.statusOn : colors.inkMuted },
              ]}
            />
            <Text style={[styles.statusText, { fontFamily: fontFam.regular }]}>
              {deviceState.power ? t('common.active') : t('common.off')}
            </Text>
          </View>
        </View>

        {/* Active Device Card */}
        <Card variant="surface" elevation="card" style={styles.deviceCard}>
          <View style={styles.deviceHeader}>
            <View>
              <Text style={[styles.deviceName, { fontFamily: fontFam.medium }]}>
                {t('device.livingRoom')}
              </Text>
              <Text style={[styles.deviceModel, { fontFamily: fontFam.regular }]}>
                {t('device.model')} · {t('device.connectedBle')}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.powerBtn,
                deviceState.power ? styles.powerBtnOn : styles.powerBtnOff,
              ]}
              onPress={handleTogglePower}
              activeOpacity={0.8}
            >
              <Power
                size={20}
                color={deviceState.power ? colors.surface : colors.inkMuted}
              />
            </TouchableOpacity>
          </View>

          {/* Device Metrics Row */}
          <View style={styles.metricsRow}>
            {/* Intensity Metric */}
            <View style={styles.metricItem}>
              <View style={styles.metricIconWrap}>
                <Wind size={18} color={colors.brandSage} />
              </View>
              <View>
                <Text style={[styles.metricLabel, { fontFamily: fontFam.regular }]}>
                  {t('device.intensity')}
                </Text>
                <Text style={[styles.metricValue, { fontFamily: fontFam.bold }]}>
                  {t('device.level', { level: deviceState.intensity })}
                </Text>
              </View>
            </View>

            {/* Oil Level Metric */}
            <View style={styles.metricItem}>
              <View style={styles.metricIconWrap}>
                <Droplets size={18} color={colors.brandSage} />
              </View>
              <View>
                <Text style={[styles.metricLabel, { fontFamily: fontFam.regular }]}>
                  {t('device.oilLevel')}
                </Text>
                <Text style={[styles.metricValue, { fontFamily: fontFam.bold }]}>
                  {t('device.oilPercent', { percent: deviceState.oilLevel })}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Details Action */}
          <TouchableOpacity
            style={styles.deviceFooterAction}
            onPress={() => navigation.navigate('DeviceControl')}
            activeOpacity={0.7}
          >
            <Text style={[styles.footerActionText, { fontFamily: fontFam.medium }]}>
              {language === 'ar' ? 'التحكّم الكامل والجدولة' : 'Full Control & Schedule'}
            </Text>
            <ChevronIcon size={18} color={colors.brandSage} />
          </TouchableOpacity>
        </Card>

        {/* Store Explore Banner */}
        <View style={styles.storeBannerWrapper}>
          <Card variant="cream" elevation="subtle" style={styles.storeBanner}>
            <View style={styles.storeBannerContent}>
              <Text style={[styles.storeEyebrow, { fontFamily: fontFam.medium }]}>
                {t('store.featuredDiffusers')}
              </Text>
              <Text style={[styles.storeTitle, { fontFamily: fontFam.medium }]}>
                {t('store.subtitle')}
              </Text>
              <Button
                title={t('home.exploreStore')}
                onPress={() => navigation.navigate('Store')}
                variant="dark"
                size="sm"
                style={styles.storeBtn}
              />
            </View>
          </Card>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
  },
  langRow: {
    marginBottom: spacing.md,
  },
  greetingSection: {
    marginBottom: spacing.xl,
    paddingTop: spacing.xs,
  },
  eyebrow: {
    fontSize: typography.fontSize.eyebrow,
    letterSpacing: typography.letterSpacing.eyebrow,
    color: colors.inkMuted,
    marginBottom: spacing.xs,
  },
  greetingTitle: {
    fontSize: typography.fontSize.hero,
    color: colors.inkPrimary,
    lineHeight: typography.lineHeight.hero,
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: typography.fontSize.body,
    color: colors.inkMuted,
  },
  heroCardWrapper: {
    marginBottom: spacing.xxl,
  },
  heroCard: {
    padding: 0,
    overflow: 'hidden',
    height: 220,
    borderRadius: radii.card,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: 'rgba(43, 43, 38, 0.45)',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.brandPaleGreen,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  heroBadgeText: {
    fontSize: typography.fontSize.caption,
    color: colors.brandOlive,
  },
  heroTitle: {
    fontSize: typography.fontSize.title3,
    color: colors.surface,
    marginBottom: 2,
  },
  heroNotes: {
    fontSize: typography.fontSize.caption,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.title2,
    color: colors.inkPrimary,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: typography.fontSize.caption,
    color: colors.inkMuted,
  },
  deviceCard: {
    marginBottom: spacing.xl,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  deviceName: {
    fontSize: typography.fontSize.title2,
    color: colors.inkPrimary,
  },
  deviceModel: {
    fontSize: typography.fontSize.caption,
    color: colors.inkMuted,
    marginTop: 2,
  },
  powerBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  powerBtnOn: {
    backgroundColor: colors.controlDark,
    ...shadows.powerGlow,
  },
  powerBtnOff: {
    backgroundColor: colors.surfaceMuted,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  metricIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: typography.fontSize.caption,
    color: colors.inkMuted,
  },
  metricValue: {
    fontSize: typography.fontSize.body,
    color: colors.inkPrimary,
  },
  deviceFooterAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderFaint,
  },
  footerActionText: {
    fontSize: typography.fontSize.bodySm,
    color: colors.brandSage,
  },
  storeBannerWrapper: {
    marginBottom: spacing.xxl,
  },
  storeBanner: {
    borderRadius: radii.card,
    padding: spacing.xl,
  },
  storeBannerContent: {
    gap: spacing.sm,
  },
  storeEyebrow: {
    fontSize: typography.fontSize.eyebrow,
    letterSpacing: typography.letterSpacing.eyebrow,
    color: colors.brandOlive,
    textTransform: 'uppercase',
  },
  storeTitle: {
    fontSize: typography.fontSize.body,
    color: colors.inkPrimary,
    lineHeight: typography.lineHeight.body,
  },
  storeBtn: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
});
