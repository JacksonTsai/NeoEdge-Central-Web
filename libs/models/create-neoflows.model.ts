import { IItService } from './it-service.model';
import { IOtDevice } from './ot-devices.model';

export interface ICreateNeoFlowState {
  neoflowProcessorVers: { version: string; id: number }[];
  otProfileList: IOtDevice<any>[];
  itProfileList: IItService[];
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
