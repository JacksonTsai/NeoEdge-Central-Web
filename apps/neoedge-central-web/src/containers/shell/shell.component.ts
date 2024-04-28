import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import * as AuthStore from '@neo-edge-web/auth-store';
import { NeLayoutComponent, NeMenuComponent } from '@neo-edge-web/components';
import { RouterStoreService, selectMenuTree, selectUserProfile, updateMenu } from '@neo-edge-web/global-store';
import { MenuItem } from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { map, take, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MENU_TREE } from '../../configs/nec-menu.config';

const REFRESH_TOKEN_INTERVAL = 1000 * 60 * 45;

@UntilDestroy()
@Component({
  selector: 'nec-shell',
  standalone: true,
  imports: [
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    NeLayoutComponent,
    NeMenuComponent,
    ShellComponent,
    LetDirective,
    NgClass,
    NgIf
  ],
  template: `
    <ne-layout
      *ngrxLet="changePath$"
      [role]="role()"
      [userName]="userName()"
      [version]="appVersion"
      [logoPath]="'assets/images/neoedge_logo_light.png'"
    >
      <ne-menu
        *ngrxLet="necMenuTree$ as necMenuTree"
        sideMenu
        [menuTree]="necMenuTree"
        (handleMenuItemSelected)="onMenuItemSelected($event)"
      >
      </ne-menu>
      <router-outlet></router-outlet>
    </ne-layout>
  `,
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent implements OnInit {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  #routerStoreService = inject(RouterStoreService);
  #globalStore = inject(Store);
  #router = inject(Router);
  appVersion = environment.version;
  userName = signal('');
  role = signal('');
  isMobile = false;
  isMenuCollapsed = true;
  defaultMenuTree = MENU_TREE;
  necMenuTree: MenuItem[] = [];
  necMenuTree$ = this.#globalStore.select(selectMenuTree).pipe(
    tap((d) => {
      this.necMenuTree = d;
    })
  );

  constructor() {
    this.#globalStore.dispatch(updateMenu({ menuTree: this.defaultMenuTree }));
  }

  protected changePath$ = this.#routerStoreService.getUrl$.pipe(
    tap((url) => {
      const menuTree = this.#updateMenuTree(url, this.defaultMenuTree);
      this.#globalStore.dispatch(updateMenu({ menuTree }));
    }),
    untilDestroyed(this)
  );

  protected onMenuItemSelected = (menuItem: MenuItem) => {
    if (menuItem?.children && menuItem.children?.length) {
      const menuTree = this.necMenuTree.map((d) =>
        d.path === menuItem.path ? { ...d, isExpanded: !d.isExpanded } : d
      );
      this.#globalStore.dispatch(updateMenu({ menuTree }));
    }

    if (!menuItem.children || !menuItem.children) {
      this.#router.navigate([menuItem.path]);
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  #updateMenuTree = (path: string, menu: MenuItem[]): MenuItem[] => {
    return menu.map((menuItem) => {
      if (path.toLowerCase() === menuItem.path.toLowerCase()) {
        return { ...menuItem, isActive: true };
      } else if (menuItem?.children && menuItem?.children.length) {
        const children = this.#updateMenuTree(path, menuItem.children);
        const isExpanded = children.findIndex((d) => d.isActive) > -1;
        return { ...menuItem, isExpanded, children };
      } else {
        return { ...menuItem, isActive: false };
      }
    });
  };

  ngOnInit() {
    this.#globalStore.select(selectUserProfile).subscribe(({ userProfile }) => {
      if (userProfile) {
        this.userName.set(userProfile.name);
        this.role.set(userProfile.role.name);
      }
    });

    this.#globalStore
      .select(AuthStore.selectAuthToken)
      .pipe(
        untilDestroyed(this),
        take(1),
        map((d) => {
          this.#globalStore.dispatch(
            AuthStore.refreshAccessTokenAction({ refreshToken: d.refreshToken, interval: REFRESH_TOKEN_INTERVAL })
          );
        })
      )
      .subscribe();
  }
}
