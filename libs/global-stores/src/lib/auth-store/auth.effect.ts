import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, ProjectsService, UserService } from '@neo-edge-web/global-services';
import { IGetUserProfileResp, ILoginResp, PERMISSION } from '@neo-edge-web/models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NgxPermissionsService } from 'ngx-permissions';
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
  #permissionsService = inject(NgxPermissionsService);
  #projectsService = inject(ProjectsService);

  login$ = createEffect(() =>
    this.#actions.pipe(
      ofType(AuthAction.loginAction),
      switchMap(({ loginReq }) => {
        return this.#authService.login$(loginReq).pipe(
          map((loginResp: ILoginResp) => {
            this.#storage.store('account', loginResp);
            return AuthAction.loginSuccess({ loginResp, fromUserLogin: true });
          }),
          catchError(() => of(AuthAction.loginFail).pipe(map(() => EMPTY)))
        );
      })
    )
  );

  loginSuccess$ = createEffect(() =>
    this.#actions.pipe(
      ofType(AuthAction.loginSuccess),
      switchMap(({ fromUserLogin }) => {
        return this.#userService.userProfile$.pipe(
          map((userProfile: IGetUserProfileResp) => {
            this.#storage.store('user_profile', userProfile);
            this.#permissionsService.loadPermissions([...userProfile.role.permissions.map((d) => PERMISSION[d])]);
            return { fromUserLogin, userProfile };
          }),
          switchMap(({ fromUserLogin, userProfile }) => {
            return userProfile.defaultProjectId
              ? this.#projectsService
                  .switchProject$(userProfile.defaultProjectId)
                  .pipe(
                    map(() => AuthAction.loinSuccessRedirect({ userProfile, isRedirectDefaultPage: fromUserLogin }))
                  )
              : of(AuthAction.loinSuccessRedirect({ userProfile, isRedirectDefaultPage: fromUserLogin }));
          }),
          catchError(() => of(AuthAction.loginFail))
        );
      })
    )
  );

  loginSuccessRedirect$ = createEffect(() =>
    this.#actions.pipe(
      ofType(AuthAction.loinSuccessRedirect),
      map(({ userProfile, isRedirectDefaultPage }) => {
        if (isRedirectDefaultPage) {
          if (userProfile?.defaultProjectName) {
            this.#router.navigateByUrl('/project/dashboard');
          } else {
            this.#router.navigateByUrl('/company-account/company-info');
          }
        }
        return AuthAction.userProfileSuccess({ userProfile });
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

  changeCurrentProjectIdAction$ = createEffect(
    () => {
      return this.#actions.pipe(
        ofType(AuthAction.changeCurrentProjectIdAction),
        switchMap(({ currentProjectId }) =>
          this.#projectsService.switchProject$(currentProjectId).pipe(
            tap(() => {
              this.#router.navigateByUrl('/project/dashboard');
            })
          )
        )
      );
    },
    { dispatch: false }
  );

  logout$ = createEffect(() =>
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
          map(() => AuthAction.resetAuthState()),
          catchError((err) => {
            return EMPTY;
          })
        )
      )
    )
  );
}
