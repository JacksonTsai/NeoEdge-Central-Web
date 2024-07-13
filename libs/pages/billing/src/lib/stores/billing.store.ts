import { inject } from '@angular/core';
import { BillingService } from '@neo-edge-web/global-services';
import {
  BILLING_LOADING,
  IBiilingState,
  IBillingEstimateResp,
  IBillingReq,
  IBillingTimeRecord,
  IGetBillingResp
} from '@neo-edge-web/models';
import { getCurrentDateInfo } from '@neo-edge-web/utils';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, pipe, switchMap, tap } from 'rxjs';

const initialState: IBiilingState = {
  isLoading: BILLING_LOADING.NONE,
  timeRecord: null,
  estimate: null,
  monthUsageFee: null,
  pastUsageFee: null,
  billingRecords: null
};

export type BillingdStore = InstanceType<typeof BillingdStore>;

export const BillingdStore = signalStore(
  withState(initialState),
  withMethods((store, billingService = inject(BillingService)) => ({
    setTimeRecord: (): void => {
      const now = new Date();
      const monthInfo = getCurrentDateInfo(now);
      const pastMonths = 12;
      const timeRecord: IBillingTimeRecord = {
        days: monthInfo.days,
        today: monthInfo.today,
        monthStart: monthInfo.firstDayOfMonth,
        monthEnd: monthInfo.lastDayOfMonth,
        pastMonths: pastMonths,
        pastStart: monthInfo.twelveMonthsAgoFirstDay,
        monthEndUTC: monthInfo.lastDayUTC
      };
      patchState(store, { timeRecord });
    },
    getCompanyUsageFee: rxMethod<IBillingReq>(
      pipe(
        tap(() =>
          patchState(store, {
            isLoading: BILLING_LOADING.GET
          })
        ),
        switchMap(({ type, params }) => {
          const storeKey = type === 'fullMonth' ? 'monthUsageFee' : 'pastUsageFee';
          return billingService.getCompanyFee$(params).pipe(
            tap((d: IGetBillingResp) => patchState(store, { [storeKey]: d, isLoading: BILLING_LOADING.NONE })),
            catchError(() => EMPTY)
          );
        })
      )
    ),
    getCompanyUsageFeeEstimate: rxMethod<void>(
      pipe(
        tap(() =>
          patchState(store, {
            isLoading: BILLING_LOADING.GET
          })
        ),
        switchMap(() =>
          billingService.getCompanyFeeEstimate$().pipe(
            tap((d: IBillingEstimateResp) => patchState(store, { estimate: d, isLoading: BILLING_LOADING.NONE })),
            catchError(() => EMPTY)
          )
        )
      )
    )
  })),
  withHooks((store) => {
    return {
      onInit() {
        store.setTimeRecord();
        store.getCompanyUsageFeeEstimate();
      }
    };
  })
);
