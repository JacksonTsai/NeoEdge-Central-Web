import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IAuthState } from '@neo-edge-web/models';
import { Store, createFeatureSelector, createSelector } from '@ngrx/store';
import { catchError, switchMap, take, throwError } from 'rxjs';

export const selectAuthState = createFeatureSelector<IAuthState>('auth');

export const selectAccessToken = createSelector(selectAuthState, (state) => state.accessToken);

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const globalStore = inject(Store);
  return globalStore.select(selectAccessToken).pipe(
    take(1),
    switchMap((accessToken) => {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
      });
      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error && (error.status === 401 || error.status === 403)) {
            router.navigate(['/login']);
            snackBar.open('Login token has expired. Please login again.', 'CLOSE', {
              horizontalPosition: 'end',
              verticalPosition: 'bottom'
            });
          }
          return throwError(() => error);
        })
      );
    })
  );
};
