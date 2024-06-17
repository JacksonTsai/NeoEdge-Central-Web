import { Route } from '@angular/router';
import { CreateItServicePageComponent, ItServiceDetailPageComponent, ItServicePageComponent } from './containers';

export const itServiceProfileRoutes: Route[] = [
  {
    path: '',
    component: ItServicePageComponent
  },
  {
    path: 'create',
    component: CreateItServicePageComponent
  },
  {
    path: ':id',
    component: ItServiceDetailPageComponent
  }
];
