import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpService } from '@neo-edge-web/global-service';
import { Observable, catchError, throwError } from 'rxjs';
import { IGetUsersQueryStrReq, IUsersResp } from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);

  USERS_PATH = '/users';

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  users$ = (queryStr: IGetUsersQueryStrReq): Observable<IUsersResp> =>
    this.#http.get(`${this.USERS_PATH}?page=${queryStr.page}&size=${queryStr.size}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Get users failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
}
