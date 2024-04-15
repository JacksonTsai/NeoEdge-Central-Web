import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { AuthInterceptor, REST_CONFIG } from '@neo-edge-web/global-service';
import { AuthEffects, CustomRouterStateSerializer, authReducer, menuReducer } from '@neo-edge-web/global-store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideStore({ menuTree: menuReducer, router: routerReducer, auth: authReducer }),
    provideRouterStore({ serializer: CustomRouterStateSerializer }),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideEffects([AuthEffects]),
    importProvidersFrom([
      NgxWebstorageModule.forRoot({
        prefix: 'ne',
        separator: '_'
      }),
      NgxPermissionsModule.forRoot(),
      MatSnackBarModule,
      MatDialogModule
    ]),
    {
      provide: REST_CONFIG,
      useValue: {
        basePath: environment.basePath,
        authPath: environment.authPath
      }
    },
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75
    })
  ]
};
