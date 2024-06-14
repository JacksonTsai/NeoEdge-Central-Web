import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ICopyItServiceDetailReq,
  ICopyItServiceDetailResp,
  ICreateItServiceReq,
  ICreateItServiceResp,
  IDeleteItServiceDetailReq,
  IGetItServiceDetailResp,
  IGetItServiceResp,
  IUpdateItServiceDetailReq,
  TableQueryForItService
} from '@neo-edge-web/models';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpService } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class ItServiceService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);

  private IT_SERVICE_PATH = '/project/it-service-profiles';

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  getItService$ = (projectId: number, queryStr?: TableQueryForItService): Observable<IGetItServiceResp> => {
    const params = new URLSearchParams();
    params.set('projectIds', projectId.toString());
    if (queryStr) {
      if (queryStr?.page) {
        params.set('page', queryStr.page.toString());
      }
      if (queryStr?.size) {
        params.set('size', queryStr.size.toString());
      }
      if (queryStr?.names) {
        params.set('names', queryStr.names.toString());
      }
    }
    return this.#http.get(`${this.IT_SERVICE_PATH}?${params}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Get IT service failure', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  createItService$ = (payload: ICreateItServiceReq): Observable<ICreateItServiceResp> => {
    return this.#http.post(`${this.IT_SERVICE_PATH}`, payload).pipe(
      map((resp) => {
        this.#snackBar.open('Create It service successfully.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });

        return resp;
      }),
      catchError((err) => {
        this.#snackBar.open('Create It service failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  getItServiceDetail$ = (profileId: number): Observable<IGetItServiceDetailResp> => {
    return this.#http.get(`${this.IT_SERVICE_PATH}/${profileId}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Delete IT service failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  updateItServiceDetail$ = (profileId: number, payload: IUpdateItServiceDetailReq): Observable<any> => {
    return this.#http.put(`${this.IT_SERVICE_PATH}/${profileId}`, payload).pipe(
      map((resp) => {
        this.#snackBar.open('Edit IT service successfully.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });

        return resp;
      }),
      catchError((err) => {
        this.#snackBar.open('Edit IT service failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  deleteItServiceDetail$ = (profileId: number, payload: IDeleteItServiceDetailReq): Observable<any> => {
    return this.#http.delete(`${this.IT_SERVICE_PATH}/${profileId}`, payload).pipe(
      map((resp) => {
        this.#snackBar.open('Delete IT service successfully.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });

        return resp;
      }),
      catchError((err) => {
        this.#snackBar.open('Delete IT service failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  copyItServiceDetail$ = (
    profileId: number,
    payload: ICopyItServiceDetailReq
  ): Observable<ICopyItServiceDetailResp> => {
    return this.#http.post(`${this.IT_SERVICE_PATH}/${profileId}`, payload).pipe(
      map((resp) => {
        this.#snackBar.open('Copy IT service successfully.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });

        return resp;
      }),
      catchError((err) => {
        this.#snackBar.open('Copy IT service failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };
}
