import { ISupportApps, TSupportAppVersionData, TSupportAppsItService } from './support-apps.model';
import { ITableQuery } from './table-query.model';

export type TItServiceAzureProtocol = 'MQTT' | 'AMQP' | 'MQTT_WS' | 'AMQP_WS';
export interface IItServiceState {
  dataTable: IItService[];
  page: number;
  size: number;
  dataLength: number;
  supportApps: ISupportApps[];
  connections: IItServiceConnectionOption[];
  isLoading: IT_SERVICE_LOADING;
}

export interface IItServiceDetailState {
  itServiceId: number;
  itServiceDetail: IItServiceDetail;
  isLoading: IT_SERVICE_DETAIL_LOADING;
}

export interface IItService {
  appClass: string;
  appVersionId: number;
  appId: number;
  createdAt: number;
  createdBy: string;
  id: number;
  name: string;
  setting: any;
  type?: TSupportAppVersionData;
  connectionLabel?: string;
}

export interface IItServiceDetail {
  appVersionId: number;
  appId: number;
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
  setting: any;
}

export interface ICreateItServiceResp {
  id: number;
}

export type IGetItServiceDetailResp = IItServiceDetail;

export interface IUpdateItServiceDetailReq {
  name: string;
  setting: any;
}

export interface IDeleteItServiceDetailReq {
  name: string;
}

export interface ICopyItServiceDetailReq {
  name: string;
}

export interface ICopyItServiceDetailResp {
  id: number;
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
  connectionCustom?: number;
  keepAlive?: number;
  qoS?: number;
  caCertFileName?: string;
  caCertFileContent?: string;
  skipCertVerify?: boolean;
  useTls?: boolean;
  useCert?: boolean;
  useCaType?: string;
  file?: IItServiceCaFile | null;
}

export interface IItServiceCaFile {
  name: string;
  content: string | ArrayBuffer | null;
  file?: File;
}

export type TItServiceAwsField = IItServiceField;

export type TItServiceAzureField = Pick<IItServiceField, 'name' | 'host' | 'connection'>;

export enum IT_SERVICE_LOADING {
  NONE,
  TABLE,
  REFRESH_TABLE,
  CREATE,
  DELETE,
  COPY,
  GET_APPS,
  REFRESH_APPS
}

export enum IT_SERVICE_DETAIL_LOADING {
  NONE,
  EDIT_DETAIL,
  GET_DETAIL,
  REFRESH,
  DELETE
}

export enum IT_SERVICE_DETAIL_MODE {
  CREATE,
  EDIT,
  CANCEL,
  VEIW
}

export enum IT_SERVICE_APP {
  'AWS IoT Core' = 1,
  'AZURE IoT Hub' = 2,
  'MQTT Broker' = 3
}

export enum IT_SERVICE_CA_TYPE {
  Public = 'public',
  Private = 'private'
}
