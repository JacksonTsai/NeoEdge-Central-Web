import { IGetUserProfileResp, ILoginReq, ILoginResp, IRefreshTokenResp } from '@neo-edge-web/models';
import { createAction, props } from '@ngrx/store';

export const loginAction = createAction('[Auth] Login', props<{ loginReq: ILoginReq }>());

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ loginResp: ILoginResp; fromUserLogin: boolean }>()
);

export const userProfileAction = createAction('[Auth] Get Profile');

export const loinSuccessRedirect = createAction(
  '[Auth] Redirect To Default Page',
  props<{ userProfile: IGetUserProfileResp; isRedirectDefaultPage: boolean }>()
);

export const userProfileSuccess = createAction(
  '[Auth] Get Profile Success',
  props<{ userProfile: IGetUserProfileResp }>()
);

export const loginFail = createAction('[Auth] Login Fail');

export const resetAuthState = createAction('[Auth] Reset Auth State');

export const logoutAction = createAction('[Auth] Logout');

export const refreshAccessTokenAction = createAction(
  '[Auth] Refresh Access Token',
  props<{ refreshToken: string; interval: number }>()
);

export const updateAccessTokenAction = createAction('[Auth] Update Access Token', props<IRefreshTokenResp>());

export const permissionActionAction = createAction('[Auth] Permission', props<{ loginReq: ILoginReq }>());
