import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  EventEmitter,
  input,
  Output,
  ViewChild
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NeExpansionTableComponent } from '@neo-edge-web/components';
import { ICompanyOrder, TableQueryForCompanyOrder } from '@neo-edge-web/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import { LicenseOrderDetailComponent } from '../license-order-detail/license-order-detail.component';

@UntilDestroy()
@Component({
  selector: 'ne-license-orders',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatTableModule, NeExpansionTableComponent, LicenseOrderDetailComponent],
  templateUrl: './license-orders.component.html',
  styleUrl: './license-orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LicenseOrdersComponent implements AfterViewInit {
  @Output() pageChange = new EventEmitter<TableQueryForCompanyOrder>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  companyOrders = input<ICompanyOrder[]>([]);
  page = input<number>(0);
  size = input<number>(0);
  dataLength = input<number>(0);
  displayedColumns: string[] = ['no', 'orderNumber', 'orderDate', 'customerContact', 'ecvContact'];
  dataSource = new MatTableDataSource<any>();

  constructor() {
    effect(() => {
      this.dataSource.data = this.companyOrders();
    });
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        untilDestroyed(this),
        tap((page) => {
          this.pageChange.emit({ page: page.pageIndex + 1, size: page.pageSize });
        })
      )
      .subscribe();
  }
}
