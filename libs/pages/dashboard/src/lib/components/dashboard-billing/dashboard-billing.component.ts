import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { IBillingChart, IDashboardProjectFeeTime, IProjectFeeResp } from '@neo-edge-web/models';
import { arraySum, generatePastMonths, getChartColor, getChartUsageAndFee } from '@neo-edge-web/utils';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'ne-dashboard-billing',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, NgApexchartsModule],
  templateUrl: './dashboard-billing.component.html',
  styleUrl: './dashboard-billing.component.scss',
  providers: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardBillingComponent {
  #currencyPipe = inject(CurrencyPipe);
  projectFee = input<IProjectFeeResp>(null);
  timeRecord = input<IDashboardProjectFeeTime>(null);
  chartOptions = signal<Partial<ApexOptions> | null>(null);
  chartColor: string[] = getChartColor(2);
  total = signal<number>(0);

  projectFeeCurrency = computed<string>(() => {
    if (!this.projectFee()?.currency) return 'USD';
    if (this.projectFee()?.currency === 'NTD') {
      return 'TWD';
    }
    return this.projectFee()?.currency;
  });
  currencyUnit = computed<string>(() => {
    const result = this.#currencyPipe.transform(0, this.projectFeeCurrency());
    console.log('currencyUnit result', result);
    return result.replace(/\d|\./g, '');
  });
  pastMonths = computed<string[]>(() => {
    if (!this.timeRecord()) return [];
    return generatePastMonths(this.timeRecord().end, 6);
  });

  constructor() {
    effect(
      () => {
        if (this.projectFee() !== null && this.pastMonths().length) {
          this.buildChart();
        }
      },
      { allowSignalWrites: true }
    );
  }

  buildChart = (): void => {
    const { usage, fee } = getChartUsageAndFee(this.pastMonths(), this.projectFee().usageAndFee);
    const chartSetting: IBillingChart = {
      series: {
        usage: usage,
        fee: fee
      },
      labels: this.pastMonths().map((v) => v.replace(/-/, '/'))
    };

    this.chartOptions.set(this.getChartOption(chartSetting));
    this.total.set(arraySum(fee));
  };

  getChartOption = (setting: IBillingChart): ApexOptions => {
    return {
      colors: this.chartColor,
      series: [
        {
          name: 'Usage',
          type: 'column',
          data: setting.series.usage
        },
        {
          name: `Fee (${this.currencyUnit()})`,
          type: 'line',
          data: setting.series.fee
        }
      ],
      chart: {
        height: 240,
        type: 'line',
        toolbar: {
          show: false
        }
      },
      stroke: {
        width: [0, 1]
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
      },
      labels: setting.labels,
      legend: {
        position: 'top'
      },
      yaxis: [
        {
          title: {
            text: 'Usage'
          }
        },
        {
          opposite: true,
          title: {
            text: `Fee (${this.currencyUnit()})`
          }
        }
      ]
    };
  };
}
