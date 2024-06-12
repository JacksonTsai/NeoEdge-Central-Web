import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IDeleteItServiceDetailReq } from '@neo-edge-web/models';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpService } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class ItServiceDetailService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);

  private IT_SERVICE_PATH = '/it-service-profiles';

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  deleteItService$ = (payload: IDeleteItServiceDetailReq): Observable<any> => {
    return this.#http.delete(`${this.IT_SERVICE_PATH}/${payload.profileId}`, { name: payload.name }).pipe(
      map((resp) => {
        this.#snackBar.open('Delete It service successfully.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });

        return resp;
      }),
      catchError((err) => {
        this.#snackBar.open('Delete It service failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };
}
