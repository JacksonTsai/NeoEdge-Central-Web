import { inject } from '@angular/core';
import { LicenseService } from '@neo-edge-web/global-services';
import {
  ICompanyLicense,
  IGetCompanyOrdersResp,
  ILicenseState,
  LICENSE_LOADING,
  TableQueryForCompanyOrder
} from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, pipe, switchMap, tap } from 'rxjs';

const INIT_ORDER_PAGE = 1;
const INIT_ORDER_SIZE = 10;
const INIT_ORDER_SORT = 'date';

const initialState: ILicenseState = {
  isLoading: LICENSE_LOADING.NONE,
  companyLicenses: [],
  companyOrders: [],
  page: INIT_ORDER_PAGE,
  size: INIT_ORDER_SIZE,
  dataLength: 0
};

export type LicenseStore = InstanceType<typeof LicenseStore>;

export const LicenseStore = signalStore(
  withState(initialState),
  withMethods((store, licenseService = inject(LicenseService)) => ({
    getCompanyLicense: rxMethod<void>(
      pipe(
        tap(() =>
          patchState(store, {
            isLoading: LICENSE_LOADING.GET
          })
        ),
        switchMap(() => {
          return licenseService.getCompanyLicense$().pipe(
            tap((d: ICompanyLicense[]) => patchState(store, { companyLicenses: d, isLoading: LICENSE_LOADING.NONE })),
            catchError(() => EMPTY)
          );
        })
      )
    ),
    getCompanyOrders: rxMethod<TableQueryForCompanyOrder>(
      pipe(
        tap(() =>
          patchState(store, {
            isLoading: LICENSE_LOADING.GET
          })
        ),
        switchMap(({ page, size, sort }) => {
          return licenseService
            .getCompanyOrders$({
              page: page ?? INIT_ORDER_PAGE,
              size: size ?? INIT_ORDER_SIZE,
              sort: sort ?? INIT_ORDER_SORT
            })
            .pipe(
              tap((d: IGetCompanyOrdersResp) =>
                patchState(store, { companyOrders: d.orders, dataLength: d.total, isLoading: LICENSE_LOADING.NONE })
              ),
              catchError(() => EMPTY)
            );
        })
      )
    )
  })),
  withHooks((store) => {
    return {
      onInit() {
        store.getCompanyOrders({ page: INIT_ORDER_PAGE, size: INIT_ORDER_SIZE });
        // store.getCompanyLicense();
      }
    };
  })
);
