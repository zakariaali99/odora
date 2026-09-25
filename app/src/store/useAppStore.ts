import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeAppLanguage, reloadApp, STORAGE_KEY_LANGUAGE } from '../i18n';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface AppDevice {
  id: string;
  name: string;
  roomName: string;
  colorway: 'sage' | 'white' | 'black';
  model: string;
  power: boolean;
  intensity: number; // 1..10
  mode: 'continuous' | 'interval';
  oilLevel: number; // e.g. 68
  oilName: string;
  oilRemainingDays: number;
  oilSensor: boolean;
  burst: boolean;
  isOnline: boolean;
  connectionType: 'ble' | 'mock';
  signalDbm: number;
}

export interface RoomOption {
  key: string;
  nameAr: string;
  nameEn: string;
}

export const SHARED_ROOMS: RoomOption[] = [
  { key: 'living_room', nameAr: 'غرفة المعيشة', nameEn: 'Living Room' },
  { key: 'master_bedroom', nameAr: 'غرفة النوم الرئيسية', nameEn: 'Master Bedroom' },
  { key: 'office', nameAr: 'المكتب', nameEn: 'Office' },
  { key: 'guest_salon', nameAr: 'صالة الضيوف', nameEn: 'Guest Salon' },
];

export const getLocalizedRoomName = (roomKeyOrName: string, isRTL: boolean): string => {
  const match = SHARED_ROOMS.find(
    (r) => r.key === roomKeyOrName || r.nameAr === roomKeyOrName || r.nameEn === roomKeyOrName
  );
  if (match) {
    return isRTL ? match.nameAr : match.nameEn;
  }
  return roomKeyOrName;
};

export interface AppRoutine {
  id: string;
  deviceId?: string;
  name: string;
  days: string[]; // e.g. ['Su', 'M', 'Tu', 'W', 'Th']
  startTime: string; // '07:00'
  endTime: string; // '09:30'
  intensity: number; // 1..10
  mode: 'continuous' | 'interval';
  enabled: boolean;
  isBurst: boolean;
  oilName: string;
}

export type ConnectionStatus = 'connected' | 'disabled' | 'out_of_range' | 'syncing';

interface AppState {
  language: 'ar' | 'en';
  isRTL: boolean;
  themeMode: ThemeMode;
  selectedDeviceId: string;
  hasCompletedOnboarding: boolean;
  pendingLanguage: 'ar' | 'en' | null;
  devices: AppDevice[];
  routines: AppRoutine[];
  connectionStatus: ConnectionStatus;
  requestLanguageChange: (lang: 'ar' | 'en') => void;
  cancelLanguageChange: () => void;
  confirmLanguageChange: () => Promise<void>;
  setLanguage: (lang: 'ar' | 'en', reload?: boolean) => Promise<void>;
  setThemeMode: (mode: ThemeMode) => void;
  setSelectedDeviceId: (id: string) => void;
  setHasCompletedOnboarding: (val: boolean) => void;
  addDevice: (device: AppDevice) => void;
  updateDevice: (id: string, updates: Partial<AppDevice>) => void;
  removeDevice: (id: string) => void;
  toggleDevicePower: (id: string) => void;
  setDeviceIntensity: (id: string, intensity: number) => void;
  addRoutine: (routine: AppRoutine) => void;
  toggleRoutine: (id: string) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
}

const INITIAL_DEVICES: AppDevice[] = [
  {
    id: 'living',
    name: 'موزع غرفة المعيشة',
    roomName: 'غرفة المعيشة',
    colorway: 'sage',
    model: 'Odora A316',
    power: true,
    intensity: 8,
    mode: 'interval',
    oilLevel: 68,
    oilName: 'مريمية الغابة والأرز',
    oilRemainingDays: 18,
    oilSensor: false,
    burst: false,
    isOnline: true,
    connectionType: 'ble',
    signalDbm: -58,
  },
  {
    id: 'reading',
    name: 'ركن القراءة',
    roomName: 'المكتب',
    colorway: 'white',
    model: 'Odora A316',
    power: false,
    intensity: 3,
    mode: 'interval',
    oilLevel: 92,
    oilName: 'صندل وسوسن',
    oilRemainingDays: 45,
    oilSensor: false,
    burst: false,
    isOnline: true,
    connectionType: 'ble',
    signalDbm: -65,
  },
  {
    id: 'bedroom',
    name: 'غرفة النوم الرئيسية',
    roomName: 'غرفة النوم',
    colorway: 'black',
    model: 'Odora A316',
    power: false,
    intensity: 2,
    mode: 'continuous',
    oilLevel: 24,
    oilName: 'سرو مدخن',
    oilRemainingDays: 7,
    oilSensor: true,
    burst: false,
    isOnline: true,
    connectionType: 'ble',
    signalDbm: -72,
  },
];

