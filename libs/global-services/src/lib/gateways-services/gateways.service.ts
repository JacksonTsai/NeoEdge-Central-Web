import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IAddGatewayReq, IAddGatewayResp, IGetGatewaysResp, TableQueryForGateways } from '@neo-edge-web/models';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpService } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class GatewaysService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  private GATEWAYS_PATH = '/project/gateways';

  gatewaysByProjectId$ = (projectId: number, queryStr?: TableQueryForGateways): Observable<IGetGatewaysResp> => {
    const params = new URLSearchParams();
    if (queryStr) {
      if (queryStr?.page) {
        params.set('page', queryStr.page.toString());
      }
      if (queryStr?.size) {
        params.set('size', queryStr.size.toString());
      }
      if (queryStr?.names) {
        params.set('names', queryStr.names);
      }
      if (queryStr?.labelIds) {
        params.set('labelIds', queryStr.labelIds.toString());
      }
    }
    return this.#http.get(`${this.GATEWAYS_PATH}?${params}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Get gateways failure', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  addGateway$ = (payload: IAddGatewayReq): Observable<IAddGatewayResp> =>
    this.#http.post(this.GATEWAYS_PATH, payload).pipe(
      map((resp) => {
        this.#snackBar.open('Add gateway successfully.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });

        return resp;
      }),
      catchError((err) => {
        this.#snackBar.open('Add gateway failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
}
