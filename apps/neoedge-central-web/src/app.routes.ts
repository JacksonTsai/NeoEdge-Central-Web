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
        path: 'project/dashboard',
        loadChildren: () => import('@neo-edge-web/dashboard').then((m) => m.dashboardRoutes),
        data: {
          preload: true
        }
      },
      {
        path: 'company-account/company-info',
        loadChildren: () => import('@neo-edge-web/company-info').then((m) => m.companyInfoRoutes),
        data: {
          preload: true
        }
      },
      {
        path: 'user-management/users',
        loadChildren: () => import('@neo-edge-web/users').then((m) => m.usersRoutes),
        data: {
          preload: true
        }
      },
      {
        path: 'user-management/roles',
        loadChildren: () => import('@neo-edge-web/roles').then((m) => m.rolesRoutes),
        data: {
          preload: true
        }
      },
      {
        path: 'company-account/subscription-plan',
        loadChildren: () => import('@neo-edge-web/subscription-plan').then((m) => m.subscriptionPlanRoutes),
        data: {
          preload: true
        }
      },
      {
        path: 'project-management/projects',
        loadChildren: () => import('@neo-edge-web/projects').then((m) => m.projectsRoutes),
        data: {
          preload: true
        }
      },
      {
        path: 'user/switch-project',
        loadChildren: () => import('@neo-edge-web/projects').then((m) => m.projectsRoutes),
        data: {
          preload: true
        }
      },
      {
        path: 'user/profile',
        loadChildren: () => import('@neo-edge-web/user-profile').then((m) => m.userProfileRoutes),
        data: {
          preload: true
        }
      },
      {
        path: 'project/gateways',
        loadChildren: () => import('@neo-edge-web/gateways').then((m) => m.gatewaysRoutes),
        data: {
          preload: true
        }
      },
      {
        path: 'neoflow/ot-device-profile',
        loadChildren: () => import('@neo-edge-web/ot-devices-profile').then((m) => m.otDeviceProfileRoutes),
        data: {
          preload: true
        }
      },
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'active-user',
    loadChildren: () => import('@neo-edge-web/active-reset-user').then((m) => m.ActiveResetUserRoutes),
    data: {
      trigger: 'active-user',
      preload: true
    }
  },
  {
    path: 'forget-password',
    loadChildren: () => import('@neo-edge-web/active-reset-user').then((m) => m.ActiveResetUserRoutes),
    data: {
      trigger: 'forget-password',
      preload: true
    }
  },
  {
    path: 'request-new-password',
    loadChildren: () => import('@neo-edge-web/request-new-password').then((m) => m.RequestNewPasswordRoutes),
    data: {
      preload: true
    }
  },
  {
    path: 'login',
    loadChildren: () => import('@neo-edge-web/login').then((m) => m.loginRoutes),
    data: {
      preload: true
    }
  },
  {
    path: 'icons',
    loadChildren: () => import('@neo-edge-web/icons').then((m) => m.iconsRoutes),
    data: {
      preload: true
    }
  },
  {
    path: '**',
    redirectTo: '/company-account/company-info'
  }
];
