import { ISupportApps, TSupportAppsItService } from './support-apps.model';
import { ITableQuery } from './table-query.model';

export interface IItServiceState {
  projectId: number;
  dataTable: IItService[];
  page: number;
  size: number;
  dataLength: number;
  supportApps: ISupportApps[];
  isLoading: IT_SERVICE_LOADING;
}

export interface IItService {
  appClass: string;
  appVersionId: number;
  createdAt: number;
  createdBy: string;
  id: number;
  name: string;
  setting: any;
}

export type TableQueryForItService = ITableQuery & { names?: string };

export interface IGetItServiceResp {
  total: number;
  itServices: IItService[];
}

export interface ICreateItServiceReq {
  appVersionId: number;
  name: string;
  projectId: number;
  setting: any;
}

export interface ICreateItServiceResp {
  id: number;
}

export interface IGetItServiceDetailResp {
  appVersionId: number;
  name: string;
  setting: any;
}

export interface IEditItServiceDetailReq {
  name: string;
  setting: any;
}

export interface IDeleteItServiceDetailReq {
  profileId: number;
  name: string;
}

export interface IItServiceDetailSelectedAppData {
  key: TSupportAppsItService;
  app: ISupportApps;
  connectionData: IItServiceConnectionData;
  qoSData: IItServiceQoSData;
}

export interface IItServiceConnectionData {
  options: IItServiceConnectionOption[];
  default: IItServiceConnectionOption;
}

export interface IItServiceConnectionOption {
  key: string;
  value: number;
  label: string;
  default?: boolean;
}

export interface IItServiceQoSData {
  options: IItServiceQoSOption[];
  default: IItServiceQoSOption;
  tip: string;
}

export interface IItServiceQoSOption {
  value: number;
  tip: string;
  default?: boolean;
  selected?: boolean;
}

export enum IT_SERVICE_LOADING {
  NONE,
  TABLE,
  REFRESH_TABLE,
  CREATE,
  DELETE,
  GET_APPS,
  REFRESH_APPS
}

export enum IT_SERVICE_DETAIL_LOADING {
  NONE,
  TABLE,
  REFRESH,
  DELETE
}

export enum IT_SERVICE_DETAIL_MODE {
  CREATE,
  EDIT,
  VEIW
}

export enum IT_SERVICE_APP {
  'AWS IoT Core' = 1,
  'AZURE IoT Hub' = 2,
  'MQTT Broker' = 3
}
