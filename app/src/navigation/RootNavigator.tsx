import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { DeviceScreen } from '../screens/DeviceScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';
import { StoreScreen } from '../screens/StoreScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { hasCompletedOnboarding } = useAppStore();

  return (
    <Stack.Navigator
      initialRouteName={hasCompletedOnboarding ? 'Home' : 'Onboarding'}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.canvas },
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="DeviceControl" component={DeviceScreen} />
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen name="Store" component={StoreScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};
