import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IAuthState } from '@neo-edge-web/models';
import { Store, createFeatureSelector, createSelector } from '@ngrx/store';
import { catchError, switchMap, take, throwError } from 'rxjs';

export const selectAuthState = createFeatureSelector<IAuthState>('auth');
export const selectAccessToken = createSelector(selectAuthState, (state) => state.accessToken);
const ERROR_UNAUTHORIZED = 401;
const ERROR_FORBIDDEN = 403;

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const globalStore = inject(Store);

  const isActiveUSer = () => {
    return router.url.includes('/active-user?');
  };

  const isForgetPassword = () => {
    return router.url.includes('/forget-password?');
  };

  return globalStore.select(selectAccessToken).pipe(
    take(1),
    switchMap((accessToken) => {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
      });
      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (!isActiveUSer() && !isForgetPassword()) {
            if (error && (error.status === ERROR_UNAUTHORIZED || error.status === ERROR_FORBIDDEN)) {
              router.navigate(['/login']);
              snackBar.open('Login token has expired. Please login again.', 'CLOSE', {
                horizontalPosition: 'end',
                verticalPosition: 'bottom'
              });
            }
          }
          return throwError(() => error);
        })
      );
    })
  );
};
