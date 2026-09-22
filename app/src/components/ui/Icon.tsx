import React from 'react';
import { Text, TextStyle, StyleSheet, StyleProp } from 'react-native';
import { useTheme } from '../../theme';

export type IconName =
  | 'home'
  | 'nest_remote'
  | 'air'
  | 'storefront'
  | 'person'
  | 'water_drop'
  | 'schedule'
  | 'tune'
  | 'add'
  | 'remove'
  | 'close'
  | 'check'
  | 'chevron_right'
  | 'chevron_left'
  | 'arrow_back'
  | 'arrow_forward'
  | 'power_settings_new'
  | 'settings'
  | 'refresh'
  | 'bluetooth'
  | 'bluetooth_disabled'
  | 'wifi_off'
  | 'search'
  | 'shopping_bag'
  | 'favorite'
  | 'favorite_border'
  | 'notifications'
  | 'info'
  | 'warning'
  | 'error'
  | 'help_outline'
  | 'local_shipping'
  | 'inventory_2'
  | 'dark_mode'
  | 'light_mode'
  | 'translate'
  | 'eco'
  | 'lock'
  | 'delete_outline'
  | 'share'
  | string;

export const DIRECTIONAL_ICONS = new Set([
  'chevron_right',
  'chevron_left',
  'arrow_back',
  'arrow_forward',
  'arrow_left',
  'arrow_right',
  'navigate_next',
  'navigate_before',
]);

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  autoMirror?: boolean;
  style?: StyleProp<TextStyle>;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  autoMirror = true,
  style,
}) => {
  const { colors, isRTL } = useTheme();
  const iconColor = color || colors.text;
  const shouldMirror = autoMirror && isRTL && DIRECTIONAL_ICONS.has(name);

  return (
    <Text
      accessible={false}
      style={[
        styles.icon,
        {
          fontFamily: 'MaterialSymbolsOutlined',
          fontSize: size,
          lineHeight: size,
          width: size,
          height: size,
          color: iconColor,
          transform: shouldMirror ? [{ scaleX: -1 }] : undefined,
        },
        style,
      ]}
    >
      {name}
    </Text>
  );
};

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});

export default Icon;
