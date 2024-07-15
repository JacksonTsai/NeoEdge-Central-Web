import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BILLING_TOTAL_TYPE, IBillingEstimateResp, IBillingTimeRecord } from '@neo-edge-web/models';
import { currencyCustomPipe, dateTimeFormatPipe } from '@neo-edge-web/pipes';

interface IBillingTotalContent {
  title: string;
  dayRange: string;
  until: number;
  usage: number;
  fee: number;
}

@Component({
  selector: 'ne-billing-total',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTooltipModule, dateTimeFormatPipe, MatIconModule, currencyCustomPipe],
  templateUrl: './billing-total.component.html',
  styleUrl: './billing-total.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillingTotalComponent {
  type = input<BILLING_TOTAL_TYPE>(BILLING_TOTAL_TYPE.CURRENT);
  timeRecord = input<IBillingTimeRecord>(null);
  estimate = input<IBillingEstimateResp>(null);
  billingTotalType = BILLING_TOTAL_TYPE;

  currencyUnit = computed(() => this.estimate()?.currency ?? 'USD');
  contentData = computed<IBillingTotalContent>(() => {
    if (!this.timeRecord()) return null;
    let result = null;
    if (BILLING_TOTAL_TYPE.CURRENT === this.type()) {
      result = {
        title: 'Month Statistics',
        dayRange: `${this.timeRecord().monthStart} - ${this.timeRecord().today}`,
        until: this.estimate()?.caculateAt ?? new Date().getTime(),
        usage: this.estimate()?.totalUsage ?? 0,
        fee: this.estimate()?.totalFee ?? 0
      };
    } else {
      result = {
        title: 'Month Estimate',
        dayRange: `${this.timeRecord().monthStart} - ${this.timeRecord().monthEnd}`,
        until: this.timeRecord().monthEndUTC,
        usage: this.estimate()?.estimateUsage ?? 0,
        fee: this.estimate()?.estimateFee ?? 0
      };
    }
    return result;
  });
}
