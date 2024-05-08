import { inject } from '@angular/core';
import { CompanyInfoService } from '@neo-edge-web/global-service';
import { COMP_INFO_LOADING, ICompanyProfileState, IEditCompanyProfileReq } from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, map, pipe, switchMap, tap } from 'rxjs';

const initialState: ICompanyProfileState = {
  companyInfo: null,
  isLoading: COMP_INFO_LOADING.NONE
};

export type CompanyInfoStore = InstanceType<typeof CompanyInfoStore>;

export const CompanyInfoStore = signalStore(
  withState(initialState),
  withMethods((store, companyInfoService = inject(CompanyInfoService)) => ({
    getCompanyProfile: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: COMP_INFO_LOADING.GET_PROFILE })),
        switchMap(() => {
          return companyInfoService.companyProfile$.pipe(
            map((companyInfo) => {
              patchState(store, { companyInfo, isLoading: COMP_INFO_LOADING.NONE });
            }),
            catchError(() => EMPTY)
          );
        })
      )
    ),
    editCompanyProfile: rxMethod<IEditCompanyProfileReq>(
      pipe(
        tap(() => patchState(store, { isLoading: COMP_INFO_LOADING.EDIT_PROFILE })),
        switchMap((payload) =>
          companyInfoService.editCompanyProfile$(payload).pipe(
            map(() => {
              patchState(store, {
                companyInfo: { ...store.companyInfo(), ...payload },
                isLoading: COMP_INFO_LOADING.REFRESH
              });
            }),
            catchError(() => EMPTY)
          )
        )
      )
    )
  })),
  withHooks((store) => {
    return {
      onInit() {
        store.getCompanyProfile();
      }
    };
  })
);
