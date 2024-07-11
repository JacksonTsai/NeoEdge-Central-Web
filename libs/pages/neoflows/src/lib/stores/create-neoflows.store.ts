import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ItServiceService,
  NeoFlowsService,
  OtDevicesService,
  OtTexolService,
  SupportAppsService
} from '@neo-edge-web/global-services';
import {
  CREATE_NEOFLOW_LOADING,
  ICreateNeoFlowState,
  IItService,
  IOtDevice,
  SUPPORT_APPS_FLOW_GROUPS
} from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, pipe, switchMap } from 'rxjs';

const NEOFLOW_FLOW_GROUP = SUPPORT_APPS_FLOW_GROUPS.neoflow;

const initialState: ICreateNeoFlowState = {
  neoflowProcessorVers: [],
  supportApps: [],
  otProfileList: [],
  itProfileList: [],
  addedOt: [],
  addedIt: [],
  texolTagDoc: null,
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
      supportAppsService = inject(SupportAppsService),
      otTexolService = inject(OtTexolService)
    ) => ({
      addOtDevice: rxMethod<IOtDevice<any>>(
        pipe(
          map((d) => {
            patchState(store, { addedOt: [...store.addedOt(), d] });
          })
        )
      ),
      addItService: rxMethod<IItService>(
        pipe(
          map((d) => {
            patchState(store, { addedIt: [...store.addedIt(), d] });
          })
        )
      ),
      removeOtDevice: rxMethod<{ otDeviceName: string }>(
        pipe(
          map(({ otDeviceName }) => {
            patchState(store, { addedOt: [...store.addedOt().filter((ot) => otDeviceName !== ot.name)] });
          })
        )
      ),
      removeItService: rxMethod<{ index: number }>(
        pipe(
          map(({ index }) => {
            patchState(store, { addedIt: [...store.addedIt().filter((_, i) => i !== index)] });
          })
        )
      ),
      editOtDevice: rxMethod<{ source: IOtDevice<any>; target: IOtDevice<any> }>(
        pipe(
          map(({ source, target }) => {
            patchState(store, {
              addedOt: [...store.addedOt().map((d) => (d.name === source.name ? { ...d, ...target } : d))]
            });
          })
        )
      ),
      getProcessorApps: rxMethod<void>(
        pipe(
          switchMap(() => {
            return supportAppsService.getApps$(NEOFLOW_FLOW_GROUP).pipe(
              map(({ apps }) => {
                patchState(store, {
                  neoflowProcessorVers: [...apps[0].appVersions]
                });
              })
            );
          })
        )
      ),
      getSupportApps: rxMethod<void>(
        pipe(
          switchMap(() => {
            return supportAppsService.getApps$().pipe(
              map(({ apps }) => {
                patchState(store, {
                  supportApps: [...apps]
                });
              })
            );
          })
        )
      ),
      getOtProfileList: rxMethod<void>(
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
      getItProfileList: rxMethod<void>(
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
      ),
      getTexolDoc: rxMethod<void>(
        pipe(
          switchMap(() => {
            return otTexolService.getTexolDoc$().pipe(
              map((texolDoc) => {
                patchState(store, {
                  texolTagDoc: texolDoc
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
        store.getProcessorApps();
        store.getSupportApps();
        store.getOtProfileList();
        store.getItProfileList();
        store.getTexolDoc();
      }
    };
  })
);
