import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IEditRoleReq, IGetRoleByIdResp, IGetRolesResp, TableQueryForRoles } from '@neo-edge-web/models';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpService, REST_CONFIG } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);
  #restConfig = inject(REST_CONFIG);

  private ROLES_PATH = '/roles';

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  roles$ = (queryStr?: TableQueryForRoles): Observable<IGetRolesResp> => {
    const params = new URLSearchParams();
    if (queryStr) {
      if (queryStr?.page) {
        params.set('page', queryStr.page.toString());
      }
      if (queryStr?.size) {
        params.set('size', queryStr.size.toString());
      }
      if (queryStr?.names) {
        params.set('names', queryStr.names);
      }
    }

    return this.#http.get(`${this.ROLES_PATH}?${params}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Get roles failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  getRoleById$ = (id: number): Observable<IGetRoleByIdResp> => {
    return this.#http.get(`${this.ROLES_PATH}/${id}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Get role failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  addRole$ = (payload: IEditRoleReq) =>
    this.#http.post(this.ROLES_PATH, payload).pipe(
      tap(() => {
        this.#snackBar.open('Add successfully.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
      }),
      catchError((err) => {
        this.#snackBar.open('Add failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );

  editRole$ = (roleId: number, payload: IEditRoleReq) =>
    this.#http.put(`${this.ROLES_PATH}/${roleId}`, payload).pipe(
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

  deleteRole$ = (userId: number, name: string) => {
    return this.#http.delete(`${this.ROLES_PATH}/${userId}`, { name }).pipe(
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
