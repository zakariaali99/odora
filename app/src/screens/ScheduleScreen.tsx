import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Clock, Plus, Check } from 'lucide-react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, typography, spacing, radii } from '../theme';
import { useAppStore } from '../store/useAppStore';

interface ScheduleScreenProps {
  navigation: any;
}

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { language } = useAppStore();
  const [slot1Enabled, setSlot1Enabled] = useState(true);
  const [slot2Enabled, setSlot2Enabled] = useState(true);
  const [synced, setSynced] = useState(false);

  const fontFam =
    language === 'ar'
      ? typography.fontFamily.ar
      : typography.fontFamily.en;

  const handleSync = () => {
    setSynced(true);
    setTimeout(() => setSynced(false), 2500);
  };

  return (
    <ScreenContainer>
      <Header
        showBack={true}
        onBack={() => navigation.goBack()}
        rightAction="none"
      />

      <View style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={[styles.title, { fontFamily: fontFam.medium }]}>
            {t('schedule.title')}
          </Text>
          <Text style={[styles.subtitle, { fontFamily: fontFam.regular }]}>
            {t('schedule.subtitle')}
          </Text>
        </View>

        {/* Schedule Slots */}
        <Card variant="surface" elevation="card" style={styles.slotCard}>
          <View style={styles.slotHeader}>
            <View style={styles.slotTitleGroup}>
              <Clock size={18} color={colors.brandSage} />
              <Text style={[styles.slotName, { fontFamily: fontFam.medium }]}>
                {language === 'ar' ? 'فترة العمل الصباحية' : 'Morning Shift'}
              </Text>
            </View>
            <Switch
              value={slot1Enabled}
              onValueChange={setSlot1Enabled}
              trackColor={{ false: colors.surfaceMuted, true: colors.brandSage }}
              thumbColor={colors.surface}
            />
          </View>

          <View style={styles.timeRow}>
            <Text style={[styles.timeText, { fontFamily: fontFam.bold }]}>
              09:00 ص — 02:00 م
            </Text>
            <Text style={[styles.intensityBadge, { fontFamily: fontFam.medium }]}>
              {t('device.level', { level: 8 })}
            </Text>
          </View>
          <Text style={[styles.daysText, { fontFamily: fontFam.regular }]}>
            {t('schedule.weekdays')}
          </Text>
        </Card>

        <Card variant="surface" elevation="card" style={styles.slotCard}>
          <View style={styles.slotHeader}>
            <View style={styles.slotTitleGroup}>
              <Clock size={18} color={colors.brandSage} />
              <Text style={[styles.slotName, { fontFamily: fontFam.medium }]}>
                {language === 'ar' ? 'فترة المساء والاستقبال' : 'Evening Ambience'}
              </Text>
            </View>
            <Switch
              value={slot2Enabled}
              onValueChange={setSlot2Enabled}
              trackColor={{ false: colors.surfaceMuted, true: colors.brandSage }}
              thumbColor={colors.surface}
            />
          </View>

          <View style={styles.timeRow}>
            <Text style={[styles.timeText, { fontFamily: fontFam.bold }]}>
              05:00 م — 10:30 م
            </Text>
            <Text style={[styles.intensityBadge, { fontFamily: fontFam.medium }]}>
              {t('device.level', { level: 6 })}
            </Text>
          </View>
          <Text style={[styles.daysText, { fontFamily: fontFam.regular }]}>
            {t('schedule.everyday')}
          </Text>
        </Card>

        {/* Add Slot Action */}
        <TouchableOpacity style={styles.addSlotBtn} activeOpacity={0.7}>
          <Plus size={18} color={colors.brandSage} />
          <Text style={[styles.addSlotText, { fontFamily: fontFam.medium }]}>
            {t('schedule.addSlot')}
          </Text>
        </TouchableOpacity>

        {/* Sync Button */}
        <View style={styles.syncWrapper}>
          <Button
            title={synced ? (language === 'ar' ? 'تمت المزامنة بنجاح' : 'Synced to Diffuser') : t('schedule.syncToDevice')}
            onPress={handleSync}
            variant={synced ? 'pale' : 'dark'}
            size="lg"
            icon={synced ? <Check size={18} color={colors.brandOlive} /> : undefined}
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
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: typography.fontSize.title1,
    color: colors.inkPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.bodySm,
    color: colors.inkMuted,
    lineHeight: typography.lineHeight.bodySm,
  },
  slotCard: {
    marginBottom: spacing.lg,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  slotTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  slotName: {
    fontSize: typography.fontSize.body,
    color: colors.inkPrimary,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timeText: {
    fontSize: typography.fontSize.title3,
    color: colors.inkPrimary,
  },
  intensityBadge: {
    fontSize: typography.fontSize.caption,
    color: colors.brandOlive,
    backgroundColor: colors.brandPaleGreen,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  daysText: {
    fontSize: typography.fontSize.caption,
    color: colors.inkMuted,
  },
  addSlotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radii.card,
    borderWidth: 1.2,
    borderColor: colors.borderLight,
    borderStyle: 'dashed',
    marginBottom: spacing.xxl,
  },
  addSlotText: {
    fontSize: typography.fontSize.bodySm,
    color: colors.brandSage,
  },
  syncWrapper: {
    marginBottom: spacing.xxxl,
  },
});
