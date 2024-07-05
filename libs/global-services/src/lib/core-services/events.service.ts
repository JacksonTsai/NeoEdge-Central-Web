import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IGetEventDocResp } from '@neo-edge-web/models';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpService } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  private EVENTS_DOC_PATH = '/codebooks/events';

  getEventsDoc$ = (): Observable<IGetEventDocResp> => {
    return this.#http.get(this.EVENTS_DOC_PATH).pipe(
      catchError((err) => {
        this.#snackBar.open('Get Events document failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };
}
