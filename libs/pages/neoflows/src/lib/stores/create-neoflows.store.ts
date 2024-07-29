import { inject } from '@angular/core';
import { selectUserProfile } from '@neo-edge-web/auth-store';
import { ItServiceService, OtDevicesService, OtTexolService, SupportAppsService } from '@neo-edge-web/global-services';
import {
  CREATE_NEOFLOW_LOADING,
  ICreateNeoFlowState,
  IItService,
  IOtDevice,
  LeaderLine,
  SUPPORT_APPS_FLOW_GROUPS
} from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { map, pipe, switchMap } from 'rxjs';

const NEOFLOW_FLOW_GROUP = SUPPORT_APPS_FLOW_GROUPS.neoflow;

const initialState: ICreateNeoFlowState = {
  neoflowProfile: null,
  neoflowProcessorVers: [],
  supportApps: [],
  otProfileList: [],
  itProfileList: [],
  addedOt: [],
  addedIt: [],
  addedMessageSchema: [],
  texolTagDoc: null,
  userProfile: null,
  dsToMessageConnection: [],
  isLoading: CREATE_NEOFLOW_LOADING.NONE
};

export type CreateNeoFlowsStore = InstanceType<typeof CreateNeoFlowsStore>;

export const CreateNeoFlowsStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      otDevicesService = inject(OtDevicesService),
      itServiceService = inject(ItServiceService),
      supportAppsService = inject(SupportAppsService),
      otTexolService = inject(OtTexolService)
    ) => ({
      updateDsToMessageConnection: rxMethod<LeaderLine[]>(
        pipe(
          map((dsToMessageConnection) => {
            patchState(store, { dsToMessageConnection });
          })
        )
      ),
      updateNeoFlowProfile: rxMethod<any>(
        pipe(
          map((neoflowProfile) => {
            patchState(store, { neoflowProfile });
          })
        )
      ),
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
      removeItService: rxMethod<{ itServiceName: string }>(
        pipe(
          map(({ itServiceName }) => {
            patchState(store, { addedIt: [...store.addedIt().filter((it) => itServiceName !== it.name)] });
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
      editItService: rxMethod<{ source: IItService; target: IItService }>(
        pipe(
          map(({ source, target }) => {
            patchState(store, {
              addedIt: [...store.addedIt().map((d) => (d.name === source.name ? { ...d, ...target } : d))]
            });
          })
        )
      ),
      updateMessageSchema: rxMethod<any>(
        pipe(
          map((messageSchema) => {
            patchState(store, {
              addedMessageSchema: [...messageSchema]
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
  withHooks((store, globalStore = inject(Store)) => {
    return {
      onInit() {
        store.getProcessorApps();
        store.getSupportApps();
        store.getOtProfileList();
        store.getItProfileList();
        store.getTexolDoc();
        globalStore
          .select(selectUserProfile)
          .pipe(
            map(({ userProfile }) => {
              patchState(store, { userProfile });
            })
          )
          .subscribe();
      }
    };
  })
);
