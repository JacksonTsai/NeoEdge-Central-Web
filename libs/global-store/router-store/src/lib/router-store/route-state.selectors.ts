import { RouterState } from '@neo-edge-web/models';
import { RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectRouterState = createFeatureSelector<RouterReducerState<RouterState>>('router');

export const selectParams = createSelector(selectRouterState, (router) => router?.state?.params);

export const selectQueryParams = createSelector(selectRouterState, (router) => router?.state?.queryParams);

export const selectUrl = createSelector(selectRouterState, (router) => router?.state?.url);

export const selectDataFromRouter = createSelector(selectRouterState, (router) => router?.state?.data);
