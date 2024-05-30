import { Route } from '@angular/router';
import { GatewayDetailPageComponent, GatewaysPageComponent } from './containers';

export const gatewaysRoutes: Route[] = [
  {
    path: '',
    component: GatewaysPageComponent
  },
  {
    path: ':id',
    component: GatewayDetailPageComponent
  }
];
