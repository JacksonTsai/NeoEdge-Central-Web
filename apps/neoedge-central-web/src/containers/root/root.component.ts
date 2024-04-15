import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import * as AuthAction from '@neo-edge-web/auth-store';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { LocalStorageService } from 'ngx-webstorage';

@UntilDestroy()
@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'nec-root',
  template: ` <router-outlet></router-outlet> `,
  styleUrl: './root.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RootComponent implements OnInit {
  #matIconRegistry = inject(MatIconRegistry);
  #domSanitizer = inject(DomSanitizer);
  #globalStore = inject(Store);
  #storage = inject(LocalStorageService);
  constructor() {
    this.#registryIcons();
  }

  #registryIcons() {
    this.#matIconRegistry.addSvgIconSetInNamespace(
      'icon',
      this.#domSanitizer.bypassSecurityTrustResourceUrl('assets/icons-sprite.svg?ts=' + new Date().getTime())
    );
  }

  ngOnInit() {
    const loginResp = this.#storage.retrieve('account');
    const permissions = this.#storage.retrieve('permissions');
    const userProfile = this.#storage.retrieve('user_profile');
    if (loginResp && permissions && userProfile) {
      this.#globalStore.dispatch(AuthAction.loginSuccess({ loginResp, permissions, userProfile }));
    }
  }
}
