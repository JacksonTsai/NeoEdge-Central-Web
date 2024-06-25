import { Route } from '@angular/router';
import { CreateNeoflowPageComponent, DetailNeoflowPageComponent, NeoflowsPageComponent } from './containers';

export const neoflowsRoutes: Route[] = [
  {
    path: '',
    component: NeoflowsPageComponent
  },
  {
    path: 'create',
    component: CreateNeoflowPageComponent
  },
  {
    path: ':id',
    component: DetailNeoflowPageComponent
  }
];
