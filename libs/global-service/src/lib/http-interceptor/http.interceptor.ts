import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  #snackBar = inject(MatSnackBar);
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = '';
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authToken)
    });
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error && (error.status === 401 || error.status === 403)) {
          this.#snackBar.open('"warn": "Your login token has expired. Get a new token and try again.', 'CLOSE', {
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        }
        return throwError(() => error);
      })
    );
  }
}
