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

export const previewConfig: PreviewConfig =
  typeof __DEV__ !== 'undefined' && __DEV__
    ? {
        screen: null,
        lang: null,
      }
    : {
        screen: null,
        lang: null,
      };
