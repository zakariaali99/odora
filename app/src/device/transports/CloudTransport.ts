/**
 * CloudTransport Stub
 *
 * ⛔ HARD RULE: Do NOT implement the cloud / remote-control path until
 * the owner explicitly orders it. See plans/claude plans/02-cloud-remote-path.md.
 * This file is an intentionally unimplemented placeholder stub.
 */

import { DeviceController, DeviceRef, DeviceSchedule, DeviceState, Unsubscribe } from '../types';

export class CloudTransport implements DeviceController {
  connect(_device: DeviceRef): Promise<void> {
    throw new Error('CloudTransport is gated and not implemented. See 02-cloud-remote-path.md');
  }

  disconnect(): Promise<void> {
    throw new Error('CloudTransport is gated and not implemented.');
  }

  setPower(_on: boolean): Promise<void> {
    throw new Error('CloudTransport is gated and not implemented.');
  }

  setIntensity(_level: number): Promise<void> {
    throw new Error('CloudTransport is gated and not implemented.');
  }

  setSpray(_onSec: number, _offSec: number): Promise<void> {
    throw new Error('CloudTransport is gated and not implemented.');
  }

  setSchedule(_schedule: DeviceSchedule): Promise<void> {
    throw new Error('CloudTransport is gated and not implemented.');
  }

  readOilLevel(): Promise<number> {
    throw new Error('CloudTransport is gated and not implemented.');
  }

  onStateChange(_cb: (state: DeviceState) => void): Unsubscribe {
    throw new Error('CloudTransport is gated and not implemented.');
  }

  getState(): DeviceState {
    throw new Error('CloudTransport is gated and not implemented.');
  }
}
