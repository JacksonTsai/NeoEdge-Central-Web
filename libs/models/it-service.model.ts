import { ISupportApps, TSupportAppVersionData, TSupportAppsItService } from './support-apps.model';
import { ITableQuery } from './table-query.model';

export type TItServiceAzureProtocol = 'MQTT' | 'AMQP' | 'MQTT_WS' | 'AMQP_WS';
export interface IItServiceState {
  projectId: number;
  dataTable: IItService[];
  page: number;
  size: number;
  dataLength: number;
  supportApps: ISupportApps[];
  connections: IItServiceConnectionOption[];
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
  type?: TSupportAppVersionData;
  connectionLabel?: string;
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
  value: number | TItServiceAzureProtocol;
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

export interface IItServiceField {
  name: string;
  host: string;
  connection: number | TItServiceAzureProtocol;
  keepAlive?: number;
  qoS?: number;
  caCertFileName?: string;
  caCertFileContent?: string;
  skipCertVerify?: boolean;
}

export type TItServiceAwsField = IItServiceField;

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
