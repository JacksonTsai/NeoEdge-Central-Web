import { inject } from '@angular/core';
import { OtDevicesService, OtTexolService, SupportAppsService } from '@neo-edge-web/global-services';
import { RouterStoreService } from '@neo-edge-web/global-stores';
import { IOtDeviceDetailState, OT_DEVICE_LOADING, SUPPORT_APPS_FLOW_GROUPS } from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, map, of, pipe, switchMap, take, tap } from 'rxjs';

const flowGroups = SUPPORT_APPS_FLOW_GROUPS.ot_device;

const initialState: IOtDeviceDetailState = {
  profileId: 0,
  otDevice: null,
  otDeviceVersion: null,
  texolTagDoc: null,
  isLoading: OT_DEVICE_LOADING.NONE
};

export type OtDeviceDetailStore = InstanceType<typeof OtDeviceDetailStore>;

export const OtDeviceDetailStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      supportAppService = inject(SupportAppsService),
      otDevicesService = inject(OtDevicesService),
      otTexolService = inject(OtTexolService)
    ) => ({
      getOtDeviceDetail: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: OT_DEVICE_LOADING.GET_DETAIL })),
          switchMap(() =>
            otDevicesService.otDeviceDetailByProfileId$(store.profileId()).pipe(
              map((d) => {
                patchState(store, {
                  otDevice: d,
                  isLoading: OT_DEVICE_LOADING.NONE
                });
                return d;
              }),
              switchMap((d) => {
                return supportAppService.getApps$(flowGroups).pipe(
                  map(({ apps }) => {
                    patchState(store, {
                      otDevice: d,
                      otDeviceVersion: supportAppService.getAppVersionData(d.appVersionId, apps)
                    });
                    return apps;
                  }),
                  switchMap((apps) => {
                    return apps.findIndex((app) => app.name.toLowerCase().includes('texol') && app.isAvailable) > -1
                      ? otTexolService.getTexolDoc$().pipe(
                          tap((d) => {
                            patchState(store, {
                              texolTagDoc: d
                            });
                          })
                        )
                      : of(true);
                  })
                );
              }),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      editOtDevice: rxMethod<{ profile; deviceIcon }>(
        pipe(
          tap(() => patchState(store, { isLoading: OT_DEVICE_LOADING.EDIT })),
          switchMap(({ profile, deviceIcon }) => {
            return otDevicesService.editOtDevice$({ profileId: store.profileId(), profile, deviceIcon }).pipe(
              map((d) => {
                patchState(store, {
                  isLoading: OT_DEVICE_LOADING.REFRESH
                });
              }),
              catchError(() => EMPTY)
            );
          })
        )
      )
    })
  ),
  withHooks((store, routerStoreService = inject(RouterStoreService)) => {
    return {
      onInit() {
        routerStoreService.getParams$
          .pipe(
            take(1),
            tap((urlParm) => {
              patchState(store, {
                profileId: parseInt(urlParm['id'])
              });
              store.getOtDeviceDetail();
            })
          )
          .subscribe();
      }
    };
  })
);
