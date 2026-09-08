import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { colors, typography } from '../theme';

interface OdoraLogoProps {
  color?: 'sage' | 'cream' | 'dark';
  height?: number;
  showTagline?: boolean;
}

export const OdoraLogo: React.FC<OdoraLogoProps> = ({
  color = 'sage',
  height = 22,
  showTagline = false,
}) => {
  // Use extracted official image logos
  const logoSource =
    color === 'cream'
      ? require('../../assets/images/logo-cream.png')
      : require('../../assets/images/logo.png');

  // Aspect ratio of logo is 700 / 165 ≈ 4.24
  const width = height * 4.24;

  return (
    <View style={styles.container}>
      <Image
        source={logoSource}
        style={{ width, height }}
        resizeMode="contain"
      />
      {showTagline && (
        <Text style={[styles.tagline, color === 'cream' && styles.taglineCream]}>
          SCENT OF ATMOSPHERE
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: {
    fontFamily: typography.fontFamily.en.medium,
    fontSize: typography.fontSize.eyebrow,
    letterSpacing: typography.letterSpacing.eyebrow,
    color: colors.inkMuted,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  taglineCream: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
