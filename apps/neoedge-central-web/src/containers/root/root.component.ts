import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'nec-root',
  template: ` <router-outlet></router-outlet> `,
  styleUrl: './root.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RootComponent {
  #matIconRegistry = inject(MatIconRegistry);
  #domSanitizer = inject(DomSanitizer);

  constructor() {
    this.#registryIcons();
  }

  #registryIcons() {
    this.#matIconRegistry.addSvgIconSetInNamespace(
      'icon',
      this.#domSanitizer.bypassSecurityTrustResourceUrl('assets/icons-sprite.svg?ts=' + new Date().getTime())
    );
  }
}
