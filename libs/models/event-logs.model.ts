export interface IEventItemDoc {
  name: string;
  group: string;
  severity: string;
  content: string;
}

export interface IEventDoc {
  [id: string]: IEventItemDoc;
}

export interface IGetEventDocResp {
  events: IEventDoc;
}

export interface IEventsState {
  events: IEventDoc;
  loading: boolean;
  error: any;
}

export interface IGetEventLogsReq {
  timeGe: number;
  timeLe: number;
  order: string;
  size: number;
  lastRecord?: string;
  eventIds?: number[];
}

export type TBaseEventLogsParams = Pick<IGetEventLogsReq, 'timeGe' | 'timeLe' | 'order' | 'size' | 'lastRecord'>;

export type TGetProjectEventLogsParams = TBaseEventLogsParams;

export type TGetGatewayEventLogsParams = TBaseEventLogsParams & Pick<IGetEventLogsReq, 'eventIds'>;

export type TGetProjectEventLogsReq = {
  type: TUpdateEventLogMode;
  params: TGetProjectEventLogsParams;
};

export type TGetGatewayEventLogsReq = {
  type: TUpdateEventLogMode;
  params: TGetGatewayEventLogsParams;
};

export interface IGetEventLogsResp {
  events: IEventLog[];
  lastEvaluatedKey: string;
}

export interface IEventLog {
  projectId: number;
  'timestamp:uuid': string;
  gatewayId: number;
  timestamp: number;
  expireAt: number;
  eventId: number;
  eventData: IEventLogData;
}

export interface IEventLogData {
  gatewayEnkey: string;
  gatewayName: string;
  userAccount: string;
  userName: string;
}

export interface IDownloadGatewayEventLogsReq {
  timeGe: number;
  timeLe: number;
  order: string;
  eventIds?: number[];
  timeZone: string;
}

export type TUpdateEventLogMode = 'UPDATE' | 'GET';

export enum EVENT_LOG_SORT {
  Descend = 'desc',
  Ascend = 'asc'
}
