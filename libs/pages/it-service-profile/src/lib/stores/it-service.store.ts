import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ItServiceDetailService, ItServiceService, SupportAppsService } from '@neo-edge-web/global-services';
import {
  ICreateItServiceReq,
  IItServiceState,
  IT_SERVICE_LOADING,
  SUPPORT_APPS_FLOW_GROUPS,
  TableQueryForItService
} from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, map, pipe, switchMap, tap } from 'rxjs';

const INIT_TABLE_PAGE = 1;
const INIT_TABLE_SIZE = 10;

const initialState: IItServiceState = {
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
      router = inject(Router),
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
              .getItService$({
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
                    if (connection) {
                      let connectionLabel = connectionOpts.find((v) => v.value === connection)?.label;
                      if (!connectionLabel) {
                        connectionLabel = item.appVersionId === 3 ? `MQTT(${connection})` : `HTTP(${connection})`;
                      }
                      item.connectionLabel = connectionLabel;
                    }

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
                catchError((err) => {
                  throw err;
                })
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
                router.navigate([`neoflow/it-service-profile`]);
              }),
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
      copyItService: rxMethod<any>(
        pipe(
          tap(() => patchState(store, { isLoading: IT_SERVICE_LOADING.COPY })),
          switchMap((payload) => {
            return itServiceService.copyItServiceDetail$(payload.profileId, { name: payload.name }).pipe(
              tap(() => {
                patchState(store, { isLoading: IT_SERVICE_LOADING.REFRESH_TABLE });
              }),
              tap(() => dialog.closeAll()),
              catchError(() => EMPTY)
            );
          })
        )
      ),
      getAllConnection: () => {
        patchState(store, { connections: itServiceDetailService.getConnection() });
      }
    })
  ),
  withHooks((store, supportAppsService = inject(SupportAppsService)) => {
    return {
      onInit() {
        store.getAllConnection();
        supportAppsService
          .getApps$(SUPPORT_APPS_FLOW_GROUPS.it_service)
          .pipe(
            map((d) => {
              patchState(store, {
                isLoading: IT_SERVICE_LOADING.NONE,
                supportApps: d.apps
              });
              store.queryDataTableByPage({ page: INIT_TABLE_PAGE, size: INIT_TABLE_SIZE });
            }),
            catchError(() => EMPTY)
          )
          .subscribe();
      }
    };
  })
);
