import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  EventsService,
  GatewayDetailService,
  ProjectsService,
  REST_CONFIG,
  WebSocketService
} from '@neo-edge-web/global-services';
import { RouterStoreService, selectCurrentProject, selectLoginState } from '@neo-edge-web/global-stores';
import {
  GATEWAY_LOADING,
  GATEWAY_SSH_STATUS,
  GW_RUNNING_MODE,
  GW_WS_TYPE,
  GatewayDetailState,
  IDownloadGatewayEventLogsReq,
  IEditGatewayProfileReq,
  IGatewaySSHWsResp,
  IGatewaySystemInfo,
  IGetEventDocResp,
  IGetEventLogsResp,
  IRebootReq,
  TGetGatewayEventLogsReq
} from '@neo-edge-web/models';
import { datetimeFormat, downloadCSV } from '@neo-edge-web/utils';
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
  sshStatus: {
    current: null,
    ws: null
  },
  eventDoc: null,
  eventLogsList: null,
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
      projectsService = inject(ProjectsService),
      eventsService = inject(EventsService)
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
              tap(() => {
                patchState(store, { isLoading: GATEWAY_LOADING.REFRESH_GATEWAY_DETAIL });
                dialog.closeAll();
              }),
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
      rebootSchedule: rxMethod<{ rebootSchedule: IRebootReq }>(
        pipe(
          switchMap((d: { rebootSchedule }) =>
            gwDetailService.rebootSchedule$(store.gatewayId(), d.rebootSchedule).pipe(
              tap(() => {
                patchState(store, {
                  gatewayDetail: {
                    ...store.gatewayDetail(),
                    rebootSchedule: { ...d.rebootSchedule.rebootSchedule }
                  }
                });
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
            projectsService.getProjectLabels$().pipe(
              tap((d) => {
                patchState(store, { labels: d.labels });
              }),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      getSSHStatus: rxMethod<void>(
        pipe(
          switchMap(() =>
            gwDetailService.getGatewaySSH$(store.gatewayId()).pipe(
              tap((d) => {
                patchState(store, { sshStatus: { ...store.sshStatus(), current: d }, isLoading: GATEWAY_LOADING.NONE });
              }),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      updateSSHStatus: rxMethod<{ enabled: GATEWAY_SSH_STATUS }>(
        pipe(
          tap(() => patchState(store, { isLoading: GATEWAY_LOADING.CONNECT_SSH })),
          switchMap(({ enabled }) =>
            gwDetailService.updateGatewaySSH$(store.gatewayId(), enabled).pipe(catchError(() => EMPTY))
          )
        )
      ),
      getEventLogsList: rxMethod<TGetGatewayEventLogsReq>(
        pipe(
          tap(({ type }) =>
            patchState(store, {
              isLoading: type === 'GET' ? GATEWAY_LOADING.GET_LOG : GATEWAY_LOADING.UPDATE_LOG
            })
          ),
          switchMap(({ type, params }) => {
            return gwDetailService.getGatewayEventLogs$(store.gatewayId(), params).pipe(
              tap((d: IGetEventLogsResp) =>
                patchState(store, {
                  eventLogsList: {
                    events: type === 'GET' ? d.events : [...store.eventLogsList().events, ...d.events],
                    lastEvaluatedKey: d.lastEvaluatedKey
                  },
                  isLoading: GATEWAY_LOADING.NONE
                })
              ),
              catchError(() => EMPTY)
            );
          })
        )
      ),
      getEventDoc: rxMethod<void>(
        pipe(
          switchMap(() =>
            eventsService.getEventDoc$().pipe(
              tap((d: IGetEventDocResp) => patchState(store, { eventDoc: d.events })),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      downloadEventLogsCsv: rxMethod<IDownloadGatewayEventLogsReq>(
        pipe(
          tap(() => patchState(store, { isLoading: GATEWAY_LOADING.DOWNLOAD_LOG })),
          switchMap((params) => {
            return gwDetailService.downloadGatewayEventLogs$(store.gatewayId(), params).pipe(
              tap((data: ArrayBuffer) => {
                const start = datetimeFormat(params.timeGe, null, false);
                const end = datetimeFormat(params.timeLe, null, false);
                downloadCSV(data, `NeoEdge_Gateway[${[store.gatewayDetail().name]}]_Log_${start}-${end}.csv`, true);
                patchState(store, { isLoading: GATEWAY_LOADING.NONE });
              }),
              catchError(() => EMPTY)
            );
          })
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
          }),
        ssh: (data: IGatewaySSHWsResp) => {
          patchState(store, {
            sshStatus: {
              ...store.sshStatus(),
              ws: { ...data }
            },
            isLoading: GATEWAY_LOADING.REFRESH_SSH
          });
        }
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
                  wsRoomName: `${loginState.jwt.fqdn}:gw:${parseInt(urlParm['id'])}`
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
