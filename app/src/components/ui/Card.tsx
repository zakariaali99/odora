import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'standard' | 'hero' | 'device' | 'compact' | 'tile' | 'flat';
  surface?: 'lowest' | 'low' | 'default';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'standard',
  surface = 'default',
  onPress,
  style,
  testID,
  accessibilityLabel,
}) => {
  const { colors, radii, spacing, elevation } = useTheme();

  const isHero = variant === 'hero' || variant === 'device';
  const isTile = variant === 'tile';
  const isCompact = variant === 'compact';
  const isFlat = variant === 'flat';

  let cardRadius: number = radii.card; // 32
  if (isTile) cardRadius = radii.md; // 16

  let cardPadding: number = spacing.cardPadding; // 24
  if (isCompact) cardPadding = 20;
  if (isTile) cardPadding = spacing.md; // 16

  let bgColor = colors.surface; // #FFFFFF in light
  if (surface === 'low') {
    bgColor = colors.bgAlt; // #F7F3EF / #F4F0EC
  } else if (surface === 'lowest') {
    bgColor = colors.surface;
  }

  const containerStyle: ViewStyle = {
    backgroundColor: bgColor,
    borderRadius: cardRadius,
    padding: cardPadding,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        style={[
          styles.base,
          containerStyle,
          !isFlat && elevation.e1,
          style,
        ]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.base,
        containerStyle,
        !isFlat && elevation.e1,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    width: '100%',
    overflow: 'hidden',
  },
});

export default Card;
