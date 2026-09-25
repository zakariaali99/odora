import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../theme';
import { Icon, IconName } from './Icon';

export type BannerVariant = 'info' | 'warning' | 'error' | 'success';

interface BannerProps {
  message: string;
  variant?: BannerVariant;
  actionText?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const Banner: React.FC<BannerProps> = ({
  message,
  variant = 'info',
  actionText,
  onAction,
  style,
}) => {
  const { colors, typography, radii, spacing, isRTL } = useTheme();

  let bg = colors.surfaceMuted;
  let textColor = colors.text;
  let iconName: IconName = 'info';
  let iconColor = colors.primary;

  switch (variant) {
    case 'info':
      bg = colors.surfaceMuted;
      textColor = colors.text;
      iconName = 'info';
      iconColor = colors.primary;
      break;
    case 'warning':
      bg = colors.surfaceMuted;
      textColor = colors.text;
      iconName = 'warning';
      iconColor = colors.warning;
      break;
    case 'error':
      bg = colors.errorSoft;
      textColor = colors.error;
      iconName = 'error';
      iconColor = colors.error;
      break;
    case 'success':
      bg = colors.surfaceMuted;
      textColor = colors.text;
      iconName = 'check';
      iconColor = colors.success;
      break;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          borderRadius: radii.md,
          borderColor: colors.border,
          borderWidth: 1,
          padding: spacing.md,
        },
        style,
      ]}
    >
      <Icon
        name={iconName}
        size={20}
        color={iconColor}
        style={{ marginEnd: spacing.sm, marginTop: 2 }}
      />
      <View style={styles.contentWrapper}>
        <Text
          style={[
            typography.bodyMd,
            {
              color: textColor,
              textAlign: 'left',
              lineHeight: 20,
            },
          ]}
        >
          {message}
        </Text>
        {actionText && onAction && (
          <TouchableOpacity
            onPress={onAction}
            activeOpacity={0.7}
            style={[
              styles.actionButton,
              {
                marginTop: spacing.xs,
                alignSelf: isRTL ? 'flex-start' : 'flex-end',
              },
            ]}
          >
            <Text
              style={[
                typography.labelMd,
                {
                  color: iconColor,
                  fontWeight: '600',
                },
              ]}
            >
              {actionText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  contentWrapper: {
    flex: 1,
  },
  actionButton: {
    paddingVertical: 2,
  },
});

export default Banner;
