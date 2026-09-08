import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { colors, typography, radii, spacing, shadows } from '../theme';
import { useAppStore } from '../store/useAppStore';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'dark' | 'outline' | 'pale';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const language = useAppStore((s) => s.language);
  const fontFam =
    language === 'ar'
      ? typography.fontFamily.ar.medium
      : typography.fontFamily.en.medium;

  const getContainerStyle = () => {
    switch (variant) {
      case 'dark':
        return styles.btnDark;
      case 'outline':
        return styles.btnOutline;
      case 'pale':
        return styles.btnPale;
      case 'primary':
      default:
        return styles.btnPrimary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'dark':
        return styles.textDark;
      case 'outline':
        return styles.textOutline;
      case 'pale':
        return styles.textPale;
      case 'primary':
      default:
        return styles.textPrimary;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.sizeSm;
      case 'lg':
        return styles.sizeLg;
      case 'md':
      default:
        return styles.sizeMd;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        getContainerStyle(),
        getSizeStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.inkPrimary : colors.surface}
          size="small"
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          <Text
            style={[
              styles.textBase,
              { fontFamily: fontFam },
              getTextStyle(),
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  iconWrapper: {
    marginRight: 2,
  },
  sizeSm: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.lg,
  },
  sizeMd: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  sizeLg: {
    paddingVertical: spacing.lg - 2,
    paddingHorizontal: spacing.xxl,
  },
  btnPrimary: {
    backgroundColor: colors.brandSage,
    ...shadows.subtle,
  },
  btnDark: {
    backgroundColor: colors.controlDark,
    ...shadows.card,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.2,
    borderColor: colors.borderLight,
  },
  btnPale: {
    backgroundColor: colors.brandPaleGreen,
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    fontSize: typography.fontSize.body,
    textAlign: 'center',
  },
  textPrimary: {
    color: colors.surface,
  },
  textDark: {
    color: colors.surface,
  },
  textOutline: {
    color: colors.inkPrimary,
  },
  textPale: {
    color: colors.brandOlive,
  },
});
