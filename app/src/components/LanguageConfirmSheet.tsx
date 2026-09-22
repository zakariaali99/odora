import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme';
import { useAppStore } from '../store/useAppStore';
import { Sheet } from './ui/Sheet';
import { Button } from './ui/Button';
import { Icon } from './ui/Icon';

export const LanguageConfirmSheet: React.FC = () => {
  const { t } = useTranslation();
  const { colors, typography, spacing } = useTheme();
  const {
    pendingLanguage,
    cancelLanguageChange,
    confirmLanguageChange,
  } = useAppStore();

  const isVisible = pendingLanguage !== null;
  const isTargetArabic = pendingLanguage === 'ar';

  const title = isTargetArabic
    ? 'تغيير لغة التطبيق إلى العربية؟'
    : 'Change Language to English?';

  const description = isTargetArabic
    ? 'سيتم إعادة تشغيل التطبيق لتطبيق اللغة العربية وتعديل اتجاه الواجهة من اليمين إلى اليسار.'
    : 'The app will restart to apply English and mirror the layout from Left-to-Right.';

  const confirmLabel = isTargetArabic
    ? t('languageModal.confirm', 'إعادة التشغيل وتطبيق')
    : t('languageModal.confirm', 'Restart & Apply');

  const cancelLabel = isTargetArabic
    ? t('languageModal.cancel', 'إلغاء')
    : t('languageModal.cancel', 'Cancel');

  return (
    <Sheet visible={isVisible} onClose={cancelLanguageChange}>
      <View style={[styles.content, { paddingBottom: spacing.lg }]}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: colors.accent, marginBottom: spacing.md },
          ]}
        >
          <Icon name="translate" size={28} color={colors.text} />
        </View>

        <Text
          style={[
            typography.headlineSm,
            { color: colors.text, textAlign: 'center', marginBottom: spacing.xs },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            typography.bodyMd,
            {
              color: colors.textMuted,
              textAlign: 'center',
              lineHeight: 22,
              marginBottom: spacing.xl,
            },
          ]}
        >
          {description}
        </Text>

        <Button
          title={confirmLabel}
          onPress={confirmLanguageChange}
          variant="primary"
          style={{ width: '100%', marginBottom: spacing.sm }}
        />

        <Button
          title={cancelLabel}
          onPress={cancelLanguageChange}
          variant="ghost"
          style={{ width: '100%' }}
        />
      </View>
    </Sheet>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    width: '100%',
    paddingTop: 8,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LanguageConfirmSheet;
