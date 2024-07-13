import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { IBillingChart, IBillingResp, IDashboardProjectFeeTime } from '@neo-edge-web/models';
import { currencyCustomPipe } from '@neo-edge-web/pipes';
import {
  arraySum,
  dateDashToSlash,
  generatePastMonths,
  getChartColor,
  getChartOption,
  getChartUsageAndFee
} from '@neo-edge-web/utils';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'ne-dashboard-billing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgApexchartsModule,
    currencyCustomPipe
  ],
  templateUrl: './dashboard-billing.component.html',
  styleUrl: './dashboard-billing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardBillingComponent {
  projectFee = input<IBillingResp>(null);
  timeRecord = input<IDashboardProjectFeeTime>(null);
  chartOptions = signal<Partial<ApexOptions> | null>(null);
  chartColor: string[] = getChartColor(2);
  total = signal<number>(0);

  currencyUnit = computed(() => this.projectFee()?.currency ?? 'USD');
  pastMonths = computed<string[]>(() => {
    if (!this.timeRecord()) return [];
    return generatePastMonths(new Date(this.timeRecord().end), 6);
  });
  dateRange = computed<string>(() => {
    if (!this.pastMonths().length) return '';
    return `${dateDashToSlash(this.pastMonths()[0])} - ${dateDashToSlash(this.pastMonths()[this.pastMonths().length - 1])}`;
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
      labels: this.pastMonths().map((v) => dateDashToSlash(v)),
      currency: this.currencyUnit()
    };

    this.chartOptions.set(getChartOption(chartSetting));
    this.total.set(arraySum(fee));
  };
}
