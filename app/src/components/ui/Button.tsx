import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';
import { Icon, IconName } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'soft' | 'ghost';

export type ButtonIconPosition = 'start' | 'end' | 'left' | 'right';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName;
  iconPosition?: ButtonIconPosition;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'start',
  style,
  textStyle,
}) => {
  const { colors, typography, radii, spacing } = useTheme();

  // Variant styles
  let bg = colors.ink;
  let textColor = colors.onInk;
  let height = 56;
  let borderWidth = 0;
  let borderColor = 'transparent';

  switch (variant) {
    case 'primary':
      bg = colors.ink;
      textColor = colors.onInk;
      height = 56;
      break;
    case 'secondary':
      bg = colors.primarySoft;
      textColor = colors.onPrimary;
      height = 48;
      break;
    case 'soft':
      bg = colors.accent;
      textColor = colors.text;
      height = 48;
      break;
    case 'ghost':
      bg = 'transparent';
      textColor = colors.text;
      height = 48;
      borderWidth = 1;
      borderColor = colors.border;
      break;
  }

  const isDisabled = disabled || loading;
  const isLeadingIcon = icon && (iconPosition === 'start' || iconPosition === 'left');
  const isTrailingIcon = icon && (iconPosition === 'end' || iconPosition === 'right');

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          height,
          borderRadius: radii.pill,
          borderWidth,
          borderColor,
          opacity: isDisabled ? 0.45 : 1,
          paddingHorizontal: spacing.lg,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {isLeadingIcon && (
            <Icon
              name={icon}
              size={20}
              color={textColor}
              style={{ marginEnd: spacing.xs }}
            />
          )}
          <Text
            style={[
              typography.labelLg,
              { color: textColor, textAlign: 'center' },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {isTrailingIcon && (
            <Icon
              name={icon}
              size={20}
              color={textColor}
              style={{ marginStart: spacing.xs }}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

export default Button;
