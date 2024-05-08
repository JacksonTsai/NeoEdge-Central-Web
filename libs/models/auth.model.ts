export interface IAuthState {
  isLoginSuccess: boolean | null;
  tryLoginCount: number;
  isAuthVerifying: boolean;
  jwt: IJwtInfo | null;
  accessToken: string;
  refreshToken: string;
  userProfile: IGetUserProfileResp | null;
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

export interface IGetUserProfileResp {
  account: string;
  isMfaEnable: number;
  name: string;
  timeZone: string;
  language: string;
  idleTimeout: number;
  defaultProjectId: number;
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

export enum PERMISSION {
  COMPANY_ACCOUNT = 100,
  USER_MANAGEMENT = 200,
  PROJECT_MANAGEMENT = 300,
  APPLICATION_MANAGEMENT = 400
}
