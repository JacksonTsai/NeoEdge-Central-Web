import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { selectUserProfile } from '@neo-edge-web/auth-store';
import { RolesService, UsersService } from '@neo-edge-web/global-services';
import {
  IEditUserStatusReq,
  IInviteUserReq,
  TableQueryForRoles,
  TableQueryForUsers,
  USERS_LOADING,
  UsersState
} from '@neo-edge-web/models';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Store } from '@ngrx/store';
import { EMPTY, catchError, map, pipe, switchMap, tap } from 'rxjs';

const INIT_TABLE_PAGE = 1;
const INIT_TABLE_SIZE = 10;

const initialState: UsersState = {
  userTable: [],
  page: INIT_TABLE_PAGE,
  size: INIT_TABLE_SIZE,
  queryKey: '',
  isLoading: USERS_LOADING.TABLE,
  roleList: [],
  usersLength: 0
};

export type UsersStore = InstanceType<typeof UsersStore>;

export const UsersStore = signalStore(
  withState(initialState),
  withMethods(
    (
      store,
      dialog = inject(MatDialog),
      usersService = inject(UsersService),
      rolesService = inject(RolesService),
      globalStore = inject(Store),
      router = inject(Router)
    ) => ({
      queryUsersTableByPage: rxMethod<TableQueryForUsers>(
        pipe(
          tap(() => patchState(store, { isLoading: USERS_LOADING.TABLE })),
          switchMap(({ page, size, accounts }) => {
            return usersService.users$({ page: page ?? INIT_TABLE_PAGE, size: size ?? INIT_TABLE_SIZE, accounts }).pipe(
              map((d) => {
                patchState(store, {
                  userTable: d.users,
                  page: page,
                  size,
                  isLoading: USERS_LOADING.NONE,
                  usersLength: d.total
                });
              }),
              catchError(() => EMPTY)
            );
          })
        )
      ),
      inviteUser: rxMethod<IInviteUserReq>(
        pipe(
          tap(() => patchState(store, { isLoading: USERS_LOADING.INVITE_USER })),
          switchMap((payload) =>
            usersService.inviteUser$(payload).pipe(
              tap(() => patchState(store, { isLoading: USERS_LOADING.REFRESH_TABLE })),
              tap(() => dialog.closeAll()),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      editUserStatus: rxMethod<{ userId: number; payload: IEditUserStatusReq }>(
        pipe(
          tap(() => patchState(store, { isLoading: USERS_LOADING.Edit_USER })),
          switchMap(({ userId, payload }) =>
            usersService.editUserStatus$(userId, payload).pipe(
              tap(() => patchState(store, { isLoading: USERS_LOADING.REFRESH_TABLE })),
              tap(() => dialog.closeAll()),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      queryRolesTableByPage: rxMethod<TableQueryForRoles>(
        pipe(
          tap(() => patchState(store, { isLoading: USERS_LOADING.ROLE_LIST })),
          switchMap(({ page, size, names }) =>
            rolesService.roles$({ page, size, names }).pipe(
              map((roles) => {
                patchState(store, {
                  roleList: roles.roles,
                  isLoading: USERS_LOADING.NONE
                });
              }),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      deleteUser: rxMethod<{ userId: number; account: string }>(
        pipe(
          tap(() => patchState(store, { isLoading: USERS_LOADING.DELETE_USER })),
          switchMap(({ userId, account }) =>
            usersService.deleteUser$(userId, account).pipe(
              tap(() => {
                patchState(store, { isLoading: USERS_LOADING.REFRESH_TABLE });
              }),
              tap(() => dialog.closeAll()),
              switchMap(() =>
                globalStore.select(selectUserProfile).pipe(
                  map(({ userProfile }) => {
                    if (userProfile.account === account) {
                      router.navigate(['/login']);
                    }
                  })
                )
              ),
              catchError(() => EMPTY)
            )
          )
        )
      ),
      resendEmail: rxMethod<number>(
        pipe(switchMap((userId) => usersService.resendEmail$(userId).pipe(catchError(() => EMPTY))))
      )
    })
  ),
  withHooks((store) => {
    return {
      onInit() {
        store.queryUsersTableByPage({ page: INIT_TABLE_PAGE, size: INIT_TABLE_SIZE });
        store.queryRolesTableByPage({});
      }
    };
  })
);
