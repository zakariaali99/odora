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
    | 'Account'
    | null;
  lang: 'ar' | 'en' | null;
  scrollToEnd?: boolean;
  sheet?: boolean;
  scrollY?: number;
  intensity?: number;
  mode?: 'continuous' | 'interval';
}

export const previewConfig: PreviewConfig = {
  screen: null,
  lang: null,
  scrollToEnd: false,
  sheet: false,
};
