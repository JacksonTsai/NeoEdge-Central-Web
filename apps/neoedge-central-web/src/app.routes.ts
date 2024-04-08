import { Route } from '@angular/router';
import { ShellComponent } from './containers/shell/shell.component';
export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    canActivateChild: [],
    children: [
      {
        path: 'project/demo1',
        loadComponent: () => import('./demo-component/demo1/demo1.component').then((mod) => mod.Demo1Component)
      },
      {
        path: 'project/demo2',
        loadComponent: () => import('./demo-component/demo2/demo2.component').then((mod) => mod.Demo2Component)
      },
      {
        path: 'project/demo3',
        loadComponent: () => import('./demo-component/demo3/demo3.component').then((mod) => mod.Demo3Component)
      }
    ]
  }
];

export function provideRouterConfig() {
  return [];
}
