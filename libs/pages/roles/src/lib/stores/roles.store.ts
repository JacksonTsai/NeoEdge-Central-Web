import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RolesService } from '@neo-edge-web/global-services';
import { IEditRoleReq, ROLES_LOADING, RolesState, TableQueryForRoles } from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, map, pipe, switchMap, tap } from 'rxjs';

const INIT_TABLE_PAGE = 1;
const INIT_TABLE_SIZE = 10;

const initialState: RolesState = {
  roleTable: [],
  page: INIT_TABLE_PAGE,
  size: INIT_TABLE_SIZE,
  queryKey: '',
  isLoading: ROLES_LOADING.TABLE,
  rolesLength: 0
};

export type RolesStore = InstanceType<typeof RolesStore>;

export const RolesStore = signalStore(
  withState(initialState),
  withMethods((store, dialog = inject(MatDialog), rolesService = inject(RolesService)) => ({
    queryRolesTableByPage: rxMethod<TableQueryForRoles>(
      pipe(
        tap(() => patchState(store, { isLoading: ROLES_LOADING.TABLE })),
        switchMap(({ page, size, names }) =>
          rolesService.roles$({ page: page ?? INIT_TABLE_PAGE, size: size ?? INIT_TABLE_SIZE, names }).pipe(
            map((d) => {
              patchState(store, {
                roleTable: d.roles,
                page,
                size,
                isLoading: ROLES_LOADING.NONE,
                rolesLength: d.total
              });
            }),
            catchError(() => EMPTY)
          )
        )
      )
    ),
    addRole: rxMethod<IEditRoleReq>(
      pipe(
        tap(() => patchState(store, { isLoading: ROLES_LOADING.ADD_ROLE })),
        switchMap((payload) =>
          rolesService.addRole$(payload).pipe(
            tap(() => patchState(store, { isLoading: ROLES_LOADING.REFRESH_TABLE })),
            tap(() => dialog.closeAll()),
            catchError(() => EMPTY)
          )
        )
      )
    ),
    editRole: rxMethod<{ roleId: number; payload: IEditRoleReq }>(
      pipe(
        tap(() => patchState(store, { isLoading: ROLES_LOADING.EDIT_ROLE })),
        switchMap(({ roleId, payload }) =>
          rolesService.editRole$(roleId, payload).pipe(
            tap(() => patchState(store, { isLoading: ROLES_LOADING.REFRESH_TABLE })),
            tap(() => dialog.closeAll()),
            catchError(() => EMPTY)
          )
        )
      )
    ),
    deleteUser: rxMethod<{ roleId: number; name: string }>(
      pipe(
        tap(() => patchState(store, { isLoading: ROLES_LOADING.DELETE_ROLE })),
        switchMap(({ roleId, name }) =>
          rolesService.deleteRole$(roleId, name).pipe(
            tap(() => {
              patchState(store, { isLoading: ROLES_LOADING.REFRESH_TABLE });
            }),
            tap(() => dialog.closeAll()),
            catchError(() => EMPTY)
          )
        )
      )
    )
  })),
  withHooks((store) => {
    return {
      onInit() {
        store.queryRolesTableByPage({ page: INIT_TABLE_PAGE, size: INIT_TABLE_SIZE });
      }
    };
  })
);
