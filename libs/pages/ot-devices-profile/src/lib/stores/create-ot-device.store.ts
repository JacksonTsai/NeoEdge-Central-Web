import { Dialog } from '@angular/cdk/dialog';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { OtDevicesService, OtTexolService, SupportAppsService } from '@neo-edge-web/global-services';
import { CREATE_OT_DEVICES_LOADING, ICreateOtDevicesState, SUPPORT_APPS_FLOW_GROUPS } from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, map, of, pipe, switchMap, tap } from 'rxjs';

const flowGroups = SUPPORT_APPS_FLOW_GROUPS.ot_device;

const initialState: ICreateOtDevicesState = {
  supportDevices: [],
  texolTagDoc: {},
  isLoading: CREATE_OT_DEVICES_LOADING.NONE
};

export type CreateOtDevicesStore = InstanceType<typeof CreateOtDevicesStore>;

export const CreateOtDevicesStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      supportAppsService = inject(SupportAppsService),
      otDevicesService = inject(OtDevicesService),
      otTexolService = inject(OtTexolService),
      router = inject(Router),
      dialog = inject(Dialog)
    ) => ({
      getSupportDevices: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: CREATE_OT_DEVICES_LOADING.GET_DEVICES })),
          switchMap(() =>
            supportAppsService.getApps$(flowGroups).pipe(
              map((d) => {
                patchState(store, {
                  isLoading: CREATE_OT_DEVICES_LOADING.NONE,
                  supportDevices: d.apps
                });
                return d.apps;
              }),
              switchMap((v) => {
                return v.findIndex((app) => app.name.toLowerCase().includes('texol') && app.isAvailable) > -1
                  ? otTexolService.getTexolDoc$().pipe(
                      tap((d) => {
                        patchState(store, {
                          texolTagDoc: d
                        });
                      })
                    )
                  : of(true);
              }),
              catchError(() => EMPTY)
            )
          )
        )
      ),

      createOtDevice: rxMethod<{ profile; deviceIcon }>(
        pipe(
          tap(() => patchState(store, { isLoading: CREATE_OT_DEVICES_LOADING.CREATE_DEVICE })),
          switchMap(({ profile, deviceIcon }) =>
            otDevicesService.createOtDevice$({ profile, deviceIcon }).pipe(
              map((d) => {
                patchState(store, {
                  isLoading: CREATE_OT_DEVICES_LOADING.NONE
                });
                router.navigate(['neoflow/ot-device-profile']);
              }),
              catchError(() => EMPTY)
            )
          )
        )
      )
    })
  ),
  withHooks((store) => {
    return {
      onInit() {
        store.getSupportDevices();
      }
    };
  })
);
