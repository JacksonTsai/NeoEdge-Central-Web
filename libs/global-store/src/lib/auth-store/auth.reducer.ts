// import { IAuthState } from '@neo-edge-web/models';
import { IAuthState, IJwtInfo } from '@neo-edge-web/models';
import { createReducer, on } from '@ngrx/store';
import * as AuthAction from './auth.actions';

const initialState: IAuthState = {
  jwt: null,
  permissions: [],
  accessToken: '',
  refreshToken: '',
  isLoginSuccess: null,
  tryLoginCount: 0,
  isAuthVerifying: false
};

const decodeJWT = (jwt: string): IJwtInfo | null => {
  try {
    const base64UrlEncode = jwt.split('.')[1];

    let jsonPayload = decodeURIComponent(escape(window.atob(base64UrlEncode)));
    // const base64 = base64UrlEncode.replace(/-/g, '+').replace(/_/g, '/');
    // const jsonPayload = decodeURIComponent(
    //   window
    //     .atob(base64)
    //     .split('')
    //     .map((d) => {
    //       return '%' + ('00' + d.charCodeAt(0).toString(16)).slice(-2);
    //     })
    //     .join('')
    // );
    const { exp, fqdn, iat, nbf, rid, uid } = JSON.parse(jsonPayload);
    return { exp, fqdn, iat, nbf, rid, uid };
  } catch (error) {
    return null;
  }
};

// const token = localStorage.getItem("token");
// const parts = token.split(".");
// const payloadBase64 = parts[1];

// let payload = JSON.parse(decodeURIComponent(escape(window.atob(payloadBase64))));

export const authReducer = createReducer(
  initialState,
  on(AuthAction.loginAction, (state) => ({ ...state, isAuthVerifying: true, tryLoginCount: state.tryLoginCount + 1 })),
  on(AuthAction.loginSuccess, (state, { loginResp, permissions }) => {
    return {
      ...state,
      jwt: decodeJWT(loginResp.accessToken),
      accessToken: loginResp.accessToken,
      refreshToken: loginResp.refreshToken,
      permissions: [...permissions],
      isAuthVerifying: false,
      isLoginSuccess: true,
      tryLoginCount: 0
    };
  }),
  on(AuthAction.loginFail, (state) => ({ ...state, isLoginSuccess: false, isAuthVerifying: false })),
  on(AuthAction.updateAccessTokenAction, (state, { accessToken }) => ({ ...state, accessToken })),
  on(AuthAction.resetAuthState, () => ({ ...initialState }))
);
