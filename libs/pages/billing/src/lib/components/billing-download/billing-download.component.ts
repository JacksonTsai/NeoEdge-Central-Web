import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, EventEmitter, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IBillingRecord, IGetBillingRecordResp } from '@neo-edge-web/models';
import { currencyCustomPipe } from '@neo-edge-web/pipes';

@Component({
  selector: 'ne-billing-download',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, currencyCustomPipe],
  templateUrl: './billing-download.component.html',
  styleUrl: './billing-download.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillingDownloadComponent {
  @Output() handleDownload = new EventEmitter<IBillingRecord>();
  billingRecords = input<IGetBillingRecordResp>(null);
  displayedColumns: string[] = ['billingMonth', 'billNo', 'amount', 'action'];
  dataSource = new MatTableDataSource<any>([]);

  currencyUnit = computed(() => this.billingRecords()?.[0]?.currency ?? 'NTD');

  constructor() {
    effect(() => {
      this.dataSource.data = this.billingRecords()?.billingRecords ?? [];
    });
  }

  onDownload = (item: IBillingRecord): void => {
    this.handleDownload.emit(item);
  };
}
