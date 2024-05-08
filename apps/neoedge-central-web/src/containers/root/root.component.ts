import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ENV_VARIABLE } from '@neo-edge-web/neoedge-central-web/environment';
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
  envVairable = inject(ENV_VARIABLE);

  constructor() {
    const appVersion = this.envVairable.version;
    console.log(
      `\n%c ✨NeoEdge Central Web ✨\n ${appVersion} 🚀`,
      'color:#1d50a2; background:#fafafa; font-size:1rem;' +
        'padding:0.8rem 0.15rem; margin:0.5rem auto; font-family: Rockwell; border: 1px solid #0dd8d8;' +
        'border-radius: 4px;font-weight: 400'
    );
  }
}
