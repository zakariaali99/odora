export interface PreviewConfig {
  screen:
    | 'Home'
    | 'Devices'
    | 'DeviceControl'
    | 'DevicePairing'
    | 'Schedule'
    | 'DeviceSettings'
    | 'ConnectionStates'
    | null;
  lang: 'ar' | 'en' | null;
  scrollToEnd?: boolean;
  sheet?: boolean;
  timestamp?: number;
}

export const previewConfig: PreviewConfig = {
  screen: 'Home',
  lang: 'ar',
  scrollToEnd: false,
  sheet: false,
  timestamp: 1790306324447,
};
