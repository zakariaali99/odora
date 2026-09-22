import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../theme';
import { Icon, IconName } from './Icon';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'air',
  title,
  description,
  actionTitle,
  onAction,
  style,
}) => {
  const { colors, typography, radii, spacing } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.xl }, style]}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.surfaceMuted,
            borderRadius: radii.pill,
            marginBottom: spacing.lg,
          },
        ]}
      >
        <Icon name={icon} size={36} color={colors.primarySoft} />
      </View>

      <Text
        style={[
          typography.headlineMd,
          {
            color: colors.text,
            textAlign: 'center',
            marginBottom: spacing.xs,
          },
        ]}
      >
        {title}
      </Text>

      <Text
        style={[
          typography.bodyMd,
          {
            color: colors.textMuted,
            textAlign: 'center',
            maxWidth: 280,
            marginBottom: actionTitle && onAction ? spacing.xl : 0,
          },
        ]}
      >
        {description}
      </Text>

      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="primary"
          style={{ maxWidth: 220 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default EmptyState;
