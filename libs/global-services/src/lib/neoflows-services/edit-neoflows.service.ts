import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpService } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class EditNeoFlowService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);

  private NEOFLOWS_PATH = '/project/neoflows';

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  getNeoFlowById$ = (id: number): Observable<any> => {
    return this.#http.get(`${this.NEOFLOWS_PATH}/${id}`).pipe(
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

  editNeoFlow$ = (id: number, payload: any) =>
    this.#http.put(`${this.NEOFLOWS_PATH}/${id}`, payload).pipe(
      tap(() => {
        this.#snackBar.open('Edit successfully.', 'X', {
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
}
