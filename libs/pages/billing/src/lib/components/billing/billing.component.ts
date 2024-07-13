import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, input, Output, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { IBillingResp, IBillingTimeRecord } from '@neo-edge-web/models';
import { BillingDownloadComponent } from '../billing-download/billing-download.component';
import { BillingHistoryComponent } from '../billing-history/billing-history.component';
import { BillingMonthComponent } from '../billing-month/billing-month.component';

enum BILLING_TAB {
  MONTH_RECORD,
  HISTORY_RECORD,
  RECORD_DOWNLOAD
}

@Component({
  selector: 'ne-billing',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    BillingDownloadComponent,
    BillingHistoryComponent,
    BillingMonthComponent
  ],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillingComponent {
  @Output() handleGetHistory = new EventEmitter();
  @Output() handleGetRecordDownload = new EventEmitter();
  monthUsageFee = input<IBillingResp>(null);
  pastUsageFee = input<IBillingResp>(null);
  timeRecord = input<IBillingTimeRecord>(null);
  tabIndex = signal<number>(0);

  onTabChange = (event: MatTabChangeEvent): void => {
    this.tabIndex.set(event.index);
    if (event.index === BILLING_TAB.HISTORY_RECORD) {
      if (!this.pastUsageFee()) {
        this.handleGetHistory.emit();
      }
    } else if (event.index === BILLING_TAB.RECORD_DOWNLOAD) {
      this.handleGetRecordDownload.emit();
    }
  };
}
