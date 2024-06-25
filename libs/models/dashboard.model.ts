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
  activities?: any;
}

export interface IDashboardGatewayStatusItem {
  name: string;
  list: Gateway[];
}

export type TDashboardGatewayStatus = Record<string, IDashboardGatewayStatusItem>;

export enum DASHBOARD_LOADING {
  NONE,
  GET,
  REFRESH
}
