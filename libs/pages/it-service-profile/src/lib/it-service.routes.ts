import { Route } from '@angular/router';
import { CreateItServicePageComponent, ItServiceDetailPageComponent, ItServicePageComponent } from './containers';

export const itServiceProfileRoutes: Route[] = [
  {
    path: '',
    component: ItServicePageComponent
  },
  {
    path: ':id',
    component: ItServiceDetailPageComponent
  },
  {
    path: 'create',
    component: CreateItServicePageComponent
  }
];
