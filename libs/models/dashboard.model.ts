import { IGetBillingResp } from './billing.model';
import { IEventDoc, IGetEventLogsResp } from './event-logs.model';
import { Gateway } from './gateways.model';
import { IItService } from './it-service.model';
import { IProjectLicense } from './license.model';
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
  eventDoc: IEventDoc;
  activitiesList: IGetEventLogsResp;
  projectFee: IGetBillingResp;
  projectLicenses: IProjectLicense[];
  timeRecord: IDashboardTimeRecord;
}

export interface IDashboardGatewayStatusItem {
  id: number;
  name: string;
  list: Gateway[];
}

export interface IDashboardTimeRecord {
  activitiesTime: IDashboardActivitiesTime;
  projectFeeTime: IDashboardProjectFeeTime;
}

export interface IDashboardActivitiesTime {
  start: number;
  end: number;
}

export interface IDashboardProjectFeeTime {
  month: number;
  start: string;
  end: string;
}

export type TDashboardGatewayStatus = Record<string, IDashboardGatewayStatusItem>;

export enum DASHBOARD_LOADING {
  NONE,
  INIT,
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
