import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Globe, Info, Sparkles, BookOpen, ChevronRight, ChevronLeft } from 'lucide-react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { LanguageToggle } from '../components/LanguageToggle';
import { colors, typography, spacing, radii } from '../theme';
import { useAppStore } from '../store/useAppStore';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { language, isRTL } = useAppStore();

  const fontFam =
    language === 'ar'
      ? typography.fontFamily.ar
      : typography.fontFamily.en;

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
            {t('settings.title')}
          </Text>
        </View>

        {/* Language Preference Card */}
        <Card variant="surface" elevation="card" style={styles.card}>
          <View style={styles.cardHeader}>
            <Globe size={20} color={colors.brandSage} />
            <Text style={[styles.cardTitle, { fontFamily: fontFam.medium }]}>
              {t('settings.language')}
            </Text>
          </View>
          <Text style={[styles.cardDesc, { fontFamily: fontFam.regular }]}>
            {language === 'ar'
              ? 'اللغة العربية هي الواجهة الأساسية والافتراضية. يمكنك التبديل للإنجليزية في أي وقت.'
              : 'Arabic is the primary default interface. You can switch to English at any time.'}
          </Text>
          <View style={styles.toggleWrap}>
            <LanguageToggle />
          </View>
        </Card>

        {/* Onboarding & Guide Card */}
        <Card variant="surface" elevation="card" style={styles.card}>
          <View style={styles.cardHeader}>
            <BookOpen size={20} color={colors.brandSage} />
            <Text style={[styles.cardTitle, { fontFamily: fontFam.medium }]}>
              {t('settings.guide')}
            </Text>
          </View>
          <Text style={[styles.cardDesc, { fontFamily: fontFam.regular }]}>
            {t('settings.guideDesc')}
          </Text>
          <TouchableOpacity
            style={styles.guideButton}
            onPress={() => navigation.navigate('Onboarding')}
            activeOpacity={0.8}
          >
            <Text style={[styles.guideButtonText, { fontFamily: fontFam.medium }]}>
              {t('settings.viewGuide')}
            </Text>
            {isRTL ? (
              <ChevronLeft size={16} color={colors.brandOlive} />
            ) : (
              <ChevronRight size={16} color={colors.brandOlive} />
            )}
          </TouchableOpacity>
        </Card>

        {/* Brand Information Card */}
        <Card variant="surface" elevation="card" style={styles.card}>
          <View style={styles.cardHeader}>
            <Sparkles size={20} color={colors.brandSage} />
            <Text style={[styles.cardTitle, { fontFamily: fontFam.medium }]}>
              {t('settings.about')}
            </Text>
          </View>
          <Text style={[styles.brandText, { fontFamily: fontFam.regular }]}>
            {t('settings.brandDescription')}
          </Text>
          <View style={styles.versionBadge}>
            <Text style={[styles.versionText, { fontFamily: fontFam.medium }]}>
              {t('settings.version')}
            </Text>
          </View>
        </Card>
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
  },
  card: {
    marginBottom: spacing.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: typography.fontSize.title3,
    color: colors.inkPrimary,
  },
  cardDesc: {
    fontSize: typography.fontSize.bodySm,
    color: colors.inkMuted,
    lineHeight: typography.lineHeight.bodySm,
    marginBottom: spacing.lg,
  },
  toggleWrap: {
    alignItems: 'flex-start',
  },
  guideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radii.md,
  },
  guideButtonText: {
    fontSize: typography.fontSize.bodySm,
    color: colors.brandOlive,
  },
  brandText: {
    fontSize: typography.fontSize.bodySm,
    color: colors.inkSecondary,
    lineHeight: typography.lineHeight.body,
    marginBottom: spacing.lg,
  },
  versionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceSubtle,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.sm,
  },
  versionText: {
    fontSize: typography.fontSize.caption,
    color: colors.inkMuted,
  },
});
