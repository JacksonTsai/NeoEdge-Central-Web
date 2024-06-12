import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ItServiceDetailService } from '@neo-edge-web/global-services';
import { IDeleteItServiceDetailReq, IT_SERVICE_DETAIL_LOADING } from '@neo-edge-web/models';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, pipe, switchMap, tap } from 'rxjs';

const initialState = {
  projectId: 0,
  itServiceId: 0,
  itServiceDetail: null,
  isLoading: IT_SERVICE_DETAIL_LOADING.NONE
};

export type ItServiceDetailStore = InstanceType<typeof ItServiceDetailStore>;

export const ItServiceDetailStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      router = inject(Router),
      dialog = inject(MatDialog),
      itServiceDetailService = inject(ItServiceDetailService)
    ) => ({
      deleteItService: rxMethod<IDeleteItServiceDetailReq>(
        pipe(
          tap(() => patchState(store, { isLoading: IT_SERVICE_DETAIL_LOADING.DELETE })),
          switchMap((payload) =>
            itServiceDetailService.deleteItService$(payload).pipe(
              tap(() => {
                patchState(store, { isLoading: IT_SERVICE_DETAIL_LOADING.NONE });
                router.navigate(['neoflow/it-service-profile']);
                dialog.closeAll();
              }),
              catchError(() => EMPTY)
            )
          )
        )
      )
    })
  )
);
