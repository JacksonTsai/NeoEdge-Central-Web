import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GatewayDetailService, ProjectsService } from '@neo-edge-web/global-service';
import { RouterStoreService, selectCurrentProject } from '@neo-edge-web/global-store';
import { GATEWAY_LOADING, GW_RUNNING_MODE, GatewayDetailState, IEditGatewayProfileReq } from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { EMPTY, catchError, combineLatest, map, pipe, switchMap, tap } from 'rxjs';

const initialState: GatewayDetailState = {
  projectId: 0,
  gatewayId: 0,
  gatewayDetail: null,
  isLoading: GATEWAY_LOADING.NONE,
  labels: []
};

export type GatewayDetailStore = InstanceType<typeof GatewayDetailStore>;

export const GatewayDetailStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      dialog = inject(MatDialog),
      router = inject(Router),
      gwDetailService = inject(GatewayDetailService),
      projectsService = inject(ProjectsService)
    ) => ({
      getGatewayDetail: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: GATEWAY_LOADING.GET_DETAIL })),
          switchMap(() => {
            return gwDetailService.gatewayDetail$(store.gatewayId()).pipe(
              map((data) => {
                patchState(store, {
                  gatewayDetail: data,
                  isLoading: GATEWAY_LOADING.NONE
                });
              }),
              catchError(() => EMPTY)
            );
          })
        )
      ),
      editGatewayProfile: rxMethod<{ gatewayProfile: IEditGatewayProfileReq; gatewayIcon: File }>(
        pipe(
          tap(() => patchState(store, { isLoading: GATEWAY_LOADING.EDIT_METADATA })),
          switchMap(({ gatewayProfile, gatewayIcon }) =>
            gwDetailService.editGatewayProfile$(store.gatewayId(), gatewayProfile, gatewayIcon).pipe(
              tap(() => {
                patchState(store, { isLoading: GATEWAY_LOADING.REFRESH_GATEWAY_DETAIL });
              }),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      syncGatewayProfile: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: GATEWAY_LOADING.SYNC_GW_PROFILE })),
          switchMap(() =>
            gwDetailService.syncGatewayProfile$(store.gatewayId()).pipe(
              tap(() => {
                patchState(store, { isLoading: GATEWAY_LOADING.NONE });
              }),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      getInstallCommand: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: GATEWAY_LOADING.GET_INSTALL_COMMAND })),
          switchMap(() =>
            gwDetailService.getInstallCommand$(store.gatewayId()).pipe(
              tap(() => {
                patchState(store, { isLoading: GATEWAY_LOADING.NONE });
              }),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      switchRunningMode: rxMethod<{ mode: GW_RUNNING_MODE; name?: string }>(
        pipe(
          tap(() => patchState(store, { isLoading: GATEWAY_LOADING.SWITCH_RUNNING_MODE })),
          switchMap(({ mode, name }) =>
            gwDetailService.switchRunningMode$(store.gatewayId(), mode, name).pipe(
              tap(() => patchState(store, { isLoading: GATEWAY_LOADING.REFRESH_GATEWAY_DETAIL })),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      deleteGateway: rxMethod<{ name: string }>(
        pipe(
          tap(() => patchState(store, { isLoading: GATEWAY_LOADING.DELETE_GW })),
          switchMap(({ name }) =>
            gwDetailService.deleteGateway$(store.gatewayId(), name).pipe(
              tap(() => {
                patchState(store, { isLoading: GATEWAY_LOADING.NONE });
                router.navigate(['project/gateways']);
                dialog.closeAll();
              }),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      getProjectLabels: rxMethod<void>(
        pipe(
          switchMap(() =>
            projectsService.getProjectLabels$(store.projectId()).pipe(
              tap((d) => {
                patchState(store, { labels: d.labels });
              }),
              catchError(() => EMPTY)
            )
          )
        )
      )
    })
  ),
  withHooks((store, globalStore = inject(Store), routerStoreService = inject(RouterStoreService)) => {
    return {
      onInit() {
        combineLatest([routerStoreService.getParams$, globalStore.select(selectCurrentProject)])
          .pipe(
            map(([urlParm, curProject]) => {
              patchState(store, { gatewayId: parseInt(urlParm['id']), projectId: curProject.currentProjectId });
              store.getGatewayDetail();
              store.getProjectLabels();
            })
          )
          .subscribe();
      }
    };
  })
);
