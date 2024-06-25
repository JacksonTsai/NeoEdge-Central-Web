import { inject } from '@angular/core';
import { selectCurrentProject } from '@neo-edge-web/auth-store';
import {
  GatewaysService,
  ItServiceService,
  OtDevicesService,
  ProjectsService,
  SupportAppsService,
  UsersService
} from '@neo-edge-web/global-services';
import { DASHBOARD_LOADING, IDashboardState, SUPPORT_APPS_FLOW_GROUPS } from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { EMPTY, catchError, pipe, switchMap, tap } from 'rxjs';

const initialState: IDashboardState = {
  isLoading: DASHBOARD_LOADING.NONE,
  projectId: 0,
  projectDetail: null,
  usersList: [],
  gatewaysList: [],
  itList: [],
  itApps: [],
  otList: [],
  otApps: []
};

export type DashboardStore = InstanceType<typeof DashboardStore>;

export const DashboardStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      usersService = inject(UsersService),
      projectsService = inject(ProjectsService),
      gatewaysService = inject(GatewaysService),
      itServiceService = inject(ItServiceService),
      otDevicesService = inject(OtDevicesService),
      supportAppsService = inject(SupportAppsService)
    ) => ({
      getProjectDetail: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: DASHBOARD_LOADING.GET })),
          switchMap(() =>
            projectsService.getProjectById$(store.projectId()).pipe(
              tap((d) => patchState(store, { projectDetail: d, isLoading: DASHBOARD_LOADING.NONE })),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      getAllUsers: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: DASHBOARD_LOADING.GET })),
          switchMap(() =>
            usersService.users$().pipe(
              tap((d) => patchState(store, { usersList: d.users, isLoading: DASHBOARD_LOADING.NONE })),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      getAllGateways: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: DASHBOARD_LOADING.GET })),
          switchMap(() =>
            gatewaysService.gatewaysByProjectId$(store.projectId()).pipe(
              tap((d) => patchState(store, { gatewaysList: d.gateways, isLoading: DASHBOARD_LOADING.NONE })),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      getAllItServiceProfiles: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: DASHBOARD_LOADING.GET })),
          switchMap(() =>
            itServiceService.getItService$().pipe(
              tap((d) => patchState(store, { itList: d.itServices, isLoading: DASHBOARD_LOADING.NONE })),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      getAllOtDeviceProfiles: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: DASHBOARD_LOADING.GET })),
          switchMap(() =>
            otDevicesService.otDevices$().pipe(
              tap((d) => patchState(store, { otList: d.devices, isLoading: DASHBOARD_LOADING.NONE })),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      getSupportApps: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: DASHBOARD_LOADING.GET })),
          switchMap(() =>
            supportAppsService.getApps$(SUPPORT_APPS_FLOW_GROUPS.it_service).pipe(
              tap((d) => {
                patchState(store, { itApps: d.apps, isLoading: DASHBOARD_LOADING.NONE });
              }),
              catchError(() => EMPTY)
            )
          ),
          switchMap(() =>
            supportAppsService.getApps$(SUPPORT_APPS_FLOW_GROUPS.ot_device).pipe(
              tap((d) => {
                patchState(store, { otApps: d.apps, isLoading: DASHBOARD_LOADING.NONE });
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
        store.getSupportApps();

        globalStore
          .select(selectCurrentProject)
          .pipe(
            tap(({ currentProjectId }) => {
              patchState(store, { projectId: currentProjectId });
              if (currentProjectId) {
                store.getProjectDetail();
                store.getAllUsers();
                store.getAllItServiceProfiles();
                store.getAllOtDeviceProfiles();
                store.getAllGateways();
              }
            })
          )
          .subscribe();
      }
    };
  })
);
