import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
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

      <!-- Position Column -->
      <ng-container matColumnDef="position">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>No.</th>
        <td mat-cell *matCellDef="let element">{{ element.position }}</td>
      </ng-container>

      <!-- Weight Column -->
      <ng-container matColumnDef="weight">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Weight</th>
        <td mat-cell *matCellDef="let element">{{ element.weight }}</td>
      </ng-container>

      <!-- Color Column -->
      <ng-container matColumnDef="symbol">
        <th mat-header-cell *matHeaderCellDef>Symbol</th>
        <td mat-cell *matCellDef="let element">{{ element.symbol }}</td>
      </ng-container>

      <ng-template let-data>
        <p>123456789</p>
        <div>{{ data | json }}</div>
      </ng-template>
    </ne-expansion-table>
  `,
  styleUrl: './license-orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LicenseOrdersComponent {
  companyOrders = input<ICompanyOrder[]>([]);
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<any>(this.companyOrders());
}
