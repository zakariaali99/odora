import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../theme';

export type BadgeVariant = 'accent' | 'warning' | 'error' | 'neutral' | 'success';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'accent',
  style,
}) => {
  const { colors, typography, radii, spacing } = useTheme();

  let bg = colors.accent;
  let textColor = colors.text;

  switch (variant) {
    case 'accent':
      bg = colors.accent;
      textColor = colors.text;
      break;
    case 'warning':
      bg = colors.warning;
      textColor = colors.onInk;
      break;
    case 'error':
      bg = colors.error;
      textColor = colors.onInk;
      break;
    case 'success':
      bg = colors.success;
      textColor = colors.onInk;
      break;
    case 'neutral':
      bg = colors.surfaceMuted;
      textColor = colors.textMuted;
      break;
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          borderRadius: radii.pill,
          paddingHorizontal: spacing.sm + 2,
          paddingVertical: 2,
        },
        style,
      ]}
    >
      <Text
        style={[
          typography.labelSm,
          {
            color: textColor,
            fontSize: 10,
            lineHeight: 14,
            fontWeight: '600',
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Badge;
