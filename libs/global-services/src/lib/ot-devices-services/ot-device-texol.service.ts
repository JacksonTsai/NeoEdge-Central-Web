import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@neo-edge-web/neoedge-central-web/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpService, REST_CONFIG } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class OtTexolService {
  #snackBar = inject(MatSnackBar);
  #http = inject(HttpService);
  restConfig = inject(REST_CONFIG);

  private readonly TEXOL_TAG_DOC_BASE_PATH = () => {
    return environment.production
      ? `${this.restConfig.docPath}/neoedgex/advanced_app/texol/device_profile/TexolTagDoc.json`
      : '/neoedgex/advanced_app/texol/device_profile/TexolTagDoc.json';
  };

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  getTexolDoc$ = (): Observable<any> => {
    return this.#http.get(this.TEXOL_TAG_DOC_BASE_PATH(), { config: { basePath: ' ' } }).pipe(
      catchError((err) => {
        this.#snackBar.open('Get texol doc failure', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };
}
