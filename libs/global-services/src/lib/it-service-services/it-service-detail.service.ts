import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IDeleteItServiceDetailReq, IItServiceConnectionOption } from '@neo-edge-web/models';
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

  private itServiceConnection: IItServiceConnectionOption[] = [
    {
      key: 'mqtt-8883',
      value: 8883,
      label: 'MQTT (8883)'
    },
    {
      key: 'mqtt-1883',
      value: 1883,
      label: 'MQTT (1883)'
    },
    {
      key: 'amqp-5671',
      value: 5671,
      label: 'AMQP (5671)'
    },
    {
      key: 'mqtt-443',
      value: 443,
      label: 'MQTT over WS (443)'
    },
    {
      key: 'amqp-443',
      value: 443,
      label: 'AMQP over WS (443)'
    },
    {
      key: 'http-443',
      value: 443,
      label: 'HTTP (443)'
    },
    {
      key: 'custom',
      value: 0,
      label: 'Custom'
    }
  ];

  getConnection = (type: string): IItServiceConnectionOption[] => {
    switch (type) {
      case 'AWS':
        return this.itServiceConnection
          .filter((conn) => conn.key === 'mqtt-8883')
          .map((conn) => ({ ...conn, default: true }));
      case 'MQTT':
        return this.itServiceConnection
          .filter((conn) => ['mqtt-1883', 'custom'].includes(conn.key))
          .map((conn) => (conn.key === 'mqtt-1883' ? { ...conn, default: true } : conn));
      case 'AZURE':
        return this.itServiceConnection
          .filter((conn) => ['mqtt-8883', 'amqp-5671', 'mqtt-443', 'amqp-443'].includes(conn.key))
          .map((conn) => (conn.key === 'mqtt-8883' ? { ...conn, default: true } : conn));
      case 'HTTP':
        return this.itServiceConnection
          .filter((conn) => ['http-443', 'custom'].includes(conn.key))
          .map((conn) => (conn.key === 'http-443' ? { ...conn, default: true } : conn));
      default:
        return [];
    }
  };

  private qoSTooltip = {
    0: 'QoS 0: At most once.',
    1: 'QoS 1: At least once.',
    2: 'QoS 2: Exactly once.'
  };

  getQoSTooltipText = (array: number[] | null): string => {
    if (array === null) {
      return Object.values(this.qoSTooltip).join('\n');
    } else {
      return array
        .map((level) => this.qoSTooltip[level])
        .filter(Boolean)
        .join('\n');
    }
  };
}
