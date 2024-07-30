import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { IBillingChart, IBillingTimeRecord, IGetBillingResp } from '@neo-edge-web/models';
import { currencyCustomPipe } from '@neo-edge-web/pipes';
import { dateDashToSlash, generateMonthDays, getBillingChartOption, getChartUsageAndFee } from '@neo-edge-web/utils';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'ne-billing-month',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, currencyCustomPipe],
  templateUrl: './billing-month.component.html',
  styleUrl: './billing-month.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillingMonthComponent {
  monthUsageFee = input<IGetBillingResp>(null);
  timeRecord = input<IBillingTimeRecord>(null);
  chartOptions = signal<Partial<ApexOptions> | null>(null);

  currencyUnit = computed(() => this.monthUsageFee()?.currency ?? 'USD');
  days = computed<string[]>(() => {
    if (!this.timeRecord()) return [];
    return generateMonthDays(new Date(this.timeRecord().today));
  });

  constructor() {
    effect(
      () => {
        if (this.monthUsageFee() !== null && this.days().length) {
          this.buildChart();
        }
      },
      { allowSignalWrites: true }
    );
  }

  buildChart = (): void => {
    const { usage, fee } = getChartUsageAndFee(this.days(), this.monthUsageFee().usageAndFee);
    const chartSetting: IBillingChart = {
      series: {
        usage: usage,
        fee: fee
      },
      labels: this.days().map((v) => dateDashToSlash(v)),
      currency: this.currencyUnit(),
      height: 300
    };

    this.chartOptions.set(getBillingChartOption(chartSetting));
  };
}
