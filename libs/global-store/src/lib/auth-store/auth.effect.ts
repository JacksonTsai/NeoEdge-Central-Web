import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserService } from '@neo-edge-web/global-service';
import { IGetUserProfileResp, ILoginResp } from '@neo-edge-web/models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SessionStorageService } from 'ngx-webstorage';
import { EMPTY, interval, of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import * as AuthAction from './auth.actions';

@Injectable()
export class AuthEffects {
  #actions = inject(Actions);
  #authService = inject(AuthService);
  #userService = inject(UserService);
  #router = inject(Router);
  #storage = inject(SessionStorageService);

  login$ = createEffect(() =>
    this.#actions.pipe(
      ofType(AuthAction.loginAction),
      switchMap(({ loginReq }) =>
        this.#authService.login$(loginReq).pipe(
          map((loginResp: ILoginResp) => {
            return AuthAction.loginSuccess({ loginResp });
          }),
          catchError(() => of(AuthAction.loginFail))
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.#actions.pipe(
      ofType(AuthAction.loginSuccess),
      map((loginSuccessProps: { loginResp: ILoginResp }) => {
        this.#storage.store('account', loginSuccessProps.loginResp);
        return AuthAction.userProfileAction();
      })
    )
  );

  userProfile$ = createEffect(() =>
    this.#actions.pipe(
      ofType(AuthAction.userProfileAction),
      exhaustMap(() =>
        this.#userService.userProfile$.pipe(
          map((userProfile: IGetUserProfileResp) => {
            this.#storage.store('user_profile', userProfile);
            if (userProfile?.defaultProjectName) {
              // to dashboard
              this.#router.navigateByUrl('/user-management/users');
            } else {
              // to company
              this.#router.navigateByUrl('/user-management/users');
            }
            return AuthAction.userProfileSuccess({ userProfile });
          }),
          catchError(() => of(AuthAction.loginFail))
        )
      )
    )
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
