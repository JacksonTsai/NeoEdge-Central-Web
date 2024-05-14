import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICustomOSResp, IPartnersIpcResp } from '@neo-edge-web/models';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpService } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class IpcsService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  private IPC_CUSTOM_OS_PATH = '/ipcs/custom/oss';
  private IPC_PARTNERS_PATH = '/ipcs/partners';

  customIpcOS$: Observable<ICustomOSResp> = this.#http.get(`${this.IPC_CUSTOM_OS_PATH}`).pipe(
    catchError((err) => {
      this.#snackBar.open('Get user projects failure', 'X', {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 5000
      });
      return this.handleError(err);
    })
  );

  partnersIpc$: Observable<IPartnersIpcResp> = this.#http.get(`${this.IPC_PARTNERS_PATH}`).pipe(
    catchError((err) => {
      this.#snackBar.open('Get ipc of partners failure', 'X', {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 5000
      });
      return this.handleError(err);
    })
  );
}
