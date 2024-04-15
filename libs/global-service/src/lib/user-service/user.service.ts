import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IGetUserProfileResp } from '@neo-edge-web/models';
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

  private USER_PROFILE_PATH = '/user/profile';

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
}
