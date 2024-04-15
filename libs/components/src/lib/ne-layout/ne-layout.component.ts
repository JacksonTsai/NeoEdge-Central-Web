import { BreakpointObserver } from '@angular/cdk/layout';
import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router } from '@angular/router';
import * as AuthStore from '@neo-edge-web/auth-store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
const SMALL_VIEW = 'screen and (max-width: 770px)';
const MEDIUM_VIEW = 'screen and (min-width: 770px) and (max-width: 1280px)';
const LARGE_VIEW = 'screen and (min-width: 1281px)';

@UntilDestroy()
@Component({
  selector: 'ne-layout',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    NgClass,
    NgIf,
    MatMenuModule
  ],
  templateUrl: './ne-layout.component.html',
  styleUrl: './ne-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NeLayoutComponent {
  logoPath = input<string>('');
  @ViewChild('mainContent', { static: true }) mainContent!: MatSidenavContent;

  #globalStore = inject(Store);
  #router = inject(Router);
  #breakpointObserver = inject(BreakpointObserver);

  protected isSide = true;
  protected sidenavMode: 'side' | 'over' = 'side';
  protected isMenuExtend = signal(true);

  constructor() {
    this.#router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((e) => {
      this.mainContent.scrollTo({ top: 0 });
    });

    this.#breakpointObserver
      .observe([SMALL_VIEW, MEDIUM_VIEW, LARGE_VIEW])
      .pipe(untilDestroyed(this))
      .subscribe((state: { breakpoints: any }) => {
        if (state.breakpoints[SMALL_VIEW]) {
          this.isMenuExtend.set(false);
        } else {
          this.isMenuExtend.set(true);
        }
      });
  }

  protected onLogout = () => {
    this.#globalStore.dispatch(AuthStore.logoutAction());
  };

  protected onMenuToggle = () => {
    this.isMenuExtend.set(!this.isMenuExtend());
  };
}
