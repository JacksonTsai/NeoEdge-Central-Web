import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ILoginReq,
  ILoginResp,
  IPermissionResp,
  IRefreshTokenReq,
  IRefreshTokenResp,
  ISetPasswordReq
} from '@neo-edge-web/models';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { HttpService, REST_CONFIG } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);
  #restConfig = inject(REST_CONFIG);
  AUTH_BASE_PATH = this.#restConfig.authPath;

  FORGET_PASSWORD_PATH = '/forget-password';
  INIT_PATH = '/init';
  LOGIN_PATH = '/login';
  LOGOUT_PATH = '/logout';
  REFRESH_TOKEN_PATH = '/refresh';
  PERMISSION_PATH = '/permissions';

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  forgetPassword$ = (payload: ILoginReq) =>
    this.#http.post(this.LOGIN_PATH, payload, { basePath: this.AUTH_BASE_PATH }).pipe(
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
    this.#http.post(this.INIT_PATH, payload, { basePath: this.AUTH_BASE_PATH }).pipe(
      catchError((err) => {
        this.#snackBar.open('Settings failed.', 'X', {
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

  logout$ = () =>
    this.#http.post(this.LOGOUT_PATH, {}, { basePath: this.AUTH_BASE_PATH }).pipe(
      tap(() => {
        console.log('logout');

        this.#snackBar.open('Logout success.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
      }),
      catchError((err) => {
        console.log('logout err');
        this.#snackBar.open('Logout failed.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );

  permission$: Observable<IPermissionResp> = this.#http.get(this.PERMISSION_PATH).pipe(
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

// remove jackson mack data
// refreshAccessToken = (payload: IRefreshTokenReq): Observable<IRefreshTokenResp> => {
//   return of({
//     accessToken:
//       'ABC.eyJleHAiOjE3MTI2NTA3NDAsIm5iZiI6MTcxMjU2NDM0MCwiaWF0IjoxNzEyNTY0MzQwLCJ1aWQiOjEsImZxZG4iOiJlY2xvdWR2YWxsZXkiLCJyb2xlSWQiOjF9.CcsUg8NV5QNEpTw-J4hQd2iyGVYVW4A5r34BpTpy7pY'
//   });
// };

// remove jackson mack data
// permission$ = of<IPermissionResp>({
//   list: [
//     { permissionId: 100, permissionName: 'Company Account' },
//     { permissionId: 200, permissionName: 'User Management' },
//     { permissionId: 300, permissionName: 'Project Management' },
//     { permissionId: 400, permissionName: 'Application Management' }
//   ]
// });

//  remove jackson mack data
// login$ = (any: ILoginReq) =>
//   of({
//     accessToken:
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTI4MTg2ODQsIm5iZiI6MTcxMjczMjI4NCwiaWF0IjoxNzEyNzMyMjg0LCJ1aWQiOjEsInJpZCI6MjAsImZxZG4iOiJlY3YuY29tIn0.S60HhKALap-5JAtl5BIzgDVxjhpxlqUIzBGR9ZqU0D0',
//     refreshToken:
//       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTI4MTg2ODQsIm5iZiI6MTcxMjczMjI4NCwiaWF0IjoxNzEyNzMyMjg0LCJ1aWQiOjEsInJpZCI6MjAsImZxZG4iOiJlY3YuY29tIn0.S60HhKALap-5JAtl5BIzgDVxjhpxlqUIzBGR9ZqU0D0'
//   });
