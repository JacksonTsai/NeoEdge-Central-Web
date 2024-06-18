import { Dialog } from '@angular/cdk/dialog';
import { inject } from '@angular/core';
import { OtDevicesService } from '@neo-edge-web/global-services';
import { selectCurrentProject } from '@neo-edge-web/global-stores';
import { IOtDevicesState, OT_DEVICES_LOADING, TTableQueryForOtDevices } from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { EMPTY, catchError, map, pipe, switchMap, tap } from 'rxjs';

const INIT_TABLE_PAGE = 1;
const INIT_TABLE_SIZE = 10;

const initialState: IOtDevicesState = {
  otDevices: [],
  page: INIT_TABLE_PAGE,
  size: INIT_TABLE_SIZE,
  queryKey: '',
  isLoading: OT_DEVICES_LOADING.NONE,
  otDevicesLength: 0,
  projectId: 0
};

export type OtDevicesStore = InstanceType<typeof OtDevicesStore>;

export const OtDevicesStore = signalStore(
  withState(initialState),
  withMethods((store, otDevicesService = inject(OtDevicesService), dialog = inject(Dialog)) => ({
    queryOtDevicesTableByPage: rxMethod<TTableQueryForOtDevices>(
      pipe(
        tap(() => patchState(store, { isLoading: OT_DEVICES_LOADING.TABLE })),
        switchMap(({ page, size, names }) => {
          return otDevicesService
            .otDevices$({
              page: page ?? INIT_TABLE_PAGE,
              size: size ?? INIT_TABLE_SIZE,
              names: names ?? ''
            })
            .pipe(
              map((d) => {
                patchState(store, {
                  otDevices: d.devices,
                  page,
                  size,
                  isLoading: OT_DEVICES_LOADING.NONE,
                  otDevicesLength: d?.total ?? 0
                });
              }),
              catchError(() => EMPTY)
            );
        })
      )
    ),
    deleteOtDevice: rxMethod<{ profileId: number; name: string }>(
      pipe(
        tap(() => patchState(store, { isLoading: OT_DEVICES_LOADING.DELETE })),
        switchMap(({ profileId, name }) =>
          otDevicesService.deleteOtDevice$(profileId, name).pipe(
            tap(() => {
              patchState(store, { isLoading: OT_DEVICES_LOADING.REFRESH_TABLE });
            }),
            tap(() => dialog.closeAll()),
            catchError(() => EMPTY)
          )
        )
      )
    ),
    copyDevice: rxMethod<{ profileId: number; name: string }>(
      pipe(
        tap(() => patchState(store, { isLoading: OT_DEVICES_LOADING.COPY })),
        switchMap(({ profileId, name }) => {
          return otDevicesService.copyDevice$(profileId, name).pipe(
            tap(() => {
              patchState(store, { isLoading: OT_DEVICES_LOADING.REFRESH_TABLE });
            }),
            tap(() => dialog.closeAll()),
            catchError(() => EMPTY)
          );
        })
      )
    )
  })),
  withHooks((store, globalStore = inject(Store)) => {
    return {
      onInit() {
        globalStore
          .select(selectCurrentProject)
          .pipe(
            tap(({ currentProjectId }) => {
              patchState(store, { projectId: currentProjectId });
              store.queryOtDevicesTableByPage({ page: INIT_TABLE_PAGE, size: INIT_TABLE_SIZE });
            })
          )
          .subscribe();
      }
    };
  })
);
