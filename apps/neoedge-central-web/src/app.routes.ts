import { Route } from '@angular/router';
import { ShellComponent } from './containers/shell/shell.component';
export const appRoutes: Route[] = [
  {
    path: '123',
    component: ShellComponent,
    canActivateChild: [],
    children: [
      {
        path: 'user',
        loadChildren: () => import('@neo-edge-web/users').then((m) => m.usersRoutes),
        data: {
          preload: true
        }
      }
    ]
  },
  {
    path: 'login',
    loadChildren: () => import('@neo-edge-web/login').then((m) => m.loginRoutes),
    data: {
      preload: true
    }
  }
];

export function provideRouterConfig() {
  return [];
}
