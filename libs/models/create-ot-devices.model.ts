import { ISupportApps } from './support-apps.model';

export interface ICreateOtDevicesState {
  supportDevices: ISupportApps[];
  isLoading: CREATE_OT_DEVICES_LOADING;
}

export enum CREATE_OT_DEVICES_LOADING {
  NONE,
  GET_DEVICES,
  CREATE_DEVICE
}
