import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { AuthInterceptor, PERMISSION_OPTIONS, REST_CONFIG } from '@neo-edge-web/global-service';
import { AuthEffects, CustomRouterStateSerializer, authReducer, menuReducer } from '@neo-edge-web/global-store';
import { ENV_VARIABLE, environment } from '@neo-edge-web/neoedge-central-web/environment';
import packageJson from '@neo-edge-web/package-json';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { appRoutes } from './app.routes';
import { AppInitService } from './services/app-init.service';

function initApp(appInitService: AppInitService) {
  return () => {
    return new Promise<void>((resolve) => {
      appInitService.initApp(resolve);
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideStore({ menuTree: menuReducer, router: routerReducer, auth: authReducer }),
    provideRouterStore({ serializer: CustomRouterStateSerializer }),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideEffects([AuthEffects]),
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AppInitService],
      multi: true
    },
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
        authPath: environment.authPath,
        wsPath: environment.wsPath
      }
    },
    {
      provide: ENV_VARIABLE,
      useValue: {
        eulaVersion: environment.eulaVersion,
        betaVersion: packageJson.betaVersion,
        version: packageJson.version
      }
    },
    {
      provide: PERMISSION_OPTIONS,
      useValue: {
        options: environment.permissionOptions
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
