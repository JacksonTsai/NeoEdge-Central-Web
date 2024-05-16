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
  gatewayProfileUpdateAt: string;
  gatewayReportProfile: string;
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
  sshConnectedAt: string;
  sshMode: number;
  sshServer: string;
  sshToken: string;
  sync: number;
  tagNumber: number;
  tpmEnabled: number;
  vendorIconPath: string;
}

export interface IEditGatewayProfileReq {
  name: string;
  ipcVendorName: string;
  ipcModelName: string;
  longitude: number;
  latitude: number;
  selectedLabel: number[];
  customField: IGatewayCustomField;
  serialPorts: IIpcSerialPort;
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

export enum GATEWAY_LOADING {
  NONE,
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
