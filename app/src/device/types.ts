/**
 * Odora Device Types & Interface
 */

export interface DeviceRef {
  id: string;
  name: string;
  roomName: string;
  model: string;
  transportType: 'mock' | 'ble' | 'wifi' | 'cloud';
  rssi?: number;
  colorway: 'sage' | 'white' | 'black';
}

export interface ScheduleSlot {
  id: string;
  days: number[]; // 0 = Sunday, 1 = Monday ... 6 = Saturday
  startMinutes: number; // minutes from midnight (e.g. 540 = 09:00)
  endMinutes: number; // minutes from midnight (e.g. 1080 = 18:00)
  intensity: number; // 0..10
  enabled: boolean;
}

export interface DeviceSchedule {
  slots: ScheduleSlot[];
}

export interface DeviceState {
  power: boolean;
  intensity: number; // 0..10
  sprayOnSec: number;
  sprayOffSec: number;
  oilLevel: number; // 0..100 %
  currentScentName: string;
  connected: boolean;
  activeTransport: 'mock' | 'ble' | 'wifi' | 'cloud';
  lastUpdated: number;
}

export type Unsubscribe = () => void;

export interface DeviceController {
  connect(device: DeviceRef): Promise<void>;
  disconnect(): Promise<void>;
  setPower(on: boolean): Promise<void>;
  setIntensity(level: number): Promise<void>;
  setSpray(onSec: number, offSec: number): Promise<void>;
  setSchedule(schedule: DeviceSchedule): Promise<void>;
  readOilLevel(): Promise<number>;
  onStateChange(cb: (state: DeviceState) => void): Unsubscribe;
  getState(): DeviceState;
}
