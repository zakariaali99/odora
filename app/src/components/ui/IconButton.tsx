import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';
import { Icon, IconName } from './Icon';

interface IconButtonProps {
  name: IconName;
  onPress: () => void;
  size?: number;
  iconSize?: number;
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const IconButton: React.FC<IconButtonProps> = ({
  name,
  onPress,
  size = 44,
  iconSize = 22,
  color,
  backgroundColor,
  disabled = false,
  style,
}) => {
  const { colors, radii, elevation } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: radii.pill,
          backgroundColor: backgroundColor || colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          opacity: disabled ? 0.45 : 1,
        },
        elevation.e1,
        style,
      ]}
    >
      <Icon
        name={name}
        size={iconSize}
        color={color || colors.text}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconButton;
