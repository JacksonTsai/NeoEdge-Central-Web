import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IEditGatewayProfileReq, IGetGatewaysDetailResp, IGetInstallCommandResp } from '@neo-edge-web/models';
import { obj2FormData } from '@neo-edge-web/utils';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { HttpService } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class GatewayDetailService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  private GATEWAYS_PATH = `/gateways`;

  gatewayDetail$ = (gatewayId: number): Observable<IGetGatewaysDetailResp> =>
    this.#http.get(`${this.GATEWAYS_PATH}/${gatewayId}`).pipe(
      map((resp) => {
        this.#snackBar.open('Get gateway detail successfully.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return resp;
      }),
      catchError((err) => {
        this.#snackBar.open('Get gateway detail failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );

  editGatewayProfile$ = (gatewayId: number, gatewayProfile: IEditGatewayProfileReq, gatewayIcon: File) => {
    const formData = obj2FormData({ profile: JSON.stringify(gatewayProfile), gatewayIcon });
    return this.#http.post(`${this.GATEWAYS_PATH}/${gatewayId}/profile`, formData).pipe(
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

  syncGatewayProfile$ = (gatewayId: number) =>
    this.#http.post(`${this.GATEWAYS_PATH}/${gatewayId}/command/system-info`, {}).pipe(
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

  getInstallCommand$ = (gatewayId: number): Observable<IGetInstallCommandResp> =>
    this.#http.post(`${this.GATEWAYS_PATH}/${gatewayId}/install-command`, {}).pipe(
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

  deleteGateway$ = (gatewayId: number, name: string) => {
    return this.#http.delete(`${this.GATEWAYS_PATH}/${gatewayId}`, { name }).pipe(
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
