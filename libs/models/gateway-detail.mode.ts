import { IGatewayLabels } from './utils.model';

export interface GatewayDetailState {
  projectId: number;
  gatewayId: number;
  gatewayDetail: IGetGatewaysDetailResp | null;
  isLoading: GATEWAY_LOADING;
  labels: IGatewayLabels[];
}

export interface IGetGatewaysDetailResp {
  account: number;
  connectionStatus: number;
  currentMode: number;
  customField: IGatewayCustomField[];
  desiredMode: number;
  gatewayIconPath: string;
  gatewaySystemInfo: GatewaySystemInfo;
  gatewaySystemInfoUpdateAt: number;
  ipcModelName: string;
  ipcSerialPorts: IIpcSerialPort[];
  ipcVendorName: string;
  labels: IGatewayLabels[];
  latitude: number;
  longitude: number;
  name: string;
  neoFlow: string;
  neoedgeXArch: string;
  neoedgeXVersion: string;
  sshConnectedAt: number;
  sshMode: number;
  sshServer: string;
  sshToken: string;
  sync: number;
  tagNumber: number;
  tpmEnabled: number;
  isPartnerIpc: number;
  ipcModelSeriesName: string;
}

export interface GatewaySystemInfo {
  os: string;
  ram: number;
  hasTPM: boolean;
  cpuCount: number;
  cpuModel: string;
  hostname: string;
  timeZone: string;
  ipAddress: string;
  timestamp: string;
  agentVersion: string;
}

export interface IEditGatewayProfileReq {
  name: string;
  ipcVendorName: string;
  ipcModelName: string;
  longitude: number;
  latitude: number;
  selectedLabel: number[];
  customField: IGatewayCustomField[];
  serialPorts: IIpcSerialPort[];
}

export interface IGetInstallCommandResp {
  command: string;
  commandEffectiveHour: number;
}

export interface IIpcSerialPort {
  name: string;
  path: string;
}

export interface IGatewayCustomField {
  name: string;
  value: string;
}

export type TMetaData = Pick<
  IGetGatewaysDetailResp,
  | 'name'
  | 'longitude'
  | 'latitude'
  | 'ipcVendorName'
  | 'ipcModelName'
  | 'ipcSerialPorts'
  | 'labels'
  | 'customField'
  | 'isPartnerIpc'
  | 'ipcModelSeriesName'
  | 'gatewayIconPath'
>;

export type TGatewayStatusInfo = Pick<
  IGetGatewaysDetailResp,
  | 'name'
  | 'ipcVendorName'
  | 'ipcModelName'
  | 'gatewayIconPath'
  | 'connectionStatus'
  | 'currentMode'
  | 'sshMode'
  | 'tpmEnabled'
  | 'gatewaySystemInfoUpdateAt'
  | 'isPartnerIpc'
  | 'ipcModelSeriesName'
>;

export enum GATEWAY_LOADING {
  NONE,
  REFRESH_METADATA,
  EDIT_METADATA,
  GET_DETAIL,
  DELETE_GW,
  DETACH_GW,
  GET_INSTALL_COMMAND,
  CUSTOM_FIELD,
  SYNC_GW_PROFILE,
  UPGRADE_EDGE_X_AGENT,
  SWITCH_RUNNING_MODE,
  SSH_CONTROL
}
