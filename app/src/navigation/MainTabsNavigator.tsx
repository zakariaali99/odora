import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabsParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { DevicesScreen } from '../screens/DevicesScreen';
import { StoreScreen } from '../screens/StoreScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { BottomTabBar, TabKey } from '../components/ui/BottomTabBar';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabsNavigator: React.FC = () => {
  const { t } = useTranslation();

  const localizedTabs = [
    { key: 'home' as TabKey, label: t('nav.home', 'Home'), icon: 'home' as const },
    { key: 'devices' as TabKey, label: t('nav.devices', 'Devices'), icon: 'air' as const },
    { key: 'store' as TabKey, label: t('nav.store', 'Store'), icon: 'storefront' as const },
    { key: 'account' as TabKey, label: t('nav.account', 'Account'), icon: 'person' as const },
  ];

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ state, navigation }) => {
        const currentRoute = state.routes[state.index]?.name || 'Home';
        const activeTab: TabKey =
          currentRoute === 'Home'
            ? 'home'
            : currentRoute === 'Devices'
            ? 'devices'
            : currentRoute === 'Store'
            ? 'store'
            : 'account';

        const handleSelect = (key: TabKey) => {
          const target =
            key === 'home'
              ? 'Home'
              : key === 'devices'
              ? 'Devices'
              : key === 'store'
              ? 'Store'
              : 'Account';
          navigation.navigate(target);
        };

        return (
          <BottomTabBar
            activeTab={activeTab}
            onSelectTab={handleSelect}
            tabs={localizedTabs}
          />
        );
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Devices" component={DevicesScreen} />
      <Tab.Screen name="Store" component={StoreScreen} />
      <Tab.Screen name="Account" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default MainTabsNavigator;
