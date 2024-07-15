import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { IBillingRecord, IGetBillingRecordResp } from '@neo-edge-web/models';
import { currencyCustomPipe } from '@neo-edge-web/pipes';

const ELEMENT_DATA: IBillingRecord[] = [
  { date: '2024/07', no: 99810024, fee: 2500 },
  { date: '2024/06', no: 99810023, fee: 1000 },
  { date: '2024/05', no: 99810022, fee: 800 },
  { date: '2024/04', no: 99810021, fee: 500 }
];

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
  displayedColumns: string[] = ['date', 'no', 'fee', 'action'];
  dataSource = ELEMENT_DATA;

  currencyUnit = computed(() => this.billingRecords()?.currency ?? 'NTD');

  onDownload = (item: IBillingRecord): void => {
    this.handleDownload.emit(item);
  };
}
