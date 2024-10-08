import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IGetOtDevicesResp, IOtDevice, TOtProfileById, TTableQueryForOtDevices } from '@neo-edge-web/models';
import { obj2FormData } from '@neo-edge-web/utils';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpService } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class OtDevicesService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  private OT_DEVICE_PROFILES_PATH = '/project/ot-device-profiles';

  otDevices$ = (queryStr?: TTableQueryForOtDevices): Observable<IGetOtDevicesResp> => {
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
      if (queryStr?.names) {
        params.set('labelIds', queryStr.names.toString());
      }
    }
    return this.#http.get(`${this.OT_DEVICE_PROFILES_PATH}?${params}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Get ot devices failure', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  OtDevice$ = (profileId: number): Observable<TOtProfileById<any>> => {
    return this.#http.get(`${this.OT_DEVICE_PROFILES_PATH}/${profileId}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Get ot profile failure', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  createOtDevice$ = ({ profile, deviceIcon }: { profile: any; deviceIcon?: File }) => {
    const payloadStringify = {
      profile: JSON.stringify(profile)
    };

    if (deviceIcon) {
      payloadStringify['deviceIcon'] = deviceIcon;
    }
    const formData = obj2FormData(payloadStringify);
    return this.#http.post(this.OT_DEVICE_PROFILES_PATH, formData).pipe(
      map((resp) => {
        this.#snackBar.open('Create ot device successfully.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });

        return resp;
      }),
      catchError((err) => {
        this.#snackBar.open('Create ot device failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  editOtDevice$ = ({ profileId, profile, deviceIcon }: { profileId: number; profile: any; deviceIcon?: File }) => {
    const payloadStringify = {
      profile: JSON.stringify(profile)
    };

    if (deviceIcon) {
      payloadStringify['deviceIcon'] = deviceIcon;
    }

    const formData = obj2FormData(payloadStringify);
    return this.#http.put(`${this.OT_DEVICE_PROFILES_PATH}/${profileId}`, formData).pipe(
      map((resp) => {
        this.#snackBar.open('Edit ot device successfully.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });

        return resp;
      }),
      catchError((err) => {
        this.#snackBar.open('Edit  ot device failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  copyDevice$ = (profileId, name) => {
    return this.#http.post(`${this.OT_DEVICE_PROFILES_PATH}/${profileId}/copy`, { name }).pipe(
      map((resp) => {
        this.#snackBar.open('Copy ot device successfully.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });

        return resp;
      }),
      catchError((err) => {
        this.#snackBar.open('Copy ot device failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  deleteOtDevice$ = (profileId: number, name: string) =>
    this.#http.delete(`${this.OT_DEVICE_PROFILES_PATH}/${profileId}`, { name }).pipe(
      map((resp) => {
        this.#snackBar.open('Delete ot device successfully.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });

        return resp;
      }),
      catchError((err) => {
        this.#snackBar.open('Delete ot device failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );

  otDeviceDetailByProfileId$ = (profileId: number): Observable<IOtDevice<any>> => {
    return this.#http.get(`${this.OT_DEVICE_PROFILES_PATH}/${profileId}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Get ot device profile failure', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };
}
