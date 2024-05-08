export interface IPageState {
  action: ACTIVE_RESET_ACTION;
  actionResult: ACTION_RESULT;
  isTokenInvalid: boolean;
}

export enum ACTIVE_RESET_ACTION {
  ACTIVE_USER,
  FORGOT_PASSWORD,
  NONE
}

export enum ACTION_RESULT {
  SUCCESS,
  FAILURE,
  NONE
}
