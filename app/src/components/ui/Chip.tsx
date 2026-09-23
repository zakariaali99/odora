import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';
import { Icon, IconName } from './Icon';

interface ChipProps {
  label: string;
  active?: boolean;
  size?: 'sm' | 'md';
  onPress: () => void;
  count?: number;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  active = false,
  size = 'md',
  onPress,
  count,
  icon,
  style,
}) => {
  const { colors, typography, radii, spacing } = useTheme();
  const height = size === 'sm' ? 32 : 36;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.base,
        {
          height,
          borderRadius: radii.pill,
          backgroundColor: active ? colors.primary : colors.surfaceMuted,
          paddingHorizontal: spacing.md,
        },
        style,
      ]}
    >
      {icon && (
        <Icon
          name={icon}
          size={16}
          color={active ? colors.onPrimary : colors.text}
          style={{ marginEnd: 6 }}
        />
      )}
      <Text
        style={[
          typography.labelMd,
          {
            color: active ? colors.onPrimary : colors.text,
            fontWeight: active ? '600' : '500',
          },
        ]}
      >
        {label}
      </Text>
      {typeof count === 'number' && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: active ? colors.primarySoft : colors.surfaceHigh,
              borderRadius: radii.pill,
            },
          ]}
        >
          <Text
            style={[
              typography.labelSm,
              { color: active ? colors.thumb : colors.textSubtle, fontSize: 10 },
            ]}
          >
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    marginStart: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});

export default Chip;
