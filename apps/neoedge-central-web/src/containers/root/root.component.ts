import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { NeLayoutComponent, NeMenuComponent } from '@neo-edge-web/components';
import { RouterStoreService, selectMenuTree, updateMenu } from '@neo-edge-web/global-store';
import { MenuItem } from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { MENU_TREE } from '../../configs/nec-menu.config';
import { ShellComponent } from '../shell/shell.component';

@UntilDestroy()
@Component({
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    NgClass,
    NgIf,
    MatButtonModule,
    NeLayoutComponent,
    NeMenuComponent,
    ShellComponent,
    LetDirective
  ],
  selector: 'nec-root',
  template: `
    <ne-layout *ngrxLet="changePath$" [logoPath]="'assets/images/neoedge_logo_light.png'">
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

  styleUrl: './root.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RootComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  #matIconRegistry = inject(MatIconRegistry);
  #domSanitizer = inject(DomSanitizer);
  #routerStoreService = inject(RouterStoreService);
  #globalStore = inject(Store);
  #router = inject(Router);

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
    this.#registryIcons();
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

  #registryIcons() {
    this.#matIconRegistry.addSvgIconSetInNamespace(
      'icon',
      this.#domSanitizer.bypassSecurityTrustResourceUrl('assets/icons-sprite.svg?ts=' + new Date().getTime())
    );
  }
}