const INITIAL_ROUTINES: AppRoutine[] = [
  {
    id: 'routine-1',
    deviceId: 'living',
    name: 'وضوح الصباح',
    days: ['Su', 'M', 'Tu', 'W', 'Th'],
    startTime: '07:00',
    endTime: '09:30',
    intensity: 7,
    mode: 'interval',
    enabled: true,
    isBurst: false,
    oilName: 'مريمية الغابة',
  },
  {
    id: 'routine-2',
    deviceId: 'living',
    name: 'تركيز الظهيرة',
    days: ['Su', 'Tu', 'Th'],
    startTime: '13:00',
    endTime: '16:30',
    intensity: 4,
    mode: 'interval',
    enabled: true,
    isBurst: false,
    oilName: 'كتان قطني',
  },
  {
    id: 'routine-3',
    deviceId: 'living',
    name: 'هدوء المساء',
    days: ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'],
    startTime: '19:00',
    endTime: '22:30',
    intensity: 3,
    mode: 'continuous',
    enabled: true,
    isBurst: false,
    oilName: 'صندل وسوسن',
  },
];

import { previewConfig } from '../previewTarget';

const initialLang = previewConfig?.lang || 'ar';
const initialRTL = initialLang === 'ar';

export const useAppStore = create<AppState>((set, get) => ({
  language: initialLang,
  isRTL: initialRTL,
  themeMode: 'light', // Primary Arabic RTL light mode
  selectedDeviceId: 'living',
  hasCompletedOnboarding: false,
  pendingLanguage: null,
  devices: INITIAL_DEVICES,
  routines: INITIAL_ROUTINES,
  connectionStatus: 'connected',

  requestLanguageChange: (lang: 'ar' | 'en') => {
    if (lang === get().language) return;
    set({ pendingLanguage: lang });
  },

  cancelLanguageChange: () => {
    set({ pendingLanguage: null });
  },

  confirmLanguageChange: async () => {
    const target = get().pendingLanguage;
    if (!target) return;
    set({ pendingLanguage: null });
    try {
      await AsyncStorage.setItem(STORAGE_KEY_LANGUAGE, target);
    } catch (e) {
      console.warn('Failed to save language to AsyncStorage', e);
    }
    await changeAppLanguage(target);
    set({
      language: target,
      isRTL: target === 'ar',
    });
    await reloadApp();
  },

  setLanguage: async (lang: 'ar' | 'en', reload: boolean = false) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_LANGUAGE, lang);
    } catch (e) {
      console.warn('Failed to save language to AsyncStorage', e);
    }
    await changeAppLanguage(lang);
    set({
      language: lang,
      isRTL: lang === 'ar',
    });
    if (reload) {
      await reloadApp();
    }
  },

  setThemeMode: (mode: ThemeMode) => set({ themeMode: mode }),
  setSelectedDeviceId: (id: string) => set({ selectedDeviceId: id }),
  setHasCompletedOnboarding: (val: boolean) => set({ hasCompletedOnboarding: val }),

  addDevice: (device: AppDevice) => {
    set((state) => ({
      devices: [device, ...state.devices],
      selectedDeviceId: device.id,
    }));
  },

  updateDevice: (id: string, updates: Partial<AppDevice>) => {
    set((state) => ({
      devices: state.devices.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  },

  removeDevice: (id: string) => {
    set((state) => {
      const remaining = state.devices.filter((d) => d.id !== id);
      return {
        devices: remaining,
        selectedDeviceId: remaining.length > 0 ? remaining[0].id : '',
      };
    });
  },

  toggleDevicePower: (id: string) => {
    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === id ? { ...d, power: !d.power } : d
      ),
    }));
  },

  setDeviceIntensity: (id: string, intensity: number) => {
    set((state) => ({
      devices: state.devices.map((d) =>
        d.id === id ? { ...d, intensity } : d
      ),
    }));
  },

  addRoutine: (routine: AppRoutine) => {
    set((state) => ({
      routines: [routine, ...state.routines],
    }));
  },

  toggleRoutine: (id: string) => {
    set((state) => ({
      routines: state.routines.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      ),
    }));
  },

  setConnectionStatus: (status: ConnectionStatus) => {
    set({ connectionStatus: status });
  },
}));
