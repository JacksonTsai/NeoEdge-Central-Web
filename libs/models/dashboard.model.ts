import { Gateway } from './gateways.model';
import { IItService } from './it-service.model';
import { IOtDevice } from './ot-devices.model';
import { IProjectByIdResp } from './projects.model';
import { User } from './users.model';

export interface IDashboardState {
  isLoading: DASHBOARD_LOADING;
  projectId: number;
  projectDetail: IProjectByIdResp;
  gateways: Gateway[];
  usersList: User[];
  itList: IItService[];
  otList: IOtDevice<any>[];
  usageFee?: any;
  licenseConsumption?: any;
  activities?: any;
}

export enum DASHBOARD_LOADING {
  NONE,
  GET,
  REFRESH
}
