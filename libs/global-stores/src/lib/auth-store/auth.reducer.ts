import { IAuthState, IJwtInfo } from '@neo-edge-web/models';
import { createReducer, on } from '@ngrx/store';
import * as AuthAction from './auth.actions';

const initialState: IAuthState = {
  jwt: null,
  accessToken: '',
  refreshToken: '',
  isLoginSuccess: null,
  tryLoginCount: 0,
  isAuthVerifying: false,
  userProfile: null,
  userProjects: [],
  currentProjectId: 0,
  currentProjectName: ''
};

const decodeJWT = (jwt: string): IJwtInfo | null => {
  try {
    const base64UrlEncode = jwt.split('.')[1];

    let jsonPayload = decodeURIComponent(escape(window.atob(base64UrlEncode)));
    const { exp, fqdn, iat, nbf, rid, uid } = JSON.parse(jsonPayload);
    return { exp, fqdn, iat, nbf, rid, uid };
  } catch (error) {
    return null;
  }
};

export const authReducer = createReducer(
  initialState,
  on(AuthAction.loginAction, (state) => ({ ...state, isAuthVerifying: true, tryLoginCount: state.tryLoginCount + 1 })),
  on(AuthAction.loginSuccess, (state, { loginResp }) => {
    return {
      ...state,
      jwt: decodeJWT(loginResp.accessToken),
      accessToken: loginResp.accessToken,
      refreshToken: loginResp.refreshToken,
      isAuthVerifying: false,
      isLoginSuccess: true,
      tryLoginCount: 0
    };
  }),
  on(AuthAction.loinSuccessRedirect, AuthAction.userProfileSuccess, (state, { userProfile, userProjects }) => {
    return {
      ...state,
      userProfile,
      userProjects,
      currentProjectId: userProfile?.defaultProjectId,
      currentProjectName: userProfile?.defaultProjectName
    };
  }),
  on(AuthAction.loginFail, (state) => ({ ...state, isLoginSuccess: false, isAuthVerifying: false })),
  on(AuthAction.updateAccessTokenAction, (state, { accessToken }) => ({ ...state, accessToken })),
  on(AuthAction.changeCurrentProjectIdAction, (state, { currentProjectId, currentProjectName }) => ({
    ...state,
    currentProjectId,
    currentProjectName
  })),
  on(AuthAction.resetAuthState, () => ({ ...initialState }))
);
