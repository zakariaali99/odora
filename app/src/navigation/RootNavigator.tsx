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

  if (__DEV__ && previewConfig.screen) {
    if (previewConfig.screen === 'Devices') {
      return <DevicesScreen navigation={{ goBack: () => {}, navigate: () => {} }} />;
    }
    if (previewConfig.screen === 'DeviceControl') {
      return <DeviceControlScreen navigation={{ goBack: () => {}, navigate: () => {} }} />;
    }
    if (previewConfig.screen === 'DevicePairing') {
      return <DevicePairingScreen navigation={{ goBack: () => {}, navigate: () => {} }} />;
    }
    if (previewConfig.screen === 'Schedule') {
      return <ScheduleScreen navigation={{ goBack: () => {}, navigate: () => {} }} />;
    }
    if (previewConfig.screen === 'DeviceSettings') {
      return <DeviceSettingsScreen navigation={{ goBack: () => {}, navigate: () => {} }} />;
    }
    if (previewConfig.screen === 'ConnectionStates') {
      return <ConnectionStatesScreen navigation={{ goBack: () => {}, navigate: () => {} }} />;
    }
    if (previewConfig.screen === 'Store') {
      return <StoreScreen navigation={{ goBack: () => {}, navigate: () => {} }} />;
    }
    if (previewConfig.screen === 'Category') {
      return <CategoryScreen navigation={{ goBack: () => {}, navigate: () => {} }} />;
    }
    if (previewConfig.screen === 'Search') {
      return <SearchScreen navigation={{ goBack: () => {}, navigate: () => {} }} />;
    }
    if (previewConfig.screen === 'ProductDetail') {
      return <ProductDetailScreen navigation={{ goBack: () => {}, navigate: () => {} }} />;
    }
    if (previewConfig.screen === 'Cart') {
      return <CartScreen navigation={{ goBack: () => {}, navigate: () => {} }} />;
    }
    if (previewConfig.screen === 'Checkout') {
      return <CheckoutScreen navigation={{ goBack: () => {}, navigate: () => {} }} />;
    }
    if (previewConfig.screen === 'OrderConfirmation') {
      return <OrderConfirmationScreen navigation={{ goBack: () => {}, navigate: () => {} }} />;
    }
    if (previewConfig.screen === 'Home') {
      return <MainTabsNavigator />;
    }
  }

  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
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
