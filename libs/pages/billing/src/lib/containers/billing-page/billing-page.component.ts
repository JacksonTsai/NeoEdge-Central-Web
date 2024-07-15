import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BILLING_TOTAL_TYPE, IBillingParamsReq, IBillingRecord, IDownloadBillingRecordReq } from '@neo-edge-web/models';
import { BillingComponent } from '../../components';
import { BillingTotalComponent } from '../../components/billing-total/billing-total.component';
import { BillingdStore } from '../../stores';

@Component({
  selector: 'ne-billing-page',
  standalone: true,
  imports: [CommonModule, BillingComponent, BillingTotalComponent],
  templateUrl: './billing-page.component.html',
  styleUrl: './billing-page.component.scss',
  providers: [BillingdStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillingPageComponent implements AfterViewInit {
  #billingdStore = inject(BillingdStore);
  timeRecord = this.#billingdStore.timeRecord;
  estimate = this.#billingdStore.estimate;
  monthUsageFee = this.#billingdStore.monthUsageFee;
  pastUsageFee = this.#billingdStore.pastUsageFee;
  billingRecords = this.#billingdStore.billingRecords;
  billingTotalType = BILLING_TOTAL_TYPE;

  getMonthRecord = (): void => {
    const monthRecordParams: IBillingParamsReq = {
      dateGe: this.#billingdStore.timeRecord().monthStart,
      dateLe: this.#billingdStore.timeRecord().today,
      groupBy: 'day'
    };
    this.#billingdStore.getCompanyUsageFee({ type: 'fullMonth', params: monthRecordParams });
  };

  getYearRecord = (): void => {
    const yearRecordParams: IBillingParamsReq = {
      dateGe: this.#billingdStore.timeRecord().pastStart,
      dateLe: this.#billingdStore.timeRecord().today,
      groupBy: 'month'
    };
    this.#billingdStore.getCompanyUsageFee({ type: 'fullYear', params: yearRecordParams });
  };

  onGetHistory = (): void => {
    this.getYearRecord();
  };

  onGetBillingRecord = (): void => {
    this.#billingdStore.getCompanyBillingRecords();
  };

  onDownload = (item: IBillingRecord): void => {
    const params: IDownloadBillingRecordReq = {
      billingMonth: item.billingMonth
    };
    this.#billingdStore.downloadCompanyBilingRecord(params);
  };

  ngAfterViewInit(): void {
    this.getMonthRecord();
  }
}
