import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  IEditProjectReq,
  IGetProjectsResp,
  IProjectByIdResp,
  IProjectLabelsReqResp,
  TGetProjectEventLogsParams,
  TableQueryForProjects
} from '@neo-edge-web/models';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpService } from '../http-service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  #http = inject(HttpService);
  #snackBar = inject(MatSnackBar);

  private PROJECTS_PATH = '/projects';
  private SWITCH_PROJECT_PATH = (projectId: number) => `/project/${projectId}`;
  private LABEL_BY_PROJECT_ID_PATH = '/project/labels';
  private EVENT_LOGS_BY_PROJECT_ID_PATH = '/project/events';

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }

  projectTable$ = (queryStr?: TableQueryForProjects): Observable<IGetProjectsResp> => {
    let queryString = '';
    if (queryStr && Object.keys(queryStr).length > 0) {
      queryString = `?page=${queryStr?.page ?? 1}&size=${queryStr?.size ?? 10}`;
      if (queryStr?.name) {
        queryString = `${queryString}&names=${queryStr.name}`;
      }
    }
    return this.#http.get(`${this.PROJECTS_PATH}${queryString}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Get projects failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  getProjectById$ = (id: number): Observable<IProjectByIdResp> => {
    return this.#http.get(`${this.PROJECTS_PATH}/${id}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Get project failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  addProject$ = (payload: IEditProjectReq) =>
    this.#http.post(this.PROJECTS_PATH, payload).pipe(
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

  editProject$ = (id: number, payload: IEditProjectReq) =>
    this.#http.put(`${this.PROJECTS_PATH}/${id}`, payload).pipe(
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

  deleteProject$ = (projectId: number, name: string) => {
    return this.#http.delete(`${this.PROJECTS_PATH}/${projectId}`, { name }).pipe(
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

  getProjectLabels$ = (): Observable<IProjectLabelsReqResp> => {
    return this.#http.get(this.LABEL_BY_PROJECT_ID_PATH).pipe(
      catchError((err) => {
        this.#snackBar.open('Get project labels failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };

  editProjectLabels$ = (payload: IProjectLabelsReqResp) =>
    this.#http.put(this.LABEL_BY_PROJECT_ID_PATH, payload).pipe(
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

  switchProject$ = (projectId: number) =>
    this.#http.put(this.SWITCH_PROJECT_PATH(projectId)).pipe(
      catchError((err) => {
        this.#snackBar.open('switch project failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );

  getProjectEventLogs$ = (eventLogsParams: TGetProjectEventLogsParams) => {
    const params = new URLSearchParams(
      Object.entries(eventLogsParams).map(([key, value]) => [key, typeof value === 'number' ? value.toString() : value])
    );
    return this.#http.get(`${this.EVENT_LOGS_BY_PROJECT_ID_PATH}?${params}`).pipe(
      catchError((err) => {
        this.#snackBar.open('Get project event logs failure.', 'X', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        });
        return this.handleError(err);
      })
    );
  };
}
