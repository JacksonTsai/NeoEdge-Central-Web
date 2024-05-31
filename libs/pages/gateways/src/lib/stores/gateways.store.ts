import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { selectCurrentProject } from '@neo-edge-web/auth-store';
import { GatewaysService, IpcsService, ProjectsService } from '@neo-edge-web/global-service';
import {
  GATEWAYS_LOADING,
  GatewaysState,
  IAddGatewayReq,
  IProjectLabelsReqResp,
  TableQueryForGateways
} from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { EMPTY, catchError, combineLatest, map, pipe, switchMap, tap } from 'rxjs';

const INIT_TABLE_PAGE = 1;
const INIT_TABLE_SIZE = 10;

const initialState: GatewaysState = {
  projectId: 0,
  gatewayTable: [],
  page: INIT_TABLE_PAGE,
  size: INIT_TABLE_SIZE,
  queryKey: '',
  isLoading: GATEWAYS_LOADING.NONE,
  labels: [],
  gatewaysLength: 0,
  partnersIpc: [],
  customOs: []
};

export type GatewaysStore = InstanceType<typeof GatewaysStore>;

export const GatewaysStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      dialog = inject(MatDialog),
      gwService = inject(GatewaysService),
      ipcService = inject(IpcsService),
      projectsService = inject(ProjectsService)
    ) => ({
      queryGatewayTableByPage: rxMethod<TableQueryForGateways>(
        pipe(
          tap(() => patchState(store, { isLoading: GATEWAYS_LOADING.TABLE })),
          switchMap(({ page, size, names, labelIds }) => {
            return gwService
              .gatewaysByProjectId$(store.projectId(), {
                page: page ?? INIT_TABLE_PAGE,
                size: size ?? INIT_TABLE_SIZE,
                names: names ?? '',
                labelIds: labelIds
              })
              .pipe(
                map((d) => {
                  patchState(store, {
                    gatewayTable: d.gateways,
                    page: page,
                    size,
                    isLoading: GATEWAYS_LOADING.NONE,
                    gatewaysLength: d.total
                  });
                }),
                catchError(() => EMPTY)
              );
          })
        )
      ),
      addGateway: rxMethod<IAddGatewayReq>(
        pipe(
          tap(() => patchState(store, { isLoading: GATEWAYS_LOADING.ADD_GATEWAY })),
          switchMap((payload) =>
            gwService.addGateway$(payload).pipe(
              tap(() => {
                patchState(store, { isLoading: GATEWAYS_LOADING.REFRESH_TABLE });
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
      ),
      editProjectLabels: rxMethod<{ payload: IProjectLabelsReqResp }>(
        pipe(
          switchMap(({ payload }) =>
            projectsService.editProjectLabels$(store.projectId(), payload).pipe(
              tap(() => patchState(store, { isLoading: GATEWAYS_LOADING.REFRESH_LABEL })),
              tap(() => dialog.closeAll()),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      ipcOs: rxMethod<void>(
        pipe(
          switchMap(() =>
            combineLatest([ipcService.customIpcOS$, ipcService.partnersIpc$]).pipe(
              map(([customIpcOS, partnersIpc]) => {
                patchState(store, { customOs: customIpcOS.oss, partnersIpc: partnersIpc.partners });
              })
            )
          )
        )
      )
    })
  ),
  withHooks((store, globalStore = inject(Store)) => {
    return {
      onInit() {
        globalStore.select(selectCurrentProject).subscribe(({ currentProjectId }) => {
          patchState(store, { projectId: currentProjectId });
          store.queryGatewayTableByPage({ page: INIT_TABLE_PAGE, size: INIT_TABLE_SIZE });
          store.getProjectLabels();
          store.ipcOs();
        });
      }
    };
  })
);
