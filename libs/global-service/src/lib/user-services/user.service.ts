import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  IEditPasswordReq,
  IGetProjectsResp,
  IGetUserProfileResp,
  IUserProfile,
  TableQueryForUserProjects
} from '@neo-edge-web/models';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpService, REST_CONFIG } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);
  #restConfig = inject(REST_CONFIG);

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  private USER_PROFILE_PATH = '/my/profile';
  private USER_PROJECTS_PATH = '/my/projects';
  private USER_EDIT_PASSWORD_PTAH = '/my/password';

  userProfile$: Observable<IGetUserProfileResp> = this.#http.get(this.USER_PROFILE_PATH).pipe(
    catchError((err) => {
      this.#snackBar.open('Get user profile failure', 'X', {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 5000
      });
      return this.handleError(err);
    })
  );

  editUserProfile$ = (payload: IUserProfile) => {
    return this.#http.put(this.USER_PROFILE_PATH, payload).pipe(
      tap(() => {
        this.#snackBar.open('Edit successfully.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
      }),
      catchError((err) => {
        this.#snackBar.open('Edit failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  userProjects$ = (queryStr?: TableQueryForUserProjects): Observable<IGetProjectsResp> => {
    let queryString = '';
    if (queryStr && Object.keys(queryStr).length > 0) {
      queryString = `?page=${queryStr?.page ?? 1}&size=${queryStr?.size ?? 10}`;
      if (queryStr?.name) {
        queryString = `${queryString}&names=${queryStr.name}`;
      }
    }
    return this.#http.get(`${this.USER_PROJECTS_PATH}${queryString}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Get user projects failure', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  editPassword$ = (payload: IEditPasswordReq) => {
    return this.#http.put(this.USER_EDIT_PASSWORD_PTAH, payload).pipe(
      tap(() => {
        this.#snackBar.open('Reset successfully.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
      }),
      catchError((err) => {
        this.#snackBar.open('Reset failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };
}
