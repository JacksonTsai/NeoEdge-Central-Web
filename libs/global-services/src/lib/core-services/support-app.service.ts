import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IGetSupportAppsResp, SUPPORT_APPS_CATEGORIES, SUPPORT_APPS_FLOW_GROUPS } from '@neo-edge-web/models';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpService } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class SupportAppsService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  private SUPPORT_APPS_PATH = '/apps';

  getApps$ = (
    flowGroups: SUPPORT_APPS_FLOW_GROUPS,
    categories?: SUPPORT_APPS_CATEGORIES
  ): Observable<IGetSupportAppsResp> => {
    const params = new URLSearchParams();
    params.set('flowGroups', flowGroups.toString());
    if (categories) {
      params.set('categories', categories.toString());
    }
    return this.#http.get(`${this.SUPPORT_APPS_PATH}?${params}`).pipe(
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
}
