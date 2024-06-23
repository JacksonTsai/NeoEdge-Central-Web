import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, input } from '@angular/core';
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
export class NeSupportAppItemComponent {
  @Output() handlerClick = new EventEmitter<ISupportAppsWithVersion>();
  appData = input<ISupportApps>();
  versionData = input<IAppVersion>();
  clickable = input(true);
  single = input(false);

  appSettings = computed<ISupportAppsUI | null>(() => {
    const appData = this.appData();

    const supportAppsSettingsMap = {
      0: otDeviceSupportApps,
      1: itServiceSupportApps,
      2: neoflowSupportApps
    };

    const supportAppsSetting = supportAppsSettingsMap[appData?.flowGroup] || [];

    const appName = appData?.name.toUpperCase();
    const matchedApp = supportAppsSetting.find((item) => appName.includes(item.key));

    return matchedApp || null;
  });

  appCategory = computed<string>(() => {
    return this.getCategoryName(this.appData()?.category) ?? SUPPORT_APPS_CATEGORIES[1];
  });

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
}
