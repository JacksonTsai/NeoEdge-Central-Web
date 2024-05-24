import { IGetUserProfileResp } from './auth.model';

export interface IUserProfileState {
  userInfo: IGetUserProfileResp | null;
  isLoading: USER_INFO_LOADING;
}

export enum USER_INFO_LOADING {
  NONE,
  EDIT_PROFILE,
  GET_PROFILE,
  REFRESH
}
