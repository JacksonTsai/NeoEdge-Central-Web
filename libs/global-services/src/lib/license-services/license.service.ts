import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ICompanyLicense,
  IGetCompanyOrdersResp,
  IProjectLicense,
  TableQueryForCompanyOrder
} from '@neo-edge-web/models';
import { setParamsArrayWithKey } from '@neo-edge-web/utils';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpService } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);

  private LICENSE_PROJECT_PATH = '/project/licenses';
  private LICENSE_COMPANY_PATH = '/company/licenses';
  private LICENSE_COMPANY_ORDER_PATH = '/company/orders';

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  getProjectLicense$ = (): Observable<IProjectLicense[]> => {
    return this.#http.get(`${this.LICENSE_PROJECT_PATH}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Get project licenses failure', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  getCompanyLicense$ = (): Observable<ICompanyLicense[]> => {
    return this.#http.get(`${this.LICENSE_COMPANY_PATH}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Get company licenses failure', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  getCompanyOrders$ = (queryStr: TableQueryForCompanyOrder): Observable<IGetCompanyOrdersResp> => {
    const params = setParamsArrayWithKey(queryStr);
    return this.#http.get(`${this.LICENSE_COMPANY_ORDER_PATH}?${params}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Get company licenses orders failure', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };
}
