import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  IBillingEstimateResp,
  IBillingParamsReq,
  IDownloadBillingRecordReq,
  IGetBillingRecordResp,
  IGetBillingResp
} from '@neo-edge-web/models';
import { setParamsArrayWithKey } from '@neo-edge-web/utils';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpService } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);

  private BILLING_PROJECT_PATH = '/project/fee';
  private BILLING_COMPANY_PATH = '/company/fee';
  private BILLING_RECORDS_PATH = '/company/billing-records';

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  getProjectFee$ = (queryStr: IBillingParamsReq): Observable<IGetBillingResp> => {
    const params = setParamsArrayWithKey(queryStr);
    return this.#http.get(`${this.BILLING_PROJECT_PATH}?${params}`).pipe(
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

  getCompanyFee$ = (queryStr: IBillingParamsReq): Observable<IGetBillingResp> => {
    const params = setParamsArrayWithKey(queryStr);
    return this.#http.get(`${this.BILLING_COMPANY_PATH}?${params}`).pipe(
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

  getCompanyFeeEstimate$ = (): Observable<IBillingEstimateResp> => {
    return this.#http.get(`${this.BILLING_COMPANY_PATH}/estimate`).pipe(
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

  getCompanyBillingRecords$ = (): Observable<IGetBillingRecordResp> => {
    return this.#http.get(`${this.BILLING_RECORDS_PATH}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Get company billing records failure', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  downloadBillingRecordPDF$ = (queryStr: IDownloadBillingRecordReq): Observable<ArrayBuffer> => {
    const params = setParamsArrayWithKey(queryStr);
    return this.#http.getArrayBuffer(`${this.BILLING_RECORDS_PATH}/download?${params}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Download company billing record failure', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };
}
