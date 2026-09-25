import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme';
import { Icon, IconName } from './Icon';
import { Button } from './Button';
import { Card } from './Card';

export type ConnectionStatus =
  | 'bluetooth_off'
  | 'out_of_range'
  | 'connecting'
  | 'disconnected';

interface ConnectionStateProps {
  status: ConnectionStatus;
  onAction: () => void;
  title?: string;
  description?: string;
  actionTitle?: string;
  inline?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ConnectionState: React.FC<ConnectionStateProps> = ({
  status,
  onAction,
  title: customTitle,
  description: customDesc,
  actionTitle: customAction,
  inline = false,
  style,
}) => {
  const { t } = useTranslation();
  const { colors, typography, radii, spacing, isRTL } = useTheme();

  let iconName: IconName = 'bluetooth';
  let defaultTitle = '';
  let defaultDesc = '';
  let defaultAction = '';
  let iconBg = colors.surfaceMuted;
  let iconColor = colors.text;

  switch (status) {
    case 'bluetooth_off':
      iconName = 'bluetooth_disabled';
      iconBg = colors.errorSoft;
      iconColor = colors.error;
      defaultTitle = t('connection.bluetoothOffTitle', 'Bluetooth Disabled');
      defaultDesc = t('connection.bluetoothOffDesc', 'Please turn on Bluetooth to discover and control your diffuser.');
      defaultAction = t('connection.bluetoothOffAction', 'Open Settings');
      break;

    case 'out_of_range':
      iconName = 'wifi_off';
      iconBg = colors.surfaceMuted;
      iconColor = colors.warning;
      defaultTitle = t('connection.outOfRangeTitle', 'Diffuser Out of Range');
      defaultDesc = t('connection.outOfRangeDesc', 'Move closer to your diffuser to connect via direct Bluetooth.');
      defaultAction = t('connection.outOfRangeAction', 'Retry Connection');
      break;

    case 'connecting':
      iconName = 'refresh';
      iconBg = colors.surfaceMuted;
      iconColor = colors.primary;
      defaultTitle = t('connection.connectingTitle', 'Connecting...');
      defaultDesc = t('connection.connectingDesc', 'Establishing direct local Bluetooth connection.');
      defaultAction = t('connection.connectingAction', 'Cancel');
      break;

    case 'disconnected':
      iconName = 'bluetooth';
      iconBg = colors.surfaceMuted;
      iconColor = colors.textMuted;
      defaultTitle = t('connection.disconnectedTitle', 'Diffuser Disconnected');
      defaultDesc = t('connection.disconnectedDesc', 'Connect to check oil status and control misting intensity.');
      defaultAction = t('connection.disconnectedAction', 'Connect Now');
      break;
  }

  const title = customTitle || defaultTitle;
  const description = customDesc || defaultDesc;
  const actionTitle = customAction || defaultAction;

  if (inline) {
    return (
      <Card variant="compact" style={[styles.inlineCard, style]}>
        <View style={styles.inlineRow}>
          <View
            style={[
              styles.inlineIcon,
              { backgroundColor: iconBg, borderRadius: radii.pill, marginEnd: 12 },
            ]}
          >
            <Icon name={iconName} size={20} color={iconColor} />
          </View>

          <View style={styles.inlineText}>
            <Text
              style={[
                typography.bodyMd,
                { color: colors.text, fontWeight: '600', textAlign: 'left' },
              ]}
            >
              {title}
            </Text>
            <Text
              numberOfLines={2}
              style={[
                typography.bodySm,
                { color: colors.textMuted, textAlign: 'left' },
              ]}
            >
              {description}
            </Text>
          </View>

          <Button
            title={actionTitle}
            onPress={onAction}
            variant="soft"
            style={{ width: 'auto', paddingHorizontal: 12, height: 36, marginStart: 8 }}
            textStyle={{ fontSize: 12 }}
          />
        </View>
      </Card>
    );
  }

  return (
    <View style={[styles.fullContainer, { padding: spacing.xl }, style]}>
      <View
        style={[
          styles.largeIcon,
          { backgroundColor: iconBg, borderRadius: radii.pill },
        ]}
      >
        <Icon name={iconName} size={36} color={iconColor} />
      </View>

      <Text
        style={[
          typography.headlineMd,
          { color: colors.text, textAlign: 'center', marginBottom: spacing.xs },
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
            marginBottom: spacing.xl,
          },
        ]}
      >
        {description}
      </Text>

      <Button
        title={actionTitle}
        onPress={onAction}
        variant="primary"
        style={{ maxWidth: 220 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  largeIcon: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  inlineCard: {
    width: '100%',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  inlineIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineText: {
    flex: 1,
  },
});

export default ConnectionState;
