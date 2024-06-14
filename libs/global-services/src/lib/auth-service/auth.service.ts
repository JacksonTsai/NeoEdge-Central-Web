import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  IAllPermission,
  IAllPermissionResp,
  IForgetPasswordReq,
  ILoginReq,
  ILoginResp,
  IRefreshTokenReq,
  IRefreshTokenResp,
  ISetPasswordReq,
  IVerifyInitTokenReq,
  IVerifyInitTokenResp
} from '@neo-edge-web/models';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { HttpService, REST_CONFIG } from '../http-service';

export const PERMISSION_OPTIONS = new InjectionToken<{ options: IAllPermission[] }>('PERMISSION_OPTIONS');

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);
  #restConfig = inject(REST_CONFIG);
  AUTH_BASE_PATH = this.#restConfig.authPath;

  FORGET_PASSWORD_PATH = '/forget-password';
  ACTIVE_ACCOUNT_PATH = '/activate-account';
  VERIFY_ACTIVE_TOKEN_PATH = '/verify-activation-token';
  LOGIN_PATH = '/login';
  LOGOUT_PATH = '/logout';
  REFRESH_TOKEN_PATH = '/refresh';
  PERMISSION_PATH = '/permissions';

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  forgetPassword$ = (payload: IForgetPasswordReq) =>
    this.#http.post(this.FORGET_PASSWORD_PATH, payload, { basePath: this.AUTH_BASE_PATH }).pipe(
      catchError((err) => {
        this.#snackBar.open('Settings failed.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );

  setPassword$ = (payload: ISetPasswordReq) =>
    this.#http.post(this.ACTIVE_ACCOUNT_PATH, payload, { basePath: this.AUTH_BASE_PATH }).pipe(
      catchError((err) => {
        this.#snackBar.open('Settings failed.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );

  verifyInitToken$ = (payload: IVerifyInitTokenReq): Observable<IVerifyInitTokenResp> =>
    this.#http
      .post(`${this.VERIFY_ACTIVE_TOKEN_PATH}`, { verifyToken: payload.verifyToken }, { basePath: this.AUTH_BASE_PATH })
      .pipe(
        catchError((err) => {
          this.#snackBar.open('Verify failed.', 'X', {
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            duration: 5000
          });
          return this.handleError(err);
        })
      );

  login$ = (payload: ILoginReq): Observable<ILoginResp> =>
    this.#http.post(this.LOGIN_PATH, payload, { basePath: this.AUTH_BASE_PATH }).pipe(
      map((d: ILoginResp) => d),
      catchError((err) => {
        this.#snackBar.open('Authentication failed.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );

  logout$ = () => of(true);

  permission$: Observable<IAllPermissionResp> = this.#http.get(this.PERMISSION_PATH).pipe(
    catchError((err) => {
      this.#snackBar.open('Get permission failure.', 'X', {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 5000
      });
      return this.handleError(err);
    })
  );

  refreshAccessToken$ = (payload: IRefreshTokenReq): Observable<IRefreshTokenResp> => {
    return this.#http.post(this.REFRESH_TOKEN_PATH, payload, { basePath: this.AUTH_BASE_PATH }).pipe(
      catchError((err) => {
        return this.handleError(err);
      })
    );
  };
}
