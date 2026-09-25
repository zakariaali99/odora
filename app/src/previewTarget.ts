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
    | null;
  lang: 'ar' | 'en' | null;
  scrollToEnd?: boolean;
  sheet?: boolean;
}

export const previewConfig: PreviewConfig = {
  screen: null,
  lang: null,
  scrollToEnd: false,
  sheet: false,
};
