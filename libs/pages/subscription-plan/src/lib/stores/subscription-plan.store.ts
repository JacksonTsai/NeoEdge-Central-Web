import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionPlanService } from '@neo-edge-web/global-services';
import { IUpgradePlanReq, SUBSCRIPTION_LOADING, SubscriptionPlanState } from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, map, pipe, switchMap, tap } from 'rxjs';

const initialState: SubscriptionPlanState = {
  currentPlan: null,
  isLoading: SUBSCRIPTION_LOADING.NONE
};

export type SubscriptionPlanStore = InstanceType<typeof SubscriptionPlanStore>;

export const SubscriptionPlanStore = signalStore(
  withState(initialState),
  withMethods((store, dialog = inject(MatDialog), subscriptionService = inject(SubscriptionPlanService)) => ({
    currentSubscriptPlan: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: SUBSCRIPTION_LOADING.GET_CURRENT_PLAN })),
        switchMap(() =>
          subscriptionService.currentPlan$().pipe(
            map((d) => {
              patchState(store, {
                currentPlan: d,
                isLoading: SUBSCRIPTION_LOADING.NONE
              });
            }),
            catchError(() => EMPTY)
          )
        )
      )
    ),
    upgradePlan: rxMethod<{ payload: IUpgradePlanReq }>(
      pipe(
        tap(() => patchState(store, { isLoading: SUBSCRIPTION_LOADING.SEND_UPGRADE })),
        switchMap(({ payload }) =>
          subscriptionService.upgradePlan$(payload).pipe(
            tap(() => patchState(store, { isLoading: SUBSCRIPTION_LOADING.SEND_SUCCESS })),
            catchError(() => {
              patchState(store, { isLoading: SUBSCRIPTION_LOADING.NONE });
              return EMPTY;
            })
          )
        )
      )
    )
  })),
  withHooks((store) => {
    return {
      onInit() {
        store.currentSubscriptPlan();
      }
    };
  })
);
