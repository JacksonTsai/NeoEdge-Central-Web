import { Injectable, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import * as AuthAction from '@neo-edge-web/auth-store';
import { Store } from '@ngrx/store';
import { SessionStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {
  #matIconRegistry = inject(MatIconRegistry);
  #domSanitizer = inject(DomSanitizer);
  #globalStore = inject(Store);
  #storage = inject(SessionStorageService);

  initApp(resolve: () => void) {
    this.#registryIcons();

    const loginResp = this.#storage.retrieve('account');
    const userProfile = this.#storage.retrieve('user_profile');
    if (loginResp && userProfile) {
      this.#globalStore.dispatch(AuthAction.loginSuccess({ loginResp, fromUserLogin: false }));
    }
    setTimeout(() => {
      return resolve();
    }, 300);
  }

  #registryIcons() {
    this.#matIconRegistry.addSvgIconSetInNamespace(
      'icon',
      this.#domSanitizer.bypassSecurityTrustResourceUrl('assets/icons-sprite.svg?ts=' + new Date().getTime())
    );
  }
}
