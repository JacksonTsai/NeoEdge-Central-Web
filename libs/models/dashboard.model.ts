import { IEventDoc, IGetEventLogsResp } from './event-logs.model';
import { Gateway } from './gateways.model';
import { IItService } from './it-service.model';
import { IOtDevice } from './ot-devices.model';
import { IProjectByIdResp } from './projects.model';
import { ISupportApps } from './support-apps.model';
import { User } from './users.model';

export interface IDashboardState {
  isLoading: DASHBOARD_LOADING;
  projectId: number;
  projectDetail: IProjectByIdResp;
  gatewaysList: Gateway[];
  usersList: User[];
  itList: IItService[];
  itApps: ISupportApps[];
  otList: IOtDevice<any>[];
  otApps: ISupportApps[];
  usageFee?: any;
  licenseConsumption?: any;
  eventDoc: IEventDoc;
  activitiesList: IGetEventLogsResp;
  activitiesTime: IDashboardActivitiesTime;
}

export interface IDashboardGatewayStatusItem {
  id: number;
  name: string;
  list: Gateway[];
}

export interface IDashboardActivitiesTime {
  start: number;
  end: number;
}

export type TDashboardGatewayStatus = Record<string, IDashboardGatewayStatusItem>;

export enum DASHBOARD_LOADING {
  NONE,
  GET,
  REFRESH,
  UPDATE_ACTIVITIES
}

export enum DASHBOARD_GATEWAY_STATUE {
  Waiting = 0,
  Connected = 1,
  Disconnected = 2,
  Detach = 3
}
