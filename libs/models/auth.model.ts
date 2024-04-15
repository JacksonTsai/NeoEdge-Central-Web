export interface IAuthState {
  isLoginSuccess: boolean | null;
  tryLoginCount: number;
  isAuthVerifying: boolean;
  jwt: IJwtInfo | null;
  permissions: IPermission[];
  accessToken: string;
  refreshToken: string;
}

export interface ILoginReq {
  account: string;
  password: string;
}

export interface ILoginResp {
  accessToken: string;
  refreshToken: string;
}

export interface IJwtInfo {
  exp: number;
  nbf: number;
  iat: number;
  uid: number;
  rid: number;
  fqdn: string;
}

export interface IPermission {
  permissionId: number;
  permissionName: string;
}

export interface IPermissionResp {
  list: IPermission[];
}

export interface IAuthState {
  isLoginSuccess: boolean | null;
  tryLoginCount: number;
  isAuthVerifying: boolean;
  jwt: IJwtInfo | null;
  permissions: IPermission[];
  accessToken: string;
  refreshToken: string;
}

export interface IRefreshTokenReq {
  refreshToken: string;
}

export interface IRefreshTokenResp {
  accessToken: string;
}

export interface IForgetPasswordReq {
  account: string;
}

export interface IForgetPasswordResp {
  details: string;
  status: string;
}

export interface ISetPasswordReq {
  password: string;
}

export interface IGetUserProfileResp {
  account: string;
  defaultProjectId: number;
  defaultProjectName: string;
  firstName: string;
  idleTimeout: number;
  isMFAEnable: number;
  language: number;
  lastName: string;
  zone: string;
}

export interface IPutUserProfileResp {
  Name: string;
  defaultProjectId: number;
  idleTimeout: number;
  isMfaEnable: number;
  language: number;
  timezone: string;
}

export enum PERMISSION {
  COMPANY_ACCOUNT = 100,
  USER_MANAGEMENT = 200,
  PROJECT_MANAGEMENT = 300,
  APPLICATION_MANAGEMENT = 400
}
