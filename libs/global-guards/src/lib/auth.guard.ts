import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, Router, RouterStateSnapshot } from '@angular/router';
import * as authStore from '@neo-edge-web/auth-store';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

export const AuthGuard: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  return inject(Store)
    .select(authStore.selectLoginState)
    .pipe(
      map((loginState: { isLoginSuccess: boolean | null }) => {
        if (loginState?.isLoginSuccess) {
          return loginState.isLoginSuccess;
        } else {
          router.navigate(['/login']);
          return false;
        }
      })
    );
};
