export interface ITcpProfileForUI {
  basic: TTcpBasicForUI;
  advanced: IAdvancedForUI;
}

export interface IRtuProfileForUI {
  basic: TRtuBasicForUI;
  advanced: IAdvancedForUI;
  connectionSetting: IRtuConnectionSetting;
}

export interface IBasicForUI {
  deviceName: string;
  slaveId: number;
  ipAddress: string;
  port: number;
  description: string;
}

export interface IAdvancedForUI {
  initialDelay: number;
  delayBetweenPolls: number;
  responseTimeout: number;
  pollingRetries: number;
  swapByte: boolean;
  swapWord: boolean;
}

export interface IRtuConnectionSetting {
  mode: string;
  baudRate: 300 | 600 | 1200 | 1800 | 2400 | 4800 | 9600 | 19200 | 38400 | 57600 | 115200 | 230400 | 460800 | 921600;
  dataBits: 7 | 8;
  parity;
  stopBit: 1 | 2;
}

export enum RTU_PARITY {
  None = 'None',
  Odd = 'Odd',
  Even = 'Even'
}

export type TTcpBasicForUI = Pick<IBasicForUI, 'deviceName' | 'slaveId' | 'ipAddress' | 'port' | 'description'>;

export type TRtuBasicForUI = Pick<IBasicForUI, 'deviceName' | 'slaveId' | 'description'>;
