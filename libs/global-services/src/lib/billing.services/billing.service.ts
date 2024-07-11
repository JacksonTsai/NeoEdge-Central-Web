import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DATE_FORMAT, IProjectFeeReq, IProjectFeeResp } from '@neo-edge-web/models';
import { datetimeFormat } from '@neo-edge-web/utils';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpService } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);

  private BILLING_PATH = '/project/fee';

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  getProjectFee$ = (feeParams: IProjectFeeReq): Observable<IProjectFeeResp> => {
    const params = new URLSearchParams();
    Object.entries(feeParams).forEach(([key, value]) => {
      if (value === null || value === '') {
        return;
      }
      if (key.includes('date')) {
        const date = datetimeFormat(
          Math.round(value.getTime() / 1000),
          DATE_FORMAT['YYYY-MM-DD HH:mm:ss'],
          false
        ).replace(/\//, '-');
        params.set(key, date);
      } else {
        params.set(key, value);
      }
    });
    return this.#http.get(`${this.BILLING_PATH}?${params}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Get project usage and fee failure', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };
}
