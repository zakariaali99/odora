import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, radii, spacing, shadows } from '../theme';
import { useAppStore } from '../store/useAppStore';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useAppStore();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.pill,
          language === 'ar' && styles.pillActive,
        ]}
        onPress={() => setLanguage('ar')}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.text,
            language === 'ar' && styles.textActive,
            { fontFamily: typography.fontFamily.ar.medium },
          ]}
        >
          العربية
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.pill,
          language === 'en' && styles.pillActive,
        ]}
        onPress={() => setLanguage('en')}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.text,
            language === 'en' && styles.textActive,
            { fontFamily: typography.fontFamily.en.medium },
          ]}
        >
          English
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radii.pill,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(70, 79, 57, 0.08)',
    alignSelf: 'center',
  },
  pill: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
  },
  pillActive: {
    backgroundColor: colors.brandSage,
    ...shadows.subtle,
  },
  text: {
    fontSize: typography.fontSize.caption,
    color: colors.inkMuted,
  },
  textActive: {
    color: colors.surface,
    fontWeight: '600',
  },
});
