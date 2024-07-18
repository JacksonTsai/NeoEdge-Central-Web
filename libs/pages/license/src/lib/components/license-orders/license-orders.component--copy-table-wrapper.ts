import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, ViewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NeExpansionTableComponent } from '@neo-edge-web/components';
import { ICompanyOrder } from '@neo-edge-web/models';

@Component({
  selector: 'ne-license-orders',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatExpansionModule, NeExpansionTableComponent],
  // templateUrl: './license-orders.component.html',
  template: `
    <ne-expansion-table [dataSource]="companyOrders()" [columns]="displayedColumns">
      <!-- Custom column definition to be provided to the wrapper table. -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let element">{{ element.name }}</td>
      </ng-container>

      <!-- Custom row definitions to be provided to the wrapper table. -->
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>

      <!-- Row shown when there is no matching data that will be provided to the wrapper table. -->
      <tr class="mat-row" *matNoDataRow>
        <td class="mat-cell" colspan="4">No data</td>
      </tr>
    </ne-expansion-table>
  `,
  styleUrl: './license-orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LicenseOrdersComponent {
  companyOrders = input<ICompanyOrder[]>([]);
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<any>(this.companyOrders());

  @ViewChild('sort') sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  clearTable() {
    this.dataSource.data = [];
  }

  addData() {
    this.dataSource.data = this.companyOrders();
  }
}
