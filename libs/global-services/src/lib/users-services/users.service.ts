import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IEditUserStatusReq, IInviteUserReq, IUsersResp, TableQueryForUsers } from '@neo-edge-web/models';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpService } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);

  USERS_PATH = '/users';
  EDIT_USERS_PATH = (userID) => `${this.USERS_PATH}/${userID}`;
  SEND_EMAIL_PATH = (id: number) => `/users/${id}/send-activation-mail`;

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  users$ = (queryStr?: TableQueryForUsers): Observable<IUsersResp> => {
    let queryString = '';
    if (queryStr && Object.keys(queryStr).length > 0) {
      queryString = `?page=${queryStr?.page ?? 1}&size=${queryStr?.size ?? 10}`;
      if (queryStr?.accounts) {
        queryString = `${queryString}&accounts=${queryStr.accounts}`;
      }
    }
    return this.#http.get(`${this.USERS_PATH}${queryString}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Get users failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  inviteUser$ = (payload: IInviteUserReq) =>
    this.#http.post(this.USERS_PATH, payload).pipe(
      tap(() => {
        this.#snackBar.open('Submit successfully.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
      }),
      catchError((err) => {
        this.#snackBar.open('Submit failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );

  resendEmail$ = (userId: number) =>
    this.#http.post(this.SEND_EMAIL_PATH(userId), {}).pipe(
      tap(() => {
        this.#snackBar.open('Resend email success.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
      }),
      catchError((err) => {
        this.#snackBar.open('Resend email failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );

  editUserStatus$ = (userId: number, payload: IEditUserStatusReq) => {
    return this.#http.put(this.EDIT_USERS_PATH(userId), payload).pipe(
      tap(() => {
        this.#snackBar.open('Setting success.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
      }),
      catchError((err) => {
        this.#snackBar.open('Setting failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  deleteUser$ = (userId: number, account: string) => {
    return this.#http.delete(this.EDIT_USERS_PATH(userId), { account }).pipe(
      tap(() => {
        this.#snackBar.open('Delete success.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
      }),
      catchError((err) => {
        this.#snackBar.open('Delete failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };
}
