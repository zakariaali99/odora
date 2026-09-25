import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { MainTabsNavigator } from './MainTabsNavigator';
import { DeviceControlScreen } from '../screens/DeviceControlScreen';
import { DevicePairingScreen } from '../screens/DevicePairingScreen';
import { DeviceSettingsScreen } from '../screens/DeviceSettingsScreen';
import { ConnectionStatesScreen } from '../screens/ConnectionStatesScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { CategoryScreen } from '../screens/CategoryScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { ProductDetailScreen } from '../screens/ProductDetailScreen';
import { CartScreen } from '../screens/CartScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { OrderConfirmationScreen } from '../screens/OrderConfirmationScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { DevUiKitScreen } from '../screens/DevUiKitScreen';
import { useTheme } from '../theme';
import { previewConfig } from '../previewTarget';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { colors } = useTheme();

  const TAB_ROUTES = ['Home', 'Devices', 'Store', 'Account'] as const;
  type TabRoute = (typeof TAB_ROUTES)[number];

  const previewScreen = __DEV__ ? previewConfig.screen : null;
  const isTabPreview = !!previewScreen && (TAB_ROUTES as readonly string[]).includes(previewScreen);

  const initialRoute: keyof RootStackParamList =
    !previewScreen || isTabPreview ? 'MainTabs' : (previewScreen as keyof RootStackParamList);

  const navigatorKey = `${previewConfig.screen || 'MainTabs'}-${previewConfig.lang || 'default'}-${previewConfig.sheet ? 'sheet' : 'nosheet'}-${previewConfig.scrollToEnd ? 'end' : 'top'}`;

  return (
    <Stack.Navigator
      key={navigatorKey}
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabsNavigator}
        initialParams={isTabPreview ? { screen: previewScreen as TabRoute } : undefined}
      />
      <Stack.Screen name="DevUiKit" component={DevUiKitScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="DeviceControl" component={DeviceControlScreen} />
      <Stack.Screen name="DevicePairing" component={DevicePairingScreen} />
      <Stack.Screen name="DeviceSettings" component={DeviceSettingsScreen} />
      <Stack.Screen name="ConnectionStates" component={ConnectionStatesScreen} />
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
