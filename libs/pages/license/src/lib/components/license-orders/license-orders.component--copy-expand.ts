import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NeExpansionTableComponent } from '@neo-edge-web/components';
import { ICompanyOrder } from '@neo-edge-web/models';

@Component({
  selector: 'ne-license-orders',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatExpansionModule, NeExpansionTableComponent],
  templateUrl: './license-orders.component.html',
  styleUrl: './license-orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LicenseOrdersComponent {
  companyOrders = input<ICompanyOrder[]>([]);
  displayedColumns: string[] = ['no', 'orderNumber', 'orderDate', 'customerContact', 'ecvContact'];
  dataSource = new MatTableDataSource<any>([]);

  // @ContentChild(TemplateRef) template: TemplateRef<any>;
  // @ContentChild(TemplateRef) rowTemplate: TemplateRef<any>;

  constructor() {
    effect(() => {
      this.dataSource.data = this.companyOrders() ?? [];
    });
  }
}
