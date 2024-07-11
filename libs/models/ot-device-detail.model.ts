import { TSupportAppVersionData } from './support-apps.model';

export interface IOtDeviceDetailState {
  profileId: number;
  otDeviceVersion: TSupportAppVersionData;
  otDevice: any;
  isLoading: OT_DEVICE_LOADING;
  texolTagDoc?: any;
}

export enum OT_DEVICE_LOADING {
  NONE,
  GET_DETAIL,
  EDIT,
  REFRESH
}

export enum OT_DEVICE_PROFILE_MODE {
  NEOFLOW_VIEW,
  OT_DEVICE_VIEW
}
