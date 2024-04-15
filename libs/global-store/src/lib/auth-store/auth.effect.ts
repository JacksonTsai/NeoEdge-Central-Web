import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserService } from '@neo-edge-web/global-service';
import { IGetUserProfileResp, ILoginResp, IPermission } from '@neo-edge-web/models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LocalStorageService } from 'ngx-webstorage';
import { EMPTY, combineLatest, interval, of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import * as AuthAction from './auth.actions';

@Injectable()
export class AuthEffects {
  #actions = inject(Actions);
  #authService = inject(AuthService);
  #userService = inject(UserService);
  #router = inject(Router);
  #storage = inject(LocalStorageService);

  // login$ = createEffect(() =>
  //   this.#actions.pipe(
  //     ofType(AuthAction.loginAction),
  //     exhaustMap(({ loginReq }) =>
  //       this.#authService.login$(loginReq).pipe(
  //         switchMap((loginResp: ILoginResp) => {
  //           return this.#authService.permission$.pipe(
  //             tap((permissions) => AuthAction.loginSuccess({ loginResp, permissions: permissions.list }))
  //           );
  //         }),
  //         catchError(() => of(AuthAction.loginFail))
  //       )
  //     )
  //   )
  // );

  login$ = createEffect(() =>
    this.#actions.pipe(
      ofType(AuthAction.loginAction),
      exhaustMap(({ loginReq }) =>
        this.#authService.login$(loginReq).pipe(
          switchMap((loginResp: ILoginResp) => {
            return combineLatest([this.#authService.permission$, this.#userService.userProfile$]).pipe(
              map(([permissions, userProfile]) => {
                return AuthAction.loginSuccess({ loginResp, permissions: permissions.list, userProfile });
              })
            );
          }),
          catchError(() => of(AuthAction.loginFail))
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.#actions.pipe(
        ofType(AuthAction.loginSuccess),
        tap(
          (loginSuccessProps: {
            loginResp: ILoginResp;
            permissions: IPermission[];
            userProfile: IGetUserProfileResp;
          }) => {
            this.#storage.store('account', loginSuccessProps.loginResp);
            this.#storage.store('permissions', loginSuccessProps.permissions);
            this.#storage.store('user_profile', loginSuccessProps.userProfile);
            if (loginSuccessProps?.userProfile?.defaultProjectName) {
              // todo jackson navigate by url
              this.#router.navigateByUrl('/user-management/users');
            }
          }
        )
      ),
    { dispatch: false }
  );

  refreshAccessTokenAction$ = createEffect(() => {
    return this.#actions.pipe(
      ofType(AuthAction.refreshAccessTokenAction),
      switchMap((refreshAccessTokenProps) =>
        interval(refreshAccessTokenProps.interval).pipe(
          switchMap(() => {
            return this.#authService.refreshAccessToken$({ refreshToken: refreshAccessTokenProps.refreshToken }).pipe(
              map((accessToken) => {
                return AuthAction.updateAccessTokenAction(accessToken);
              }),
              catchError((err) => {
                return EMPTY;
              })
            );
          })
        )
      )
    );
  });

  logout$ = createEffect(
    () =>
      this.#actions.pipe(
        ofType(AuthAction.logoutAction),
        tap(() => {
          this.#storage.clear('account');
          this.#storage.clear('permissions');
          this.#storage.clear('user_profile');
          this.#router.navigateByUrl('/login');
        }),
        exhaustMap(() =>
          this.#authService.logout$().pipe(
            catchError((err) => {
              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );
}
