import { ICustomOss, IPartnerIpc } from './ipcs.model';
import { ITableQuery } from './table-query.model';

export interface GatewaysState {
  projectId: number;
  gatewayTable: Gateway[];
  page: number;
  size: number;
  gatewaysLength: number;
  queryKey: string;
  isLoading: GATEWAYS_LOADING;
  labels: IGatewayLabels[];
  partnersIpc: IPartnerIpc[];
  customOs: ICustomOss[];
}

export interface IGatewayLabels {
  colorCode: string;
  name: string;
}

export interface IGetGatewaysResp {
  total: number;
  gateways: Gateway[];
}

export interface Gateway {
  id: number;
  name: string;
  gatewayIconPath: string;
  ipcVendorName: string;
  ipcModelName: string;
  createdBy: string;
  createdAt: number;
  currentMode: number;
  connectionStatus: number;
  tagNumber: number;
  neoFlow: string;
  sync: number;
  sshMode: number;
  labels: IGatewayLabels[] | null;
}

export type TableQueryForGateways = ITableQuery & { names?: string; label?: string };

export interface IAddGatewayReq {
  ipcModelName: string;
  ipcVendorName: string;
  isPartnerIpc: number;
  name: string;
  osId: number;
  projectId: number;
}

export interface IAddGatewayResp {
  command: string;
  commandEffectiveHour: number;
}

export enum GATEWAY_STATUE {
  Waiting = 0,
  Connected = 1,
  Disconnected = 2
}

export enum GATEWAY_SSH_MODE {
  FALSE = 0,
  TRUE = 1
}

export enum GW_CURRENT_MODE {
  ACTIVE = 0,
  PASSIVE = 1,
  DETACH = 2
}

export enum GATEWAYS_LOADING {
  NONE,
  TABLE,
  REFRESH_TABLE,
  CUSTOM_FIELD,
  MANAGE_LABEL,
  REFRESH_LABEL,
  ADD_GATEWAY
}

export enum NEED_SYNC_GATEWAYS {
  NO = 0,
  YES = 1
}
