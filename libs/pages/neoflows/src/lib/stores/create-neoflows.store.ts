import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItServiceService, NeoFlowsService, OtDevicesService, SupportAppsService } from '@neo-edge-web/global-services';
import { CREATE_NEOFLOW_LOADING, ICreateNeoFlowState } from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, pipe, switchMap } from 'rxjs';

const FLOW_GROUP = 2;

const initialState: ICreateNeoFlowState = {
  neoflowProcessorVers: [],
  otProfileList: [],
  itProfileList: [],
  isLoading: CREATE_NEOFLOW_LOADING.NONE
};

export type CreateNeoFlowsStore = InstanceType<typeof CreateNeoFlowsStore>;

export const CreateNeoFlowsStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      dialog = inject(MatDialog),
      nfService = inject(NeoFlowsService),
      otDevicesService = inject(OtDevicesService),
      itServiceService = inject(ItServiceService),
      supportAppsService = inject(SupportAppsService)
    ) => ({
      getApps: rxMethod<void>(
        pipe(
          switchMap(() => {
            return supportAppsService.getApps$(FLOW_GROUP).pipe(
              map(({ apps }) => {
                patchState(store, {
                  neoflowProcessorVers: [...apps[0].appVersions]
                });
              })
            );
          })
        )
      ),
      otProfileList: rxMethod<void>(
        pipe(
          switchMap(() => {
            return otDevicesService.otDevices$().pipe(
              map((otDevices) => {
                patchState(store, {
                  otProfileList: [...otDevices.devices]
                });
              })
            );
          })
        )
      ),
      itProfileList: rxMethod<void>(
        pipe(
          switchMap(() => {
            return itServiceService.getItService$().pipe(
              map((otDevices) => {
                patchState(store, {
                  itProfileList: [...otDevices.itServices]
                });
              })
            );
          })
        )
      )
    })
  ),
  withHooks((store) => {
    return {
      onInit() {
        store.getApps();
        store.otProfileList();
        store.itProfileList();
      }
    };
  })
);
