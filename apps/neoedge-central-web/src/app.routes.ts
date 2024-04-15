import { Route } from '@angular/router';
import { AuthGuard } from '@neo-edge-web/global-guards';
import { ShellComponent } from './containers/shell/shell.component';
export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'user-management/users',
        loadChildren: () => import('@neo-edge-web/users').then((m) => m.usersRoutes),
        data: {
          preload: true
        }
      },
      {
        path: '',
        redirectTo: 'user-management/users',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'login',
    loadChildren: () => import('@neo-edge-web/login').then((m) => m.loginRoutes),
    data: {
      preload: true
    }
  },
  {
    path: '**',
    redirectTo: '/user-management/users'
  }
];
