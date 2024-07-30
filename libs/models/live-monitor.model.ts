export interface ILiveMonitorChart {
  type: TLiveMonitorChartType;
  series: number[];
}

// System
export interface ILiveMonitorSystem {
  cpu: number;
  memory: number;
}

// Status
export interface ILiveMonitorStatus {
  type: string;
  appName: string;
  status: ILiveMonitorAppItem[];
}

export interface ILiveMonitorAppItem {
  name: string;
  status: ILiveMonitorAppStatus | ILiveMonitorGwStatus;
}

export interface ILiveMonitorAppStatus {
  connection: number;
  input: number;
  output: number;
}

export interface ILiveMonitorGwStatus {
  process: number;
}

// Event
export interface ILiveMonitorEvent {
  timestamp: number;
  eventId: number;
  eventData: ILiveMonitorEventData;
}

export interface ILiveMonitorEventData {
  gatewayEnkey: string;
  gatewayName: string;
  appName: string;
}

export type TLiveMonitorChartType = 'CPU' | 'RAM';

export enum LIVE_MONITOR_WS_TYPE {
  'system' = 'system',
  'status' = 'status',
  'event' = 'event'
}

export enum LIVE_MONITOR_WS_STATUS_TYPE {
  'IT' = 'IT',
  'OT' = 'OT',
  'GW' = 'Processor'
}

export enum LIVE_MONITOR_STATUS_CATEGORY {
  'Unknow' = 0,
  'Success' = 1,
  'Fail' = 2
}

export enum LIVE_MONITOR_STATUS_TYPE {
  'Connection' = 'Connection',
  'Tx' = 'Send', // Output
  'Rx' = 'Read', // Input
  'Processes' = 'Processes'
}
