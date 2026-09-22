import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme';

interface StatusPillProps {
  label?: string;
  active?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  label,
  active = true,
  onPress,
  style,
}) => {
  const { t } = useTranslation();
  const { colors, typography, radii, spacing, elevation } = useTheme();
  const activeLabel = label !== undefined ? label : t('device.activePill', 'Diffuser active · tap to pause');

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.pill,
        {
          backgroundColor: colors.ink,
          borderRadius: radii.pill,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.sm + 2,
        },
        elevation.e2,
        style,
      ]}
    >
      <View
        style={[
          styles.dot,
          {
            backgroundColor: active ? colors.success : colors.textSubtle,
          },
        ]}
      />
      <Text
        style={[
          typography.labelMd,
          {
            color: colors.onInk,
            marginStart: spacing.sm,
            fontWeight: '500',
          },
        ]}
      >
        {activeLabel}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default StatusPill;
