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
  DevicePairing: undefined;
  DeviceSettings: { deviceId?: string; name?: string; room?: string } | undefined;
  ConnectionStates: { initialTab?: 'disabled' | 'out_of_range' | 'syncing' } | undefined;
  Schedule: undefined;
  Category: { categoryId?: string; title?: string } | undefined;
  Search: undefined;
  ProductDetail: { productId?: string } | undefined;
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId?: string } | undefined;
  Settings: undefined;
  DevUiKit: undefined;
};
