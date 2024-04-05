import { BreakpointObserver } from '@angular/cdk/layout';
import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NeLayoutComponent } from '@neo-edge-web/components';

const MOBILE_VIEW = 'screen and (max-width: 768px)';
const TABLET_VIEW = 'screen and (min-width: 769px) and (max-width: 1024px)';
const MONITOR_VIEW = 'screen and (min-width: 1024px)';
const BELOWMONITOR = 'screen and (max-width: 1023px)';

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
    NeLayoutComponent
  ],
  selector: 'nec-root',
  templateUrl: './root.component.html',
  styleUrl: './root.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RootComponent {
  #matIconRegistry = inject(MatIconRegistry);
  #domSanitizer = inject(DomSanitizer);

  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  isMobile = false;
  isMenuCollapsed = true;

  constructor(private observer: BreakpointObserver) {
    this.#registryIcons();
  }

  protected toggleMenu() {
    if (this.isMobile) {
      this.sidenav.toggle();
      this.isMenuCollapsed = false;
    } else {
      this.sidenav.open();
      this.isMenuCollapsed = !this.isMenuCollapsed;
    }
  }

  #registryIcons() {
    this.#matIconRegistry.addSvgIconSetInNamespace(
      'icon',
      this.#domSanitizer.bypassSecurityTrustResourceUrl('assets/icons-sprite.svg?ts=' + new Date().getTime())
    );
  }
}
