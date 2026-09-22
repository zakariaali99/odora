import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme';
import { IconButton } from './IconButton';

interface IntensityGaugeProps {
  value: number; // 0 to 10
  onChange: (value: number) => void;
  max?: number;
  caption?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const IntensityGauge: React.FC<IntensityGaugeProps> = ({
  value,
  onChange,
  max = 10,
  caption,
  disabled = false,
  style,
}) => {
  const { t } = useTranslation();
  const { colors, typography, spacing } = useTheme();
  const activeCaption = caption !== undefined ? caption : t('device.optimalScenting', 'Optimal Scenting');

  const size = 240;
  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const clampedVal = Math.min(Math.max(value, 0), max);
  const progress = clampedVal / max;
  const strokeDashoffset = circumference * (1 - progress);

  const handleDecrease = () => {
    if (clampedVal > 0 && !disabled) {
      onChange(clampedVal - 1);
    }
  };

  const handleIncrease = () => {
    if (clampedVal < max && !disabled) {
      onChange(clampedVal + 1);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.gaugeRow}>
        {/* Decrease Button */}
        <IconButton
          name="remove"
          onPress={handleDecrease}
          disabled={disabled || clampedVal <= 0}
          size={44}
          color={colors.text}
          backgroundColor={colors.surfaceMuted}
        />

        {/* Ring & Value */}
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={size} height={size} style={styles.svg}>
            {/* Background Track (20% opacity of primarySoft) */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={colors.primarySoft}
              strokeWidth={strokeWidth}
              strokeOpacity={0.2}
              fill="transparent"
            />
            {/* Progress Fill */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={colors.primarySoft}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              transform={`rotate(-90 ${center} ${center})`}
            />
          </Svg>

          {/* Central Values */}
          <View style={styles.centerContent}>
            <View style={styles.valueRow}>
              <Text style={[typography.numeric, { color: colors.text }]}>
                {clampedVal}
              </Text>
              <Text style={[typography.labelMd, { color: colors.textSubtle, marginStart: 2, marginBottom: 8 }]}>
                /{max}
              </Text>
            </View>
            <Text style={[typography.labelSm, { color: colors.textMuted, marginTop: -4 }]}>
              {activeCaption}
            </Text>
          </View>
        </View>

        {/* Increase Button */}
        <IconButton
          name="add"
          onPress={handleIncrease}
          disabled={disabled || clampedVal >= max}
          size={44}
          color={colors.text}
          backgroundColor={colors.surfaceMuted}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  gaugeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});

export default IntensityGauge;
