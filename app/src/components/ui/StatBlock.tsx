import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../theme';
import { Card } from './Card';
import { Icon, IconName } from './Icon';

interface StatBlockProps {
  label: string;
  value: string;
  subValue?: string;
  icon?: IconName;
  progress?: number; // 0 to 1
  progressColor?: string;
  style?: StyleProp<ViewStyle>;
}

export const StatBlock: React.FC<StatBlockProps> = ({
  label,
  value,
  subValue,
  icon,
  progress,
  progressColor,
  style,
}) => {
  const { colors, typography, radii, spacing } = useTheme();

  return (
    <Card variant="compact" style={[styles.card, style]}>
      <View style={styles.topRow}>
        <Text style={[typography.labelSm, { color: colors.textSubtle }]}>
          {label}
        </Text>
        {icon && (
          <Icon
            name={icon}
            size={16}
            color={colors.primarySoft}
          />
        )}
      </View>

      <View style={styles.valueRow}>
        <Text
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
          style={[typography.headlineSm, { color: colors.text, flexShrink: 1 }]}
        >
          {value}
        </Text>
        {subValue ? (
          <Text
            style={[
              typography.bodySm,
              { color: colors.textMuted, marginStart: 6 },
            ]}
          >
            {' '}{subValue}
          </Text>
        ) : null}
      </View>

      {typeof progress === 'number' && (
        <View
          style={[
            styles.progressTrack,
            {
              backgroundColor: colors.surfaceMuted,
              borderRadius: radii.pill,
              marginTop: spacing.xs + 2,
            },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(Math.max(progress, 0), 1) * 100}%`,
                backgroundColor: progressColor || colors.primarySoft,
                borderRadius: radii.pill,
              },
            ]}
          />
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 100,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  progressTrack: {
    height: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});

export default StatBlock;
