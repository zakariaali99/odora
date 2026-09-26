/**
 * MockTransport — Simulated Odora Diffuser
 * Enables complete end-to-end UI & app development without physical hardware.
 */

import { DeviceController, DeviceRef, DeviceSchedule, DeviceState, Unsubscribe } from '../types';
import { timingForLevel } from '../intensityMap';

export class MockTransport implements DeviceController {
  private timer: any = null;
  private state: DeviceState = {
    power: true,
    intensity: 8,
    sprayOnSec: timingForLevel(8).onSec,       // 20
    sprayOffSec: timingForLevel(8).offSec,     // 60
    oilLevel: 78,
    currentScentName: 'Forest Sage',
    connected: true,
    activeTransport: 'mock',
    lastUpdated: Date.now(),
    phase: 'spraying',
    phaseRemainingSec: timingForLevel(8).onSec, // 20
    mode: 'interval',
  };

  private listeners: Set<(state: DeviceState) => void> = new Set();
  private connectedDevice: DeviceRef | null = null;

  constructor() {
    if (this.state.power && this.state.connected) {
      this.startTimer();
    }
  }

  private startTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.timer = setInterval(() => {
      this.tick();
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private tick(): void {
    if (!this.state.power || !this.state.connected) {
      this.stopTimer();
      return;
    }

    if (this.state.mode === 'continuous') {
      if (this.state.phase !== 'spraying' || this.state.phaseRemainingSec !== 0) {
        this.state.phase = 'spraying';
        this.state.phaseRemainingSec = 0;
        this.state.lastUpdated = Date.now();
        this.notify();
      }
      return;
    }

    // Interval mode
    // "decrement each second; at 0, switch to 'paused' with sprayOffSec, then back to 'spraying', and so on"
    if (this.state.phaseRemainingSec <= 1) {
      if (this.state.phase === 'spraying') {
        this.state.phase = 'paused';
        this.state.phaseRemainingSec = this.state.sprayOffSec;
      } else {
        this.state.phase = 'spraying';
        this.state.phaseRemainingSec = this.state.sprayOnSec;
      }
    } else {
      this.state.phaseRemainingSec -= 1;
    }
    this.state.lastUpdated = Date.now();
    this.notify();
  }

  async connect(device: DeviceRef): Promise<void> {
    this.connectedDevice = device;
    this.state.connected = true;
    if (this.state.power) {
      if (this.state.mode === 'continuous') {
        this.state.phase = 'spraying';
        this.state.phaseRemainingSec = 0;
      } else {
        this.state.phase = 'spraying';
        this.state.phaseRemainingSec = this.state.sprayOnSec;
      }
      this.startTimer();
    }
    this.state.lastUpdated = Date.now();
    this.notify();
  }

  async disconnect(): Promise<void> {
    this.stopTimer();
    this.state.connected = false;
    this.state.phase = 'off';
    this.state.phaseRemainingSec = 0;
    this.state.lastUpdated = Date.now();
    this.notify();
  }

  async setPower(on: boolean): Promise<void> {
    this.state.power = on;
    if (!on) {
      this.stopTimer();
      this.state.phase = 'off';
      this.state.phaseRemainingSec = 0;
    } else {
      if (this.state.mode === 'continuous') {
        this.state.phase = 'spraying';
        this.state.phaseRemainingSec = 0;
      } else {
        this.state.phase = 'spraying';
        this.state.phaseRemainingSec = this.state.sprayOnSec;
      }
      if (this.state.connected) {
        this.startTimer();
      }
    }
    this.state.lastUpdated = Date.now();
    this.notify();
  }

  async setMode(mode: 'continuous' | 'interval'): Promise<void> {
    this.state.mode = mode;
    if (!this.state.power || !this.state.connected) {
      this.state.phase = 'off';
      this.state.phaseRemainingSec = 0;
    } else if (mode === 'continuous') {
      this.state.phase = 'spraying';
      this.state.phaseRemainingSec = 0;
    } else {
      // Switch back to interval mode
      this.state.phase = 'spraying';
      this.state.phaseRemainingSec = this.state.sprayOnSec;
      this.startTimer();
    }
    this.state.lastUpdated = Date.now();
    this.notify();
  }

  async setIntensity(level: number): Promise<void> {
    this.state.intensity = Math.max(0, Math.min(10, level));
    const { onSec, offSec } = timingForLevel(this.state.intensity);
    await this.setSpray(onSec, offSec);
  }

  async setSpray(onSec: number, offSec: number): Promise<void> {
    this.state.sprayOnSec = onSec;
    this.state.sprayOffSec = offSec;
    if (this.state.power && this.state.mode !== 'continuous') {
      if (this.state.phase === 'spraying' && this.state.phaseRemainingSec > onSec) {
        this.state.phaseRemainingSec = onSec;
      } else if (this.state.phase === 'paused' && this.state.phaseRemainingSec > offSec) {
        this.state.phaseRemainingSec = offSec;
      }
    }
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
