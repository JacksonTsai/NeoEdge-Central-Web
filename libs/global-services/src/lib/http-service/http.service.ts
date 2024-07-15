import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface RestConfig {
  basePath: string;
  authPath: string;
  wsPath: string;
  docPath: string;
}

interface IHttpGet {
  config?: { basePath: string };
  query?: HttpParams | { [param: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  headers?: HttpHeaders | { [header: string]: string | string[] };
  observe?: 'body';
  reportProgress?: boolean;
  withCredentials?: boolean;
}

type THttpGetArrayBuffer = IHttpGet & {
  responseType: 'arraybuffer';
};

export const REST_CONFIG = new InjectionToken<RestConfig>('REST_CONFIG');

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private httpOptions = {
    withCredentials: false
  };

  #restConfig = inject(REST_CONFIG);
  #http = inject(HttpClient);

  private formatError = (error: HttpErrorResponse) => {
    return throwError(() => error);
  };

  get(url: string, params?: IHttpGet): Observable<any> {
    const basePath = params?.config && params.config?.basePath ? params.config.basePath : this.#restConfig.basePath;
    return this.#http.get(`${basePath}${url}`, { params: params?.query }).pipe(catchError(this.formatError));
  }

  getArrayBuffer(url: string, params?: IHttpGet): Observable<any> {
    const basePath = params?.config && params.config?.basePath ? params.config.basePath : this.#restConfig.basePath;
    const options: THttpGetArrayBuffer = {
      params: params?.query,
      headers: params?.headers,
      responseType: 'arraybuffer'
    };
    return this.#http.get(`${basePath}${url}`, options).pipe(catchError(this.formatError));
  }

  put(url: string, payload = {}, config?: { basePath: string }): Observable<any> {
    const basePath = config && config.basePath ? config.basePath : this.#restConfig.basePath;
    return this.#http.put(`${basePath}${url}`, payload, this.httpOptions).pipe(catchError(this.formatError));
  }

  patch(url: string, payload = {}, config?: { basePath: string }): Observable<any> {
    const basePath = config && config.basePath ? config.basePath : this.#restConfig.basePath;
    return this.#http.patch(`${basePath}${url}`, payload, this.httpOptions).pipe(catchError(this.formatError));
  }

  post(url: string, payload = {}, config?: { basePath: string }): Observable<any> {
    const basePath = config && config.basePath ? config.basePath : this.#restConfig.basePath;
    return this.#http.post(`${basePath}${url}`, payload, this.httpOptions).pipe(catchError(this.formatError));
  }

  delete(url: string, payload: any = [], config?: { basePath: string }): Observable<any> {
    const basePath = config && config.basePath ? config.basePath : this.#restConfig.basePath;
    return this.#http
      .request('DELETE', `${basePath}${url}`, {
        body: payload,
        withCredentials: this.httpOptions.withCredentials
      })
      .pipe(catchError(this.formatError));
  }
}
