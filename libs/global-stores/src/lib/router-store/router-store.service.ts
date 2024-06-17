import { Injectable, inject } from '@angular/core';
import { Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectDataFromRouter, selectParams, selectQueryParams, selectUrl } from './route-state.selectors';

@Injectable({
  providedIn: 'root'
})
export class RouterStoreService {
  store = inject(Store);

  readonly getUrl$: Observable<string> = this.store.select(selectUrl);

  readonly getParams$: Observable<Params> = this.store.select(selectParams);

  readonly getQueryParams$: Observable<Params> = this.store.select(selectQueryParams);

  readonly getDataFromRouter$: Observable<Params> = this.store.select(selectDataFromRouter);
}
