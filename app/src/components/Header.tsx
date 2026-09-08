import React from 'react';
import { View, StyleSheet, TouchableOpacity, I18nManager } from 'react-native';
import { ChevronLeft, ChevronRight, SlidersHorizontal, Search } from 'lucide-react-native';
import { OdoraLogo } from './OdoraLogo';
import { colors, spacing, shadows } from '../theme';
import { useAppStore } from '../store/useAppStore';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: 'settings' | 'search' | 'none';
  onRightAction?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  showBack = false,
  onBack,
  rightAction = 'settings',
  onRightAction,
}) => {
  const isRTL = useAppStore((s) => s.isRTL);

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          {isRTL ? (
            <ChevronRight size={20} color={colors.inkPrimary} />
          ) : (
            <ChevronLeft size={20} color={colors.inkPrimary} />
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      <OdoraLogo height={20} color="sage" />

      {rightAction !== 'none' ? (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onRightAction}
          activeOpacity={0.7}
        >
          {rightAction === 'search' ? (
            <Search size={18} color={colors.inkPrimary} />
          ) : (
            <SlidersHorizontal size={18} color={colors.inkPrimary} />
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.canvas,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  placeholder: {
    width: 42,
    height: 42,
  },
});
