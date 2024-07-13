import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { IBillingChart, IBillingResp, IBillingTimeRecord } from '@neo-edge-web/models';
import { dateDashToSlash, generatePastMonths, getChartOption, getChartUsageAndFee } from '@neo-edge-web/utils';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'ne-billing-history',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './billing-history.component.html',
  styleUrl: './billing-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillingHistoryComponent {
  pastUsageFee = input<IBillingResp>(null);
  timeRecord = input<IBillingTimeRecord>(null);

  chartOptions = signal<Partial<ApexOptions> | null>(null);

  currencyUnit = computed(() => this.pastUsageFee()?.currency ?? 'USD');
  pastMonths = computed<string[]>(() => {
    if (!this.timeRecord()) return [];
    return generatePastMonths(new Date(this.timeRecord().today), this.timeRecord().pastMonths);
  });

  constructor() {
    effect(
      () => {
        if (this.pastUsageFee() !== null && this.pastMonths().length) {
          this.buildChart();
        }
      },
      { allowSignalWrites: true }
    );
  }

  buildChart = (): void => {
    const { usage, fee } = getChartUsageAndFee(this.pastMonths(), this.pastUsageFee().usageAndFee);
    const chartSetting: IBillingChart = {
      series: {
        usage: usage,
        fee: fee
      },
      labels: this.pastMonths().map((v) => dateDashToSlash(v)),
      currency: this.currencyUnit(),
      height: 300
    };

    this.chartOptions.set(getChartOption(chartSetting));
  };
}
