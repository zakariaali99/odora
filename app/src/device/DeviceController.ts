export * from './types';
export * from './transports/MockTransport';
export * from './transports/CloudTransport';

import { DeviceController } from './types';
import { mockDeviceController } from './transports/MockTransport';

// Default active controller (swappable from Mock -> BLE in M4)
let activeController: DeviceController = mockDeviceController;

export const getDeviceController = (): DeviceController => {
  return activeController;
};

export const setDeviceController = (controller: DeviceController): void => {
  activeController = controller;
};
