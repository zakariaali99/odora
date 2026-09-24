declare const __DEV__: boolean;

export interface PreviewConfig {
  screen:
    | 'Home'
    | 'Devices'
    | 'DeviceControl'
    | 'DevicePairing'
    | 'Schedule'
    | 'DeviceSettings'
    | 'ConnectionStates'
    | 'Store'
    | 'Category'
    | 'Search'
    | 'ProductDetail'
    | 'Cart'
    | 'Checkout'
    | 'OrderConfirmation'
    | null;
  lang: 'ar' | 'en' | null;
}

export const previewConfig: PreviewConfig = {
  screen: null,
  lang: 'ar',
};
