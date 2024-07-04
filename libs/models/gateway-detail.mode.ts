import { IGatewayLabels } from './utils.model';

export interface GatewayDetailState {
  projectId: number;
  gatewayId: number;
  gatewayDetail: IGetGatewaysDetailResp | null;
  isLoading: GATEWAY_LOADING;
  labels: IGatewayLabels[];
  sshStatus: IGatewaySSHStatus;
  wsRoomName: string;
}

export interface IGetGatewaysDetailResp {
  account: number;
  connectionStatus: number;
  currentMode: number;
  customField: IGatewayCustomField[];
  desiredMode: number;
  gatewayIconPath: string;
  gatewaySystemInfo: IGatewaySystemInfo;
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
  neoedgeXName: string;
  neoedgeXOsName: string;
  neoedgeXOsVersion: string;
  latestNeoedgeXVersion: string;
  latestNeoedgeXReleaseNote: string;
  latestNeoedgeXReleaseDate: number;
  desiredModeUpdatedAt: number;
  connectionStatusUpdatedAt: number;
  rebootSchedule: IGWRebootSchedule;
}

export interface IGatewaySystemInfo {
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

export interface IRebootReq {
  rebootSchedule: IGWRebootSchedule;
  rebootNow: number;
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
  | 'connectionStatusUpdatedAt'
>;

export type TNeoEdgeXInfo = Pick<
  IGetGatewaysDetailResp,
  | 'connectionStatus'
  | 'currentMode'
  | 'customField'
  | 'desiredMode'
  | 'neoedgeXArch'
  | 'neoedgeXVersion'
  | 'neoedgeXName'
  | 'neoedgeXOsName'
  | 'neoedgeXOsVersion'
  | 'latestNeoedgeXVersion'
  | 'latestNeoedgeXReleaseNote'
  | 'latestNeoedgeXReleaseDate'
  | 'gatewaySystemInfo'
>;

export enum GATEWAY_LOADING {
  NONE,
  REFRESH_GATEWAY_DETAIL,
  EDIT_METADATA,
  GET_DETAIL,
  DELETE_GW,
  GET_INSTALL_COMMAND,
  CUSTOM_FIELD,
  SYNC_GW_PROFILE,
  UPGRADE_EDGE_X_AGENT,
  SWITCH_RUNNING_MODE,
  CONNECT_SSH,
  REFRESH_SSH
}

export enum GW_RUNNING_MODE {
  Active = 0,
  Passive = 1,
  Detach = 2
}

export enum GW_WS_TYPE {
  'connection-info' = 'connectionInfo',
  'running-mode' = 'runningMode',
  'system-info' = 'systemInfo',
  'ssh' = 'ssh'
}

export interface IGWRebootSchedule {
  min: number;
  hour: number;
  days: IGWRebootDays;
}

export interface IGWRebootDays {
  sun: number;
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
}

export interface IGatewaySSHStatus {
  current: IGetGatewaySSHResp;
  ws: IGatewaySSHWsResp;
}

export interface IGetGatewaySSHResp {
  connectionStatus: number;
  sshServer: string;
  token: string;
}
export interface IGatewaySSHWsResp {
  enable: number;
  sshServer: string;
  token: string;
  connected: number;
}

export enum GATEWAY_SSH_STATUS {
  DISABLED = 0,
  ENABLED = 1
}
