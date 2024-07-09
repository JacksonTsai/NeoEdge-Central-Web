import { ITableQuery } from './table-query.model';

export interface IOtDevicesState {
  otDevices: IOtDevice<any>[];
  page: number;
  size: number;
  queryKey: string;
  otDevicesLength: number;
  projectId: number;
  isLoading: OT_DEVICES_LOADING;
}

export interface IGetOtDevicesResp {
  total: number;
  devices: IOtDevice<any>[];
}

export interface IOtDevice<T> {
  id: number;
  name: string;
  appVersionId: number;
  appId: number;
  appClass: string;
  iconPath: string;
  setting: IInstances<T>;
  createdBy: string;
  createdAt: number;
}

export interface IInstances<T> {
  Instances: T;
}

export interface IInstancesRtu {
  RTU: {
    [key: string]: {
      Devices: { [key: string]: IDevices };
      Properties: IRtuProperties;
    };
  };
}

export interface IInstancesTcp {
  TCP: {
    [key: string]: {
      Devices: { [key: string]: IDevices };
      Properties: ITcpProperties;
    };
  };
}

export interface IDevices {
  Name: string;
  SlaveID: number;
  Profile?: any;
  Commands: {
    [key: string]: IDevicesCommands;
  };
}

export interface IDevicesCommands {
  Name: string;
  Swap: 'ByteWord' | 'Word' | 'Byte' | 'None';
  Enable: boolean;
  Trigger: string;
  DataType: string;
  Function: number;
  Interval: number;
  Quantity: number;
  StartingAddress: number;
}

export interface IRtuProperties {
  Parity: string;
  DataBit: number;
  StopBit: string;
  BaudRate: number;
  InitialDelay: number;
  PollingRetries: number;
  ResponseTimeout: number;
  DelayBetweenPolls: number;
}

export interface ITcpProperties {
  IP: string;
  Port: number;
  InitialDelay: number;
  PollingRetries: number;
  ResponseTimeout: number;
  DelayBetweenPolls: number;
}

export interface IEditOtProfile<T> {
  projectId: number;
  appVersionId: number;
  name: string;
  description: string;
  setting: IInstances<T>;
}

export interface IEditOtDeviceReq<T> {
  profile: IOtProfile<T>;
  deviceIcon: File;
}

export type TEditOtProfile<T> = Pick<IOtProfile<T>, 'description' | 'name' | 'setting' | 'appVersionId'>;

export type TOtProfileById<T> = Pick<IOtProfile<T>, 'description' | 'name' | 'setting' | 'appClass' | 'iconPath'>;

interface IOtProfile<T> {
  description: string;
  name: string;
  setting: IInstances<T>;
  appVersionId?: number;
  appId: number;
  appClass: string;
  iconPath: string;
}

export type TTableQueryForOtDevices = ITableQuery & { names?: string };

export enum DEVICE_TYPE {
  NONE,
  MODBUS_TCP,
  MODBUS_RTU,
  TEXOL
}

export enum OT_DEVICES_LOADING {
  NONE,
  TABLE,
  CREATE,
  DELETE,
  DETAIL,
  COPY,
  REFRESH_TABLE
}

export enum CREATE_OT_STEP {
  selectDeviceProtocol,
  deviceProfile,
  selectCommandTemplate,
  otTags
}

export enum OT_DEVICES_TABLE_MODE {
  SELECTION,
  NEOFLOW_VIEW,
  OT_DEVICE_VIEW
}
