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
  variant?: 'standard' | 'device' | 'compact' | 'flat';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'standard',
  onPress,
  style,
}) => {
  const { colors, radii, spacing, elevation } = useTheme();

  const isDevice = variant === 'device';
  const isCompact = variant === 'compact';
  const isFlat = variant === 'flat';

  const cardRadius = isDevice ? radii.deviceCard : radii.lg;
  const cardPadding = isCompact ? spacing.md : spacing.cardPadding;

  const containerStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: cardRadius,
    padding: cardPadding,
    borderColor: colors.border,
    borderWidth: 1,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
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
