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
}

export const previewConfig: PreviewConfig = {
  screen: null,
  lang: null,
};
