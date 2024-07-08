import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NeoFlowsService } from '@neo-edge-web/global-services';
import { INeoFlowState, NEOFLOW_LOADING, TTableQueryForNeoFlows } from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, map, pipe, switchMap, tap } from 'rxjs';

const INIT_TABLE_PAGE = 1;
const INIT_TABLE_SIZE = 10;

const initialState: INeoFlowState = {
  neoflows: [],
  page: INIT_TABLE_PAGE,
  size: INIT_TABLE_SIZE,
  queryKey: '',
  neoflowLength: 0,
  isLoading: NEOFLOW_LOADING.NONE
};

export type NeoflowsStore = InstanceType<typeof NeoflowsStore>;

export const NeoflowsStore = signalStore(
  withState(initialState),
  withMethods((store, dialog = inject(MatDialog), nfService = inject(NeoFlowsService)) => ({
    queryNeoFlowsTableByPage: rxMethod<TTableQueryForNeoFlows>(
      pipe(
        tap(() => patchState(store, { isLoading: NEOFLOW_LOADING.TABLE })),
        switchMap(({ page, size, name }) => {
          return nfService.neoFlowsTable$({ page: page, size: size, name: name }).pipe(
            map((d) => {
              patchState(store, {
                neoflows: d.neoflows,
                page: page,
                size,
                isLoading: NEOFLOW_LOADING.NONE,
                neoflowLength: d.total
              });
            }),
            catchError(() => EMPTY)
          );
        })
      )
    ),
    copyNeoFlow: rxMethod<{ profileId: number; name: string }>(
      pipe(
        tap(() => patchState(store, { isLoading: NEOFLOW_LOADING.COPY })),
        switchMap(({ profileId, name }) => {
          return nfService.copyNeoFlow$(profileId, name).pipe(
            map((d) => {
              patchState(store, { isLoading: NEOFLOW_LOADING.REFRESH_TABLE });
              dialog.closeAll();
            }),
            catchError(() => EMPTY)
          );
        })
      )
    ),
    deleteNeoFlow: rxMethod<{ neoflowId: number }>(
      pipe(
        tap(() => patchState(store, { isLoading: NEOFLOW_LOADING.TABLE })),
        switchMap(({ neoflowId }) => {
          return nfService.deleteNeoFlow$(neoflowId).pipe(
            map((d) => {
              patchState(store, { isLoading: NEOFLOW_LOADING.REFRESH_TABLE });
              dialog.closeAll();
            }),
            catchError(() => EMPTY)
          );
        })
      )
    )
  })),
  withHooks((store) => {
    return {
      onInit() {
        store.queryNeoFlowsTableByPage({ page: INIT_TABLE_PAGE, size: INIT_TABLE_SIZE });
      }
    };
  })
);
