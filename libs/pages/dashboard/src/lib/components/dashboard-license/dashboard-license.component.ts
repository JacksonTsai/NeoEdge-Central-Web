import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { IProjectLicense } from '@neo-edge-web/models';
import { getChartColor } from '@neo-edge-web/utils';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

interface ILicenseChartSeries {
  usage: number[];
  remaining: number[];
  categories: string[];
}

interface ILicenseChartSetting {
  series: {
    usage: number[];
    remaining: number[];
  };
  categories: string[];
}

const PROJECT_LICENSE_MOCK: IProjectLicense[] = [
  {
    name: 'NeoEdge X Tag License',
    companyQuantity: 10,
    projectQuantity: 4
  },
  {
    name: 'NeoEdge X License',
    companyQuantity: 10,
    projectQuantity: 4
  }
];

@Component({
  selector: 'ne-dashboard-license',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, NgApexchartsModule],
  templateUrl: './dashboard-license.component.html',
  styleUrl: './dashboard-license.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLicenseComponent {
  // TODO 等 License API 可以串接後，把 projectLicenseMock 改為 projectLicenses，並移除相關假資料
  projectLicenses = input<IProjectLicense[]>([]);
  projectLicenseMock = signal<IProjectLicense[]>(PROJECT_LICENSE_MOCK);
  chartOptions = signal<Partial<ApexOptions> | null>(null);
  defaultColors: string[] = [...getChartColor(1), '#C4D7E9'];
  warningColor = '#F87A7A';

  licenseUsage = computed<ILicenseChartSeries>(() => {
    if (!this.projectLicenseMock().length) return null;
    return this.getLicenseUsage(this.projectLicenseMock());
  });

  constructor() {
    effect(
      () => {
        if (this.licenseUsage() !== null) {
          this.buildChart();
        }
      },
      { allowSignalWrites: true }
    );
  }

  getLicenseUsage = (licenses: IProjectLicense[]): ILicenseChartSeries => {
    const result: ILicenseChartSeries = {
      usage: [],
      remaining: [],
      categories: []
    };
    licenses.map((item) => {
      const remainingValue = item.companyQuantity - item.projectQuantity;
      result.usage.push(item.projectQuantity);
      result.remaining.push(remainingValue <= 0 ? 0 : remainingValue);
      result.categories.push(item.name);
    });
    return result;
  };

  buildChart = (): void => {
    const { usage, remaining, categories } = this.licenseUsage();
    const chartSetting: ILicenseChartSetting = {
      series: {
        usage: usage,
        remaining: remaining
      },
      categories
    };

    this.chartOptions.set(this.getChartOption(chartSetting));
  };

  getChartOption = (setting: ILicenseChartSetting): ApexOptions => {
    return {
      series: [
        {
          name: 'Project usage',
          data: setting.series.usage
        },
        {
          name: 'Remaining ratio',
          data: setting.series.remaining
        }
      ],
      chart: {
        type: 'bar',
        height: 224,
        stacked: true,
        stackType: '100%',
        toolbar: {
          show: false
        }
      },
      xaxis: {
        categories: setting.categories
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: 'top',
        markers: {
          radius: 12
        }
      },
      colors: [
        ({ value, seriesIndex, dataPointIndex, w }) => {
          if (value >= 100) {
            return this.warningColor;
          } else {
            return this.defaultColors[seriesIndex];
          }
        }
      ],
      tooltip: {
        shared: true,
        intersect: false
      }
    };
  };
}
