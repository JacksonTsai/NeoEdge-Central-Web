import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NeExpansionTableComponent } from '@neo-edge-web/components';
import { ICompanyOrder } from '@neo-edge-web/models';
import { LicenseOrderDetailComponent } from '../license-order-detail/license-order-detail.component';

@Component({
  selector: 'ne-license-orders',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatExpansionModule, NeExpansionTableComponent, LicenseOrderDetailComponent],
  templateUrl: './license-orders.component.html',
  styleUrl: './license-orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LicenseOrdersComponent {
  companyOrders = input<ICompanyOrder[]>([]);
  displayedColumns: string[] = ['no', 'orderNumber', 'orderDate', 'customerContact', 'ecvContact'];
  dataSource = new MatTableDataSource<any>();

  constructor() {
    effect(() => {
      this.dataSource.data = this.companyOrders();
    });
  }
}
