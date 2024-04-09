import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { REST_CONFIG } from '@neo-edge-web/global-service';
import { CustomRouterStateSerializer, menuReducer } from '@neo-edge-web/global-store';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { appRoutes, provideRouterConfig } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(appRoutes),
    provideStore({ menuTree: menuReducer, router: routerReducer }),
    provideRouterStore({ serializer: CustomRouterStateSerializer }),
    provideRouterConfig(),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideRouterStore(),
    {
      provide: REST_CONFIG,
      useValue: {
        basePath: environment.basePath
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
