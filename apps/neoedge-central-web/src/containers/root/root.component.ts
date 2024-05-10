import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ENV_VARIABLE } from '@neo-edge-web/neoedge-central-web/environment';
import { UntilDestroy } from '@ngneat/until-destroy';
import { MENU_TREE } from '../../configs/nec-menu.config';

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
  envVariable = inject(ENV_VARIABLE);
  defaultMenuTree = MENU_TREE;

  constructor() {
    const appVersion = this.envVariable.betaVersion;
    console.log(
      `\n%c ✨NeoEdge Central Web ✨ ${appVersion} 🚀`,
      'color:#1d50a2; background:#fafafa; font-size:1rem;' +
        'padding:0.8rem 0.15rem; margin:0.5rem auto; font-family: Rockwell; border: 1px solid #0dd8d8;' +
        'border-radius: 4px;font-weight: 400'
    );
  }
}
