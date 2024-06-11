import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { ISupportApps, ISupportAppsWithVersion } from '@neo-edge-web/models';
import { NeSupportAppItemComponent } from '../../components';

@Component({
  selector: 'ne-support-apps',
  standalone: true,
  imports: [CommonModule, MatChipsModule, NeSupportAppItemComponent],
  template: `
    <div class="support-apps-wrapper">
      @for (appItem of supportApps(); track appItem.id) {
        @for (version of appItem?.appVersions; track version.id) {
          <ne-support-app-item
            [appData]="appItem"
            [versionData]="version"
            (handlerClick)="onClick($event)"
          ></ne-support-app-item>
        }
      }
    </div>
  `,
  styleUrl: './ne-support-apps.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NeSupportAppsComponent {
  @Output() handlerClick = new EventEmitter();
  supportApps = input<ISupportApps[]>();

  onClick = (payload: ISupportAppsWithVersion): void => {
    this.handlerClick.emit(payload);
  };
}
