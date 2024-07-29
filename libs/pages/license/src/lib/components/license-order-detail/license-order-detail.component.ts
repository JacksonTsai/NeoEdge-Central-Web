import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ICompanyOrderItem } from '@neo-edge-web/models';

@Component({
  selector: 'ne-license-order-detail',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './license-order-detail.component.html',
  styleUrl: './license-order-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LicenseOrderDetailComponent {
  dataTable = input<ICompanyOrderItem[]>();
  displayedColumns: string[] = ['no', 'name', 'quantity', 'partNumber'];
  dataSource = new MatTableDataSource<any>();

  constructor() {
    effect(() => {
      this.dataSource.data = this.dataTable();
    });
  }
}
