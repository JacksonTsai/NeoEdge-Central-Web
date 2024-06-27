import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TableQueryForNeoFlows } from '@neo-edge-web/models';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpService } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class NeoFlowsService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);

  private NEOFLOWS_PATH = '/project/neoflows';

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  neoFlowsTable$ = (queryStr?: TableQueryForNeoFlows): Observable<any> => {
    const params = new URLSearchParams();
    if (queryStr) {
      if (queryStr?.page) {
        params.set('page', queryStr.page.toString());
      }
      if (queryStr?.size) {
        params.set('size', queryStr.size.toString());
      }
      if (queryStr?.name) {
        params.set('names', queryStr.name);
      }
    }
    return this.#http.get(`${this.NEOFLOWS_PATH}${params}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Get neoflows failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  deleteNeoFlow$ = (projectId: number) => {
    return this.#http.delete(`${this.NEOFLOWS_PATH}/${projectId}`).pipe(
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
}
