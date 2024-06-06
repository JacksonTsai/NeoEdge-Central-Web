import { Route } from '@angular/router';
import { CreateOtDevicePageComponent, OtDeviceDetailPageComponent, OtDevicesPageComponent } from './containers';

export const otDeviceProfileRoutes: Route[] = [
  { path: '', component: OtDevicesPageComponent },
  {
    path: ':id',
    component: OtDeviceDetailPageComponent
  },
  {
    path: 'create',
    component: CreateOtDevicePageComponent
  }
];
