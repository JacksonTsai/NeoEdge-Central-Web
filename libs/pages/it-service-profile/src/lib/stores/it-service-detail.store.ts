import { inject } from '@angular/core';
import { ItServiceService } from '@neo-edge-web/global-services';
import { RouterStoreService } from '@neo-edge-web/global-stores';
import { IItServiceDetailState, IT_SERVICE_DETAIL_LOADING, IUpdateItServiceDetailReq } from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, combineLatest, map, pipe, switchMap, take, tap } from 'rxjs';

const initialState: IItServiceDetailState = {
  itServiceId: 0,
  itServiceDetail: null,
  isLoading: IT_SERVICE_DETAIL_LOADING.NONE
};

export type ItServiceDetailStore = InstanceType<typeof ItServiceDetailStore>;

export const ItServiceDetailStore = signalStore(
  withState(initialState),
  withMethods((store, itServiceService = inject(ItServiceService)) => ({
    getItServiceDetail: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: IT_SERVICE_DETAIL_LOADING.GET_DETAIL })),
        switchMap(() =>
          itServiceService.getItServiceDetail$(store.itServiceId()).pipe(
            map((data) => {
              patchState(store, {
                itServiceDetail: data,
                isLoading: IT_SERVICE_DETAIL_LOADING.NONE
              });
            }),
            catchError(() => EMPTY)
          )
        )
      )
    ),
    updateItServiceDetail: rxMethod<IUpdateItServiceDetailReq>(
      pipe(
        tap(() => patchState(store, { isLoading: IT_SERVICE_DETAIL_LOADING.GET_DETAIL })),
        switchMap((payload) =>
          itServiceService.updateItServiceDetail$(store.itServiceId(), payload).pipe(
            map(() => {
              patchState(store, {
                itServiceDetail: { ...store.itServiceDetail(), ...payload },
                isLoading: IT_SERVICE_DETAIL_LOADING.REFRESH
              });
            }),
            catchError(() => EMPTY)
          )
        )
      )
    )
  })),
  withHooks((store, routerStoreService = inject(RouterStoreService)) => {
    return {
      onInit() {
        combineLatest([routerStoreService.getParams$])
          .pipe(
            take(1),
            map(([urlParm]) => {
              patchState(store, {
                itServiceId: parseInt(urlParm['id'])
              });
              store.getItServiceDetail();
            })
          )
          .subscribe();
      }
    };
  })
);
