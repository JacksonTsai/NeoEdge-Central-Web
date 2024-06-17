import { Route } from '@angular/router';
import { CreateOtDevicePageComponent, OtDeviceDetailPageComponent, OtDevicesPageComponent } from './containers';

export const otDeviceProfileRoutes: Route[] = [
  { path: '', component: OtDevicesPageComponent },
  {
    path: 'create',
    component: CreateOtDevicePageComponent
  },
  {
    path: ':id',
    component: OtDeviceDetailPageComponent
  }
];
