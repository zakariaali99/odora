import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../theme';
import { Icon } from './Icon';

interface QuantityStepperProps {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  min?: number;
  max?: number;
  style?: StyleProp<ViewStyle>;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onDecrease,
  onIncrease,
  min = 1,
  max = 99,
  style,
}) => {
  const { colors, typography, radii, spacing } = useTheme();

  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceMuted,
          borderRadius: radii.pill,
          borderColor: colors.border,
          borderWidth: 1,
        },
        style,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onDecrease}
        disabled={!canDecrease}
        style={[styles.button, { opacity: canDecrease ? 1 : 0.4 }]}
      >
        <Icon name="remove" size={16} color={colors.text} />
      </TouchableOpacity>

      <Text
        style={[
          typography.labelMd,
          {
            color: colors.text,
            fontWeight: '600',
            minWidth: 24,
            textAlign: 'center',
          },
        ]}
      >
        {value}
      </Text>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onIncrease}
        disabled={!canIncrease}
        style={[styles.button, { opacity: canIncrease ? 1 : 0.4 }]}
      >
        <Icon name="add" size={16} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    paddingHorizontal: 4,
  },
  button: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default QuantityStepper;
