import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  GATEWAY_SSH_STATUS,
  GW_RUNNING_MODE,
  IDownloadGatewayEventLogsReq,
  IEditGatewayProfileReq,
  IGetGatewaysDetailResp,
  IGetInstallCommandResp,
  IRebootReq,
  TGetGatewayEventLogsParams
} from '@neo-edge-web/models';
import { obj2FormData, setParamsArrayWithKey } from '@neo-edge-web/utils';
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

  private GATEWAYS_PATH = `/project/gateways`;

  gatewayDetail$ = (gatewayId: number): Observable<IGetGatewaysDetailResp> =>
    this.#http.get(`${this.GATEWAYS_PATH}/${gatewayId}`).pipe(
      map((resp) => {
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
    const payload = { profile: JSON.stringify(gatewayProfile) };
    if (gatewayIcon && typeof gatewayIcon !== 'string') {
      payload['gatewayIcon'] = gatewayIcon;
    }
    const formData = obj2FormData(payload);

    return this.#http.put(`${this.GATEWAYS_PATH}/${gatewayId}`, formData).pipe(
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
        this.#snackBar.open('Fetch success.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
      }),
      catchError((err) => {
        this.#snackBar.open('Fetch failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );

  getInstallCommand$ = (gatewayId: number): Observable<IGetInstallCommandResp> =>
    this.#http.post(`${this.GATEWAYS_PATH}/${gatewayId}/install-command`, {}).pipe(
      map((resp) => resp),
      tap(() => {
        this.#snackBar.open('Copied Command.', 'X', {
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

  switchRunningMode$ = (gatewayId: number, mode: GW_RUNNING_MODE, name?: string): Observable<IGetInstallCommandResp> =>
    this.#http.post(`${this.GATEWAYS_PATH}/${gatewayId}/command/running-mode`, { mode, name }).pipe(
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

  rebootSchedule$ = (gatewayId: number, rebootSchedule: IRebootReq) => {
    return this.#http.post(`${this.GATEWAYS_PATH}/${gatewayId}/command/reboot`, rebootSchedule).pipe(
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

  getGatewaySSH$ = (gatewayId: number) => {
    return this.#http.get(`${this.GATEWAYS_PATH}/${gatewayId}/ssh-status`).pipe(
      map((resp) => {
        return resp;
      }),
      catchError((err) => {
        this.#snackBar.open('Get gateway SSH Satus failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  updateGatewaySSH$ = (gatewayId: number, enable: GATEWAY_SSH_STATUS) => {
    return this.#http.post(`${this.GATEWAYS_PATH}/${gatewayId}/command/ssh`, { enable }).pipe(
      tap(() => {
        this.#snackBar.open(
          `Setting SSH Status: ${enable === GATEWAY_SSH_STATUS.ENABLED ? 'enabled' : 'disabled'} success.`,
          'X',
          {
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            duration: 5000
          }
        );
      }),
      catchError((err) => {
        this.#snackBar.open('Setting SSH Status failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  getGatewayEventLogs$ = (gatewayId: number, eventLogsParams: TGetGatewayEventLogsParams) => {
    const params = setParamsArrayWithKey(eventLogsParams);
    return this.#http.get(`${this.GATEWAYS_PATH}/${gatewayId}/events?${params}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Get gateway event logs failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  downloadGatewayEventLogs$ = (gatewayId: number, eventLogsParams: IDownloadGatewayEventLogsReq) => {
    const params = setParamsArrayWithKey(eventLogsParams);
    const headers = new HttpHeaders({
      Accept: 'text/csv'
    });
    return this.#http.getArrayBuffer(`${this.GATEWAYS_PATH}/${gatewayId}/events/csv?${params}`, { headers }).pipe(
      tap(() => {
        this.#snackBar.open(`Download gateway logs success.`, 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
      }),
      catchError((err) => {
        this.#snackBar.open('Download gateway logs failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        console.log(err);
        return this.handleError(err);
      })
    );
  };
}
