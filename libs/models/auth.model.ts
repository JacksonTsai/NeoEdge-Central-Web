import { DATE_FORMAT } from './dateFormat.model';

export interface IAuthState {
  isLoginSuccess: boolean | null;
  tryLoginCount: number;
  isAuthVerifying: boolean;
  jwt: IJwtInfo | null;
  accessToken: string;
  refreshToken: string;
  userProfile: IGetUserProfileResp | null;
  currentProjectId: number;
  currentProjectName: string;
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

export interface IAllPermission {
  permissionId: number;
  permissionName: string;
  desc: string;
}

export interface IAllPermissionResp {
  list: IAllPermission[];
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
  account: string;
  password: string;
  eulaVersion?: string;
  verifyToken: string;
}

export interface IUserProfile {
  dateTimeFormat: DATE_FORMAT;
  defaultProjectId: number;
  idleTimeout: number;
  isMfaEnable: number;
  language: string;
  name: string;
}

export interface IGetUserProfileResp extends IUserProfile {
  account: string;
  timeZone: string;
  defaultProjectName: string;
  role: IUserRole;
}

export interface IUserRole {
  id: number;
  name: string;
  description: string;
  permissions: number[];
}

export interface IVerifyInitTokenReq {
  verifyToken: string;
}

export interface IVerifyInitTokenResp {
  account: string;
}
