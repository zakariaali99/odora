import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, withAlpha } from '../../theme';
import { Icon, IconName } from './Icon';

export type TabKey = 'home' | 'devices' | 'store' | 'account';

export interface TabItem {
  key: TabKey;
  label: string;
  icon: IconName;
}

interface BottomTabBarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  tabs?: TabItem[];
  style?: StyleProp<ViewStyle>;
}

export const DEFAULT_TABS: TabItem[] = [
  { key: 'home', label: 'Home', icon: 'airwave' },
  { key: 'devices', label: 'Devices', icon: 'devices_other' },
  { key: 'store', label: 'Store', icon: 'science' },
  { key: 'account', label: 'Account', icon: 'person' },
];

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onSelectTab,
  tabs = DEFAULT_TABS,
  style,
}) => {
  const { colors, typography, isRTL, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const bottomInset = Math.max(insets.bottom, 0);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: withAlpha(colors.bg, 0.94),
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          shadowColor: colors.ink,
          height: 64 + bottomInset,
          paddingBottom: bottomInset,
        },
        style,
      ]}
    >
      <View style={styles.tabRow}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const tintColor = isActive ? colors.primary : colors.textMuted;

          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.8}
              onPress={() => onSelectTab(tab.key)}
              style={styles.tabButton}
            >
              <View style={styles.iconWrapper}>
                <Icon
                  name={tab.icon}
                  size={24}
                  color={tintColor}
                />
              </View>
              <Text
                style={[
                  typography.labelSm,
                  {
                    color: tintColor,
                    fontWeight: isActive ? '600' : '500',
                    fontSize: 10,
                    letterSpacing: isRTL ? 0 : 0.8,
                    textTransform: isRTL ? 'none' : 'uppercase',
                    marginTop: 2,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 64,
    justifyContent: 'center',
    shadowColor: '#232821',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 8,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    height: 64,
  },
  tabButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 26,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});

export default BottomTabBar;
