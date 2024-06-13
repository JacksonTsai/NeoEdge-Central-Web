export interface IAppVersion {
  id: number;
  version: string;
}

export interface ISupportApps {
  id: number;
  isAvailable: number;
  category: number;
  flowGroup: number;
  name: string;
  appVersions: IAppVersion[];
}

export interface IGetSupportAppsResp {
  total: number;
  apps: ISupportApps[];
}

export interface ISupportAppsUI {
  key: string;
  img: string;
}

export interface ISupportAppsWithVersion extends ISupportApps {
  key: string;
  version: IAppVersion;
}

export interface IGetSupportAppsReq {
  flowGroups: number;
  categories?: number;
}

export enum SUPPORT_APPS_FLOW_GROUPS {
  'ot_device' = 0,
  'it_service' = 1,
  'neoflow' = 2
}

export enum SUPPORT_APPS_CATEGORIES {
  'My Private App' = 0,
  'Standard App' = 1,
  'Advanced App' = 2
}

export type TSupportAppsItService = 'AWS' | 'MQTT' | 'AZURE' | 'HTTP';

export enum SUPPORT_APPS_IT_SERVICE {
  AWS = 'AWS IoT Core',
  MQTT = 'MQTT Broker',
  AZURE = 'Azure IoT Hub',
  HTTP = 'HTTP Client'
}

export enum SUPPORT_APPS_OT_DEVICE {
  MODBUS_TCP = 'Modbus TCP',
  MODBUS_RTU = 'Modbus RTU',
  TEXOL = 'TEXOL 213MM2-R1'
}

export type SUPPORT_APPS = SUPPORT_APPS_IT_SERVICE | SUPPORT_APPS_OT_DEVICE;
