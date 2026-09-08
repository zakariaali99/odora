import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, radii, spacing, shadows } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'surface' | 'subtle' | 'cream';
  elevation?: 'none' | 'subtle' | 'card' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'surface',
  elevation = 'card',
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'subtle':
        return colors.surfaceSubtle;
      case 'cream':
        return colors.canvasTint;
      case 'surface':
      default:
        return colors.surface;
    }
  };

  const getShadow = () => {
    switch (elevation) {
      case 'none':
        return {};
      case 'subtle':
        return shadows.subtle;
      case 'elevated':
        return shadows.elevated;
      case 'card':
      default:
        return shadows.card;
    }
  };

  const cardStyle = [
    styles.card,
    { backgroundColor: getBackgroundColor() },
    getShadow(),
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.85}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.card,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(70, 79, 57, 0.05)',
  },
});
