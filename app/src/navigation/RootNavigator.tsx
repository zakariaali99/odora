import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { MainTabsNavigator } from './MainTabsNavigator';
import { DevicesScreen } from '../screens/DevicesScreen';
import { DeviceControlScreen } from '../screens/DeviceControlScreen';
import { DevicePairingScreen } from '../screens/DevicePairingScreen';
import { DeviceSettingsScreen } from '../screens/DeviceSettingsScreen';
import { ConnectionStatesScreen } from '../screens/ConnectionStatesScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { StoreScreen } from '../screens/StoreScreen';
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
import i18n from '../i18n';
import { useAppStore } from '../store/useAppStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { colors } = useTheme();

  useEffect(() => {
    if (__DEV__ && previewConfig.lang) {
      const isRtl = previewConfig.lang === 'ar';
      i18n.changeLanguage(previewConfig.lang);
      useAppStore.setState({
        language: previewConfig.lang,
        isRTL: isRtl,
      });
      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('lang', previewConfig.lang);
      }
    }
  }, []);

  const initialRoute: keyof RootStackParamList =
    previewConfig.screen === 'Home'
      ? 'MainTabs'
      : (previewConfig.screen as keyof RootStackParamList) || 'MainTabs';

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
      <Stack.Screen name="Devices" component={DevicesScreen} />
      <Stack.Screen name="Store" component={StoreScreen} />
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
