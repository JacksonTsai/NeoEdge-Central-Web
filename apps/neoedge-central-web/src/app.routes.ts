import { Route } from '@angular/router';
import { ShellComponent } from './containers/shell/shell.component';
export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    canActivateChild: [],
    children: []
  }
];

export function provideRouterConfig() {
  return [];
}
