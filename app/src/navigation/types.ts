import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabsParamList = {
  Home: undefined;
  Devices: undefined;
  Store: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: NavigatorScreenParams<MainTabsParamList> | undefined;
  DeviceControl: { deviceId?: string } | undefined;
  Schedule: undefined;
  Checkout: undefined;
  Settings: undefined;
  DevUiKit: undefined;
};
