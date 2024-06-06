import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GatewayDetailService, ProjectsService, REST_CONFIG, WebSocketService } from '@neo-edge-web/global-services';
import { RouterStoreService, selectCurrentProject, selectLoginState } from '@neo-edge-web/global-store';
import {
  GATEWAY_LOADING,
  GW_RUNNING_MODE,
  GW_WS_TYPE,
  GatewayDetailState,
  IEditGatewayProfileReq,
  IGatewaySystemInfo
} from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { EMPTY, catchError, combineLatest, map, pipe, switchMap, take, tap } from 'rxjs';

const initialState: GatewayDetailState = {
  projectId: 0,
  gatewayId: 0,
  gatewayDetail: null,
  isLoading: GATEWAY_LOADING.NONE,
  labels: [],
  wsRoomName: ''
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
  withHooks(
    (
      store,
      globalStore = inject(Store),
      routerStoreService = inject(RouterStoreService),
      wsService = inject(WebSocketService),
      restConfig = inject(REST_CONFIG)
    ) => {
      const dispatchWsData = {
        connectionInfo: (data: { connectionStatus: number; connectionStatusUpdatedAt: number }) =>
          patchState(store, {
            gatewayDetail: {
              ...store.gatewayDetail(),
              connectionStatus: data.connectionStatus,
              connectionStatusUpdatedAt: data.connectionStatusUpdatedAt
            }
          }),
        runningMode: (data: { currentMode: number }) =>
          patchState(store, { gatewayDetail: { ...store.gatewayDetail(), currentMode: data.currentMode } }),
        systemInfo: (data: { gatewaySystemInfo: IGatewaySystemInfo; gatewaySystemInfoUpdateAt: number }) =>
          patchState(store, {
            gatewayDetail: {
              ...store.gatewayDetail(),
              gatewaySystemInfo: { ...data.gatewaySystemInfo },
              gatewaySystemInfoUpdateAt: data.gatewaySystemInfoUpdateAt
            }
          })
      };

      return {
        onInit() {
          combineLatest([
            routerStoreService.getParams$,
            globalStore.select(selectCurrentProject),
            globalStore.select(selectLoginState)
          ])
            .pipe(
              take(1),
              map(([urlParm, curProject, loginState]) => {
                patchState(store, {
                  gatewayId: parseInt(urlParm['id']),
                  projectId: curProject.currentProjectId,
                  wsRoomName: `${loginState.jwt.fqdn}-gw-${parseInt(urlParm['id'])}`
                });
                store.getGatewayDetail();
                store.getProjectLabels();
              })
            )
            .subscribe();

          wsService
            .connect({ room: store.wsRoomName(), url: restConfig.wsPath })
            .pipe(
              map((wsAction) => {
                wsAction.data.messages.map((wsMsg) => {
                  dispatchWsData[GW_WS_TYPE[wsMsg.type]](wsMsg.data);
                });
              })
            )
            .subscribe();
        },
        onDestroy() {
          wsService.disconnect({ room: store.wsRoomName() });
        }
      };
    }
  )
);
