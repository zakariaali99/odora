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
  const { colors, typography, isRTL } = useTheme();
  const activeCaption = caption !== undefined ? caption : t('device.optimalScenting', 'Optimal Scenting');

  const size = 224;
  const strokeWidth = 8;
  const radius = 82;
  const center = size / 2; // 112
  const circumference = 2 * Math.PI * radius; // ~515.22

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
        {/* Decrease Button (-) */}
        <IconButton
          name="remove"
          onPress={handleDecrease}
          disabled={disabled || clampedVal <= 0}
          size={44}
          color={colors.text}
          backgroundColor={colors.surfaceMuted}
        />

        {/* Full Ring Gauge SVG & Central Values */}
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={size} height={size} style={styles.svg}>
            {/* Background Circle Track (Full 360° Ring) */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={colors.surfaceMuted}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="transparent"
            />

            {/* Active Progress Ring (Level 0..10 = 0..100% of ring, starting from top 12 o'clock) */}
            {clampedVal > 0 && (
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={colors.primary}
                strokeWidth={9}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                transform={`rotate(-90 ${center} ${center})`}
              />
            )}
          </Svg>

          {/* Central Values Display */}
          <View style={styles.centerContent}>
            <Text
              style={[
                typography.labelSm,
                {
                  color: colors.textMuted,
                  textTransform: isRTL ? 'none' : 'uppercase',
                  letterSpacing: isRTL ? 0 : 1,
                  fontSize: 11,
                  fontWeight: '600',
                  marginBottom: 2,
                },
              ]}
            >
              {t('deviceControl.dispersionRate', 'معدل الانتشار')}
            </Text>

            {/* Numeric Reading with LTR Isolation */}
            <View style={styles.valueRow}>
              <Text
                style={{
                  fontFamily: isRTL ? 'IBMPlexSansArabic_600SemiBold' : 'Outfit_300Light',
                  fontSize: 44,
                  lineHeight: 48,
                  fontWeight: isRTL ? '600' : '300',
                  color: colors.text,
                }}
              >
                {clampedVal}
              </Text>
              <Text
                style={[
                  typography.labelMd,
                  {
                    color: colors.textSubtle,
                    marginStart: 2,
                    marginBottom: 6,
                    fontSize: 15,
                    writingDirection: 'ltr',
                  },
                ]}
              >
                /10
              </Text>
            </View>

            <Text
              style={[
                typography.labelSm,
                {
                  color: colors.primary,
                  fontWeight: '600',
                  marginTop: 2,
                  letterSpacing: 0,
                },
              ]}
            >
              {isRTL ? t('device.level', { level: clampedVal }) : activeCaption}
            </Text>
          </View>
        </View>

        {/* Increase Button (+) */}
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
    paddingVertical: 8,
  },
  gaugeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    direction: 'ltr',
  },
});
