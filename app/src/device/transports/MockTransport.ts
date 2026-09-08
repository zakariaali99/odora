/**
 * MockTransport — Simulated Odora Diffuser
 * Enables complete end-to-end UI & app development without physical hardware.
 */

import { DeviceController, DeviceRef, DeviceSchedule, DeviceState, Unsubscribe } from '../types';

export class MockTransport implements DeviceController {
  private state: DeviceState = {
    power: true,
    intensity: 8,
    sprayOnSec: 15,
    sprayOffSec: 120,
    oilLevel: 78,
    currentScentName: 'Forest Sage',
    connected: true,
    activeTransport: 'mock',
    lastUpdated: Date.now(),
  };

  private listeners: Set<(state: DeviceState) => void> = new Set();
  private connectedDevice: DeviceRef | null = null;

  async connect(device: DeviceRef): Promise<void> {
    this.connectedDevice = device;
    this.state.connected = true;
    this.state.lastUpdated = Date.now();
    this.notify();
  }

  async disconnect(): Promise<void> {
    this.state.connected = false;
    this.state.lastUpdated = Date.now();
    this.notify();
  }

  async setPower(on: boolean): Promise<void> {
    this.state.power = on;
    this.state.lastUpdated = Date.now();
    this.notify();
  }

  async setIntensity(level: number): Promise<void> {
    this.state.intensity = Math.max(0, Math.min(10, level));
    this.state.lastUpdated = Date.now();
    this.notify();
  }

  async setSpray(onSec: number, offSec: number): Promise<void> {
    this.state.sprayOnSec = onSec;
    this.state.sprayOffSec = offSec;
    this.state.lastUpdated = Date.now();
    this.notify();
  }

  async setSchedule(_schedule: DeviceSchedule): Promise<void> {
    this.state.lastUpdated = Date.now();
    this.notify();
  }

  async readOilLevel(): Promise<number> {
    return this.state.oilLevel;
  }

  onStateChange(cb: (state: DeviceState) => void): Unsubscribe {
    this.listeners.add(cb);
    cb({ ...this.state });
    return () => {
      this.listeners.delete(cb);
    };
  }

  getState(): DeviceState {
    return { ...this.state };
  }

  private notify(): void {
    const snap = { ...this.state };
    this.listeners.forEach((listener) => {
      try {
        listener(snap);
      } catch (err) {
        console.error('Error in device state listener:', err);
      }
    });
  }
}

// Global default mock controller instance for M0 & M2
export const mockDeviceController = new MockTransport();
