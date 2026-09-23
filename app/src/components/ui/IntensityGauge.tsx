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

  const size = 224;
  const strokeWidth = 8;
  const radius = 82;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius; // ~515.22
  const arcSpan = 270; // 270 degree arc
  const arcLength = (arcSpan / 360) * circumference; // ~386.42
  const gapLength = circumference - arcLength; // ~128.80

  const clampedVal = Math.min(Math.max(value, 0), max);
  const progress = clampedVal / max;
  // Offset moves from arcLength (empty) down to 0 (full 270° arc)
  const strokeDashoffset = arcLength * (1 - progress);

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
            {/* Background 270° Track Arc (20% opacity of primarySoft) */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={colors.primarySoft}
              strokeWidth={strokeWidth}
              strokeOpacity={0.2}
              strokeDasharray={`${arcLength} ${gapLength}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              fill="transparent"
              transform={`rotate(135 ${center} ${center})`}
            />
            {/* Active Progress 270° Fill Arc */}
            {clampedVal > 0 && (
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={colors.primary}
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                transform={`rotate(135 ${center} ${center})`}
              />
            )}
          </Svg>

          {/* Central Values */}
          <View style={styles.centerContent}>
            <View style={styles.valueRow}>
              <Text style={{ fontFamily: 'Outfit_300Light', fontSize: 36, lineHeight: 42, fontWeight: '300', color: colors.text }}>
                {clampedVal}
              </Text>
              <Text style={[typography.labelMd, { color: colors.textSubtle, marginStart: 2, marginBottom: 4 }]}>
                /{max}
              </Text>
            </View>
            <Text style={[typography.labelSm, { color: colors.primary, fontWeight: '500', marginTop: -2 }]}>
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
