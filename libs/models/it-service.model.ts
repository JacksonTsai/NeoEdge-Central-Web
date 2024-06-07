import { ITableQuery } from './table-query.model';

export interface IItServiceState {
  projectId: number;
  dataTable: IItService[];
  page: number;
  size: number;
  dataLength: number;
  isLoading: IT_SERVICE_LOADING;
}

export interface IItService {
  // type: number;
  // connection: string;
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

export enum IT_SERVICE_LOADING {
  NONE,
  TABLE,
  REFRESH_TABLE,
  CREATE,
  DELETE
}

export enum IT_SERVICE_APP {
  'AWS IoT Core' = 1,
  'AZURE IoT Hub' = 2,
  'MQTT Broker' = 3
}
