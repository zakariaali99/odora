import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';

interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  selected: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
}

export function SegmentedControl<T extends string>({
  options,
  selected,
  onChange,
  style,
}: SegmentedControlProps<T>) {
  const { colors, typography, radii, spacing, elevation } = useTheme();

  return (
    <View
      style={[
        styles.track,
        {
          backgroundColor: colors.surfaceMuted,
          borderRadius: radii.pill,
          padding: 4,
        },
        style,
      ]}
    >
      {options.map((opt) => {
        const isActive = opt.value === selected;
        return (
          <TouchableOpacity
            key={opt.value}
            activeOpacity={0.85}
            onPress={() => onChange(opt.value)}
            style={[
              styles.segment,
              {
                borderRadius: radii.pill,
                backgroundColor: isActive ? colors.surface : 'transparent',
                paddingVertical: spacing.sm,
              },
              isActive ? elevation.e1 : null,
            ]}
          >
            <Text
              style={[
                typography.labelMd,
                {
                  color: isActive ? colors.text : colors.textMuted,
                  fontWeight: isActive ? '600' : '500',
                  textAlign: 'center',
                },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SegmentedControl;
