import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IGetSubscriptionResp, IUpgradePlanReq } from '@neo-edge-web/models';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpService } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionPlanService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);

  SUBSCRIPTION_PATH = '/company/subscription';
  UPGRADE_PLAN_PATH = '/company/subscription/upgrade';

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  currentPlan$ = (): Observable<IGetSubscriptionResp> => {
    return this.#http.get(this.SUBSCRIPTION_PATH).pipe(
      catchError((err) => {
        this.#snackBar.open('Get current plan failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  upgradePlan$ = (payload: IUpgradePlanReq) =>
    this.#http.post(this.UPGRADE_PLAN_PATH, payload).pipe(
      tap(() => {
        this.#snackBar.open('Emil Sent successfully.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
      }),
      catchError((err) => {
        this.#snackBar.open('Send email failed.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
}
