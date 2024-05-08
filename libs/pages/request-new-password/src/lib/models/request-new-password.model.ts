export interface IRequestNewPasswordState {
  action: REQUEST_PASSWORD_ACTION;
  actionResult: REQUEST_PASSWORD_RESULT;
}

export enum REQUEST_PASSWORD_ACTION {
  REQUEST_NEW_PASSWORD,
  NONE
}

export enum REQUEST_PASSWORD_RESULT {
  SUCCESS,
  FAILURE,
  NONE
}
