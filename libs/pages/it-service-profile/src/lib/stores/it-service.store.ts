import { inject } from '@angular/core';
import { selectCurrentProject } from '@neo-edge-web/auth-store';
import { ItServiceService, SupportAppsService } from '@neo-edge-web/global-services';
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
import { EMPTY, catchError, combineLatest, map, pipe, switchMap, take, tap } from 'rxjs';

const INIT_TABLE_PAGE = 1;
const INIT_TABLE_SIZE = 10;

const initialState: IItServiceState = {
  projectId: 0,
  dataTable: [],
  dataLength: 0,
  page: INIT_TABLE_PAGE,
  size: INIT_TABLE_SIZE,
  supportApps: [],
  isLoading: IT_SERVICE_LOADING.NONE
};

export type ItServiceStore = InstanceType<typeof ItServiceStore>;

export const ItServiceStore = signalStore(
  withState(initialState),
  withMethods(
    (store, supportAppsService = inject(SupportAppsService), itServiceService = inject(ItServiceService)) => ({
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
      getSupportApps: rxMethod<IGetSupportAppsReq>(
        pipe(
          tap(() => patchState(store, { isLoading: IT_SERVICE_LOADING.GET_APPS })),
          switchMap((payload) =>
            supportAppsService.getApps$(payload.flowGroups).pipe(
              tap(() => {
                patchState(store, { isLoading: IT_SERVICE_LOADING.REFRESH_APPS });
              }),
              map((d) => {
                patchState(store, {
                  isLoading: IT_SERVICE_LOADING.REFRESH_APPS,
                  supportApps: d.apps
                });
              }),
              catchError(() => EMPTY)
            )
          )
        )
      )
    })
  ),
  withHooks((store, globalStore = inject(Store)) => {
    return {
      onInit() {
        combineLatest([globalStore.select(selectCurrentProject)])
          .pipe(
            take(1),
            tap(([currentProjectId]) => {
              patchState(store, {
                projectId: currentProjectId.currentProjectId
              });
              console.log(currentProjectId);
              if (currentProjectId.currentProjectId) {
                store.queryDataTableByPage({ page: INIT_TABLE_PAGE, size: INIT_TABLE_SIZE });
              }
            })
          )
          .subscribe();

        store.getSupportApps({ flowGroups: SUPPORT_APPS_FLOW_GROUPS.it_service });
      }
    };
  })
);
