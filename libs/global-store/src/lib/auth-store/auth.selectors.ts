import { IAuthState } from '@neo-edge-web/models';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectAuthState = createFeatureSelector<IAuthState>('auth');

export const selectAuthToken = createSelector(selectAuthState, (state) => ({
  accessToken: state.accessToken,
  refreshToken: state.refreshToken
}));

export const selectLoginState = createSelector(selectAuthState, (state) => ({
  isLoginSuccess: state.isLoginSuccess,
  tryLoginCount: state.tryLoginCount,
  isAuthVerifying: state.isAuthVerifying,
  jwt: state.jwt,
  permissions: state.permissions
}));
