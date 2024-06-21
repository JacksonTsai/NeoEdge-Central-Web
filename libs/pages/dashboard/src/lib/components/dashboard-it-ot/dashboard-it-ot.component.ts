import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { itServiceSupportApps, otDeviceSupportApps } from '@neo-edge-web/configs';
import { IItService, IOtDevice, ISupportAppsUI } from '@neo-edge-web/models';
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

  dataTableLength = computed<number>(() => {
    return this.dataTable().length;
  });

  category = computed<Category | null>(() => {
    if (!this.dataTable().length) return null;
    const data = this.dataTable();
    const result = {};
    data.forEach((item: TITOTData) => {
      const key = item.appVersionId;
      if (!result[key]) {
        const supportAppsSetting = this.type() === 'it' ? itServiceSupportApps : otDeviceSupportApps || [];
        const appName = item.appClass.toUpperCase();
        const matchedApp = supportAppsSetting.find((item) => appName.includes(item.key));

        result[key] = {
          name: item.appClass,
          setting: matchedApp,
          list: []
        };
      }
      result[key].list.push(item);
    });
    return result;
  });
}
