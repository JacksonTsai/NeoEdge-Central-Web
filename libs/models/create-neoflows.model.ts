import { IGetUserProfileResp } from './auth.model';
import { IItService } from './it-service.model';
import { LeaderLine } from './leader-line.model';
import { IOtDevice } from './ot-devices.model';
import { ISupportApps } from './support-apps.model';

export interface ICreateNeoFlowState {
  neoflowProfile: any;
  supportApps: ISupportApps[];
  otProfileList: IOtDevice<any>[];
  itProfileList: IItService[];
  addedOt: IOtDevice<any>[];
  addedIt: IItService[];
  addedMessageSchema: IMessageSchema[];
  texolTagDoc: any;
  userProfile: IGetUserProfileResp;
  neoflowProcessorVers: { version: string; id: number }[];
  dsToMessageConnection: LeaderLine[];
  isLoading: CREATE_NEOFLOW_LOADING;
}

export interface IMessageSchema {
  messageName: string;
  messagePublishMode: string;
  publishInterval: string;
  messageContains: string;
  messagePayloadSize: string;
  tags: [];
}

export enum CREATE_NEOFLOW_LOADING {
  NONE,
  CREATE
}

export enum CREATE_NEOFLOW_STEP {
  neoflowProfile,
  selectDataProvider,
  selectMessageDestination,
  createMessageSchema,
  linkDataSource,
  linkDestination
}
