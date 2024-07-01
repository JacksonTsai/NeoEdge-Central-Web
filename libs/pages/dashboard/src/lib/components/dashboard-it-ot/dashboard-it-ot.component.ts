import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { itServiceSupportApps, otDeviceSupportApps } from '@neo-edge-web/configs';
import { IItService, IOtDevice, ISupportApps, ISupportAppsUI } from '@neo-edge-web/models';
import { FormatCountPipe } from '@neo-edge-web/pipes';

type TITOT = 'it' | 'ot';
type TITOTList = IItService[] | IOtDevice<any>[];
type TITOTData = IItService | IOtDevice<any>;

interface ICategoryItem {
  name: string;
  setting: ISupportAppsUI;
  list: TITOTList;
}

type Category = Record<string, ICategoryItem>;

@Component({
  selector: 'ne-dashboard-it-ot',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, FormatCountPipe],
  templateUrl: './dashboard-it-ot.component.html',
  styleUrl: './dashboard-it-ot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardItOtComponent {
  type = input<TITOT>('it');
  dataTable = input<TITOTList>([]);
  apps = input<ISupportApps[]>([]);

  dataTableLength = computed<number>(() => {
    return this.dataTable().length;
  });

  supportAppsSetting = computed<ISupportAppsUI[]>(() => {
    return this.type() === 'it' ? itServiceSupportApps : otDeviceSupportApps || [];
  });

  category = computed<Category | null>(() => {
    if (!this.apps().length) return null;

    // Init
    const result = {};
    this.apps().forEach((item: ISupportApps) => {
      const key = item.id;
      result[key] = this.initCategory(item.name);
    });

    if (!this.dataTable().length) return result;

    // Set Data
    const data = this.dataTable();
    data.forEach((item: TITOTData) => {
      const key = item.appId;
      result[key]?.list.push(item);
    });
    return result;
  });

  initCategory = (name: string): ICategoryItem => {
    const appName = name.toUpperCase();
    const matchedApp = this.supportAppsSetting().find((item) => appName.includes(item.key));

    return {
      name,
      setting: matchedApp,
      list: []
    };
  };
}
