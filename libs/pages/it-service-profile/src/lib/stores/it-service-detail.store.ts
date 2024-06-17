import { inject } from '@angular/core';
import { selectCurrentProject } from '@neo-edge-web/auth-store';
import { ItServiceService } from '@neo-edge-web/global-services';
import { RouterStoreService } from '@neo-edge-web/global-stores';
import { IItServiceDetailState, IT_SERVICE_DETAIL_LOADING } from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { EMPTY, catchError, combineLatest, map, pipe, switchMap, take, tap } from 'rxjs';

const initialState: IItServiceDetailState = {
  projectId: 0,
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
    )
  })),
  withHooks((store, globalStore = inject(Store), routerStoreService = inject(RouterStoreService)) => {
    return {
      onInit() {
        combineLatest([routerStoreService.getParams$, globalStore.select(selectCurrentProject)])
          .pipe(
            take(1),
            map(([urlParm, curProject]) => {
              patchState(store, {
                itServiceId: parseInt(urlParm['id']),
                projectId: curProject.currentProjectId
              });
              store.getItServiceDetail();
            })
          )
          .subscribe();
      }
    };
  })
);
