import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface RestConfig {
  basePath: string;
}

export const REST_CONFIG = new InjectionToken<RestConfig>('REST_CONFIG');

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private httpOptions = {
    withCredentials: true
  };

  constructor(private http: HttpClient, @Inject(REST_CONFIG) private restConfig: RestConfig) {}

  private formatError = (error: HttpErrorResponse) => {
    throw error;
  };

  get(
    url: string,
    query?: HttpParams | { [param: string]: string | string[] },
    config?: { basePath: string }
  ): Observable<any> {
    const basePath = config && config.basePath ? config.basePath : this.restConfig.basePath;
    return this.http.get(`${basePath}${url}`, { params: query }).pipe(catchError(this.formatError));
  }

  put(url: string, payload = {}, config?: { basePath: string }): Observable<any> {
    const basePath = config && config.basePath ? config.basePath : this.restConfig.basePath;
    return this.http.put(`${basePath}${url}`, payload, this.httpOptions).pipe(catchError(this.formatError));
  }

  patch(url: string, payload = {}, config?: { basePath: string }): Observable<any> {
    const basePath = config && config.basePath ? config.basePath : this.restConfig.basePath;
    return this.http.patch(`${basePath}${url}`, payload, this.httpOptions).pipe(catchError(this.formatError));
  }

  post(url: string, payload = {}, config?: { basePath: string }): Observable<any> {
    const basePath = config && config.basePath ? config.basePath : this.restConfig.basePath;
    return this.http.post(`${basePath}${url}`, payload, this.httpOptions).pipe(catchError(this.formatError));
  }

  delete(url: string, payload: any = [], config?: { basePath: string }): Observable<any> {
    const basePath = config && config.basePath ? config.basePath : this.restConfig.basePath;
    return this.http
      .request('DELETE', `${basePath}${url}`, {
        body: payload,
        withCredentials: this.httpOptions.withCredentials
      })
      .pipe(catchError(this.formatError));
  }
}
