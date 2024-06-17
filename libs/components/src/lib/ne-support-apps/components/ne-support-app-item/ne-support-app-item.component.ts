import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Output, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { itServiceSupportApps, neoflowSupportApps, otDeviceSupportApps } from '@neo-edge-web/configs';
import {
  IAppVersion,
  ISupportApps,
  ISupportAppsUI,
  ISupportAppsWithVersion,
  SUPPORT_APPS_CATEGORIES
} from '@neo-edge-web/models';

@Component({
  selector: 'ne-support-app-item',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatButtonModule],
  templateUrl: './ne-support-app-item.component.html',
  styleUrl: './ne-support-app-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NeSupportAppItemComponent implements AfterViewInit {
  @Output() handlerClick = new EventEmitter<ISupportAppsWithVersion>();
  appData = input<ISupportApps>();
  versionData = input<IAppVersion>();
  clickable = input(true);
  single = input(false);
  appSettings = signal<ISupportAppsUI>({ key: '', img: '' });
  appCategory = signal<string>(SUPPORT_APPS_CATEGORIES[1]);

  getCategoryName(value: number): string {
    return SUPPORT_APPS_CATEGORIES[value];
  }

  onClick = (): void => {
    if (!this.clickable()) return;

    this.handlerClick.emit({
      version: this.versionData(),
      ...this.appSettings(),
      ...this.appData()
    });
  };

  ngAfterViewInit(): void {
    let supportAppsSetting: ISupportAppsUI[] = [];
    switch (this.appData()?.flowGroup) {
      case 0:
        supportAppsSetting = otDeviceSupportApps;
        break;
      case 1:
        supportAppsSetting = itServiceSupportApps;
        break;
      case 2:
        supportAppsSetting = neoflowSupportApps;
        break;
    }

    for (const item of supportAppsSetting) {
      if (this.appData()?.name.toUpperCase().includes(item.key)) {
        this.appSettings.set(item);
        break;
      }
    }

    this.appCategory.set(this.getCategoryName(this.appData()?.category));
  }
}
