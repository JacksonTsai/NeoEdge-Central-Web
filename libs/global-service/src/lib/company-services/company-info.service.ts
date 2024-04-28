import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICompanyProfileResp, IEditCompanyProfileReq } from '@neo-edge-web/models';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpService, REST_CONFIG } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class CompanyInfoService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);
  #restConfig = inject(REST_CONFIG);

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  private COMPANY_PROFILE_PATH = '/company/profile';

  companyProfile$: Observable<ICompanyProfileResp> = this.#http.get(this.COMPANY_PROFILE_PATH).pipe(
    catchError((err) => {
      this.#snackBar.open('Get company profile failure', 'X', {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 5000
      });
      return this.handleError(err);
    })
  );

  editCompanyProfile$ = (payload: IEditCompanyProfileReq) => {
    return this.#http.put(this.COMPANY_PROFILE_PATH, payload).pipe(
      tap(() => {
        this.#snackBar.open('Edit success.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
      }),
      catchError((err) => {
        this.#snackBar.open('Edit failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };
}
