import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const snackBar = inject(MatSnackBar);
  const authToken = '';
  const authReq = req.clone({
    headers: req.headers.set('Authorization', authToken)
  });
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error && (error.status === 401 || error.status === 403)) {
        snackBar.open('"warn": "Login token has expired. Please login again.', 'CLOSE', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
      return throwError(() => error);
    })
  );
};
