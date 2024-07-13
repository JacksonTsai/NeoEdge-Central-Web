import { IGetUserProfileResp } from './auth.model';
import { IItService } from './it-service.model';
import { IOtDevice } from './ot-devices.model';
import { ISupportApps } from './support-apps.model';

export interface ICreateNeoFlowState {
  neoflowProcessorVers: { version: string; id: number }[];
  supportApps: ISupportApps[];
  otProfileList: IOtDevice<any>[];
  itProfileList: IItService[];
  addedOt: IOtDevice<any>[];
  addedIt: IItService[];
  texolTagDoc: any;
  userProfile: IGetUserProfileResp;
  isLoading: CREATE_NEOFLOW_LOADING;
}

export enum CREATE_NEOFLOW_LOADING {
  NONE,
  CREATE
}

export enum CREATE_NEOFLOW_STEP {
  profile,
  selectDataProvider,
  selectMessageDestination,
  createMessageSchema,
  linkDataSource,
  linkDestination
}
