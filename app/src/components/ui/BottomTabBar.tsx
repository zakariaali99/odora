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
import { useTheme } from '../../theme';
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
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'devices', label: 'Devices', icon: 'air' },
  { key: 'store', label: 'Store', icon: 'storefront' },
  { key: 'account', label: 'Account', icon: 'person' },
];

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onSelectTab,
  tabs = DEFAULT_TABS,
  style,
}) => {
  const { colors, typography, elevation, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: Math.max(insets.bottom, 12),
        },
        elevation.e2,
        style,
      ]}
    >
      <View style={styles.tabRow}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const tintColor = isActive ? colors.primary : colors.textSubtle;

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
                {isActive && (
                  <View
                    style={[
                      styles.activeDot,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  typography.labelSm,
                  {
                    color: tintColor,
                    fontWeight: isActive ? '600' : '400',
                    marginTop: 4,
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
    paddingTop: 10,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});

export default BottomTabBar;
