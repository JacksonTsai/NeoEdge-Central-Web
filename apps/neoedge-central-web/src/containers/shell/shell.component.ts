import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import * as AuthStore from '@neo-edge-web/auth-store';
import { NeLayoutComponent, NeMenuComponent } from '@neo-edge-web/components';
import { AutoLogoutService } from '@neo-edge-web/global-services';
import { RouterStoreService, selectMenuTree, selectUserProfile, updateMenu } from '@neo-edge-web/global-stores';
import { MenuItem, PERMISSION } from '@neo-edge-web/models';
import { ENV_VARIABLE } from '@neo-edge-web/neoedge-central-web/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { combineLatest, map, take } from 'rxjs';
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
    MatMenuModule,
    AsyncPipe,
    NgIf
  ],
  template: `
    <div *ngIf="necMenuTree$ | async">
      <ne-layout
        *ngrxLet="changePath$"
        [role]="role()"
        [userName]="userName()"
        [version]="appVersion"
        [logoPath]="'assets/images/neoedge_logo_light.png'"
      >
        <div userMenu>
          <button mat-menu-item (click)="goToCompany()">
            <span>My Company</span>
          </button>
          <button mat-menu-item (click)="goToUserProfile()">
            <span>My Profile</span>
          </button>
          @if (userProjects().length > 0) {
            <button mat-menu-item (click)="onSwitchProject()">
              <span>Switch Project</span>
            </button>
          }
          <a
            mat-menu-item
            href="https://docs.neoedgecentral.com/legal/NeoEdgeX_EULA_1.0.pdf"
            target="_blank"
            rel="noreferrer noopener"
          >
            <span>NeoEdge X EULA</span>
          </a>
          <a
            mat-menu-item
            href="https://docs.neoedgecentral.com/legal/NeoEdge_Central_EULA_1.0.pdf"
            target="_blank"
            rel="noreferrer noopener"
          >
            <span>NeoEdge Central EULA</span>
          </a>
          <a mat-menu-item href="mailto:NeoEdge_Service@ecloudvalley.com"><span>Help</span></a>
          <button mat-menu-item (click)="onLogout()">
            <span>Logout</span>
          </button>
        </div>
        <ne-menu sideMenu [menuTree]="menuTreeByPermission()" (handleMenuItemSelected)="onMenuItemSelected($event)">
        </ne-menu>
        <router-outlet></router-outlet>
      </ne-layout>
    </div>
  `,
  styleUrl: './shell.component.scss',
  providers: [AutoLogoutService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent implements OnInit, OnDestroy {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  #routerStoreService = inject(RouterStoreService);
  #autoLogoutService = inject(AutoLogoutService);
  #globalStore = inject(Store);
  #router = inject(Router);
  envVariable = inject(ENV_VARIABLE);
  appVersion = this.envVariable.betaVersion;
  userName = signal('');
  role = signal('');
  userProjects = signal([]);
  defaultMenuTree = MENU_TREE;
  menuTreeByPermission = signal<MenuItem[]>([]);
  isMobile = false;
  isMenuCollapsed = true;
  necMenuTree$ = this.#globalStore.select(selectMenuTree).pipe(
    map((d) => {
      this.menuTreeByPermission.set(d);
      return d;
    })
  );

  changePath$ = this.#routerStoreService.getUrl$.pipe(
    map((url) => {
      const shortUrl = url.split('/').splice(1, 2).join('/');
      const menuTree = this.#updateMenuTree(`/${shortUrl}`, this.menuTreeByPermission());
      this.#globalStore.dispatch(updateMenu({ menuTree }));
    })
  );

  protected onMenuItemSelected = (menuItem: MenuItem) => {
    if (menuItem?.children && menuItem.children?.length) {
      const menuTree = this.menuTreeByPermission().map((d) =>
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

  protected onSwitchProject = () => {
    this.#router.navigate(['user/switch-project']);
  };

  protected goToUserProfile = () => {
    this.#router.navigate(['user/profile']);
  };

  protected goToCompany = () => {
    this.#router.navigate(['company-account/company-info']);
  };

  protected onLogout = () => {
    this.#globalStore.dispatch(AuthStore.logoutAction());
  };

  ngOnDestroy() {
    this.#autoLogoutService.destroy();
  }

  ngOnInit() {
    this.#autoLogoutService.init();
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

    combineLatest([
      this.#globalStore.select(AuthStore.selectUserProfile),
      this.#globalStore.select(AuthStore.selectCurrentProject),
      this.#globalStore.select(AuthStore.selectUserProjects)
    ])
      .pipe(
        untilDestroyed(this),
        map(([{ userProfile }, { currentProjectName, currentProjectShortName }, { userProjects }]) => {
          if (!userProfile) {
            return;
          }
          this.userProjects.set(userProjects);
          const userPermission = userProfile.role.permissions;
          if (userPermission.length > 0) {
            let newMenu = this.defaultMenuTree?.filter((menu) => {
              const hasCurrentProject =
                menu.permissions.includes(PERMISSION[PERMISSION.CURRENT_PROJECT]) && currentProjectName !== '';
              const hasUserPermission = menu.permissions.some((menuPermission) =>
                userPermission.includes(PERMISSION[menuPermission])
              );
              return hasCurrentProject || hasUserPermission;
            });
            newMenu = newMenu.map((d) =>
              d.displayName === '{USER_PROJECT_NAME}' ? { ...d, displayName: currentProjectShortName } : d
            );
            this.#globalStore.dispatch(updateMenu({ menuTree: newMenu }));
          }
        })
      )
      .subscribe();
  }
}
