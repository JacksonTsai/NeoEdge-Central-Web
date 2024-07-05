import { inject } from '@angular/core';
import { selectCurrentProject } from '@neo-edge-web/auth-store';
import {
  EventsService,
  GatewaysService,
  ItServiceService,
  OtDevicesService,
  ProjectsService,
  SupportAppsService,
  UsersService
} from '@neo-edge-web/global-services';
import {
  DASHBOARD_LOADING,
  IDashboardState,
  IGetEventDocResp,
  IGetProjectEventLogsReq,
  IGetProjectEventLogsResp,
  SUPPORT_APPS_FLOW_GROUPS,
  TUpdateProjectEventDataMode
} from '@neo-edge-web/models';
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
  otApps: [],
  eventsDoc: {},
  activitiesList: null,
  activitiesTime: null
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
      supportAppsService = inject(SupportAppsService),
      eventsService = inject(EventsService)
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
      ),
      getActivities: rxMethod<{ type: TUpdateProjectEventDataMode; params: IGetProjectEventLogsReq }>(
        pipe(
          tap(({ type }) =>
            patchState(store, {
              isLoading: type === 'GET' ? DASHBOARD_LOADING.GET : DASHBOARD_LOADING.UPDATE_ACTIVITIES
            })
          ),
          switchMap(({ type, params }) => {
            return projectsService.getProjectEventLogs$(params).pipe(
              tap((d: IGetProjectEventLogsResp) =>
                patchState(store, {
                  activitiesList: {
                    events: type === 'GET' ? d.events : [...store.activitiesList().events, ...d.events],
                    lastEvaluatedKey: d.lastEvaluatedKey
                  },
                  isLoading: DASHBOARD_LOADING.NONE
                })
              ),
              catchError(() => EMPTY)
            );
          })
        )
      ),
      set24hoursStartEndTime: () => {
        const now = new Date();
        const past = new Date(now.getTime() - 24 * 60 * 60 * 1000 * 30);
        patchState(store, {
          activitiesTime: {
            start: Math.floor(past.getTime() / 1000),
            end: Math.floor(now.getTime() / 1000)
          }
        });
      },
      getEventsDoc: rxMethod<void>(
        pipe(
          switchMap(() =>
            eventsService.getEventsDoc$().pipe(
              tap((d: IGetEventDocResp) =>
                patchState(store, { eventsDoc: d.events, isLoading: DASHBOARD_LOADING.NONE })
              ),
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
        store.getEventsDoc();
        store.set24hoursStartEndTime();

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

                const activitiesParams: IGetProjectEventLogsReq = {
                  size: 10,
                  order: 'desc',
                  timeGe: store.activitiesTime().start,
                  timeLe: store.activitiesTime().end
                };
                store.getActivities({ type: 'GET', params: activitiesParams });
              }
            })
          )
          .subscribe();
      }
    };
  })
);
