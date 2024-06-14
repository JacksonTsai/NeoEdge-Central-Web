import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { selectCurrentProject } from '@neo-edge-web/auth-store';
import { ItServiceDetailService, ItServiceService, SupportAppsService } from '@neo-edge-web/global-services';
import {
  ICreateItServiceReq,
  IGetSupportAppsReq,
  IItServiceState,
  IT_SERVICE_LOADING,
  SUPPORT_APPS_FLOW_GROUPS,
  TableQueryForItService
} from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { EMPTY, catchError, map, pipe, switchMap, tap } from 'rxjs';

const INIT_TABLE_PAGE = 1;
const INIT_TABLE_SIZE = 10;

const initialState: IItServiceState = {
  projectId: 0,
  dataTable: [],
  dataLength: 0,
  page: INIT_TABLE_PAGE,
  size: INIT_TABLE_SIZE,
  supportApps: [],
  connections: [],
  isLoading: IT_SERVICE_LOADING.NONE
};

export type ItServiceStore = InstanceType<typeof ItServiceStore>;

export const ItServiceStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      dialog = inject(MatDialog),
      supportAppsService = inject(SupportAppsService),
      itServiceService = inject(ItServiceService),
      itServiceDetailService = inject(ItServiceDetailService)
    ) => ({
      queryDataTableByPage: rxMethod<TableQueryForItService>(
        pipe(
          tap(() => patchState(store, { isLoading: IT_SERVICE_LOADING.TABLE })),
          switchMap(({ page, size, names }) => {
            return itServiceService
              .getItService$(store.projectId(), {
                page: page ?? INIT_TABLE_PAGE,
                size: size ?? INIT_TABLE_SIZE,
                names: names ?? ''
              })
              .pipe(
                map((d) => {
                  const connectionOpts = store.connections();
                  const supportApps = store.supportApps();

                  d.itServices.map((item) => {
                    const { connection } = itServiceDetailService.apiToFieldData(item);
                    let connectionLabel = connectionOpts.find((v) => v.value === connection).label;
                    if (!connectionLabel) {
                      connectionLabel = item.appVersionId === 3 ? `MQTT(${connection})` : `HTTP(${connection})`;
                    }
                    item.connectionLabel = connectionLabel;

                    const appVersionData = supportAppsService.getAppVersionData(item.appVersionId, supportApps);
                    item.type = appVersionData;

                    return item;
                  });

                  patchState(store, {
                    dataTable: d.itServices,
                    page,
                    size,
                    isLoading: IT_SERVICE_LOADING.NONE,
                    dataLength: d.total
                  });
                }),
                catchError(() => EMPTY)
              );
          })
        )
      ),
      createItService: rxMethod<ICreateItServiceReq>(
        pipe(
          tap(() => patchState(store, { isLoading: IT_SERVICE_LOADING.CREATE })),
          switchMap((payload) =>
            itServiceService.createItService$(payload).pipe(
              tap(() => {
                patchState(store, { isLoading: IT_SERVICE_LOADING.REFRESH_TABLE });
              }),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      deleteItService: rxMethod<{ profileId: number; name: string }>(
        pipe(
          tap(() => patchState(store, { isLoading: IT_SERVICE_LOADING.DELETE })),
          switchMap(({ profileId, ...payload }) =>
            itServiceService.deleteItServiceDetail$(profileId, payload).pipe(
              tap(() => {
                patchState(store, { isLoading: IT_SERVICE_LOADING.REFRESH_TABLE });
              }),
              tap(() => dialog.closeAll()),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      getSupportApps: rxMethod<IGetSupportAppsReq>(
        pipe(
          tap(() => patchState(store, { isLoading: IT_SERVICE_LOADING.GET_APPS })),
          switchMap((payload) =>
            supportAppsService.getApps$(payload.flowGroups).pipe(
              map((d) => {
                patchState(store, {
                  isLoading: IT_SERVICE_LOADING.NONE,
                  supportApps: d.apps
                });
              }),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      getAllConnection: () => {
        patchState(store, { connections: itServiceDetailService.getConnection() });
      }
    })
  ),
  withHooks((store, globalStore = inject(Store)) => {
    return {
      onInit() {
        store.getAllConnection();
        store.getSupportApps({ flowGroups: SUPPORT_APPS_FLOW_GROUPS.it_service });

        globalStore
          .select(selectCurrentProject)
          .pipe(
            tap(({ currentProjectId }) => {
              patchState(store, { projectId: currentProjectId });
              store.queryDataTableByPage({ page: INIT_TABLE_PAGE, size: INIT_TABLE_SIZE });
            })
          )
          .subscribe();
      }
    };
  })
);
