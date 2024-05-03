import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IGetProjectsResp, IGetUserProfileResp, TableQueryForUserProjects } from '@neo-edge-web/models';
import { Observable, catchError, throwError } from 'rxjs';
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
}
