import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Power,
  Droplets,
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  Sparkles,
  Minus,
  Plus,
} from 'lucide-react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, typography, spacing, radii, shadows } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { getDeviceController } from '../device/DeviceController';
import { DeviceState } from '../device/types';

interface DeviceScreenProps {
  navigation: any;
}

export const DeviceScreen: React.FC<DeviceScreenProps> = ({ navigation }) => {
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

  const fontFam =
    language === 'ar'
      ? typography.fontFamily.ar
      : typography.fontFamily.en;

  const handleTogglePower = () => {
    controller.setPower(!deviceState.power);
  };

  const handleSetIntensity = (level: number) => {
    const clamped = Math.max(0, Math.min(10, Math.round(level)));
    controller.setIntensity(clamped);
  };

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <ScreenContainer>
      <Header
        showBack={true}
        onBack={() => navigation.goBack()}
        rightAction="settings"
        onRightAction={() => navigation.navigate('Settings')}
      />

      <View style={styles.content}>
        {/* Device Title & Status */}
        <View style={styles.titleSection}>
          <Text style={[styles.deviceName, { fontFamily: fontFam.medium }]}>
            {t('device.livingRoom')}
          </Text>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: deviceState.power ? colors.brandSage : colors.inkMuted },
              ]}
            />
            <Text style={[styles.statusText, { fontFamily: fontFam.regular }]}>
              {deviceState.power ? t('common.on') : t('common.off')} ·{' '}
              {deviceState.power
                ? t('device.level', { level: deviceState.intensity })
                : t('common.idle')}
            </Text>
          </View>
        </View>

        {/* Real Product Photography Hero with Ambient Mist */}
        <View style={styles.deviceHeroWrapper}>
          <Card variant="surface" elevation="elevated" style={styles.heroCard}>
            <Image
              source={require('../../assets/images/brand_photo_0.png')}
              style={styles.heroImage}
              resizeMode="cover"
            />
            {/* Ambient Mist Cue Indicator */}
            {deviceState.power && (
              <View style={styles.mistIndicator}>
                <Sparkles size={16} color={colors.brandSage} />
                <Text style={[styles.mistText, { fontFamily: fontFam.medium }]}>
                  {language === 'ar' ? 'ينفث العطر الآن' : 'Diffusing Aroma'}
                </Text>
              </View>
            )}
          </Card>
        </View>

        {/* Intensity Controller (Continuous 0-10 Slider with Value Bubble) */}
        <Card variant="surface" elevation="card" style={styles.controlCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardLabel, { fontFamily: fontFam.medium }]}>
              {t('device.intensity')}
            </Text>
            <View style={styles.valueBubble}>
              <Text style={[styles.valueBubbleText, { fontFamily: fontFam.bold }]}>
                {t('device.level', { level: deviceState.intensity })}
              </Text>
            </View>
          </View>

          {/* Continuous Slider Track with Round Knob */}
          <View style={styles.sliderContainer}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => handleSetIntensity(deviceState.intensity - 1)}
              disabled={deviceState.intensity <= 0}
              activeOpacity={0.7}
            >
              <Minus size={16} color={deviceState.intensity <= 0 ? colors.inkLight : colors.inkPrimary} />
            </TouchableOpacity>

            <View style={styles.trackContainer}>
              <View style={styles.sliderTrack}>
                <View
                  style={[
                    styles.sliderFill,
                    { width: `${(deviceState.intensity / 10) * 100}%` },
                  ]}
                />
              </View>
              {/* Tap segments along track 0..10 */}
              <View style={styles.sliderTouchRow}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => (
                  <TouchableOpacity
                    key={lvl}
                    style={styles.sliderTouchSegment}
                    onPress={() => handleSetIntensity(lvl)}
                    activeOpacity={0.8}
                  />
                ))}
              </View>
              {/* Round Knob */}
              <View
                style={[
                  styles.sliderKnob,
                  {
                    left: `${(deviceState.intensity / 10) * 100}%`,
                    transform: [{ translateX: -12 }],
                  },
                ]}
              />
            </View>

            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => handleSetIntensity(deviceState.intensity + 1)}
              disabled={deviceState.intensity >= 10}
              activeOpacity={0.7}
            >
              <Plus size={16} color={deviceState.intensity >= 10 ? colors.inkLight : colors.inkPrimary} />
            </TouchableOpacity>
          </View>

          {/* Scale range labels */}
          <View style={styles.scaleRow}>
            <Text style={[styles.scaleText, { fontFamily: fontFam.regular }]}>0</Text>
            <Text style={[styles.scaleText, { fontFamily: fontFam.regular }]}>5</Text>
            <Text style={[styles.scaleText, { fontFamily: fontFam.regular }]}>10</Text>
          </View>
        </Card>

        {/* Oil Level Gauge Card */}
        <Card variant="surface" elevation="card" style={styles.controlCard}>
          <View style={styles.oilRow}>
            <View style={styles.oilIconWrap}>
              <Droplets size={22} color={colors.brandSage} />
            </View>
            <View style={styles.oilInfo}>
              <Text style={[styles.cardLabel, { fontFamily: fontFam.medium }]}>
                {t('device.oilLevel')}
              </Text>
              <Text style={[styles.oilStatus, { fontFamily: fontFam.regular }]}>
                {deviceState.oilLevel > 20
                  ? t('device.oilStatusGood')
                  : t('device.oilStatusLow')}
              </Text>
            </View>
            <Text style={[styles.oilPercent, { fontFamily: fontFam.bold }]}>
              {deviceState.oilLevel}%
            </Text>
          </View>

          {/* Oil Level Gauge Bar */}
          <View style={styles.gaugeTrack}>
            <View
              style={[
                styles.gaugeFill,
                {
                  width: `${deviceState.oilLevel}%`,
                  backgroundColor:
                    deviceState.oilLevel > 20 ? colors.brandSage : colors.warningAmber,
                },
              ]}
            />
          </View>

          {/* Reorder Oil Action */}
          <TouchableOpacity
            style={styles.reorderBtn}
            onPress={() => navigation.navigate('Store')}
            activeOpacity={0.7}
          >
            <ShoppingBag size={16} color={colors.brandSage} />
            <Text style={[styles.reorderText, { fontFamily: fontFam.medium }]}>
              {t('device.reorderOil')}
            </Text>
            <ChevronIcon size={16} color={colors.brandSage} />
          </TouchableOpacity>
        </Card>

        {/* Scent Pyramid Breakdown (Earned Content per 03-design-elevation) */}
        <Card variant="subtle" elevation="subtle" style={styles.controlCard}>
          <Text style={[styles.pyramidTitle, { fontFamily: fontFam.medium }]}>
            {t('device.scentNotes')} · Forest Sage
          </Text>
          <View style={styles.notesList}>
            <View style={styles.noteItem}>
              <View style={styles.noteBullet} />
              <Text style={[styles.noteText, { fontFamily: fontFam.regular }]}>
                {t('device.topNotes')}
              </Text>
            </View>
            <View style={styles.noteItem}>
              <View style={styles.noteBullet} />
              <Text style={[styles.noteText, { fontFamily: fontFam.regular }]}>
                {t('device.heartNotes')}
              </Text>
            </View>
            <View style={styles.noteItem}>
              <View style={styles.noteBullet} />
              <Text style={[styles.noteText, { fontFamily: fontFam.regular }]}>
                {t('device.baseNotes')}
              </Text>
            </View>
          </View>
        </Card>

        {/* Setting Rows: Schedule & Spray Timing */}
        <Card variant="surface" elevation="card" style={styles.settingsListCard}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => navigation.navigate('Schedule')}
            activeOpacity={0.7}
          >
            <View style={styles.settingLabelGroup}>
              <Calendar size={18} color={colors.inkMuted} />
              <Text style={[styles.settingLabel, { fontFamily: fontFam.regular }]}>
                {t('schedule.title')}
              </Text>
            </View>
            <View style={styles.settingValueGroup}>
              <Text style={[styles.settingValue, { fontFamily: fontFam.regular }]}>
                {t('schedule.everyday')}
              </Text>
              <ChevronIcon size={16} color={colors.inkMuted} />
            </View>
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLabelGroup}>
              <Clock size={18} color={colors.inkMuted} />
              <Text style={[styles.settingLabel, { fontFamily: fontFam.regular }]}>
                {t('device.sprayDuration')} / {t('device.pauseDuration')}
              </Text>
            </View>
            <Text style={[styles.settingValue, { fontFamily: fontFam.regular }]}>
              {deviceState.sprayOnSec}s / {deviceState.sprayOffSec}s
            </Text>
          </View>
        </Card>

        {/* Main High-Contrast Dark Power Button */}
        <View style={styles.powerActionSection}>
          <Button
            title={deviceState.power ? t('device.powerOff') : t('device.powerOn')}
            onPress={handleTogglePower}
            variant={deviceState.power ? 'dark' : 'primary'}
            size="lg"
            icon={
              <Power
                size={20}
                color={deviceState.power ? colors.brandPaleGreen : colors.surface}
              />
            }
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  deviceName: {
    fontSize: typography.fontSize.title1,
    color: colors.inkPrimary,
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: typography.fontSize.bodySm,
    color: colors.inkMuted,
  },
  deviceHeroWrapper: {
    marginBottom: spacing.xl,
  },
  heroCard: {
    padding: 0,
    height: 240,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  mistIndicator: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    ...shadows.subtle,
  },
  mistText: {
    fontSize: typography.fontSize.caption,
    color: colors.brandOlive,
  },
  controlCard: {
    marginBottom: spacing.lg,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  cardLabel: {
    fontSize: typography.fontSize.bodySm,
    color: colors.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
  },
  cardValue: {
    fontSize: typography.fontSize.body,
    color: colors.inkPrimary,
  },
  valueBubble: {
    backgroundColor: colors.brandPaleGreen,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
  },
  valueBubbleText: {
    fontSize: typography.fontSize.caption,
    color: colors.brandOlive,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackContainer: {
    flex: 1,
    height: 32,
    justifyContent: 'center',
    position: 'relative',
  },
  sliderTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
    width: '100%',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: colors.brandSage,
    borderRadius: 4,
  },
  sliderTouchRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  sliderTouchSegment: {
    flex: 1,
    height: '100%',
  },
  sliderKnob: {
    position: 'absolute',
    top: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 2.5,
    borderColor: colors.brandSage,
    ...shadows.subtle,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    marginTop: 2,
  },
  scaleText: {
    fontSize: typography.fontSize.tag,
    color: colors.inkMuted,
  },
  oilRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  oilIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.canvasTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  oilInfo: {
    flex: 1,
  },
  oilStatus: {
    fontSize: typography.fontSize.caption,
    color: colors.inkMuted,
    marginTop: 2,
  },
  oilPercent: {
    fontSize: typography.fontSize.title3,
    color: colors.inkPrimary,
  },
  gaugeTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 4,
  },
  reorderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
  },
  reorderText: {
    fontSize: typography.fontSize.bodySm,
    color: colors.brandSage,
  },
  pyramidTitle: {
    fontSize: typography.fontSize.bodySm,
    color: colors.brandOlive,
    marginBottom: spacing.sm,
  },
  notesList: {
    gap: 4,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noteBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.brandSage,
  },
  noteText: {
    fontSize: typography.fontSize.caption,
    color: colors.inkSecondary,
  },
  settingsListCard: {
    marginBottom: spacing.xl,
    paddingVertical: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  settingLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingLabel: {
    fontSize: typography.fontSize.bodySm,
    color: colors.inkPrimary,
  },
  settingValueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingValue: {
    fontSize: typography.fontSize.bodySm,
    color: colors.inkMuted,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.borderFaint,
    marginHorizontal: spacing.lg,
  },
  powerActionSection: {
    marginBottom: spacing.xxxl,
  },
});
